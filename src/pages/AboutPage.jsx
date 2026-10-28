import PageHeader from '../components/PageHeader'
import CtaBand from '../components/CtaBand'
import DoctorProfile from '../sections/DoctorProfile'
import MissionVision from '../sections/MissionVision'
import Approach from '../sections/Approach'
import Gallery from '../sections/Gallery'
import Testimonials from '../sections/Testimonials'
import Cta from '../sections/Cta'

export default function AboutPage() {
  return (
    <main>
      <PageHeader
        label='About Us'
        title='Physiotherapy Care Built Around You'
        description='Wellness Physiotherapy Centre is a Noida-based clinic led by Dr. Arun Yadav, combining sports rehabilitation, neurological physiotherapy and advanced manual therapy in one practice.'
        image='/assets/img/clinic/doctor-desk.jpg'
        imageSmall='/assets/img/clinic/doctor-desk.jpg'
      />

      <DoctorProfile />

      <CtaBand
        id='inline-cta'
        className='inline-cta'
        title='Meet Us Before You Commit'
        text='Book a consultation with Dr. Arun Yadav — assessment first, treatment plan second, no guesswork.'
      />

      <MissionVision />

      <Approach />
      <Gallery />
      <Testimonials />

      <Cta />
    </main>
  )
}
