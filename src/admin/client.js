const TOKEN_KEY = 'admin_token'

export const getToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export const setToken = (token) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* private mode: session lives in memory for this tab only */
  }
}

const STATUS_MESSAGE = {
  400: 'Some details need attention. Review the highlighted fields and try again.',
  401: 'Your session has expired. Please sign in again.',
  403: 'You don’t have permission to do that.',
  404: 'That item no longer exists. Refresh the page and try again.',
  409: 'That change conflicts with data that already exists. Refresh and try again.',
  413: 'That upload is too large. Choose a smaller file.',
  429: 'Too many attempts. Please wait a moment and try again.',
  500: 'Something went wrong on our side. Please try again.',
  502: 'The server is temporarily unavailable. Please try again shortly.',
  503: 'The service is temporarily unavailable. Please try again shortly.',
  504: 'The server took too long to respond. Please try again.',
}

const isLoginRequest = (path) => /\/api\/admin\/login\/?$/.test(path)

export async function api(path, { method = 'GET', body } = {}) {
  const token = getToken()
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  let response
  try {
    response = await fetch(path, {
      method,
      headers,
      credentials: 'include',
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    throw new Error('Cannot reach the server. Check your connection and try again.')
  }

  const data = await response.json().catch(() => ({}))

  // A 401 on a signed-in request means the session is gone. A 401 from the
  // sign-in endpoint is simply wrong credentials, so keep the server's message.
  if (response.status === 401 && token && !isLoginRequest(path)) {
    setToken(null)
    window.dispatchEvent(new Event('admin-unauthorized'))
    throw new Error(data.error || STATUS_MESSAGE[401])
  }

  if (!response.ok) {
    const serverMessage = typeof data.error === 'string' ? data.error.trim() : ''
    throw new Error(serverMessage || STATUS_MESSAGE[response.status] || `Request failed (${response.status}).`)
  }

  return data
}

export const uploadImage = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('We couldn’t read that file. Try choosing it again.'))
    reader.onload = () =>
      api('/api/upload', { method: 'POST', body: { name: file.name, dataUrl: reader.result } })
        .then((result) => resolve(result.url))
        .catch(reject)
    reader.readAsDataURL(file)
  })
