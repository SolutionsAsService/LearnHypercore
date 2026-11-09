/* Learn Hypercore: shared chrome, data loading and code blocks. No dependencies. */
(function () {
  'use strict';
  var NAV = [
    ['basics', 'basics.html', 'Basics'], ['features', 'features.html', 'Features'], ['started', 'started.html', 'Get started'],
    ['api', 'api.html', 'API'], ['examples', 'examples.html', 'Examples'], ['advanced', 'advanced.html', 'Advanced'], ['about', 'about.html', 'About']
  ];
  var REPO = 'https://github.com/SolutionsAsService/LearnHypercore';
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function get(path) {
    return fetch(new URL(path, document.baseURI)).then(function (r) {
      if (!r.ok) throw new Error(path + ': HTTP ' + r.status);
      return r.json();
    });
  }

  function chrome(active) {
    var h = document.createElement('header');
    h.className = 'site';
    h.innerHTML = '<a class="skip" href="#main">Skip to content</a><div class="wrap topbar">' +
      '<a class="brand" href="index.html"><svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">' +
      '<g fill="currentColor"><rect x="1" y="15" width="4.5" height="7" rx="1"/><rect x="6.5" y="15" width="4.5" height="7" rx="1"/><rect x="12" y="15" width="4.5" height="7" rx="1"/></g>' +
      '<rect x="17.5" y="15" width="4.5" height="7" rx="1" fill="var(--new)"/><g stroke="currentColor" stroke-width="1.6" fill="none"><path d="M3.2 15 8.8 6.5 14.2 15M8.8 6.5l8.9 8.5"/></g></svg>Learn Hypercore</a>' +
      '<nav aria-label="Main">' + NAV.map(function (n) {
        return '<a href="' + n[1] + '"' + (n[0] === active ? ' aria-current="page"' : '') + '>' + n[2] + '</a>';
      }).join('') + '</nav></div>';
    document.body.insertBefore(h, document.body.firstChild);
    var f = document.createElement('footer');
    f.className = 'site';
    f.innerHTML = '<div class="wrap"><p>Unofficial. Not affiliated with Holepunch. Hypercore is its authors’ project; the source of truth is its <a href="https://docs.pears.com/building-blocks/hypercore">documentation</a>.</p>' +
      '<p><span id="stamp-foot"></span> <a href="about.html">How this site is checked</a> · <a href="' + REPO + '/issues">Report a mistake</a> · <a href="' + REPO + '">Source</a> · MIT licence</p></div>';
    document.body.appendChild(f);
  }

  function codeBlock(code, out) {
    var wrap = document.createElement('div');
    wrap.className = 'codeblock';
    wrap.innerHTML = '<button type="button" class="copy" aria-label="Copy code">Copy</button><pre tabindex="0" role="region" aria-label="Code example"><code>' + esc(code.replace(/\n$/, '')) + '</code></pre>' +
      (out ? '<div class="out"><b>Output, from a real run</b>' + esc(out) + '</div>' : '');
    wrap.querySelector('.copy').addEventListener('click', function (e) {
      var b = e.currentTarget;
      var done = function () { b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1500); };
      if (navigator.clipboard) navigator.clipboard.writeText(code).then(done, function () { b.textContent = 'Select and copy'; });
      else b.textContent = 'Select and copy';
    });
    return wrap;
  }

  // boot(active, fn): chrome, load verified/examples/api, stamp, run fn.
  function boot(active, fn) {
    chrome(active);
    Promise.all([get('data/verified.json'), get('data/examples.json'), get('data/api.json')]).then(function (d) {
      var G = { verified: d[0], examples: d[1], api: d[2], esc: esc, $: $, $$: $$, codeBlock: codeBlock };
      $$('[data-fig]').forEach(function (el) {
        var k = el.getAttribute('data-fig');
        var v = { version: G.verified.hypercore, date: G.verified.date, node: G.verified.node,
          examples: G.examples.length, methods: G.api.reduce(function (n, g) { return n + g.items.filter(function (i) { return i.kind === 'method'; }).length; }, 0),
          apiitems: G.api.reduce(function (n, g) { return n + g.items.length; }, 0) }[k];
        el.textContent = v;
      });
      var s = 'Code and API names run or looked up against hypercore ' + G.verified.hypercore + ' on ' + G.verified.date + '. The prose paraphrases the README.';
      var foot = $('#stamp-foot'); if (foot) foot.textContent = s;
      $$('.stamp').forEach(function (el) { el.textContent = s; });
      $$('[data-example]').forEach(function (el) {
        var ex = G.examples.filter(function (e) { return e.id === el.getAttribute('data-example'); })[0];
        if (ex) el.replaceWith(codeBlock(ex.code, ex.expect));
      });
      if (fn) fn(G);
    }).catch(function (err) {
      console.error(err);
      var m = $('#main'); if (m) m.insertAdjacentHTML('afterbegin', '<p class="notice" role="alert">Data could not be loaded (' + esc(err.message) + '). Serve this folder instead of opening the file, for example with <code>npx serve .</code>.</p>');
    });
  }
  window.HC = { boot: boot, esc: esc, $: $, $$: $$, codeBlock: codeBlock };
})();
