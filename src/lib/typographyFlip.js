let flipObserver = null

export function initSectionTypographyAnimations() {
  if (typeof window === 'undefined') return

  if (!flipObserver) {
    flipObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-flipped')
            flipObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )
  }

  const targets = document.querySelectorAll(
    '.sub-title, .page-hero-title, .cta-band-title, .cta-panel-title'
  )

  targets.forEach((el) => {
    if (el.dataset.flipInit === 'true' || el.classList.contains('hero-editorial-h1')) {
      return
    }

    const rawText = el.textContent.trim()
    if (!rawText) return

    el.dataset.flipInit = 'true'
    el.setAttribute('aria-label', rawText)
    el.classList.add('perspective-header')

    el.textContent = ''

    const wrapper = document.createElement('span')
    wrapper.className = 'flip-header-inner'
    wrapper.setAttribute('aria-hidden', 'true')

    const words = rawText.split(/\s+/)

    words.forEach((word, wordIdx) => {
      const wordSpan = document.createElement('span')
      wordSpan.className = 'flip-word'

      for (let i = 0; i < word.length; i++) {
        const char = word[i]
        const charSpan = document.createElement('span')
        charSpan.className = 'flip-char'
        // Same index for every char of the word, so each word flips up as a
        // single unit (one line at a time), like the hero headline.
        charSpan.style.setProperty('--char-index', wordIdx)
        charSpan.textContent = char
        wordSpan.appendChild(charSpan)
      }

      wrapper.appendChild(wordSpan)

      if (wordIdx < words.length - 1) {
        const spaceSpan = document.createElement('span')
        spaceSpan.className = 'flip-space'
        spaceSpan.innerHTML = '&nbsp;'
        wrapper.appendChild(spaceSpan)
      }
    })

    el.appendChild(wrapper)
    flipObserver.observe(el)
  })
}
