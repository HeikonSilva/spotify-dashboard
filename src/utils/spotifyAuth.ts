const clientId = 'fc709806d94d4dbd95542687040c6987'
const redirectUri = 'https://192.168.0.13:5173/callback'

const authorizationEndpoint = 'https://accounts.spotify.com/authorize'
const tokenEndpoint = 'https://accounts.spotify.com/api/token'
const scope =
  'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-modify-playback-state user-top-read user-read-recently-played'

// Cache para o status de autenticação
let _isAuthenticated: boolean | null = null
let _lastAuthCheck: number = 0
const AUTH_CACHE_DURATION = 5000 // 5 segundos de cache para o status de auth

export function generateRandomString(length: number) {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = window.crypto.getRandomValues(new Uint8Array(length))
  return Array.from(values)
    .map((x) => possible[x % possible.length])
    .join('')
}

export async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier)
  const digest = await window.crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

export async function redirectToSpotifyAuthorize() {
  const codeVerifier = generateRandomString(64)
  const codeChallenge = await generateCodeChallenge(codeVerifier)

  localStorage.setItem('code_verifier', codeVerifier)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    redirect_uri: redirectUri,
  })

  window.location.href = `${authorizationEndpoint}?${params.toString()}`
}

export async function exchangeToken(code: string) {
  const codeVerifier = localStorage.getItem('code_verifier')
  if (!codeVerifier) throw new Error('No code_verifier found in localStorage')

  const params = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
    code_verifier: codeVerifier,
  })

  // Use Axios for the request
  const axios = (await import('axios')).default
  const response = await axios.post(tokenEndpoint, params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  })

  // Reset authentication status cache when getting a new token
  _isAuthenticated = null

  return response.data
}

interface SpotifyToken {
  access_token: string
  refresh_token?: string
  expires_in: string
}

export function saveToken(token: SpotifyToken) {
  localStorage.setItem('access_token', token.access_token)
  localStorage.setItem('refresh_token', token.refresh_token || '')
  localStorage.setItem('expires_in', token.expires_in)
  const expiry = Date.now() + parseInt(token.expires_in) * 1000
  localStorage.setItem('expires', expiry.toString())

  // Update authentication status cache
  _isAuthenticated = true
  _lastAuthCheck = Date.now()
}

// Add this function to refresh an expired token
export async function refreshAuthToken(): Promise<boolean> {
  try {
    const refreshToken = localStorage.getItem('refresh_token')
    if (!refreshToken) {
      console.error('No refresh token available')
      return false
    }

    const params = new URLSearchParams({
      client_id: clientId,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })

    const axios = (await import('axios')).default
    const response = await axios.post(tokenEndpoint, params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })

    // Save the new token data
    saveToken(response.data)
    return true
  } catch (error) {
    console.error('Error refreshing token:', error)
    // If refresh fails, clear auth state
    clearAuth()
    return false
  }
}

/**
 * Gets an active access token, refreshing if necessary
 * @returns Promise with the access token or null if unavailable
 */
export async function getActiveAccessToken(): Promise<string | null> {
  // Check if token exists and is valid
  const token = localStorage.getItem('access_token')
  const expires = localStorage.getItem('expires')
  const now = Date.now()

  if (token && expires) {
    // If token exists but is expired, try to refresh
    if (now >= parseInt(expires)) {
      console.log('Token expired, attempting to refresh...')
      const refreshed = await refreshAuthToken()
      if (refreshed) {
        return localStorage.getItem('access_token')
      }
      return null
    }
    // If token is valid, return it
    return token
  }

  return null
}

// Modify the existing getAccessToken to be synchronous (for backward compatibility)
export function getAccessToken(): string | null {
  const token = localStorage.getItem('access_token')
  const expires = localStorage.getItem('expires')
  const now = Date.now()

  if (token && expires) {
    // If token is expired, return null
    // This maintains backward compatibility but doesn't try to refresh
    if (now >= parseInt(expires)) {
      console.warn('Token expired. Use getActiveAccessToken() for auto-refresh')
      return null
    }
    return token
  }

  return null
}

export function clearAuth() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('expires_in')
  localStorage.removeItem('expires')
  localStorage.removeItem('code_verifier')

  // Update authentication status cache
  _isAuthenticated = false
  _lastAuthCheck = Date.now()
}

/**
 * Improved isAuthenticated that checks token expiration
 */
export function isAuthenticated(): boolean {
  // Use cache if recent
  const now = Date.now()
  if (_isAuthenticated !== null && now - _lastAuthCheck < AUTH_CACHE_DURATION) {
    return _isAuthenticated
  }

  // Check if there's a token and if it's not expired
  const token = localStorage.getItem('access_token')
  const expires = localStorage.getItem('expires')

  if (!token || !expires) {
    _isAuthenticated = false
    _lastAuthCheck = now
    return false
  }

  const isValid = now < parseInt(expires)

  // Update cache
  _isAuthenticated = isValid
  _lastAuthCheck = now

  return isValid
}

/**
 * Atualiza o logout com o novo mecanismo de cache e usa a função clearAuth
 */
export const logout = () => {
  clearAuth()
  window.location.href = '/'
}
