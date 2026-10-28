import PageHeader from '../components/PageHeader'
import VideoCarousel from '../components/VideoCarousel'
import CtaBand from '../components/CtaBand'
import Gallery from '../sections/Gallery'
import Cta from '../sections/Cta'

export default function GalleryPage() {
  return (
    <main>
      {/* 1. Hero Section for Gallery Page */}
      <PageHeader
        label='Our Gallery'
        title='Clinic Spaces & Patient Stories'
        description='Tour our modern treatment facilities in Sector 50, Noida, and watch real recovery stories from patients back on their feet.'
        image='/assets/img/clinic/doctor-desk.jpg'
        imageSmall='/assets/img/clinic/doctor-desk.jpg'
      />

      {/* 2. Portrait Video Reel Carousel (Circular Queue) */}
      <VideoCarousel />

      {/* 3. Inline CTA */}
      <CtaBand
        id='gallery-inline-cta'
        className='inline-cta'
        title='Ready to Begin Your Recovery Journey?'
        text='Schedule an in-depth clinical consultation with Dr. Arun Yadav at our Noida clinic.'
      />

      {/* 4. Gallery Image Carousel Section */}
      <Gallery standalone />

      {/* 5. Bottom CTA */}
      <Cta />
    </main>
  )
}
