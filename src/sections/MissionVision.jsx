const pillars = [
  {
    number: '01',
    title: 'Our Mission',
    text: 'Make expert physiotherapy normal, not a last resort. Every patient in Noida should be able to get a proper diagnosis, a hands-on plan and clear milestones — at the clinic or at home.'
  },
  {
    number: '02',
    title: 'Our Vision',
    text: 'Build the most trusted rehabilitation practice in the city: one where athletes, seniors and working professionals recover faster because treatment is measured, honest and genuinely personal.'
  }
]

const values = [
  {
    title: 'Hands-On First',
    text: 'Manual therapy and clinical reasoning before gadgets or gimmicks.'
  },
  {
    title: 'Honest Advice',
    text: 'If physiotherapy is not the answer, we tell you what is.'
  },
  {
    title: 'Inclusive Rehab',
    text: 'Para-athletes, seniors, desk workers — plans adapt to real life.'
  },
  {
    title: 'Long-Term Results',
    text: 'We treat the cause and teach you how to keep it from returning.'
  }
]

export default function MissionVision() {
  return (
    <section id='mission' className='section mission'>
      <div className='w-layout-blockcontainer container w-container'>
        <div className='mission-title-wrapper'>
          <div className='sub-title-wrapper middle'>
            <div slide-bottom-all='' className='sub-tag-wrap'>
              <div className='sub-tag-text-wrap'>
                <div className='body-text gray'>{'Our Purpose'}</div>
              </div>
            </div>
            <div className='sub-title-wrap'>
              <h2 className='sub-title'>{'Why We Do This Work'}</h2>
            </div>
            <div slide-bottom-all='' className='sub-text-wrap mission'>
              <p className='body-text gray'>
                {'A physiotherapy practice is only as good as the recovery it produces. These are the standards we hold ourselves to.'}
              </p>
            </div>
          </div>
        </div>

        <div className='mission-grid'>
          {pillars.map((pillar) => (
            <div grow-in='' key={pillar.number} className='mission-card'>
              <div className='mission-card-number'>{pillar.number}</div>
              <h3 className='mission-card-title'>{pillar.title}</h3>
              <p className='body-text gray'>{pillar.text}</p>
            </div>
          ))}
        </div>

        <div className='mission-values'>
          {values.map((value) => (
            <div grow-in='' key={value.title} className='mission-value'>
              <div className='mission-value-mark'></div>
              <div className='mission-value-title'>{value.title}</div>
              <p className='body-text gray'>{value.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
