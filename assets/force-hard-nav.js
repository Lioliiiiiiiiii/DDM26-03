// Force browser navigation for internal URLs so hand-edited static HTML
// pages are served instead of stale Next.js client-side-routed components.
//
// Two vectors to cover:
//   1. <a> click → Next.js <Link> soft-nav (capture-phase click handler)
//   2. Programmatic router.push / router.replace → history.pushState
//      (also some elements have pointer-events:none on the <a>, so the
//      click handler never sees a matching anchor and the parent triggers
//      router.push directly)
(function () {
  var origin = window.location.origin;

  function sameOriginUrl(raw) {
    try {
      var u = new URL(raw, window.location.href);
      return u.origin === origin ? u : null;
    } catch (_) { return null; }
  }

  function clickHandler(e) {
    if (e.defaultPrevented) return;
    if (e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href');
    if (!href) return;
    if (href[0] === '#') return;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) return;
    if (a.hasAttribute('download')) return;
    if (a.target && a.target !== '_self') return;
    var url = sameOriginUrl(a.href);
    if (!url) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    window.location.href = url.href;
  }
  document.addEventListener('click', clickHandler, true);

  // Intercept programmatic navigation from the Next.js router.
  var origPush = history.pushState;
  var origReplace = history.replaceState;
  function wrap(orig) {
    return function (state, title, url) {
      if (url != null) {
        var target = sameOriginUrl(url);
        if (target && target.pathname !== window.location.pathname) {
          window.location.href = target.href;
          return;
        }
      }
      return orig.apply(this, arguments);
    };
  }
  history.pushState = wrap(origPush);
  history.replaceState = wrap(origReplace);
})();
