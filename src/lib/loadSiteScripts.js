const SCRIPTS = [
  '/assets/js/jquery-3.5.1.min.dc5e7f18c8.js',
  '/assets/js/gsap.min.js',
  '/assets/js/SplitText.min.js',
  '/assets/js/ScrollTrigger.min.js',
  '/assets/js/CustomEase.min.js',
  '/assets/js/interactions.vendor.js',
  '/assets/js/interactions.page.js',
]

let loading = null

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-src="${src}"]`)
    if (existing) {
      if (existing.dataset.loaded === 'true') resolve()
      else {
        existing.addEventListener('load', () => resolve(), { once: true })
        existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)), { once: true })
      }
      return
    }
    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.dataset.src = src
    script.addEventListener('load', () => {
      script.dataset.loaded = 'true'
      resolve()
    })
    script.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)))
    document.body.appendChild(script)
  })
}

export function loadSiteScripts() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (loading) return loading
  loading = SCRIPTS.reduce((chain, src) => chain.then(() => loadScript(src)), Promise.resolve())
  return loading
}
