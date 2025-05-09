import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'motion/react'
import { Skeleton } from '@/components/ui/skeleton'
import { Clock, Music, Users, AlertCircle, InfoIcon } from 'lucide-react'

import { useListeningActivity } from '@/hooks/useListeningActivity'
import { useSpotifyTopArtists } from '@/hooks/useSpotifyTopArtists'
import { useSpotifyTopTracks } from '@/hooks/useSpotifyTopTracks'
import { ActivityBarChart } from '@/components/charts/ActivityBarChart'
import { TopItemsList } from '@/components/charts/TopItemsList'
import { useSpotifyRecentlyPlayed } from '@/hooks/useSpotifyRecentlyPlayed'

export default function Home() {
  // Get listening activity data (hourly, weekday)
  const {
    hourlyActivity,
    weekdayActivity,
    totalTracks,
    totalTimeMs,
    uniqueArtists,
    loading: activityLoading,
    error: activityError,
  } = useListeningActivity()

  // Get top artists data
  const {
    data: topArtistsData,
    loading: topArtistsLoading,
    error: topArtistsError,
  } = useSpotifyTopArtists({ limit: 5, timeRange: '5' })

  // Get top tracks data
  const {
    data: topTracksData,
    loading: topTracksLoading,
    error: topTracksError,
  } = useSpotifyTopTracks({ limit: 5, timeRange: '5' })

  // Get recently played tracks
  const oneMonthAgoTimestamp = useMemo(() => {
    const date = new Date()
    date.setMonth(date.getMonth() - 1)
    return date.getTime()
  }, [])

  const {
    data: recentData,
    loading: recentLoading,
    error: recentError,
  } = useSpotifyRecentlyPlayed({
    limit: 10,
    after: oneMonthAgoTimestamp,
  })

  // Process recent tracks data
  const sortedItems = useMemo(() => {
    if (!recentData?.items?.length) return []

    return [...recentData.items].sort(
      (a, b) =>
        new Date(b.played_at).getTime() - new Date(a.played_at).getTime()
    )
  }, [recentData])

  // Format milliseconds to hours and minutes
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  // Format hour for X axis
  const formatHour = (hour: number) => {
    return `${hour}:00`
  }

  // Format date for display
  const formatPlayedDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date()
    yesterday.setDate(today.getDate() - 1)

    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return `Hoje, ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    }
    // Check if it's yesterday
    else if (date.toDateString() === yesterday.toDateString()) {
      return `Ontem, ${date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })}`
    }
    // Other dates
    else {
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
          {[1, 2, 3].map((i) => (
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
      <Alert variant="destructive" className="bg-red-900/20 border-red-800">
        <AlertTitle className="text-red-400">Erro</AlertTitle>
        <AlertDescription>
          Não foi possível carregar os dados: {activityError}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Stats cards */}
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

      {/* Activity charts */}
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

      {/* Top Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Artists */}
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
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-8 w-8 text-b4 mb-2" />
                <p className="text-b4">Dados não disponíveis.</p>
                <p className="text-sm text-b4/70 mt-1">
                  Spotify não retornou dados de artistas mais ouvidos.
                </p>
              </div>
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
                name: artist.name,
                imageUrl: artist.images[0]?.url,
                index: idx + 1,
              })) || []
            }
          />
        )}

        {/* Top Tracks */}
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
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <AlertCircle className="h-8 w-8 text-b4 mb-2" />
                <p className="text-b4">Dados não disponíveis.</p>
                <p className="text-sm text-b4/70 mt-1">
                  Spotify não retornou dados de músicas mais ouvidas.
                </p>
              </div>
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
                name: track.name,
                subtitle: track.artists.map((a) => a.name).join(', '),
                imageUrl: track.album.images[0]?.url,
                index: idx + 1,
              })) || []
            }
          />
        )}
      </div>

      {/* Recent Tracks */}
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
                          {item.track.name}
                        </p>
                        <p className="text-sm text-b4 truncate">
                          {item.track.artists
                            .map((artist) => artist.name)
                            .join(', ')}
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
    </motion.div>
  )
}
