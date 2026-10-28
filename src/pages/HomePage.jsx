import Hero from '../sections/Hero'
import About from '../sections/About'
import Services from '../sections/Services'
import Choose from '../sections/Choose'
import CtaBand from '../components/CtaBand'
import Works from '../sections/Works'
import Approach from '../sections/Approach'
import Pricing from '../sections/Pricing'
import Testimonials from '../sections/Testimonials'
import Journey from '../sections/Journey'
import Blog from '../sections/Blog'
import Cta from '../sections/Cta'

export default function HomePage() {
  return (
    <main>
      <Hero />
      <About />
      <Services />
      <Choose />
      <CtaBand />
      <Works />
      <Approach />
      <Pricing />
      <Testimonials />
      <Journey />
      <Blog />
      <Cta />
    </main>
  )
}
