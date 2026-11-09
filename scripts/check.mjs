// The gate: node scripts/check.mjs [--update]
//  1. every internal link and asset in every page resolves to a file
//  2. every example in data/examples.json runs against the pinned hypercore and prints what the page shows
//  3. every method and property named in data/api.json exists on a real Hypercore
//  4. a claim lint refuses the phrases the first review found
// --update rewrites each example's `expect` from a real run.
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import { createRequire } from 'node:module'

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const update = process.argv.includes('--update')
const problems = []
const bad = (m) => problems.push(m)

// 1. links
const pages = fs.readdirSync(root).filter((f) => f.endsWith('.html'))
for (const p of pages) {
  const html = fs.readFileSync(path.join(root, p), 'utf8')
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1]
    if (/^(https?:|mailto:|#|data:)/.test(u)) continue
    const f = u.split('#')[0].split('?')[0]
    if (f && !fs.existsSync(path.join(root, f))) bad(`${p}: dead link ${u}`)
  }
  if (/fonts\.googleapis|cdn\./.test(html)) bad(`${p}: external request`)
  // 4. claim lint
  const text = html.replace(/<script[\s\S]*?<\/script>|<[^>]+>/g, ' ')
  for (const w of ['unparalleled', 'next-generation', 'state-of-the-art', 'mailing list', 'nothing can be erased', 'all rights reserved']) {
    if (text.toLowerCase().includes(w)) bad(`${p}: banned phrase "${w}"`)
  }
}
for (const f of ['styles.css', 'assets/site.css']) {
  const q = path.join(root, f)
  if (fs.existsSync(q) && /@import url\(['"]?https?:/.test(fs.readFileSync(q, 'utf8'))) bad(`${f}: external @import`)
}

// 2. examples
const require = createRequire(path.join(root, 'package.json'))
let Hypercore
try { Hypercore = require('hypercore') } catch { bad('hypercore is not installed: run npm install'); }
const verified = JSON.parse(fs.readFileSync(path.join(root, 'data/verified.json'), 'utf8'))
if (Hypercore) {
  const installed = require('hypercore/package.json').version
  if (installed !== verified.hypercore) bad(`installed hypercore ${installed} != data/verified.json ${verified.hypercore}`)
}
const examples = JSON.parse(fs.readFileSync(path.join(root, 'data/examples.json'), 'utf8'))
if (Hypercore) {
  for (const ex of examples) {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hc-'))
    fs.writeFileSync(path.join(dir, 'ex.js'), ex.code)
    let out = ''
    try {
      out = execFileSync(process.execPath, ['ex.js'], { cwd: dir, env: { ...process.env, NODE_PATH: path.join(root, 'node_modules') }, timeout: 30000, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
    } catch (e) { bad(`example ${ex.id} failed: ${String(e.stderr || e.message).split('\n')[0]}`); continue }
    out = out.trimEnd()
    if (update) ex.expect = out
    else if (out !== ex.expect.trimEnd()) bad(`example ${ex.id}: output differs\n--- page shows:\n${ex.expect}\n--- actual:\n${out}`)
    fs.rmSync(dir, { recursive: true, force: true })
  }
  if (update) fs.writeFileSync(path.join(root, 'data/examples.json'), JSON.stringify(examples, null, 2) + '\n')

  // 3. api names
  const api = JSON.parse(fs.readFileSync(path.join(root, 'data/api.json'), 'utf8'))
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hc-'))
  const core = new Hypercore(path.join(dir, 'c'))
  await core.ready()
  for (const g of api) for (const m of g.items) {
    if (m.kind === 'method' && typeof core[m.name] !== 'function') bad(`api: core.${m.name} is not a function`)
    if (m.kind === 'property' && !(m.name in core)) bad(`api: core.${m.name} is not a property`)
    if (m.kind === 'static' && !(m.name in Hypercore)) bad(`api: Hypercore.${m.name} missing`)
  }
  await core.close()
  fs.rmSync(dir, { recursive: true, force: true })
}

// 5. the landing demo's printed numbers, recomputed from the same module the page uses
{
  const Merkle = require('./assets/merkle.js')
  const mk = (n) => Array.from({ length: n }, (_, i) => 'block ' + i)
  const t8 = await Merkle.build(mk(8))
  const t13 = await Merkle.build(mk(13))
  const l = mk(8); l[3] += ' (forged)'
  const f8 = await Merkle.build(l)
  const got = { 'proof 8/3': Merkle.proofFor(t8, 3).proof.length, 'proof 13/12': Merkle.proofFor(t13, 12).proof.length, 'roots 13': t13.peaks.length, 'forged 8/3': Merkle.changed(f8, t8).length, 'million': Merkle.proofLength(1000000) }
  const want = { 'proof 8/3': 3, 'proof 13/12': 2, 'roots 13': 3, 'forged 8/3': 4, 'million': 20 }
  for (const k of Object.keys(want)) if (got[k] !== want[k]) bad(`demo ${k}: got ${got[k]}, expected ${want[k]}`)
  // fixture that must fail: a tampered tree must not match the original signed value
  if (Merkle.hex(f8.signed, 16) === Merkle.hex(t8.signed, 16)) bad('demo fixture: a forged block did not change the signed value')
}

if (problems.length) { console.error(problems.join('\n')); process.exit(1) }
console.log(`OK: ${pages.length} pages, ${examples.length} examples run${update ? ' and expectations updated' : ''}, links and API names resolve`)
