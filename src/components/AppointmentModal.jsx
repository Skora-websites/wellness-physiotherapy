import { useState, useEffect, useRef } from 'react'
import { CLINIC_INFO } from '../data/clinic'

const CONCERN_OPTIONS = [
  'Select a concern',
  'Back Pain & Spine',
  'Neck & Shoulder Pain',
  'Knee & Joint Pain',
  'Sports Injury Rehabilitation',
  'Post-Surgery Recovery',
  'Sciatica & Nerve Compression',
  'Paralysis & Neurological Rehab',
  'Elderly Mobility & Balance',
  'General Physiotherapy Assessment',
  'Other Concern'
]

const CLINIC_WHATSAPP_NUMBER = CLINIC_INFO.whatsappNumber

export function openAppointmentModal(concern = '') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('open-appointment-modal', {
        detail: { concern }
      })
    )
  }
}

export default function AppointmentModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [concern, setConcern] = useState('Select a concern')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [isSuccess, setIsSuccess] = useState(false)

  const triggerElementRef = useRef(null)
  const modalCardRef = useRef(null)
  const firstInputRef = useRef(null)

  // Listen for global open triggers and manage keyboard trap
  useEffect(() => {
    const handleOpen = (e) => {
      triggerElementRef.current = document.activeElement
      setIsOpen(true)
      setIsSuccess(false)
      setErrors({})
      if (e.detail?.concern && CONCERN_OPTIONS.includes(e.detail.concern)) {
        setConcern(e.detail.concern)
      }
    }

    const handleKeyDown = (e) => {
      if (!isOpen) return

      if (e.key === 'Escape') {
        handleClose()
        return
      }

      if (e.key === 'Tab') {
        const card = modalCardRef.current
        if (!card) return
        const focusable = card.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    window.addEventListener('open-appointment-modal', handleOpen)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('open-appointment-modal', handleOpen)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Move focus to first input when modal opens
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        firstInputRef.current?.focus()
      }, 60)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Lock body scroll when modal is active
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = originalOverflow
      }
    }
  }, [isOpen])

  const handleClose = () => {
    setIsOpen(false)
    setIsSuccess(false)
    setErrors({})
    setTimeout(() => {
      if (triggerElementRef.current && typeof triggerElementRef.current.focus === 'function') {
        triggerElementRef.current.focus()
      }
    }, 50)
  }

  const validate = () => {
    const errs = {}
    if (!fullName.trim()) {
      errs.fullName = 'Please enter your full name.'
    }
    const cleanPhone = phone.replace(/\D/g, '')
    if (!cleanPhone) {
      errs.phone = 'Please enter your phone number.'
    } else if (cleanPhone.length < 10) {
      errs.phone = 'Phone number should be at least 10 digits.'
    }
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    // Build plain-text WhatsApp message without emojis or breakable symbols
    const selectedConcern =
      concern && concern !== 'Select a concern' ? concern : 'General Physiotherapy'

    const messageLines = [
      'Hello Wellness Physiotherapy,',
      '',
      'I would like to request an appointment/consultation.',
      '',
      `Full Name: ${fullName.trim()}`,
      `Phone: ${phone.trim()}`,
      email.trim() ? `Email: ${email.trim()}` : null,
      `Concern: ${selectedConcern}`,
      message.trim() ? `Message: ${message.trim()}` : null,
      '',
      'Please let me know the available time slots. Thank you.'
    ].filter(Boolean)

    const fullText = messageLines.join('\n')
    const whatsappUrl = `https://wa.me/${CLINIC_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      fullText
    )}`

    // Redirect to WhatsApp
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')

    setIsSuccess(true)
  }

  if (!isOpen) return null

  return (
    <div
      className='appointment-modal-overlay'
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose()
      }}
      role='dialog'
      aria-modal='true'
      aria-labelledby='appointment-modal-title'
    >
      <div className='appointment-modal-card' ref={modalCardRef}>
        {/* Close Button */}
        <button
          type='button'
          className='appointment-modal-close'
          onClick={handleClose}
          aria-label='Close consultation form'
        >
          <svg
            width='14'
            height='14'
            viewBox='0 0 14 14'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            aria-hidden='true'
          >
            <line x1='1' y1='1' x2='13' y2='13'></line>
            <line x1='13' y1='1' x2='1' y2='13'></line>
          </svg>
        </button>

        {isSuccess ? (
          <div className='appointment-modal-success' role='status' aria-live='polite'>
            <div className='appointment-modal-success-badge'>REQUEST SENT</div>
            <h3 className='appointment-modal-title'>Opening WhatsApp...</h3>
            <p className='appointment-modal-desc'>
              Your appointment details have been prepared and WhatsApp is opening.
              Our clinical coordinator in Noida will review your concern and
              confirm your consultation time slot.
            </p>
            <div className='appointment-modal-actions'>
              <button
                type='button'
                className='appointment-modal-submit-btn'
                onClick={handleClose}
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className='appointment-modal-header'>
              <div className='appointment-modal-tag'>REQUEST A CONSULTATION</div>
              <h2 id='appointment-modal-title' className='appointment-modal-title'>
                Tell us about your concern
              </h2>
              <p className='appointment-modal-desc'>
                Share a few details and our team will call you back to arrange a
                suitable time.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className='appointment-modal-form' noValidate>
              <div className='appointment-form-grid'>
                {/* Full Name */}
                <div className='appointment-form-field'>
                  <label htmlFor='modal-fullname' className='appointment-form-label'>
                    FULL NAME <span className='required-star' aria-hidden='true'>*</span>
                  </label>
                  <input
                    ref={firstInputRef}
                    id='modal-fullname'
                    type='text'
                    autoComplete='name'
                    className={`appointment-form-input ${
                      errors.fullName ? 'has-error' : ''
                    }`}
                    placeholder='Your name'
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      if (errors.fullName) setErrors({ ...errors, fullName: null })
                    }}
                    required
                    aria-required='true'
                    aria-invalid={errors.fullName ? 'true' : 'false'}
                    aria-describedby={errors.fullName ? 'modal-fullname-error' : undefined}
                  />
                  {errors.fullName && (
                    <span id='modal-fullname-error' className='appointment-field-error' role='alert'>
                      {errors.fullName}
                    </span>
                  )}
                </div>

                {/* Phone */}
                <div className='appointment-form-field'>
                  <label htmlFor='modal-phone' className='appointment-form-label'>
                    PHONE <span className='required-star' aria-hidden='true'>*</span>
                  </label>
                  <input
                    id='modal-phone'
                    type='tel'
                    autoComplete='tel'
                    className={`appointment-form-input ${
                      errors.phone ? 'has-error' : ''
                    }`}
                    placeholder='+91 .....'
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value)
                      if (errors.phone) setErrors({ ...errors, phone: null })
                    }}
                    required
                    aria-required='true'
                    aria-invalid={errors.phone ? 'true' : 'false'}
                    aria-describedby={errors.phone ? 'modal-phone-error' : undefined}
                  />
                  {errors.phone && (
                    <span id='modal-phone-error' className='appointment-field-error' role='alert'>
                      {errors.phone}
                    </span>
                  )}
                </div>

                {/* Email */}
                <div className='appointment-form-field'>
                  <label htmlFor='modal-email' className='appointment-form-label'>
                    EMAIL
                  </label>
                  <input
                    id='modal-email'
                    type='email'
                    autoComplete='email'
                    className='appointment-form-input'
                    placeholder='you@example.com'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Concern */}
                <div className='appointment-form-field'>
                  <label htmlFor='modal-concern' className='appointment-form-label'>
                    CONCERN
                  </label>
                  <div className='appointment-select-wrap'>
                    <select
                      id='modal-concern'
                      className='appointment-form-select'
                      value={concern}
                      onChange={(e) => setConcern(e.target.value)}
                    >
                      {CONCERN_OPTIONS.map((opt) => (
                        <option
                          key={opt}
                          value={opt}
                          disabled={opt === 'Select a concern'}
                        >
                          {opt}
                        </option>
                      ))}
                    </select>
                    <span className='appointment-select-arrow' aria-hidden='true'>
                      <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                        <polyline points='6 9 12 15 18 9'></polyline>
                      </svg>
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div className='appointment-form-field appointment-form-field-full'>
                  <label htmlFor='modal-message' className='appointment-form-label'>
                    MESSAGE
                  </label>
                  <textarea
                    id='modal-message'
                    rows='3'
                    className='appointment-form-textarea'
                    placeholder='Briefly describe your concern, diagnosis or reports (optional)'
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>
              </div>

              {/* Submit CTA */}
              <div className='appointment-modal-actions'>
                <button
                  type='submit'
                  className='appointment-modal-submit-btn'
                >
                  <span>REQUEST A CALL BACK</span>
                  <span className='appointment-submit-arrow' aria-hidden='true'>&rarr;</span>
                </button>
              </div>

              {/* Disclaimer */}
              <p className='appointment-modal-disclaimer'>
                Please do not share sensitive medical details until a consultation is confirmed.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
