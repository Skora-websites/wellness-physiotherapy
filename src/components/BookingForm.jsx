import { useState } from 'react'
import { CLINIC_INFO } from '../data/clinic'

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  message: ''
}

function validate(form) {
  const errors = {}

  if (!form.name.trim()) {
    errors.name = 'Please enter your full name.'
  }

  const digits = form.phone.replace(/\D/g, '')
  if (digits && digits.length < 10) {
    errors.phone = 'That looks too short — enter at least 10 digits.'
  }

  if (!form.email.trim()) {
    errors.email = 'Please enter your email address.'
  } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!form.message.trim()) {
    errors.message = 'Please describe your question or inquiry.'
  }

  return errors
}

const fieldOrder = ['name', 'phone', 'email', 'message']

export default function BookingForm() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState('idle')

  const errorList = Object.values(errors).filter(Boolean)

  const update = (field) => (event) => {
    const next = { ...form, [field]: event.target.value }
    setForm(next)
    if (submitted) {
      setErrors(validate(next))
    }
  }

  const focusFirstInvalid = (list) => {
    const first = fieldOrder.find((field) => list[field])
    if (!first) return
    const el = document.getElementById(`booking-${first}`)
    if (el) el.focus()
  }

  const submit = (event) => {
    event.preventDefault()

    const found = validate(form)
    setErrors(found)
    setSubmitted(true)

    if (Object.keys(found).length) {
      focusFirstInvalid(found)
      return
    }

    // Forward inquiry via WhatsApp to clinic desk
    const messageLines = [
      'Hello Wellness Physiotherapy,',
      '',
      'I would like to make an inquiry via your website contact desk.',
      '',
      `Full Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      form.email.trim() ? `Email: ${form.email.trim()}` : null,
      `Inquiry: ${form.message.trim()}`,
      '',
      'Please get back to me. Thank you.'
    ].filter(Boolean)

    const whatsappUrl = `https://wa.me/${CLINIC_INFO.whatsappNumber}?text=${encodeURIComponent(
      messageLines.join('\n')
    )}`

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    setSubmitted(false)
    setStatus('success')
  }

  const close = () => {
    setForm(emptyForm)
    setErrors({})
    setSubmitted(false)
    setStatus('idle')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && status === 'success') close()
  }

  const fieldError = (field) =>
    errors[field] ? (
      <span className='booking-error' id={`booking-${field}-error`}>{errors[field]}</span>
    ) : null

  const invalidProps = (field) =>
    errors[field]
      ? { 'aria-invalid': 'true', 'aria-describedby': `booking-${field}-error` }
      : {}

  return (
    <>
      <div className='booking-panel'>
        <div className='booking-head'>
          <div className='form-tag-wrap'>
            <span className='form-tag-dot' aria-hidden='true'></span>
            <span className='form-tag-text'>{'General & Patient Inquiry Desk'}</span>
          </div>
          <div className='sub-title-wrap left'>
            <h3 className='h3 form-title'>{'Send us a message'}</h3>
          </div>
          <p className='body-text gray form-description'>
            {'Have a question about recovery care, reports review, second opinions, or clinic timings? Fill in the details below and our administrative desk will respond to you promptly.'}
          </p>
        </div>

        <form className='booking-form' onSubmit={submit} onKeyDown={handleKeyDown} noValidate>
          <label className='booking-field booking-field-half' htmlFor='booking-name'>
            <span className='booking-label'>
              {'Full Name'} <span className='field-required'>*</span>
            </span>
            <input
              id='booking-name'
              type='text'
              autoComplete='name'
              className='booking-input'
              placeholder='Your name'
              value={form.name}
              onChange={update('name')}
              required
              {...invalidProps('name')}
            />
            {fieldError('name')}
          </label>

          <label className='booking-field booking-field-half' htmlFor='booking-phone'>
            <span className='booking-label'>{'Phone Number (Optional)'}</span>
            <input
              id='booking-phone'
              type='tel'
              autoComplete='tel'
              className='booking-input'
              placeholder='+91 .........'
              value={form.phone}
              onChange={update('phone')}
              {...invalidProps('phone')}
            />
            {fieldError('phone')}
          </label>

          <label className='booking-field booking-field-full' htmlFor='booking-email'>
            <span className='booking-label'>
              {'Email Address'} <span className='field-required'>*</span>
            </span>
            <input
              id='booking-email'
              type='email'
              autoComplete='email'
              className='booking-input'
              placeholder='you@example.com'
              value={form.email}
              onChange={update('email')}
              required
              {...invalidProps('email')}
            />
            {fieldError('email')}
          </label>

          <label className='booking-field booking-field-full' htmlFor='booking-message'>
            <span className='booking-label'>
              {'Your Message or Question'} <span className='field-required'>*</span>
            </span>
            <textarea
              id='booking-message'
              className='booking-input booking-textarea'
              rows='4'
              placeholder='Please describe your question, diagnosis inquiry, or how we may assist you...'
              value={form.message}
              onChange={update('message')}
              required
              {...invalidProps('message')}
            ></textarea>
            {fieldError('message')}
          </label>

          {submitted && errorList.length > 0 && (
            <p className='booking-summary booking-field-full' role='alert'>
              {`Please fix ${errorList.length} highlighted field${errorList.length === 1 ? '' : 's'} above.`}
            </p>
          )}

          <div className='booking-actions'>
            <button type='submit' className='primary-button form-submit-btn'>
              <div className='primary-button-inner'>
                <div className='button-text-wrap'>
                  <div className='button-text'>{'Send Message'}</div>
                  <div className='button-text'>{'Send Message'}</div>
                </div>
                <div className='button-arrow-wrap'>
                  <img
                    loading='lazy'
                    src='/assets/img/c2cdac-6a8b5001496ed67dd32f5996_Vector.svg'
                    alt=''
                    className='arrow-icon'
                  />
                </div>
              </div>
            </button>

            <p className='form-urgent-note'>
              {'For urgent emergencies or same-day clinical visits, please contact our direct telephone helpline at '}<a href='tel:+916395716031'>{'+91 63957 16031'}</a>.
            </p>
          </div>
        </form>
      </div>

      {status === 'success' && (
        <div className='booking-overlay' onClick={(event) => { if (event.target === event.currentTarget) close() }} onKeyDown={handleKeyDown}>
          <div className='booking-modal' role='dialog' aria-modal='true' aria-labelledby='booking-modal-title'>
            <div className='booking-modal-icon' aria-hidden='true'>✓</div>
            <h3 className='h3' id='booking-modal-title'>{'Inquiry Prepared'}</h3>
            <p className='body-text gray'>
              {'Thank you for reaching out. Your inquiry has been forwarded to our WhatsApp desk (+91 63957 16031) so our clinical team in Noida can assist you immediately.'}
            </p>
            <button
              type='button'
              className='primary-button'
              onClick={close}
              autoFocus
            >
              <div className='primary-button-inner'>
                <div className='button-text-wrap'>
                  <div className='button-text'>{'Done'}</div>
                  <div className='button-text'>{'Done'}</div>
                </div>
                <div className='button-arrow-wrap'>
                  <img
                    loading='lazy'
                    src='/assets/img/c2cdac-6a8b5001496ed67dd32f5996_Vector.svg'
                    alt=''
                    className='arrow-icon'
                  />
                </div>
              </div>
            </button>
          </div>
        </div>
      )}
    </>
  )
}
