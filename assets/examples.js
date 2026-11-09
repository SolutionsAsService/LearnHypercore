HC.boot('examples', function (G) {
  var root = G.$('#ex');
  G.examples.forEach(function (ex, i) {
    var sec = document.createElement('section');
    sec.id = ex.id;
    sec.innerHTML = '<h2>' + (i + 1) + '. ' + G.esc(ex.title) + '</h2><p>' + G.esc(ex.lead) + '</p>';
    sec.appendChild(G.codeBlock(ex.code, ex.expect));
    root.appendChild(sec);
  });
});
