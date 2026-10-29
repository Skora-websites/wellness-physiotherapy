import PageHeader from '../components/PageHeader'
import CtaBand from '../components/CtaBand'
import Cta from '../sections/Cta'
import NotFoundPage from './NotFoundPage'
import { BLOG_DETAIL } from '../data/detailContent'
import { useContent, usePageSeo } from '../lib/content'

export default function BlogDetailPage({ slug }) {
  const { blogs } = useContent()
  const post = blogs.find(
    (item) => item.slug === slug && item.status !== 'draft' && item.contentType !== 'standalone'
  )

  usePageSeo({
    path: `/blog/${slug}`,
    title: post ? `${post.metaTitle || post.title} · Wellness Physiotherapy` : undefined,
    description: post?.metaDescription || post?.excerpt,
    keywords: post?.metaKeywords,
    canonical: post?.canonicalUrl,
  })

  if (!post) return <NotFoundPage />

  const related = blogs
    .filter((item) => item.slug !== post.slug && item.status !== 'draft' && item.contentType !== 'standalone')
    .slice(0, 3)

  // Copy comes from src/data/detailContent.js + optional per-post overrides.
  const content = { ...BLOG_DETAIL, ...post.content }

  return (
    <main className='blog-detail-page'>
      {/* Dynamic Animated Page Hero */}
      <PageHeader
        label={post.category}
        title={post.title}
        description={content.subtitle}
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
              <div className='blog-featured-caption'>{content.caption}</div>
            </div>

            {/* Editorial Body Content */}
            <div className='blog-article-body'>
              <p className='blog-lead-paragraph'>{post.excerpt}</p>

              {post.contentHtml ? (
                <div className='blog-rich-content' dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
              ) : (
                post.description.map((paragraph, index) => (
                  <div key={index} className='blog-para-block'>
                    {content.sectionHeadings?.[index - 1] && (
                      <h2 className='blog-content-h2'>{content.sectionHeadings[index - 1]}</h2>
                    )}
                    <p className='blog-regular-para'>{paragraph}</p>
                  </div>
                ))
              )}
            </div>

            {/* Back to Index */}
            <div className='blog-share-strip'>
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
