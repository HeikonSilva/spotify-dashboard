import {
  redirectToSpotifyAuth,
  isAccessTokenExpired,
  refreshAccessToken,
} from '../utils/spotifyAuth'

export default function Login() {
  const handleCheckAndRefreshToken = async () => {
    if (isAccessTokenExpired()) {
      try {
        // Aqui você pode chamar a função de refresh do token
        const refreshedToken = await refreshAccessToken() // Certifique-se de implementar essa função no spotifyAuth.ts
        console.log('Token atualizado:', refreshedToken)
      } catch (error) {
        console.error('Erro ao atualizar o token:', error)
      }
    } else {
      console.log('O token ainda é válido.')
    }
  }

  return (
    <div>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={redirectToSpotifyAuth}
      >
        Login com Spotify
      </button>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded ml-2"
        onClick={handleCheckAndRefreshToken}
      >
        Checar e Atualizar Token
      </button>
    </div>
  )
}
