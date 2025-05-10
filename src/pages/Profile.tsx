import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorDisplay } from '@/components/ui/ErrorDisplay'
import { Music, InfoIcon, User, Crown } from 'lucide-react'
import { motion } from 'motion/react'
import { Skeleton } from '@/components/ui/skeleton'

import { useSpotifyPlaylists } from '@/hooks/useSpotifyPlaylists'
import { useSpotifyMe } from '@/hooks/useSpotifyMe'
import { useSpotifyTopTracks } from '@/hooks/useSpotifyTopTracks'
import { useSpotifyTopArtists } from '@/hooks/useSpotifyTopArtists'
import { useListeningActivity } from '@/hooks/useListeningActivity'

const ProfileSkeleton = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="flex flex-col gap-6"
  >
    {/* Profile header skeleton */}
    <div className="bg-gradient-to-br from-b1 to-b2 border border-b3/30 rounded-xl p-6 mb-6 shadow-md">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <Skeleton className="w-28 h-28 rounded-full" />
        <div className="flex flex-col gap-2 w-full max-w-xs">
          <Skeleton className="h-8 w-3/4 rounded" />
          <Skeleton className="h-4 w-1/2 rounded" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
          <Skeleton className="h-4 w-32 mt-2 rounded" />
        </div>
      </div>
    </div>
    {/* Destaques skeleton */}
    <div>
      <Skeleton className="h-7 w-32 mb-4 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="min-h-[160px] bg-gradient-to-br from-b1 to-b2 border-b3/30 shadow-md">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-32 rounded" />
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded" />
            <div>
              <Skeleton className="h-5 w-24 mb-2 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          </CardContent>
        </Card>
        <Card className="min-h-[160px] bg-gradient-to-br from-b1 to-b2 border-b3/30 shadow-md">
          <CardHeader className="pb-2">
            <Skeleton className="h-6 w-32 rounded" />
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded" />
            <div>
              <Skeleton className="h-5 w-24 mb-2 rounded" />
              <Skeleton className="h-4 w-16 rounded" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    {/* Listas skeleton */}
    <Skeleton className="h-7 w-24 mb-4 rounded" />
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="bg-b1 border-b3/30">
          <CardHeader>
            <Skeleton className="h-6 w-32 rounded" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((j) => (
                <div key={j} className="flex items-center gap-4">
                  <Skeleton className="w-12 h-12 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2 rounded" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </motion.div>
)

const Profile = () => {
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useSpotifyMe()

  const { data: topTracks, loading: tracksLoading } = useSpotifyTopTracks({
    limit: 5,
    timeRange: 'long_term',
  })

  const { data: topArtists, loading: artistsLoading } = useSpotifyTopArtists({
    limit: 5,
    timeRange: 'long_term',
  })

  const { loading: activityLoading } = useListeningActivity()

  const {
    data: playlists,
    loading: playlistsLoading,
    error: playlistsError,
  } = useSpotifyPlaylists()

  if (profileLoading || tracksLoading || artistsLoading || activityLoading) {
    return <ProfileSkeleton />
  }

  if (profileError) {
    return (
      <ErrorDisplay
        message={`Não foi possível carregar o perfil: ${profileError}`}
      />
    )
  }

  return (
    <div>
      <div className="bg-gradient-to-br from-b1 to-b2 border border-b3/30 rounded-xl p-6 mb-6 shadow-md">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          {profile?.images && profile.images.length > 0 ? (
            <img
              src={profile.images[0].url}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-b3/50"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-b3/50 flex items-center justify-center">
              <User className="h-12 w-12 text-b4" />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-white">
              {profile?.display_name}
            </h1>
            <p className="text-b4 mb-3">{profile?.email}</p>
            <div className="flex flex-wrap gap-2">
              {profile?.product === 'premium' ? (
                <motion.span
                  initial={{ scale: 0.9, opacity: 0.7 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="inline-flex items-center gap-1 bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 text-xs font-semibold px-2.5 py-1 rounded-full border border-yellow-400 shadow"
                >
                  <Crown className="w-4 h-4 mr-1 text-yellow-700" />
                  Premium Plan
                </motion.span>
              ) : (
                <span className="bg-sprimary/20 text-sprimary text-xs font-medium px-2.5 py-1 rounded-full border border-sprimary/30">
                  Free Plan
                </span>
              )}
              <span className="bg-blue-900/20 text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full border border-blue-800/30">
                {profile?.followers?.total} followers
              </span>
              <span className="bg-purple-900/20 text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full border border-purple-800/30">
                {profile?.country}
              </span>
            </div>

            <a
              href={profile?.external_urls?.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-sm text-sprimary hover:underline"
            >
              Open profile in Spotify →
            </a>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-white">Destaques</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Artista mais ouvido */}
        {topArtists?.items?.[0] && (
          <Card className="relative overflow-hidden bg-gradient-to-br from-b1 to-b2 border-b3/30 shadow-md hover:shadow-lg transition-all min-h-[160px]">
            {/* Background image */}
            {topArtists.items[0].images?.[0]?.url && (
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url(${topArtists.items[0].images[0].url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(2px) brightness(0.7)',
                  opacity: 0.5,
                }}
              />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-b1/80 via-b1/40 to-transparent" />
            <CardHeader className="relative z-20 pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Artista mais ouvido
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-20 flex items-center gap-4">
              {topArtists.items[0].images?.[0]?.url ? (
                <img
                  src={topArtists.items[0].images[0].url}
                  alt={topArtists.items[0].name}
                  className="w-16 h-16 rounded object-cover border-2 border-white shadow"
                />
              ) : (
                <div className="w-16 h-16 rounded bg-b3/50 flex items-center justify-center">
                  <User className="h-8 w-8 text-b4" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-white">
                  {topArtists.items[0].name}
                </h3>
                <p className="text-sm text-b4">
                  {topArtists.items[0].genres?.slice(0, 2).join(', ') ||
                    'Sem gênero'}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Música mais ouvida */}
        {topTracks?.items?.[0] && (
          <Card className="relative overflow-hidden bg-gradient-to-br from-b1 to-b2 border-b3/30 shadow-md hover:shadow-lg transition-all min-h-[160px]">
            {/* Background image */}
            {topTracks.items[0].album.images?.[0]?.url && (
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: `url(${topTracks.items[0].album.images[0].url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'blur(2px) brightness(0.7)',
                  opacity: 0.5,
                }}
              />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-b1/80 via-b1/40 to-transparent" />
            <CardHeader className="relative z-20 pb-2">
              <CardTitle className="text-white flex items-center gap-2">
                <Music className="h-5 w-5" />
                Música mais ouvida
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-20 flex items-center gap-4">
              {topTracks.items[0].album.images?.[0]?.url ? (
                <img
                  src={topTracks.items[0].album.images[0].url}
                  alt={topTracks.items[0].name}
                  className="w-16 h-16 rounded object-cover border-2 border-white shadow"
                />
              ) : (
                <div className="w-16 h-16 rounded bg-b3/50 flex items-center justify-center">
                  <Music className="h-8 w-8 text-b4" />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-white">
                  {topTracks.items[0].name}
                </h3>
                <p className="text-sm text-b4">
                  {topTracks.items[0].artists.map((a) => a.name).join(', ')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-white">Listas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Top Artists */}
        <Card className="bg-b1 border-b3/30">
          <CardHeader>
            <CardTitle className="text-white">Top Artists</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!artistsLoading &&
            (!topArtists ||
              !topArtists.items ||
              topArtists.items.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <InfoIcon className="h-10 w-10 text-b4 mb-2" />
                <p className="text-b4">No artist data available.</p>
                <p className="text-sm text-b4/70 mt-1">
                  Listen to more music to see your top artists.
                </p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                <ul className="divide-y divide-b3/30">
                  {topArtists?.items?.map((artist, index) => (
                    <li
                      key={artist.id}
                      className="p-4 flex items-center gap-4 hover:bg-b3/20 transition-colors"
                    >
                      <span className="text-lg font-medium text-b4 min-w-[24px] text-center">
                        {index + 1}
                      </span>
                      {artist.images && artist.images.length > 0 ? (
                        <img
                          src={artist.images[0].url}
                          alt={artist.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-b3/50 flex items-center justify-center">
                          <User className="h-6 w-6 text-b4" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">
                          {artist.name}
                        </h3>
                        <p className="text-sm text-b4 truncate">
                          {artist.genres?.slice(0, 2).join(', ') ||
                            'No genres available'}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Tracks */}
        <Card className="bg-b1 border-b3/30">
          <CardHeader>
            <CardTitle className="text-white">Top Tracks</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!tracksLoading &&
            (!topTracks || !topTracks.items || topTracks.items.length === 0) ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <InfoIcon className="h-10 w-10 text-b4 mb-2" />
                <p className="text-b4">No track data available.</p>
                <p className="text-sm text-b4/70 mt-1">
                  Listen to more music to see your top tracks.
                </p>
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                <ul className="divide-y divide-b3/30">
                  {topTracks?.items?.map((track, index) => (
                    <li
                      key={track.id}
                      className="p-4 flex items-center gap-4 hover:bg-b3/20 transition-colors"
                    >
                      <span className="text-lg font-medium text-b4 min-w-[24px] text-center">
                        {index + 1}
                      </span>
                      {track.album.images && track.album.images.length > 0 ? (
                        <img
                          src={track.album.images[0].url}
                          alt={track.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-b3/50 flex items-center justify-center">
                          <Music className="h-6 w-6 text-b4" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-white truncate">
                          {track.name}
                        </h3>
                        <p className="text-sm text-b4 truncate">
                          {track.artists.map((a) => a.name).join(', ')}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Playlists Públicas */}
        <Card className="bg-b1 border-b3/30">
          <CardHeader>
            <CardTitle className="text-white">
              Suas Playlists Públicas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {playlistsLoading ? (
              <div className="py-8 text-center text-b4">
                Carregando playlists...
              </div>
            ) : playlistsError ? (
              <div className="py-8 text-center text-b4">
                Erro ao carregar playlists.
              </div>
            ) : !playlists ||
              !playlists.items ||
              playlists.items.filter((pl: any) => pl.public).length === 0 ? (
              <div className="py-8 text-center text-b4">
                Nenhuma playlist pública encontrada.
              </div>
            ) : (
              <ul className="divide-y divide-b3/30 max-h-80 overflow-y-auto">
                {playlists.items
                  .filter((pl: any) => pl.public)
                  .map((pl: any) => (
                    <li
                      key={pl.id}
                      className="p-4 flex items-center gap-4 hover:bg-b3/20 transition-colors"
                    >
                      {pl.images && pl.images.length > 0 ? (
                        <img
                          src={pl.images[0].url}
                          alt={pl.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded bg-b3/50 flex items-center justify-center">
                          <Music className="h-6 w-6 text-b4" />
                        </div>
                      )}
                      <div className="flex-1 font-medium text-white truncate min-w-0">
                        {pl.name}
                        <p className="text-sm text-b4 truncate">
                          {pl.tracks.total} músicas
                        </p>
                      </div>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile
