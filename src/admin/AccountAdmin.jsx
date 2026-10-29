import { useContext, useRef, useState } from 'react'
import { api } from './client'
import { Field, ImageField, ToastCtx } from './parts'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AccountAdmin({ user, onUser, onSessionEnded }) {
  const notify = useContext(ToastCtx)
  const [profile, setProfile] = useState({ ...user })
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [profileErrors, setProfileErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [busy, setBusy] = useState('')

  const nameRef = useRef(null)
  const usernameRef = useRef(null)
  const emailRef = useRef(null)
  const currentRef = useRef(null)
  const newRef = useRef(null)
  const confirmRef = useRef(null)

  const set = (key) => (event) => {
    setProfile((current) => ({ ...current, [key]: event.target.value }))
    if (profileErrors[key]) setProfileErrors((current) => ({ ...current, [key]: '' }))
    if (profileError) setProfileError('')
  }

  const setPass = (key) => (event) => {
    setPasswords((current) => ({ ...current, [key]: event.target.value }))
    if (passwordErrors[key]) setPasswordErrors((current) => ({ ...current, [key]: '' }))
    if (passwordError) setPasswordError('')
  }

  const saveProfile = async () => {
    const found = {}
    if (!String(profile.name || '').trim()) found.name = 'Enter the administrator’s full name.'
    if (!String(profile.username || '').trim()) found.username = 'Enter a username used for signing in.'
    const email = String(profile.email || '').trim()
    if (!email) found.email = 'Enter an email address for account notices.'
    else if (!EMAIL_RE.test(email)) found.email = 'Enter a valid email address, such as name@example.com.'

    setProfileErrors(found)
    if (Object.keys(found).length) {
      setProfileError('Please correct the highlighted fields before saving.')
      const refs = { name: nameRef, username: usernameRef, email: emailRef }
      refs[Object.keys(found)[0]]?.current?.focus()
      return
    }

    setBusy('profile')
    setProfileError('')
    try {
      const result = await api('/api/admin/profile', { method: 'PUT', body: profile })
      onUser(result.user)
      setProfile(result.user)
      notify('Profile updated')
    } catch (err) {
      setProfileError(err.message)
    } finally {
      setBusy('')
    }
  }

  const savePassword = async () => {
    const found = {}
    if (!passwords.currentPassword) found.currentPassword = 'Enter your current password.'
    if (!passwords.newPassword) found.newPassword = 'Enter a new password.'
    else if (passwords.newPassword.length < 8) found.newPassword = 'Use at least 8 characters.'
    if (!passwords.confirmPassword) found.confirmPassword = 'Re-enter the new password.'
    else if (passwords.confirmPassword !== passwords.newPassword) found.confirmPassword = 'Passwords do not match.'

    setPasswordErrors(found)
    if (Object.keys(found).length) {
      setPasswordError('Please correct the highlighted fields before continuing.')
      const refs = { currentPassword: currentRef, newPassword: newRef, confirmPassword: confirmRef }
      refs[Object.keys(found)[0]]?.current?.focus()
      return
    }

    setBusy('password')
    setPasswordError('')
    try {
      await api('/api/admin/password', { method: 'PUT', body: passwords })
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      // The API revokes every session on a password change, this one included.
      notify('Password changed. Please sign in again.')
      onSessionEnded?.()
    } catch (err) {
      setPasswordError(err.message)
    } finally {
      setBusy('')
    }
  }

  return (
    <div className='adm-stack'>
      <section className='adm-card'>
        <header className='adm-card-head'><div><h2>Admin profile</h2><p>Shown in the sidebar and on articles you author.</p></div></header>
        <div className='adm-grid-2'>
          <Field label='Full name' required error={profileErrors.name}>
            <input ref={nameRef} className='adm-input' value={profile.name || ''} onChange={set('name')} autoComplete='name' />
          </Field>
          <Field label='Username' required error={profileErrors.username}>
            <input ref={usernameRef} className='adm-input' value={profile.username || ''} onChange={set('username')} autoComplete='username' />
          </Field>
          <Field label='Email' required error={profileErrors.email}>
            <input ref={emailRef} className='adm-input' type='email' value={profile.email || ''} onChange={set('email')} autoComplete='email' />
          </Field>
          <Field label='Display role'>
            <input className='adm-input' value={profile.role || ''} onChange={set('role')} placeholder='Clinic Administrator' />
          </Field>
        </div>
        <ImageField
          label='Avatar photo'
          value={profile.avatar}
          onChange={(avatar) => setProfile((current) => ({ ...current, avatar }))}
        />
        {profileError && <div className='adm-alert' role='alert'>{profileError}</div>}
        <div className='adm-sticky-actions'>
          <button type='button' className='adm-btn is-primary' onClick={saveProfile} disabled={busy === 'profile'} aria-busy={busy === 'profile'}>
            {busy === 'profile' ? <><span className='adm-spinner is-sm' aria-hidden='true' /> Saving…</> : 'Save profile'}
          </button>
        </div>
      </section>

      <section className='adm-card'>
        <header className='adm-card-head'><div><h2>Password security</h2><p>Changing the password signs out every session, including this one.</p></div></header>
        <div className='adm-grid-2'>
          <Field label='Current password' required error={passwordErrors.currentPassword}>
            <input ref={currentRef} className='adm-input' type='password' autoComplete='current-password' value={passwords.currentPassword} onChange={setPass('currentPassword')} />
          </Field>
          <Field label='New password' required hint='At least 8 characters.' error={passwordErrors.newPassword}>
            <input ref={newRef} className='adm-input' type='password' autoComplete='new-password' minLength={8} value={passwords.newPassword} onChange={setPass('newPassword')} />
          </Field>
          <Field label='Confirm new password' required error={passwordErrors.confirmPassword}>
            <input ref={confirmRef} className='adm-input' type='password' autoComplete='new-password' minLength={8} value={passwords.confirmPassword} onChange={setPass('confirmPassword')} />
          </Field>
        </div>
        {passwordError && <div className='adm-alert' role='alert'>{passwordError}</div>}
        <div className='adm-sticky-actions'>
          <button type='button' className='adm-btn is-primary' onClick={savePassword} disabled={busy === 'password'} aria-busy={busy === 'password'}>
            {busy === 'password' ? <><span className='adm-spinner is-sm' aria-hidden='true' /> Updating…</> : 'Update password'}
          </button>
        </div>
      </section>
    </div>
  )
}
