// Fetches a web page for the in-portfolio Safari so sites that forbid framing
// (GitHub, etc.) can still be browsed inside the window.
// The response is sandboxed (opaque origin) so proxied pages can't touch this site's storage.

const PRIVATE_HOST = /^(localhost|0\.0\.0\.0|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?|.*\.(local|internal|localhost)$)/i
const MAX_BYTES = 4 * 1024 * 1024
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'

// Injected into every proxied page: route link clicks and GET forms back to the parent Safari window.
const bridge = (url) => `<script>(function(){
var P=window.parent;function abs(h){try{return new URL(h,document.baseURI).href}catch(e){return null}}
document.addEventListener('click',function(e){var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;
var h=a.getAttribute('href');if(!h||h.charAt(0)==='#'||/^(javascript|mailto|tel|data):/i.test(h))return;var u=abs(h);if(!u)return;
e.preventDefault();e.stopImmediatePropagation();P.postMessage({__safari:a.target==='_blank'?'newtab':'nav',url:u},'*')},true);
document.addEventListener('submit',function(e){var f=e.target;if((f.method||'get').toLowerCase()!=='get')return;e.preventDefault();
var u=new URL(f.getAttribute('action')||location.href,document.baseURI);new FormData(f).forEach(function(v,k){u.searchParams.set(k,v)});
P.postMessage({__safari:'nav',url:u.href},'*')},true);
function ready(){P.postMessage({__safari:'loaded',url:${JSON.stringify(url)},title:document.title},'*')}
if(document.readyState!=='loading')ready();else document.addEventListener('DOMContentLoaded',ready);
})();</script>`

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)
const errorPage = (url, msg) => `<!doctype html><meta charset="utf-8"><body style="font:15px -apple-system,Inter,sans-serif;background:#1c1c20;color:#f5f5f7;display:grid;place-items:center;height:100vh;margin:0;text-align:center">
<div><div style="font-size:52px">🧭</div><h2 style="margin:10px 0 6px">Safari can’t open this page</h2><p style="color:#aaa;max-width:420px;margin:0 auto 18px">${msg}</p>
<a href="${esc(url)}" target="_blank" rel="noreferrer" style="background:#0a84ff;color:#fff;padding:9px 16px;border-radius:99px;text-decoration:none;font-weight:600">Open in your browser ↗</a></div>`

function send(res, status, body, headers = {}) {
  res.statusCode = status
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v)
  res.end(body)
}

export default async function handler(req, res) {
  const target = new URL(req.url, 'http://local').searchParams.get('url') || ''
  let url
  try { url = new URL(target) } catch { return send(res, 400, 'Bad url') }
  if (!/^https?:$/.test(url.protocol) || PRIVATE_HOST.test(url.hostname) || target.length > 2048) return send(res, 400, 'Blocked url')

  const sandbox = { 'content-type': 'text/html; charset=utf-8', 'content-security-policy': 'sandbox allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox', 'x-robots-tag': 'noindex' }
  try {
    const ctrl = new AbortController()
    const timer = setTimeout(() => ctrl.abort(), 9000)
    const r = await fetch(url, { redirect: 'follow', signal: ctrl.signal, headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml,*/*;q=0.8', 'accept-language': 'en-US,en;q=0.9' } })
    clearTimeout(timer)
    const type = r.headers.get('content-type') || ''
    // Non-HTML (images, PDFs, downloads)   hand straight to the original URL.
    if (!type.includes('html')) return send(res, 302, '', { location: r.url })
    const len = +(r.headers.get('content-length') || 0)
    if (len > MAX_BYTES) return send(res, 200, errorPage(r.url, 'This page is too large to preview here.'), sandbox)
    let html = await r.text()
    if (html.length > MAX_BYTES) html = html.slice(0, MAX_BYTES)
    const final = r.url
    html = html
      .replace(/<meta[^>]+http-equiv=["']?(content-security-policy|x-frame-options|refresh)["']?[^>]*>/gi, '')
      .replace(/<base\s[^>]*>/gi, '')
    const inject = `<base href="${final.replace(/"/g, '&quot;')}">${bridge(final)}`
    html = /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (m) => m + inject) : inject + html
    return send(res, r.ok ? 200 : r.status, html, { ...sandbox, 'cache-control': 'public, max-age=300, s-maxage=600', 'x-final-url': final })
  } catch (e) {
    return send(res, 502, errorPage(target, e.name === 'AbortError' ? 'The site took too long to respond.' : 'The site could not be reached from the preview.'), sandbox)
  }
}
