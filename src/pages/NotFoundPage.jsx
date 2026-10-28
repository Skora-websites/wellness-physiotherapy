import PageHeader from '../components/PageHeader'

export default function NotFoundPage() {
  return (
    <main>
      <PageHeader
        label='404'
        title='This Page Took a Rest Day'
        description='The page you were looking for does not exist. Head back to the homepage or book an appointment instead.'
      />
      <section className='section notfound'>
        <div className='w-layout-blockcontainer container w-container'>
          <div className='notfound-actions'>
            <a href='/' className='booking-submit'>{'Back to Home'}</a>
            <a href='/contact' className='contact-map-link'>{'Book Appointment'}</a>
          </div>
        </div>
      </section>
    </main>
  )
}
