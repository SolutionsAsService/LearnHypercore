/* The tree behind the landing demo. Pure functions so scripts/check.mjs can test the numbers the page prints.
   Shape follows Hypercore: leaves are blocks; the "roots" are the peaks of the binary decomposition of the length;
   the signed value is a hash over the roots. Fingerprints are SHA-256 here (Hypercore uses BLAKE2b). */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Merkle = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';
  var enc = new TextEncoder();
  function subtle() { return globalThis.crypto.subtle; }
  function cat() {
    var n = 0, i; for (i = 0; i < arguments.length; i++) n += arguments[i].length;
    var o = new Uint8Array(n), p = 0;
    for (i = 0; i < arguments.length; i++) { o.set(arguments[i], p); p += arguments[i].length; }
    return o;
  }
  function sha(bytes) { return subtle().digest('SHA-256', bytes).then(function (d) { return new Uint8Array(d); }); }
  function hex(u8, n) { return Array.prototype.map.call(u8, function (x) { return ('0' + x.toString(16)).slice(-2); }).join('').slice(0, n); }

  // Largest complete subtrees, from the binary digits of n: 13 -> sizes 8, 4, 1.
  function peaksOf(n) {
    var out = [], start = 0, size = 1;
    while (size * 2 <= n) size *= 2;
    for (; size >= 1; size = size / 2) if (n - start >= size) { out.push({ start: start, size: size }); start += size; }
    return out;
  }

  // Promise of { nodes: {id: {id, level, start, span, hash, kids?}}, peaks: [ids], signed: Uint8Array }
  function build(list) {
    return Promise.all(list.map(function (b) { return sha(cat(new Uint8Array([0]), enc.encode(b))); })).then(function (leaves) {
      var nodes = {};
      leaves.forEach(function (h, i) { nodes['0:' + i] = { id: '0:' + i, level: 0, start: i, span: 1, hash: h }; });
      function make(level, start) {
        var id = level + ':' + start;
        if (nodes[id]) return Promise.resolve(nodes[id]);
        var half = Math.pow(2, level - 1);
        return Promise.all([make(level - 1, start), make(level - 1, start + half)]).then(function (k) {
          return sha(cat(new Uint8Array([1]), k[0].hash, k[1].hash)).then(function (h) {
            var n = { id: id, level: level, start: start, span: Math.pow(2, level), hash: h, kids: [k[0].id, k[1].id] };
            nodes[id] = n; return n;
          });
        });
      }
      return Promise.all(peaksOf(list.length).map(function (p) { return make(Math.log2(p.size), p.start); })).then(function (pn) {
        return sha(cat.apply(null, pn.map(function (n) { return n.hash; }))).then(function (signed) {
          return { nodes: nodes, peaks: pn.map(function (n) { return n.id; }), signed: signed };
        });
      });
    });
  }

  // The hashes a reader needs to check block i against the roots: siblings up to its root, plus every other root.
  function proofFor(t, i) {
    var peak = t.peaks.map(function (p) { return t.nodes[p]; }).filter(function (p) { return i >= p.start && i < p.start + p.span; })[0];
    var path = ['0:' + i], proof = [], cur = peak, trail = [];
    while (cur.level > 0) {
      var a = t.nodes[cur.kids[0]], b = t.nodes[cur.kids[1]];
      var inA = i >= a.start && i < a.start + a.span;
      trail.push({ on: inA ? a : b, sib: inA ? b : a });
      cur = inA ? a : b;
    }
    trail.forEach(function (s) { path.push(s.on.id); proof.push(s.sib.id); });
    t.peaks.forEach(function (p) { if (p !== peak.id) proof.push(p); });
    return { path: path, proof: proof, peak: peak.id };
  }

  // Node ids whose fingerprint differs between two trees of the same shape.
  function changed(t, orig) {
    return Object.keys(t.nodes).filter(function (id) { return orig.nodes[id] && hex(orig.nodes[id].hash, 16) !== hex(t.nodes[id].hash, 16); });
  }
  // How many hashes verify one block in a perfect tree of n blocks (n a power of two).
  function proofLength(n) { return Math.ceil(Math.log2(n)); }

  return { build: build, proofFor: proofFor, peaksOf: peaksOf, changed: changed, proofLength: proofLength, hex: hex };
});
