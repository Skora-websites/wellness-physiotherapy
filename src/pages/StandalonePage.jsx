import PageHeader from '../components/PageHeader'
import CtaBand from '../components/CtaBand'
import NotFoundPage from './NotFoundPage'
import { useContent, usePageSeo } from '../lib/content'

/** A page published from Admin → Blogs & Pages with type "Standalone Page". */
export default function StandalonePage({ slug }) {
  const { blogs } = useContent()
  const page = blogs.find(
    (item) => item.slug === slug && item.contentType === 'standalone' && item.status !== 'draft'
  )

  usePageSeo({
    path: `/${slug}`,
    title: page ? `${page.metaTitle || page.title} · Wellness Physiotherapy` : undefined,
    description: page?.metaDescription || page?.excerpt,
    keywords: page?.metaKeywords,
    canonical: page?.canonicalUrl,
  })

  if (!page) return <NotFoundPage />

  return (
    <main>
      <PageHeader
        label={page.category || 'Wellness Physiotherapy'}
        title={page.title}
        description={page.excerpt}
        image={page.image}
        imageSmall={page.image}
      />

      <article className='section blog-article-section'>
        <div className='w-layout-blockcontainer container w-container'>
          {page.image && (
            <div className='blog-featured-media-wrap' style={{ maxWidth: '840px', margin: '0 auto 32px' }}>
              <img src={page.image} alt={page.imageAlt || page.title} className='blog-featured-media-img' />
            </div>
          )}
          <div
            className='blog-article-layout'
            dangerouslySetInnerHTML={{ __html: page.contentHtml || page.content || '' }}
          />
        </div>
      </article>

      <CtaBand
        title='Ready to Move Pain-Free?'
        text='Book an assessment with Dr. Arun Yadav and get a clear, honest recovery plan.'
      />
    </main>
  )
}
