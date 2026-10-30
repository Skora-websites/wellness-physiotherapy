import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import CtaBand from '../components/CtaBand'
import Cta from '../sections/Cta'
import NotFoundPage from './NotFoundPage'
import { posts, findPost } from '../data/posts'
import { CLINIC_INFO } from '../data/clinic'
import { openAppointmentModal } from '../components/AppointmentModal'

export default function BlogDetailPage({ slug }) {
  const post = findPost(slug)
  const [copied, setCopied] = useState(false)

  if (!post) return <NotFoundPage />

  const related = posts.filter((item) => item.slug !== post.slug).slice(0, 3)

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  // Key clinical takeaways derived from the post
  const takeaways = [
    'Consistent small movement breaks beat hours of static posture.',
    'Early progressive loading and targeted mobilization speed recovery.',
    'Consult a certified physiotherapist if symptoms persist past 14 days.'
  ]

  return (
    <main className='blog-detail-page'>
      {/* Dynamic Animated Page Hero */}
      <PageHeader
        label={post.category}
        title={post.title}
        description={`Clinical Insights & Recovery Guides · Dr. Arun Yadav, Wellness Physiotherapy`}
        image={post.image}
        imageSmall={post.image}
      />

      {/* Breadcrumb & Meta Bar */}
      <div className='detail-breadcrumb-bar'>
        <div className='w-layout-blockcontainer container w-container'>
          <div className='detail-breadcrumb-flex'>
            <nav aria-label='Breadcrumb' className='detail-breadcrumbs'>
              <a href='/' className='breadcrumb-link'>Home</a>
              <span className='breadcrumb-sep'>/</span>
              <a href='/blog' className='breadcrumb-link'>Blog</a>
              <span className='breadcrumb-sep'>/</span>
              <span className='breadcrumb-current'>{post.title}</span>
            </nav>

            <div className='blog-meta-tags-row'>
              <span className='blog-meta-tag'>
                {`${post.date} ${post.month}`}
              </span>
              <span className='blog-meta-tag'>
                {'4 min read'}
              </span>
              <span className='blog-meta-tag is-badge'>
                {post.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Editorial Article Container */}
      <article className='section blog-article-section'>
        <div className='w-layout-blockcontainer container w-container'>
          <div className='blog-article-layout'>

            {/* Featured Article Image */}
            <div className='blog-featured-media-wrap'>
              <img
                src={post.image}
                alt={post.title}
                className='blog-featured-media-img'
                loading='eager'
              />
              <div className='blog-featured-caption'>
                {'Clinical Recovery Guide · Wellness Physiotherapy Centre, Noida'}
              </div>
            </div>

            {/* Author Byline Box */}
            <div className='blog-author-strip'>
              <img
                src='/assets/img/clinic/doctor-portrait.webp'
                alt='Dr. Arun Yadav'
                className='blog-author-avatar'
              />
              <div className='blog-author-info'>
                <div className='blog-author-name'>{'Dr. Arun Yadav'}</div>
                <div className='blog-author-title'>{'Senior Physiotherapist · BPT, MPT · Certified Cupping & Manual Therapist'}</div>
              </div>
              <div className='blog-verified-badge'>
                <span>✔</span>
                {'Clinically Reviewed'}
              </div>
            </div>

            {/* Key Clinical Takeaways Frosted Box */}
            <div className='blog-takeaways-card'>
              <div className='blog-takeaways-header'>
                <div className='blog-takeaways-icon-box' aria-hidden='true'></div>
                <h3 className='blog-takeaways-title'>{'Key Clinical Takeaways'}</h3>
              </div>
              <ul className='blog-takeaways-list'>
                {takeaways.map((item, idx) => (
                  <li key={idx} className='blog-takeaways-item'>
                    <span className='blog-takeaway-check'>✔</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Editorial Body Content */}
            <div className='blog-article-body'>
              <p className='blog-lead-paragraph'>
                {post.excerpt}
              </p>

              {post.description.map((paragraph, index) => (
                <div key={index} className='blog-para-block'>
                  {index === 1 && (
                    <h2 className='blog-content-h2'>
                      {'What Causes the Problem & How to Reverse It'}
                    </h2>
                  )}
                  {index === 2 && (
                    <h2 className='blog-content-h2'>
                      {'When You Should Seek Professional Physiotherapy'}
                    </h2>
                  )}
                  <p className='blog-regular-para'>
                    {paragraph}
                  </p>
                </div>
              ))}

              {/* Physiotherapist Pro-Tip Callout Box */}
              <blockquote className='blog-protip-quote'>
                <div className='blog-quote-mark'>“</div>
                <div className='blog-quote-content'>
                  <p className='blog-quote-text'>
                    {'“Tissue that is unloaded loses strength and resilience rapidly. Early guided movement and controlled progressive loading always deliver superior, lasting recovery over passive rest.”'}
                  </p>
                  <cite className='blog-quote-cite'>
                    {'— Dr. Arun Yadav, Founder & Chief Physiotherapist'}
                  </cite>
                </div>
              </blockquote>

              <p className='blog-regular-para'>
                {'At Wellness Physiotherapy Centre in Noida Sector 04, our goal is to pinpoint the exact biomechanical dysfunction driving your symptoms and provide one-on-one guided rehabilitation so you can return to life, sports, and active work without fear of re-injury.'}
              </p>
            </div>

            {/* Author Bio Box */}
            <div className='blog-bio-card'>
              <div className='blog-bio-left'>
                <img
                  src='/assets/img/clinic/doctor-portrait.webp'
                  alt='Dr. Arun Yadav, Chief Physiotherapist'
                  className='blog-bio-photo'
                />
              </div>
              <div className='blog-bio-right'>
                <span className='blog-bio-label'>{'About the Author'}</span>
                <h3 className='blog-bio-name'>{'Dr. Arun Yadav (PT)'}</h3>
                <p className='blog-bio-desc'>
                  {'Dr. Arun Yadav is a senior physiotherapist with over 7 years of clinical experience specializing in sports rehabilitation, spinal decompression, orthopedic aftercare, and neurological recovery. He has helped over 5,000 patients regain active, pain-free mobility.'}
                </p>
                <div className='blog-bio-action'>
                  <a
                    href='#book'
                    onClick={(e) => {
                      e.preventDefault()
                      openAppointmentModal('Consultation with Dr. Arun Yadav')
                    }}
                    className='blog-bio-book-btn'
                  >
                    {'Book a Consultation with Dr. Arun'}
                    <span>{'→'}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Share and Back Navigation Strip */}
            <div className='blog-share-strip'>
              <div className='blog-share-group'>
                <span className='blog-share-label'>{'Share this guide:'}</span>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(post.title + ' - ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='blog-share-btn'
                  aria-label='Share on WhatsApp'
                >
                  {'WhatsApp'}
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='blog-share-btn'
                  aria-label='Share on X'
                >
                  {'X (Twitter)'}
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='blog-share-btn'
                  aria-label='Share on LinkedIn'
                >
                  {'LinkedIn'}
                </a>
                <button
                  type='button'
                  onClick={handleCopyLink}
                  className='blog-share-btn'
                  aria-label='Copy article link'
                >
                  {copied ? 'Link Copied! ✓' : 'Copy Link'}
                </button>
              </div>

              <a href='/blog' className='blog-back-button'>
                <span>{'←'}</span>
                {'Back to All Articles'}
              </a>
            </div>

          </div>

          {/* Related Articles Grid */}
          <div className='blog-related-container'>
            <div className='blog-related-header'>
              <div>
                <span className='blog-related-tag'>{'Continue Reading'}</span>
                <h3 className='blog-related-main-title'>{'More Clinical Recovery Articles'}</h3>
              </div>
              <a href='/blog' className='blog-view-all-link'>
                {'View All Articles'}
                <span>{'→'}</span>
              </a>
            </div>

            <div className='blog-related-grid'>
              {related.map((item) => (
                <a key={item.slug} href={`/blog/${item.slug}`} className='blog-related-card'>
                  <div className='blog-related-img-box'>
                    <img src={item.image} alt={item.title} className='blog-related-img' loading='lazy' />
                    <span className='blog-related-category-pill'>{item.category}</span>
                  </div>
                  <div className='blog-related-content-box'>
                    <div className='blog-related-date'>{`${item.date} ${item.month}`}</div>
                    <h4 className='blog-related-title'>{item.title}</h4>
                    <p className='blog-related-excerpt'>{item.excerpt}</p>
                    <span className='blog-related-link-text'>
                      {'Read Article'}
                      <span className='blog-arrow'>{'→'}</span>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

        </div>
      </article>

      {/* Interactive Bottom CTAs */}
      <CtaBand
        title='Have Questions About Your Symptoms?'
        text='Speak directly with Dr. Arun Yadav. We will assess your condition and provide an honest recovery roadmap.'
      />

      <Cta />
    </main>
  )
}
