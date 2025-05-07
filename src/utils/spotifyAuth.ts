const clientId = 'fc709806d94d4dbd95542687040c6987'
const redirectUri = 'https://heikonsilva.github.io/spotify-dashboard/#/callback'

const authorizationEndpoint = 'https://accounts.spotify.com/authorize'
const tokenEndpoint = 'https://accounts.spotify.com/api/token'
const scope = 'user-read-private user-read-email'

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
}

export function getAccessToken() {
  return localStorage.getItem('access_token')
}
