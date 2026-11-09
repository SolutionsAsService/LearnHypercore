/* Landing: a Hypercore's Merkle tree, built live. Leaves are blocks; "root" marks the peaks that get hashed and signed. */
HC.boot('home', function (G) {
  'use strict';
  var $ = G.$, esc = G.esc, M = Merkle;
  var svg = $('#fig'), readout = $('#readout'), srList = $('#sr'), appendBtn = $('#append'), forgeBtn = $('#forge'), resetBtn = $('#reset');
  var START = 8, DEFAULT_SEL = 3;
  var blocks = [], sel = null, forged = null, foc = 0, gen = 0, tree = null, orig = null, cap = 16;

  function reset() { blocks = []; for (var i = 0; i < START; i++) blocks.push('block ' + i); sel = DEFAULT_SEL; forged = null; foc = DEFAULT_SEL; }
  function width() { return Math.max(240, svg.parentNode.clientWidth - 16); }
  function capFor(W) { return Math.max(START, Math.min(16, Math.floor((W - 20) / 28))); } // keep every block at least 24px wide (28px slot minus the 4px gap)

  function fp(nd, n) { return M.hex(nd.hash, n || 4); }

  function draw() {
    var hadFocus = svg.contains(document.activeElement);
    var W = width(), n = blocks.length, slots = Math.max(START, n);
    cap = capFor(W);
    var pad = 10, dx = (W - pad * 2) / slots, levels = Math.ceil(Math.log2(Math.max(2, n)));
    var levelH = W < 500 ? 40 : 46, leafH = 38, top = 30, r = Math.min(15, Math.max(9, dx * 0.4)), fs = r >= 14 ? 9 : 8;
    var H = top + levels * levelH + 28 + leafH + 24, yLeaf = H - leafH - 24;
    function xOf(nd) { return pad + (nd.start + nd.span / 2) * dx; }
    function yOf(nd) { return nd.level === 0 ? yLeaf : yLeaf - 16 - nd.level * levelH; }
    var pr = sel === null ? null : M.proofFor(tree, sel), pathSet = {}, proofSet = {}, chSet = {};
    if (pr) { pr.path.forEach(function (x) { pathSet[x] = 1; }); pr.proof.forEach(function (x) { proofSet[x] = 1; }); }
    if (orig) M.changed(tree, orig).forEach(function (x) { chSet[x] = 1; });
    var h = '', ids = Object.keys(tree.nodes);
    ids.forEach(function (id) {
      var nd = tree.nodes[id]; if (!nd.kids) return;
      nd.kids.forEach(function (k) {
        var c = tree.nodes[k], cls = 'edge' + (chSet[k] && chSet[id] ? ' bad' : (pathSet[k] && pathSet[id] ? ' path' : ''));
        h += '<line class="' + cls + '" x1="' + xOf(nd) + '" y1="' + yOf(nd) + '" x2="' + xOf(c) + '" y2="' + yOf(c) + '"/>';
      });
    });
    ids.forEach(function (id) {
      var nd = tree.nodes[id]; if (nd.level === 0) return;
      var isPeak = tree.peaks.indexOf(id) >= 0;
      var cls = 'node' + (isPeak ? ' peak' : '') + (proofSet[id] ? ' proof' : '') + (pathSet[id] ? ' path' : '') + (chSet[id] ? ' bad' : '');
      h += '<g class="' + cls + '"><circle cx="' + xOf(nd) + '" cy="' + yOf(nd) + '" r="' + r + '"/>' +
        (proofSet[id] ? '<circle class="ring" cx="' + xOf(nd) + '" cy="' + yOf(nd) + '" r="' + (r + 4) + '"/>' : '') +
        '<text style="font-size:' + fs + 'px" x="' + xOf(nd) + '" y="' + (yOf(nd) + 3) + '">' + (chSet[id] ? '× ' : '') + fp(nd) + '</text></g>';
      if (isPeak) h += '<text class="tag" x="' + xOf(nd) + '" y="' + (yOf(nd) - r - 6) + '">root</text>';
    });
    for (var i = 0; i < n; i++) {
      var leaf = tree.nodes['0:' + i], x = pad + i * dx + 2, w = dx - 4;
      var state = (sel === i ? ' selected' : '') + (forged === i ? ' forged' : '') + (proofSet['0:' + i] ? ' needed' : '');
      var cls = 'leaf' + (sel === i ? ' sel' : '') + (forged === i ? ' bad' : '') + (proofSet['0:' + i] ? ' proofleaf' : '');
      h += '<g class="' + cls + '" tabindex="' + (i === foc ? 0 : -1) + '" role="button" aria-pressed="' + (sel === i) + '" data-i="' + i + '" aria-label="Block ' + i + ', fingerprint ' + fp(leaf) +
        (sel === i ? ', selected' : '') + (proofSet['0:' + i] ? ', needed to verify the selected block' : '') + (forged === i ? ', forged' : '') + '">' +
        '<rect x="' + x + '" y="' + yLeaf + '" width="' + w + '" height="' + leafH + '" rx="3"/>' +
        (sel === i ? '<rect class="mark" x="' + (x - 2) + '" y="' + (yLeaf - 2) + '" width="' + (w + 4) + '" height="' + (leafH + 4) + '" rx="5"/>' : '') +
        '<text x="' + (x + w / 2) + '" y="' + (yLeaf + 15) + '" text-anchor="middle">' + i + '</text>' +
        '<text class="fp" x="' + (x + w / 2) + '" y="' + (yLeaf + 30) + '" text-anchor="middle" style="font-size:' + fs + 'px">' + (forged === i ? '× ' : '') + fp(leaf) + '</text></g>';
    }
    h += '<text class="tag" x="' + (W / 2) + '" y="' + (H - 6) + '">blocks, in the order they were appended</text>';
    h += '<text class="signed" x="' + pad + '" y="14">signed value ' + M.hex(tree.signed, 8) + (orig ? '  (was ' + M.hex(orig.signed, 8) + ')' : '') + '</text>';
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('height', H);
    svg.innerHTML = h;
    if (hadFocus) { var f = svg.querySelector('.leaf[data-i="' + foc + '"]'); if (f) f.focus(); }

    // text alternative for the figure
    srList.innerHTML = blocks.map(function (b, i) {
      var l = tree.nodes['0:' + i];
      return '<li>Block ' + i + ', fingerprint ' + fp(l, 8) + (sel === i ? ', selected' : '') + (proofSet['0:' + i] ? ', needed to verify the selected block' : '') + (forged === i ? ', forged' : '') + '</li>';
    }).join('') + '<li>Roots: ' + tree.peaks.map(function (p) { return fp(tree.nodes[p], 8); }).join(', ') + '. Signed value ' + M.hex(tree.signed, 8) + '.</li>';
  }

  function say() {
    var n = blocks.length, peaks = tree.peaks.length, msg;
    if (forged !== null) {
      var ch = M.changed(tree, orig).length;
      msg = '<b>Block ' + forged + ' was forged.</b> A real core has no edit: you can only append. If someone tried to slip this block in, ' + ch + (ch === 1 ? ' fingerprint' : ' fingerprints') + ' from the block up to the root changed (marked ×), the signed value goes from ' + M.hex(orig.signed, 8) + ' to ' + M.hex(tree.signed, 8) + ', and a reader holding the real signature rejects it.';
    } else if (sel !== null) {
      var pr = M.proofFor(tree, sel);
      msg = '<b>Block ' + sel + ' is checked with ' + pr.proof.length + ' hashes</b> (ringed), not the other ' + (n - 1) + ' blocks. In a perfect tree of a million blocks it would take about ' + M.proofLength(1000000) + '. That is sparse replication: fetch one block, verify it against the signed roots.';
    } else {
      msg = '<b>This demo: ' + n + ' blocks, ' + peaks + (peaks === 1 ? ' root' : ' roots') + '.</b> A real log keeps growing. Select a block to see what verifies it.';
    }
    if (blocks.length >= cap) msg += ' The demo stops at ' + cap + ' blocks here; a real log has no such limit.';
    readout.innerHTML = msg;
    appendBtn.disabled = blocks.length >= cap;
    forgeBtn.disabled = sel === null || forged !== null;
    forgeBtn.textContent = sel === null ? 'Forge the selected block' : 'Forge block ' + sel;
  }

  function rail() {
    var pr = sel === null ? null : M.proofFor(tree, sel), api = G.api.reduce(function (c, g) { g.items.forEach(function (i) { c[i.kind] = (c[i.kind] || 0) + 1; }); return c; }, {});
    var items = [
      ['basics.html', 'Basics', 'Blocks, keys, forks', blocks.length + ' blocks in the demo'],
      ['features.html', 'Features', 'The five from the README', pr ? pr.proof.length + ' hashes verify block ' + sel : ''],
      ['started.html', 'Get started', 'Install and run', 'hypercore ' + G.verified.hypercore],
      ['api.html', 'API', 'Methods, properties, events', api.method + ' methods'],
      ['examples.html', 'Examples', 'Runnable, with output', G.examples.length + ' run and checked'],
      ['advanced.html', 'Advanced', 'Forks, snapshots, encryption', ''],
      ['about.html', 'About', 'How this site is checked', '']
    ];
    $('#rail').innerHTML = items.map(function (i) {
      return '<li><a href="' + i[0] + '"><b>' + esc(i[1]) + '</b><span>' + esc(i[2]) + '</span>' + (i[3] ? '<em>' + esc(i[3]) + '</em>' : '') + '</a></li>';
    }).join('');
  }

  function refresh() {
    var my = ++gen, list = blocks.slice(), alt = list.slice();
    if (forged !== null) alt[forged] = alt[forged] + ' (forged)';
    Promise.all([M.build(alt), forged !== null ? M.build(list) : Promise.resolve(null)]).then(function (r) {
      if (my !== gen) return;
      tree = r[0]; orig = r[1];
      cap = capFor(width());
      draw(); say(); rail();
    });
  }

  function choose(i) { foc = i; sel = (sel === i) ? null : i; refresh(); }
  svg.addEventListener('click', function (e) { var g = e.target.closest('.leaf'); if (g) choose(+g.getAttribute('data-i')); });
  svg.addEventListener('keydown', function (e) {
    var g = e.target.closest && e.target.closest('.leaf'); if (!g) return;
    var i = +g.getAttribute('data-i'), to = null;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(i); return; }
    if (e.key === 'ArrowRight') to = Math.min(blocks.length - 1, i + 1);
    else if (e.key === 'ArrowLeft') to = Math.max(0, i - 1);
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = blocks.length - 1;
    if (to === null) return;
    e.preventDefault(); // roving focus: move focus only, select with Enter or Space
    g.setAttribute('tabindex', '-1'); foc = to;
    var t = svg.querySelector('.leaf[data-i="' + to + '"]'); t.setAttribute('tabindex', '0'); t.focus();
  });
  appendBtn.addEventListener('click', function () { blocks.push('block ' + blocks.length); forged = null; refresh(); });
  forgeBtn.addEventListener('click', function () { forged = sel; resetBtn.focus(); refresh(); });
  resetBtn.addEventListener('click', function () { reset(); refresh(); });
  var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(function () { if (tree) { cap = capFor(width()); draw(); say(); } }, 100); });

  if (!window.crypto || !crypto.subtle) { readout.textContent = 'This demo needs a secure context (https or localhost) for the Web Crypto API.'; return; }
  reset(); refresh();
});
