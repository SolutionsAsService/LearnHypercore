HC.boot('api', function (G) {
  var root = G.$('#api'), q = G.$('#q'), count = G.$('#count');
  var c = {}; G.api.forEach(function (g) { g.items.forEach(function (i) { c[i.kind] = (c[i.kind] || 0) + 1; }); });
  G.$('#breakdown').textContent = c.method + ' methods, ' + (c.property + c.static) + ' properties and constants, and ' + c.event + ' events';
  var LABEL = { method: 'method', property: 'property', event: 'event', static: 'static' };
  function render() {
    var term = q.value.trim().toLowerCase(), shown = 0, html = '';
    G.api.forEach(function (g) {
      var items = g.items.filter(function (i) { return !term || (i.name + ' ' + i.sig + ' ' + i.text).toLowerCase().indexOf(term) >= 0; });
      if (!items.length) return;
      shown += items.length;
      html += '<section class="api-group"><h2>' + G.esc(g.group) + '</h2>' + items.map(function (i) {
        return '<div class="api-item" id="' + G.esc(i.kind + '-' + i.name) + '"><span class="kind">' + LABEL[i.kind] + '</span><code class="sig">' + G.esc(i.sig) + '</code><p>' + G.esc(i.text) + '</p></div>';
      }).join('') + '</section>';
    });
    root.innerHTML = html || '<p class="notice">Nothing matches that filter.</p>';
    count.textContent = shown + ' shown';
  }
  q.addEventListener('input', render);
  render();
});
