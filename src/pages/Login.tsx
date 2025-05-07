import { redirectToSpotifyAuthorize } from '@/utils/spotifyAuth.js'

export default function Login() {
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
