const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string
const REDIRECT_URI = 'https://192.168.23.157:5173/callback'

const SPOTIFY_AUTHORIZE_URL = new URL('https://accounts.spotify.com/authorize')
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token'
const SCOPES = 'user-read-private user-read-email'

async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const data = new TextEncoder().encode(codeVerifier)
  const hashed = await crypto.subtle.digest('SHA-256', data)
  return btoa(String.fromCharCode(...new Uint8Array(hashed)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function generateCodeVerifier(): string {
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const randomValues = crypto.getRandomValues(new Uint8Array(128))
  return Array.from(randomValues)
    .map((x) => possible[x % possible.length])
    .join('')
}

export async function redirectToSpotifyAuth() {
  const codeVerifier = generateCodeVerifier()
  const codeChallenge = await generateCodeChallenge(codeVerifier)

  // Salvar o code_verifier no localStorage para uso posterior
  localStorage.setItem('spotify_code_verifier', codeVerifier)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES, // Exemplo: 'user-read-private user-read-email'
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  })

  // Redirecionar o usuário para a URL de autorização
  window.location.href = `${SPOTIFY_AUTHORIZE_URL}?${params.toString()}`
}

export async function fetchAccessToken(code: string) {
  const codeVerifier = localStorage.getItem('spotify_code_verifier')

  if (!codeVerifier) {
    throw new Error('Code verifier not found in localStorage')
  }

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, payload)
  const data = await response.json()

  if (response.ok) {
    // Armazenar tokens no localStorage
    localStorage.setItem('spotify_access_token', data.access_token) // Padronizado
    localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('expires_in', data.expires_in.toString())

    const now = new Date()
    const expiry = new Date(now.getTime() + data.expires_in * 1000)
    localStorage.setItem('expires', expiry.toISOString())

    return data
  } else {
    throw new Error(`Failed to fetch access token: ${data.error}`)
  }
}

/*  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    code_verifier: codeVerifier || '',
  })

  const response = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  return response.json()*/

export async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refresh_token')

  if (!refreshToken) {
    throw new Error('Refresh token not found in localStorage')
  }

  const payload = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  }

  const response = await fetch(SPOTIFY_TOKEN_URL, payload)
  const data = await response.json()

  if (response.ok) {
    // Atualizar tokens no localStorage
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('expires_in', data.expires_in.toString())

    const now = new Date()
    const expiry = new Date(now.getTime() + data.expires_in * 1000)
    localStorage.setItem('expires', expiry.toISOString())

    return data
  } else {
    throw new Error(`Failed to refresh access token: ${data.error}`)
  }
}

export function isAccessTokenExpired(): boolean {
  const expiry = localStorage.getItem('expires')
  if (!expiry) return true

  const now = new Date()
  return now >= new Date(expiry)
}
