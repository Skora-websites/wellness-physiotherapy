import PostGrid from '../components/PostGrid'

export default function Blog() {
  return (
    <>
    <section id='blog' className='section blog'>
      <div className='w-layout-blockcontainer container w-container'>
        <div className='blog-main-wrapper'>
          <div className='blog-title-wrapper'>
            <div className='sub-title-wrapper blog'>
              <div slide-bottom-all='' className='sub-tag-wrap'>
                <div className='sub-tag-text-wrap'>
                  <div className='body-text gray'>
                    {'Blog'}
                  </div>
                </div>
              </div>
              <div className='sub-title-wrap blog'>
                <h2 className='sub-title'>
                  {'Wellness '}<span className='blog-insights-line'>{'Insights & Tips'}</span>
                </h2>
              </div>
              <div slide-bottom-all='' className='sub-text-wrap blog'>
                <p className='body-text gray'>
                  {'Practical advice from our Noida clinic on pain relief, injury recovery and staying mobile for longer.'}
                </p>
              </div>
              <div slide-bottom-all='' className='blog-all-link-wrap'>
                <a href='/blog' className='contact-map-link'>{'Read all articles'}</a>
              </div>
            </div>
          </div>
          <PostGrid limit={3} />
        </div>
      </div>
    </section>
    </>
  )
}
