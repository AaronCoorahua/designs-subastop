/* Voyager · iframe auto-resize via postMessage
   Resuelve el caso file:// donde cada HTML es cross-origin.
   Cada componente publica su altura; index.html escucha y ajusta el iframe.
   Funciona idéntico en file:// y http(s). */
(function () {
  if (window.parent === window) { return; }

  var lastSent = 0;

  function postHeight() {
    /* SOLO body.scrollHeight — documentElement.scrollHeight tiene un piso
       igual al viewport del iframe, lo que crea feedback loop:
       cada vez que el padre crece el iframe, viewport crece, scrollHeight
       crece, se publica más altura, padre crece más → infinito. */
    if (!document.body) { return; }
    var h = document.body.scrollHeight;
    if (h <= 0 || h === lastSent) { return; }
    lastSent = h;
    try {
      window.parent.postMessage({ type: 'voyager-iframe-height', height: h }, '*');
    } catch (_) {}
  }

  function schedule() {
    requestAnimationFrame(postHeight);
  }

  function init() {
    postHeight();
    /* Pasadas extra para fonts Google e imágenes diferidas */
    setTimeout(postHeight, 150);
    setTimeout(postHeight, 700);
    setTimeout(postHeight, 1600);

    if (typeof ResizeObserver === 'function') {
      var ro = new ResizeObserver(schedule);
      ro.observe(document.body);
    }
    if (typeof MutationObserver === 'function') {
      var mo = new MutationObserver(schedule);
      mo.observe(document.body, {
        childList: true, subtree: true,
        attributes: true, attributeFilter: ['class', 'style']
      });
    }
    /* Resize del viewport del iframe (cuando el padre cambia ancho) */
    window.addEventListener('resize', schedule);
    /* Última pasada cuando todos los recursos terminen */
    window.addEventListener('load', schedule);
  }

  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
