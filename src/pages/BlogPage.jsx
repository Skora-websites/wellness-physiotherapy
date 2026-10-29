import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import PostGrid from '../components/PostGrid'
import CtaBand from '../components/CtaBand'
import BeaconPagination from '../components/BeaconPagination'
import Cta from '../sections/Cta'
import { useContent } from '../lib/content'

const PAGE_SIZE = 3

export default function BlogPage() {
  const [page, setPage] = useState(1)
  const { blogs } = useContent()
  const posts = blogs.filter((post) => post.status !== 'draft' && post.contentType !== 'standalone')
  const pageCount = Math.ceil(posts.length / PAGE_SIZE)
  const visiblePosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goToPage(next) {
    setPage(next)
  }

  return (
    <main>
      <PageHeader
        label='Blog'
        title='Wellness Insights & Tips'
        description='Practical advice from our Noida clinic on pain relief, injury recovery, posture and staying mobile for longer.'
        image='/assets/img/9bfa6d-6a8e934e44ceed9147704b89_Frame-46-4-.webp'
        imageSmall='/assets/img/e717e7-6a8e934e44ceed9147704b89_Frame-46-4-p-500.webp'
      />

      <section className='section blog'>
        <div className='w-layout-blockcontainer container w-container'>
          <div className='blog-main-wrapper'>
            <div className='blog-title-wrapper blog-page-head'>
              <div className='sub-title-wrapper blog'>
                <div slide-bottom-all='' className='sub-tag-wrap'>
                  <div className='sub-tag-text-wrap'>
                    <div className='body-text gray'>{'Latest Articles'}</div>
                  </div>
                </div>
                <div className='sub-title-wrap blog'>
                  <h2 className='sub-title'>{'Read Before You Recover'}</h2>
                </div>
                <div slide-bottom-all='' className='sub-text-wrap blog'>
                  <p className='body-text gray'>
                    {`${posts.length} articles on pain, movement and rehabilitation — written by our clinical team.`}
                  </p>
              </div>
            </div>
            </div>
            <div id='blog-grid'>
              <PostGrid items={visiblePosts} />
            </div>

            <BeaconPagination page={page} pageCount={pageCount} onChange={goToPage} label='Blog pages' />
          </div>
        </div>
      </section>

      <CtaBand
        title='Have a Question About Your Recovery?'
        text='Send us a message or book an assessment — we will tell you what is going on and what treatment makes sense.'
      />

      <Cta />
    </main>
  )
}
