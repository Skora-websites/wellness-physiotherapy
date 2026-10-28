import { openAppointmentModal } from '../components/AppointmentModal'

const CARDS = [
  {
    key: 'assessment',
    image: '/assets/img/site/service-assessment.jpg',
    title: 'Physiotherapy Assessment',
    text: 'A detailed assessment to find the root cause of pain and create a tailored plan.',
  },
  {
    key: 'home',
    image: '/assets/img/site/service-home.jpg',
    title: 'Home Session',
    text: 'Tailored physiotherapy treatment in the convenience and comfort of your home.',
  },
  {
    key: 'treatment',
    image: '/assets/img/site/service-treatment.jpg',
    title: 'Physiotherapy Treatment',
    text: 'Hands-on therapy and targeted exercises to relieve pain and restore function.',
  },
]

function ServiceCard({ card, variant }) {
  return (
    <div
      img-scroll=''
      role='button'
      tabIndex={0}
      aria-label={`Book ${card.title}`}
      onClick={() => openAppointmentModal(card.title)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          openAppointmentModal(card.title)
        }
      }}
      className={`service-wrapper _0${variant} service-card-interactive`}
    >
      <img src={card.image} loading='lazy' zoom-out='' alt={card.title} className='service-image' />
      <div className='service-wrap'>
        <div className='service-text-wrap'>
          <h3 className='h4 white'>{card.title}</h3>
          <p className='body-text mist'>{card.text}</p>
        </div>
      </div>
    </div>
  )
}

export default function Services() {
  return (
    <>
      <section id='services' className='section service'>
        <div className='w-layout-blockcontainer container w-container'>
          <div className='service-main-wrapper'>
            <div className='service-title-wrapper'>
              <div className='service-title-wrap'>
                <div slide-bottom-all='' className='sub-tag-wrap'>
                  <div className='sub-tag-text-wrap'>
                    <div className='body-text gray'>
                      {'Our Services'}
                    </div>
                  </div>
                </div>
                <div className='sub-title-wrap left'>
                  <h2 className='sub-title'>
                    {'Personalized Care for Every Step of Recovery'}
                  </h2>
                </div>
              </div>
              <div slide-bottom-all='' className='service-para-wrap'>
                <p className='body-text gray'>
                  {'Tailored physiotherapy treatments designed to relieve pain, restore movement and rebuild strength.'}
                </p>
              </div>
            </div>
            <div className='service-grid desk'>
              {CARDS.map((card, index) => (
                <ServiceCard key={card.key} card={card} variant={index + 1} />
              ))}
            </div>
            {/* the marquee repeats the three cards for the scroll loop */}
            <div className='service-loop-wrapper' aria-hidden='true'>
              {[0, 1, 2].map((loop) => (
                <div key={loop} loop-card='' className='service-loop'>
                  {CARDS.map((card, index) => (
                    <ServiceCard key={card.key} card={card} variant={index + 1} />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
