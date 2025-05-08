import { redirectToSpotifyAuthorize, getAccessToken } from '@/utils/spotifyAuth'

export default function Login() {
  const accessToken = getAccessToken()

  console.log('Access Token:', accessToken)
  return (
    <div>
      <button
        onClick={() => redirectToSpotifyAuthorize()}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Login com Spotify
      </button>
    </div>
  )
}
