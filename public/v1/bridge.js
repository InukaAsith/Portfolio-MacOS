// Runs inside the local copy of Portfolio v1 when it's shown in the desktop's Safari:
// routes link clicks back to Safari so history, tabs and the address bar stay in sync.
(function () {
  var P = window.parent
  if (P === window) return
  var LIVE = 'https://inukaasith.vercel.app'
  function logical(href) {
    var u = new URL(href, location.href)
    if (u.host === location.host && u.pathname.indexOf('/v1/') === 0) {
      return LIVE + u.pathname.slice(3).replace(/index\.html$/, '') + u.search + u.hash
    }
    return u.href
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]')
    if (!a) return
    var h = a.getAttribute('href')
    if (!h || h.charAt(0) === '#' || /^(mailto|tel|javascript):/i.test(h)) return
    e.preventDefault()
    P.postMessage({ __safari: a.target === '_blank' ? 'newtab' : 'nav', url: logical(a.href) }, '*')
  }, true)
  P.postMessage({ __safari: 'loaded', url: logical(location.href), title: document.title }, '*')
})()
