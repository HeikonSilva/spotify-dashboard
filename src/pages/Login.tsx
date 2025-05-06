import { redirectToSpotifyAuth } from '../utils/spotifyAuth'

export default function Login() {
  return (
    <button
      className="bg-green-500 text-white px-4 py-2 rounded"
      onClick={redirectToSpotifyAuth}
    >
      Login com Spotify
    </button>
  )
}
