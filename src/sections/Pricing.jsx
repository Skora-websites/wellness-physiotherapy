import { openAppointmentModal } from '../components/AppointmentModal'
import ShaderBackground from '../components/ui/ShaderBackground'

export default function Pricing() {
  return (
    <>
    <section id='pricing' className='section pricing'>
      <div className='w-layout-blockcontainer container w-container'>
        <div className='pricing-main-wrapper'>
          <div className='pricing-title-wrapper'>
            <div className='pricing-title-wrap'>
              <div slide-bottom-all='' className='sub-tag-wrap'>
                <div className='sub-tag-text-wrap'>
                  <div className='body-text gray'>                    {' Session Pricing'}
                  </div>
                </div>
              </div>
              <div className='sub-title-wrap left'>
                <h2 className='sub-title'>
                  {'Sessions & Pricing'}
                </h2>
              </div>
            </div>
            <div slide-bottom-all='' className='pricing-para-wrap'>
              <p className='body-text gray'>
                {'Straightforward pricing for world-class physiotherapy. Home visits available across Noida.'}
              </p>
            </div>
          </div>
          <div className='pricing-plan-grid'>
            <div grow-in='' className='pricing-plan-wrapper left'>
              <div className='pricing-title'>
                <div className='h5'>
                  {'Physiotherapy Assessment'}
                </div>
              </div>
              <div className='price-wrap'>
                <div className='h3'>
                  {'₹400 '}
                  <span className='price-span'>
                    {'/ 30 min'}
                  </span>
                </div>
              </div>
              <div className='pricing-divider'></div>
              <div className='pricing-plan-content'>
                <div className='pricing-text-block'>
                  <img loading='lazy' src='/assets/img/a83d0b-6a8f261fa13a21b860428b8a_Tik-removebg-preview.svg' alt='' className='pricing-icon' />
                  <div className='body-text gray'>
                    {'Full physical assessment'}
                  </div>
                </div>
                <div className='pricing-text-block'>
                  <img loading='lazy' src='/assets/img/a83d0b-6a8f261fa13a21b860428b8a_Tik-removebg-preview.svg' alt='' className='pricing-icon' />
                  <div className='body-text gray'>                    {'Movement & posture analysis'}
                  </div>
                </div>
                <div className='pricing-text-block'>
                  <img loading='lazy' src='/assets/img/a83d0b-6a8f261fa13a21b860428b8a_Tik-removebg-preview.svg' alt='' className='pricing-icon' />
                  <div className='body-text gray'>
                    {'Personalised treatment plan'}
                  </div>
                </div>
                <div className='pricing-text-block'>
                  <img loading='lazy' src='/assets/img/a83d0b-6a8f261fa13a21b860428b8a_Tik-removebg-preview.svg' alt='' className='pricing-icon' />
                  <div className='body-text gray'>
                    {'Sports & injury diagnosis'}
                  </div>
                </div>
              </div>
              <div className='pricing-button'>
                <a
                  data-wf--button--variant='dark'
                  href='#book'
                  aria-label='Book Physiotherapy Assessment Session'
                  onClick={(e) => {
                    e.preventDefault()
                    openAppointmentModal('Physiotherapy Assessment')
                  }}
                  className='primary-button w-variant-faa0a121-f2b6-9d41-bc84-2deb6ac98b69 w-inline-block'
                >
                  <div className='primary-button-inner w-variant-faa0a121-f2b6-9d41-bc84-2deb6ac98b69'>
                    <div className='button-text-wrap w-variant-faa0a121-f2b6-9d41-bc84-2deb6ac98b69'>
                      <div className='button-text'>
                        {'Book Session'}
                      </div>
                      <div className='button-text'>
                        {'Book Session'}
                      </div>
                    </div>
                    <div className='button-arrow-wrap w-variant-faa0a121-f2b6-9d41-bc84-2deb6ac98b69'>
                      <img loading='lazy' src='/assets/img/c2cdac-6a8b5001496ed67dd32f5996_Vector.svg' alt='' className='arrow-icon' />
                    </div>
                  </div>
                </a>
              </div>
              <div className='pricing-text-wrap'>
                <div className='body-text-s'>
                  {'“Book your first assessment today.”'}
                </div>
              </div>
            </div>
            <div grow-in='' className='pricing-plan-wrapper middle'>
              <ShaderBackground className='pricing-shader-bg' />
              <div className='pricing-title'>
                <div className='h5 white'>
                  {'Premium Home Session'}
                </div>
              </div>
              <div className='price-wrap'>
                <div className='h3 white'>
                  {'₹799'}
                  <span className='price-span white'>
                    {' / 45 min'}
                  </span>
                </div>
              </div>
              <div className='pricing-divider white'></div>
              <div className='pricing-plan-content'>
                <div className='pricing-text-block'>
                  <img loading='lazy' src='/assets/img/a83d0b-6a8f261fa13a21b860428b8a_Tik-removebg-preview.svg' alt='' className='pricing-icon' />
                  <div className='body-text'>                    {'Therapist at your doorstep'}
                  </div>
                </div>
                <div className='pricing-text-block'>
                  <img loading='lazy' src='/assets/img/a83d0b-6a8f261fa13a21b860428b8a_Tik-removebg-preview.svg' alt='' className='pricing-icon' />
                  <div className='body-text'>
                    {'Available across Noida'}
                  </div>
                </div>
                <div className='pricing-text-block'>
                  <img loading='lazy' src='/assets/img/a83d0b-6a8f261fa13a21b860428b8a_Tik-removebg-preview.svg' alt='' className='pricing-icon' />
                  <div className='body-text'>
                    {'Ideal for post-surgery & elderly care'}
                  </div>
                </div>
                <div className='pricing-text-block'>
                  <img loading='lazy' src='/assets/img/a83d0b-6a8f261fa13a21b860428b8a_Tik-removebg-preview.svg' alt='' className='pricing-icon' />
                  <div className='body-text'>
                    {'Home exercise guidance included'}
                  </div>
                </div>
              </div>
              <div className='pricing-button'>
                <a
                  data-wf--button--variant='white'
                  href='#book'
                  aria-label='Book Premium Home Physiotherapy Session'
                  onClick={(e) => {
                    e.preventDefault()
                    openAppointmentModal('Premium Home Session')
                  }}
                  className='primary-button w-variant-44e41eb2-8e60-c979-6a7d-35d888e578c2 w-inline-block'
                >
                  <div className='primary-button-inner w-variant-44e41eb2-8e60-c979-6a7d-35d888e578c2'>
                    <div className='button-text-wrap w-variant-44e41eb2-8e60-c979-6a7d-35d888e578c2'>
                      <div className='button-text w-variant-44e41eb2-8e60-c979-6a7d-35d888e578c2'>
                        {'Book Home Visit'}
                      </div>
                      <div className='button-text w-variant-44e41eb2-8e60-c979-6a7d-35d888e578c2'>
                        {'Book Home Visit'}
                      </div>
                    </div>
                    <div className='button-arrow-wrap w-variant-44e41eb2-8e60-c979-6a7d-35d888e578c2'>
                      <img loading='lazy' src='/assets/img/c2cdac-6a8b5001496ed67dd32f5996_Vector.svg' alt='' className='arrow-icon w-variant-44e41eb2-8e60-c979-6a7d-35d888e578c2' />
                    </div>
                  </div>
                </a>
              </div>
              <div className='pricing-text-wrap'>
                <div className='body-text-s mist'>
                  {'“Most popular service — home physiotherapy.”'}
                </div>
              </div>
            </div>
            <div grow-in='' className='pricing-plan-wrapper right'>
              <div className='pricing-title'>
                <div className='h5'>
                  {'Physiotherapy Treatment'}
                </div>
              </div>
              <div className='price-wrap'>
                <div className='h3'>
                  {'From ₹499 '}
                  <span className='price-span'>
                    {'/ 45 min'}
                  </span>
                </div>
              </div>
              <div className='pricing-divider'></div>
              <div className='pricing-plan-content'>
                <div className='pricing-text-block'>
                  <img loading='lazy' src='/assets/img/a83d0b-6a8f261fa13a21b860428b8a_Tik-removebg-preview.svg' alt='' className='pricing-icon' />
                  <div className='body-text gray'>
                    {'Manual therapy & targeted exercises'}
                  </div>
                </div>
                <div className='pricing-text-block'>
                  <img loading='lazy' src='/assets/img/a83d0b-6a8f261fa13a21b860428b8a_Tik-removebg-preview.svg' alt='' className='pricing-icon' />
                  <div className='body-text gray'>
                    {'Sports & post-surgery rehabilitation'}
                  </div>
                </div>
                <div className='pricing-text-block'>
                  <img loading='lazy' src='/assets/img/a83d0b-6a8f261fa13a21b860428b8a_Tik-removebg-preview.svg' alt='' className='pricing-icon' />
                  <div className='body-text gray'>
                    {'Dry needling & cupping therapy'}
                  </div>
                </div>
                <div className='pricing-text-block'>
                  <img loading='lazy' src='/assets/img/a83d0b-6a8f261fa13a21b860428b8a_Tik-removebg-preview.svg' alt='' className='pricing-icon' />
                  <div className='body-text gray'>
                    {'Advanced clinical techniques'}
                  </div>
                </div>
              </div>
              <div className='pricing-button'>
                <a
                  data-wf--button--variant='dark'
                  href='#book'
                  aria-label='Book Physiotherapy Treatment Session'
                  onClick={(e) => {
                    e.preventDefault()
                    openAppointmentModal('Physiotherapy Treatment')
                  }}
                  className='primary-button w-variant-faa0a121-f2b6-9d41-bc84-2deb6ac98b69 w-inline-block'
                >
                  <div className='primary-button-inner w-variant-faa0a121-f2b6-9d41-bc84-2deb6ac98b69'>
                    <div className='button-text-wrap w-variant-faa0a121-f2b6-9d41-bc84-2deb6ac98b69'>
                      <div className='button-text'>
                        {'Book Session'}
                      </div>
                      <div className='button-text'>
                        {'Book Session'}
                      </div>
                    </div>
                    <div className='button-arrow-wrap w-variant-faa0a121-f2b6-9d41-bc84-2deb6ac98b69'>
                      <img loading='lazy' src='/assets/img/c2cdac-6a8b5001496ed67dd32f5996_Vector.svg' alt='' className='arrow-icon' />
                    </div>
                  </div>
                </a>
              </div>
              <div className='pricing-text-wrap'>
                <div className='body-text-s'>
                  {'“Advanced treatment for lasting relief.”'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}
