import { useState } from 'react'

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

const SEND_ERROR = 'We couldn’t send your message. Check your connection and try again, or call us on +91 63957 16031.'

// Marks failures reported by our own API so their wording is safe to show;
// raw browser/network errors stay hidden behind SEND_ERROR.
class ApiError extends Error {}

export default function BookingForm() {
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [status, setStatus] = useState('idle')
  const [submitError, setSubmitError] = useState('')

  const errorList = Object.values(errors).filter(Boolean)
  const sending = status === 'sending'

  const update = (field) => (event) => {
    const next = { ...form, [field]: event.target.value }
    setForm(next)
    if (submitError) setSubmitError('')
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

  const submit = async (event) => {
    event.preventDefault()
    if (sending) return

    const found = validate(form)
    setErrors(found)
    setSubmitted(true)
    setSubmitError('')

    if (Object.keys(found).length) {
      setStatus('idle')
      focusFirstInvalid(found)
      return
    }

    // Contact messages land in Admin → Contact Messages. No WhatsApp handoff
    // here; only the appointment form continues to WhatsApp.
    setStatus('sending')
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          subject: 'Website inquiry',
          message: form.message.trim()
        }),
        signal: controller.signal
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new ApiError(typeof data.error === 'string' ? data.error : '')
      // Keep the entered text on failure; only clear it once the clinic has it.
      setForm(emptyForm)
      setErrors({})
      setSubmitted(false)
      setStatus('sent')
    } catch (error) {
      setStatus('error')
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        setSubmitError('You appear to be offline. Reconnect and try again, or call us on +91 63957 16031.')
      } else if (error?.name === 'AbortError') {
        setSubmitError('The message took too long to send. Please try again, or call us on +91 63957 16031.')
      } else if (error instanceof ApiError && error.message) {
        setSubmitError(error.message)
      } else {
        setSubmitError(SEND_ERROR)
      }
    } finally {
      clearTimeout(timer)
    }
  }

  const close = () => {
    setForm(emptyForm)
    setErrors({})
    setSubmitted(false)
    setSubmitError('')
    setStatus('idle')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Escape' && status === 'sent') close()
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

          {submitError && (
            <p className='booking-summary booking-field-full is-error' role='alert'>
              {submitError}
            </p>
          )}

          <div className='booking-actions'>
            <button type='submit' className='primary-button form-submit-btn' disabled={sending} aria-busy={sending}>
              <div className='primary-button-inner'>
                <div className='button-text-wrap'>
                  <div className='button-text'>{sending ? 'Sending…' : 'Send Message'}</div>
                  <div className='button-text'>{sending ? 'Sending…' : 'Send Message'}</div>
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

      {status === 'sent' && (
        <div className='booking-overlay' onClick={(event) => { if (event.target === event.currentTarget) close() }} onKeyDown={handleKeyDown}>
          <div className='booking-modal' role='dialog' aria-modal='true' aria-labelledby='booking-modal-title'>
            <div className='booking-modal-icon' aria-hidden='true'>✓</div>
            <h3 className='h3' id='booking-modal-title'>{'Message Sent'}</h3>
            <p className='body-text gray'>
              {'Thank you for reaching out. Your message has reached our clinic desk and our team in Noida will get back to you shortly.'}
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
