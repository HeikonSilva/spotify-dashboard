import { SearchResultCard } from './SearchResultCard'
import { TrackResult } from './TrackResult'
import { EmptyState } from '@/components/ui/EmptyState'
import { AlertCircle, InfoIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ErrorDisplay } from '@/components/ui/ErrorDisplay'

interface SearchResultsProps {
  title: string
  type: 'artists' | 'albums' | 'playlists' | 'tracks'
  data: any
  loading: boolean
  error: string | null
  query: string
}

export function SearchResults({
  title,
  type,
  data,
  loading,
  error,
  query,
}: SearchResultsProps) {
  if (error) {
    return <ErrorDisplay message={error} />
  }

  if (loading) {
    return (
      <Card className="bg-b1 border-b3/30">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {type === 'tracks' ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="w-10 h-10 mr-4 rounded" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-full max-w-[180px] mb-2" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="flex flex-col">
                  <Skeleton className="aspect-square rounded-lg mb-2" />
                  <Skeleton className="h-4 w-full max-w-[160px] mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (
    !data ||
    (type === 'tracks' && (!data.tracks || !data.tracks.items?.length)) ||
    (type === 'artists' && (!data.artists || !data.artists.items?.length)) ||
    (type === 'albums' && (!data.albums || !data.albums.items?.length)) ||
    (type === 'playlists' && (!data.playlists || !data.playlists.items?.length))
  ) {
    return (
      <Card className="bg-b1 border-b3/30">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent className="py-6">
          <EmptyState
            icon={<InfoIcon className="h-10 w-10 text-b4 mb-2" />}
            title="Nenhum resultado encontrado"
            description={`Não encontramos ${title.toLowerCase()} para "${query}"`}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-b1 border-b3/30">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {type === 'tracks' && (
          <div className="divide-y divide-b3/20">
            {data.tracks.items.map((track: any, index: number) => (
              <TrackResult
                key={track.id}
                id={track.id}
                name={track.name}
                artists={track.artists.map((a: any) => a.name).join(', ')}
                album={track.album.name}
                imageUrl={track.album.images?.[0]?.url}
                duration={track.duration_ms}
                index={index}
              />
            ))}
          </div>
        )}
        {type === 'artists' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.artists.items.map((artist: any, index: number) => (
              <SearchResultCard
                key={artist.id}
                id={artist.id}
                type="artist"
                name={artist.name}
                imageUrl={artist.images?.[0]?.url}
                subtitle={`${
                  artist.followers?.total.toLocaleString() || '0'
                } seguidores`}
                index={index}
              />
            ))}
          </div>
        )}
        {type === 'albums' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.albums.items.map((album: any, index: number) => (
              <SearchResultCard
                key={album.id}
                id={album.id}
                type="album"
                name={album.name}
                imageUrl={album.images?.[0]?.url}
                subtitle={album.artists.map((a: any) => a.name).join(', ')}
                index={index}
              />
            ))}
          </div>
        )}
        {type === 'playlists' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {data.playlists.items.map((playlist: any, index: number) => (
              <SearchResultCard
                key={playlist.id}
                id={playlist.id}
                type="playlist"
                name={playlist.name}
                imageUrl={playlist.images?.[0]?.url}
                subtitle={`${playlist.tracks?.total || '?'} músicas`}
                index={index}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
