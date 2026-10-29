import { useEffect, useRef, useState } from 'react'
import logoMark from '/assets/img/brand/logo-mark.png'

// A goniometer arc — the instrument physiotherapists use to measure how far a
// joint moves. It is the page's one visual idea; everything else stays quiet.
function RangeOfMotion() {
  return (
    <svg className='adm-login-figure' viewBox='0 0 580 380' aria-hidden='true' focusable='false'>
      <defs>
        <linearGradient id='adm-login-sweep' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stopColor='#8ad9ae' stopOpacity='0.26' />
          <stop offset='62%' stopColor='#8ccfe0' stopOpacity='0.07' />
          <stop offset='100%' stopColor='#8ccfe0' stopOpacity='0.02' />
        </linearGradient>
      </defs>
      <g transform='translate(-40 -20)'>
        <line x1='40' y1='330' x2='560' y2='330' stroke='rgba(234,244,251,0.14)' strokeDasharray='2 8' />
        <path d='M 510 330 A 210 210 0 0 0 151.5 181.5 L 300 330 Z' fill='url(#adm-login-sweep)' />
        <path d='M 510 330 A 210 210 0 0 0 90 330' fill='none' stroke='rgba(234,244,251,0.38)' strokeWidth='1.25' />

        <g strokeLinecap='round'>
          <line x1='484.0' y1='330.0' x2='510.0' y2='330.0' stroke='rgba(234,244,251,0.4)' />
          <line x1='487.4' y1='279.8' x2='502.8' y2='275.6' stroke='rgba(234,244,251,0.18)' />
          <line x1='468.0' y1='233.0' x2='481.9' y2='225.0' stroke='rgba(234,244,251,0.18)' />
          <line x1='430.1' y1='199.9' x2='448.5' y2='181.5' stroke='rgba(234,244,251,0.4)' />
          <line x1='397.0' y1='162.0' x2='405.0' y2='148.1' stroke='rgba(234,244,251,0.18)' />
          <line x1='350.2' y1='142.6' x2='354.4' y2='127.2' stroke='rgba(234,244,251,0.18)' />
          <line x1='300.0' y1='146.0' x2='300.0' y2='120.0' stroke='rgba(234,244,251,0.4)' />
          <line x1='249.8' y1='142.6' x2='245.6' y2='127.2' stroke='rgba(234,244,251,0.18)' />
          <line x1='203.0' y1='162.0' x2='195.0' y2='148.1' stroke='rgba(234,244,251,0.18)' />
          <line x1='169.9' y1='199.9' x2='151.5' y2='181.5' stroke='rgba(234,244,251,0.4)' />
          <line x1='132.0' y1='233.0' x2='118.1' y2='225.0' stroke='rgba(234,244,251,0.18)' />
          <line x1='112.6' y1='279.8' x2='97.2' y2='275.6' stroke='rgba(234,244,251,0.18)' />
          <line x1='116.0' y1='330.0' x2='90.0' y2='330.0' stroke='rgba(234,244,251,0.4)' />
        </g>

        <line x1='300' y1='330' x2='510' y2='330' stroke='rgba(234,244,251,0.36)' />
        <line x1='300' y1='330' x2='151.5' y2='181.5' stroke='rgba(138,217,174,0.6)' />
        <circle cx='300' cy='330' r='3' fill='rgba(234,244,251,0.65)' />
        <circle cx='151.5' cy='181.5' r='4.5' fill='#8ad9ae' />
        <circle cx='151.5' cy='181.5' r='13' fill='none' stroke='rgba(138,217,174,0.32)' />

        <text x='524' y='334' fill='rgba(234,244,251,0.5)' fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontSize='11'>0°</text>
        <text x='140' y='176' textAnchor='end' fill='rgba(138,217,174,0.8)' fontFamily="ui-monospace, 'SF Mono', Menlo, monospace" fontSize='11'>135°</text>
      </g>
    </svg>
  )
}

export default function Login({ onSubmit, notice = '' }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const errorRef = useRef(null)

  useEffect(() => {
    document.title = 'Admin Sign In · Wellness Physiotherapy'
  }, [])

  // Move keyboard and screen-reader focus to the failure message so the reason
  // for the rejected sign-in is announced without hunting for it.
  useEffect(() => {
    if (error) errorRef.current?.focus()
  }, [error])

  const submit = async (event) => {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await onSubmit(email, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className='adm-login'>
      <section className='adm-login-field' aria-labelledby='adm-login-clinic'>
        <div className='adm-login-brandbar'>
          <img className='adm-login-mark' src={logoMark} alt='' />
          <h1 id='adm-login-clinic'>Wellness Physiotherapy</h1>
        </div>

        <div className='adm-login-figure-wrap'>
          <RangeOfMotion />
        </div>

        <div className='adm-login-statement'>
          <p className='adm-login-lede'>Keep the clinic running.</p>
          <p className='adm-login-sub'>Consultations, messages, services and pages in one place.</p>
          <p className='adm-login-foot'>Authorised clinic staff, Noida Sector 04</p>
        </div>
      </section>

      <main className='adm-login-panel'>
        <div className='adm-login-inner'>
          <header className='adm-login-head'>
            <h2>Welcome back</h2>
            <p>Sign in to continue to the admin panel.</p>
          </header>

          {notice && !error && <div className='adm-alert is-info' role='status'>{notice}</div>}
          {error && (
            <div className='adm-alert' id='adm-login-error' role='alert' ref={errorRef} tabIndex={-1}>
              {error}
            </div>
          )}

          <form className='adm-login-form' onSubmit={submit}>
            <div className='adm-field'>
              <label className='adm-label' htmlFor='adm-login-email'>
                Email or username <span className='adm-required' aria-hidden='true'>*</span>
              </label>
              <input
                className='adm-input'
                id='adm-login-email'
                name='username'
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (error) setError('')
                }}
                autoComplete='username'
                autoFocus
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'adm-login-error' : undefined}
                required
              />
            </div>

            <div className='adm-field'>
              <label className='adm-label' htmlFor='adm-login-password'>
                Password <span className='adm-required' aria-hidden='true'>*</span>
              </label>
              <span className='adm-pass-wrap'>
                <input
                  className='adm-input'
                  id='adm-login-password'
                  name='password'
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    if (error) setError('')
                  }}
                  autoComplete='current-password'
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'adm-login-error' : undefined}
                  required
                />
                <button
                  type='button'
                  className='adm-pass-toggle'
                  onClick={() => setShow((visible) => !visible)}
                  aria-controls='adm-login-password'
                  aria-pressed={show}
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  {show ? 'Hide' : 'Show'}
                </button>
              </span>
            </div>

            <button type='submit' className='adm-btn is-primary is-block adm-login-submit' disabled={busy} aria-busy={busy}>
              {busy ? <><span className='adm-spinner is-sm' aria-hidden='true' /> Signing in…</> : 'Sign in'}
            </button>
          </form>

          <a href='/' className='adm-login-back'>← Back to website</a>
        </div>
      </main>
    </div>
  )
}
