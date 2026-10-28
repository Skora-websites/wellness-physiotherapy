import GalleryCarousel from '../components/GalleryCarousel'

export default function Gallery({ standalone = false }) {
  return (
    <section
      id='gallery'
      className={`section gallery${standalone ? ' gallery-standalone' : ''}`}
    >
      <div className='w-layout-blockcontainer container w-container'>
        <div className='gallery-main-wrapper'>
          <div className='gallery-title-wrapper'>
            <div className='sub-title-wrapper middle'>
              <div slide-bottom-all='' className='sub-tag-wrap'>
                <div className='sub-tag-text-wrap'>
                  <div className='body-text gray'>
                    {'Our Gallery'}
                  </div>
                </div>
              </div>
              <div className='sub-title-wrap'>
                <h2 className='sub-title'>
                  {'Inside Our Clinic'}
                </h2>
              </div>
              <div slide-bottom-all='' className='sub-text-wrap gallery'>
                <p className='body-text gray'>
                  {'Take a look around our Noida centre — the reception, private treatment rooms and the equipment we use every day.'}
                </p>
              </div>
            </div>
          </div>

          <GalleryCarousel />
        </div>
      </div>
    </section>
  )
}
