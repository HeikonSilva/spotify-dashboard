import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Clock, Music, Users, AlertCircle, InfoIcon } from 'lucide-react'
import { ErrorDisplay } from '@/components/ui/ErrorDisplay'
import { EmptyState } from '@/components/ui/EmptyState'

import { useListeningActivity } from '@/hooks/useListeningActivity'
import { useSpotifyTopArtists } from '@/hooks/useSpotifyTopArtists'
import { useSpotifyTopTracks } from '@/hooks/useSpotifyTopTracks'
import { ActivityBarChart } from '@/components/charts/ActivityBarChart'
import { TopItemsList } from '@/components/charts/TopItemsList'
import { useSpotifyRecentlyPlayed } from '@/hooks/useSpotifyRecentlyPlayed'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'react-router'

export default function Home() {
  const {
    hourlyActivity,
    weekdayActivity,
    totalTracks,
    totalTimeMs,
    uniqueArtists,
    loading: activityLoading,
    error: activityError,
  } = useListeningActivity()

  const {
    data: topArtistsData,
    loading: topArtistsLoading,
    error: topArtistsError,
  } = useSpotifyTopArtists({
    limit: 5,
    timeRange: 'medium_term',
  })

  const {
    data: topTracksData,
    loading: topTracksLoading,
    error: topTracksError,
  } = useSpotifyTopTracks({
    limit: 5,
    timeRange: 'medium_term',
  })

  const {
    data: recentData,
    loading: recentLoading,
    error: recentError,
  } = useSpotifyRecentlyPlayed({
    limit: 10,
  })

  const sortedItems = useMemo(() => {
    if (!recentData?.items?.length) return []

    return [...recentData.items].sort(
      (a, b) =>
        new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
    )
  }, [recentData])

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  const formatHour = (hour: number) => {
    return `${hour}:00`
  }

  const formatPlayedDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    if (date.toDateString() === today.toDateString()) {
      return `Hoje, ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    } else if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    } else {
      return `${date.toLocaleDateString([], {
        day: '2-digit',
        month: '2-digit',
      })} - ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    }
  }

  if (activityLoading && topArtistsLoading && topTracksLoading) {
    return (
      <div className="w-full space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }, (_, i) => (
            <Card key={i} className="bg-b1 border-b3/30">
              <CardHeader className="pb-2">
                <Skeleton className="h-5 w-3/4 bg-b3/30" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-1/2 bg-b3/30" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="bg-b1 border-b3/30">
          <CardHeader>
            <Skeleton className="h-6 w-1/4 bg-b3/30" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[250px] w-full bg-b3/30" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (activityError) {
    return (
      <ErrorDisplay
        message={`Não foi possível carregar os dados: ${activityError}`}
      />
    )
  }

  return (
    <div className="gap-4 flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-b1 to-b2 border-b3/30 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-b4 flex items-center gap-2">
              <Music className="h-4 w-4" />
              Músicas ouvidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">{totalTracks}</p>
            <p className="text-sm text-b4 mt-1">no último mês</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-b1 to-b2 border-b3/30 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-b4 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Tempo total escutado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">
              {formatTime(totalTimeMs)}
            </p>
            <p className="text-sm text-b4 mt-1">aproximadamente</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-b1 to-b2 border-b3/30 shadow-md hover:shadow-lg transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-b4 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Artistas diferentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">{uniqueArtists}</p>
            <p className="text-sm text-b4 mt-1">ouvidos no período</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-b1 text-white border-b3/30">
        <CardHeader>
          <CardTitle>Padrões de Escuta</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {(!hourlyActivity ||
            hourlyActivity.every((item) => item.count === 0)) &&
          (!weekdayActivity ||
            weekdayActivity.every((item) => item.count === 0)) ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <InfoIcon className="h-10 w-10 text-b4 mb-2" />
              <p className="text-b4">Dados de atividade não disponíveis.</p>
              <p className="text-sm text-b4/70 mt-1">
                Ouça mais músicas para visualizar seus padrões de escuta.
              </p>
            </div>
          ) : (
            <Tabs defaultValue="hourly">
              <TabsList className="bg-b4 mb-4">
                <TabsTrigger value="hourly">Por Hora</TabsTrigger>
                <TabsTrigger value="weekday">Por Dia da Semana</TabsTrigger>
              </TabsList>
              <TabsContent value="hourly">
                <ActivityBarChart
                  data={hourlyActivity}
                  dataKey="count"
                  color="#1DB954"
                  xAxisDataKey="hour"
                  xAxisFormatter={formatHour}
                />
              </TabsContent>
              <TabsContent value="weekday">
                <ActivityBarChart
                  data={weekdayActivity}
                  dataKey="count"
                  color="#1DB954"
                  xAxisDataKey="name"
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!topArtistsLoading &&
        !topArtistsError &&
        (!topArtistsData ||
          !topArtistsData.items ||
          topArtistsData.items.length === 0) ? (
          <Card className="bg-b1 border-b3/30">
            <CardHeader>
              <CardTitle className="text-white">
                Artistas Mais Ouvidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<AlertCircle className="h-8 w-8 text-b4 mb-2" />}
                title="Dados não disponíveis."
                description="Spotify não retornou dados de artistas mais ouvidos."
              />
            </CardContent>
          </Card>
        ) : (
          <TopItemsList
            title="Artistas Mais Ouvidos"
            loading={topArtistsLoading}
            error={topArtistsError}
            items={
              topArtistsData?.items.map((artist, idx) => ({
                id: artist.id,
                name: (
                  <Link to={`/artist/${artist.id}`} className="hover:underline">
                    {artist.name}
                  </Link>
                ),
                imageUrl: artist.images[0]?.url,
                index: idx + 1,
              })) || []
            }
          />
        )}

        {!topTracksLoading &&
        !topTracksError &&
        (!topTracksData ||
          !topTracksData.items ||
          topTracksData.items.length === 0) ? (
          <Card className="bg-b1 border-b3/30">
            <CardHeader>
              <CardTitle className="text-white">Músicas Mais Ouvidas</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={<AlertCircle className="h-8 w-8 text-b4 mb-2" />}
                title="Dados não disponíveis."
                description="Spotify não retornou dados de músicas mais ouvidas."
              />
            </CardContent>
          </Card>
        ) : (
          <TopItemsList
            title="Músicas Mais Ouvidas"
            loading={topTracksLoading}
            error={topTracksError}
            items={
              topTracksData?.items.map((track, idx) => ({
                id: track.id,
                name: (
                  <Link to={`/track/${track.id}`} className="hover:underline">
                    {track.name}
                  </Link>
                ),
                subtitle: track.artists.map((a, i) => (
                  <span key={a.id}>
                    <Link to={`/artist/${a.id}`} className="hover:underline">
                      {a.name}
                    </Link>
                    {i < track.artists.length - 1 && <span>, </span>}
                  </span>
                )),
                imageUrl: track.album.images[0]?.url,
                index: idx + 1,
              })) || []
            }
          />
        )}
      </div>

      {!recentLoading &&
      !recentError &&
      (!sortedItems || sortedItems.length === 0) ? (
        <Card className="bg-b1 text-white border-b3/30">
          <CardHeader>
            <CardTitle>Músicas Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <InfoIcon className="h-10 w-10 text-b4 mb-2" />
              <p className="text-b4">Sem histórico de reprodução recente.</p>
              <p className="text-sm text-b4/70 mt-1">
                Ouça algumas músicas no Spotify para ver seu histórico aqui.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        sortedItems &&
        sortedItems.length > 0 && (
          <Card className="bg-b1 text-white border-b3/30">
            <CardHeader>
              <CardTitle>Músicas Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="max-h-96 overflow-y-auto p-6">
                <ul className="space-y-2">
                  {sortedItems.map((item, index) => (
                    <li
                      key={`${item.track.id}-${index}`}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-b3/20 transition-colors"
                    >
                      <div className="min-w-[40px] h-10 aspect-square bg-b3/30 rounded overflow-hidden">
                        {item.track.album.images[0]?.url && (
                          <img
                            src={item.track.album.images[0]?.url}
                            alt={item.track.album.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-white">
                          <Link
                            to={`/track/${item.track.id}`}
                            className="hover:underline"
                          >
                            {item.track.name}
                          </Link>
                        </p>
                        <p className="text-sm text-b4 truncate">
                          {item.track.artists.map((artist, idx) => (
                            <Link
                              key={artist.id}
                              to={`/artist/${artist.id}`}
                              className="hover:underline"
                              style={{
                                marginRight:
                                  idx < item.track.artists.length - 1 ? 4 : 0,
                              }}
                            >
                              {artist.name}
                              {idx < item.track.artists.length - 1 && (
                                <span>, </span>
                              )}
                            </Link>
                          ))}
                        </p>
                      </div>
                      <div className="text-sm text-b4">
                        {formatPlayedDate(item.played_at)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  )
}
