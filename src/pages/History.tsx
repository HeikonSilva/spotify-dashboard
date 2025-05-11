import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { InfoIcon, ArrowDownAZ, ArrowUpZA } from 'lucide-react'
import { motion } from 'motion/react'
import { Skeleton } from '@/components/ui/skeleton'
import { Link } from 'react-router'
import { useSpotifyRecentlyPlayed } from '@/hooks/useSpotifyRecentlyPlayed'

const HistorySkeleton = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="max-w-full mx-auto w-full"
  >
    <Card className="bg-b1 text-white border-b3/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-7 w-24 rounded" />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-b3/20">
                <th className="px-4 py-2 text-left text-b4 font-normal">#</th>
                <th className="px-4 py-2 text-left text-b4 font-normal">
                  Capa
                </th>
                <th className="px-4 py-2 text-left text-b4 font-normal">
                  Música
                </th>
                <th className="px-4 py-2 text-left text-b4 font-normal">
                  Artista(s)
                </th>
                <th className="px-4 py-2 text-left text-b4 font-normal">
                  Data/Hora
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 10 }).map((_, idx) => (
                <tr key={idx} className="hover:bg-b3/10 transition-colors">
                  <td className="px-4 py-2 text-b4">
                    <Skeleton className="h-4 w-6 rounded" />
                  </td>
                  <td className="px-4 py-2">
                    <Skeleton className="min-w-[48px] h-12 rounded" />
                  </td>
                  <td className="px-4 py-2">
                    <Skeleton className="h-4 w-32 rounded mb-1" />
                  </td>
                  <td className="px-4 py-2">
                    <Skeleton className="h-4 w-28 rounded" />
                  </td>
                  <td className="px-4 py-2">
                    <Skeleton className="h-4 w-20 rounded" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  </motion.div>
)

export default function History() {
  const [loading, setLoading] = useState(true)
  const [sortAsc, setSortAsc] = useState(false)
  const {
    data: recentData,
    loading: recentLoading,
    error: recentError,
  } = useSpotifyRecentlyPlayed({ limit: 50 })

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  const sortedItems = useMemo(() => {
    if (!recentData?.items?.length) return []
    const sorted = [...recentData.items].sort(
      (a, b) =>
        new Date(a.played_at).getTime() - new Date(b.played_at).getTime()
    )
    return sortAsc ? sorted : sorted.reverse()
  }, [recentData, sortAsc])

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

  if (loading || recentLoading) {
    return <HistorySkeleton />
  }

  if (recentError) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <InfoIcon className="h-10 w-10 text-b4 mb-2" />
        <p className="text-b4">Erro ao carregar histórico: {recentError}</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-full mx-auto w-full"
    >
      <Card className="bg-b1 text-white border-b3/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Músicas Tocadas</CardTitle>
            <button
              className="flex items-center gap-1 px-2 py-1 rounded bg-b3/30 hover:bg-b3/50 text-b4 text-xs transition"
              onClick={() => setSortAsc((asc) => !asc)}
              title="Ordenar por data"
              type="button"
            >
              {sortAsc ? (
                <>
                  <ArrowUpZA className="w-4 h-4" />
                  Crescente
                </>
              ) : (
                <>
                  <ArrowDownAZ className="w-4 h-4" />
                  Decrescente
                </>
              )}
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!sortedItems || sortedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <InfoIcon className="h-10 w-10 text-b4 mb-2" />
              <p className="text-b4">Sem histórico de reprodução recente.</p>
              <p className="text-sm text-b4/70 mt-1">
                Ouça algumas músicas no Spotify para ver seu histórico aqui.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-b3/20">
                    <th className="px-4 py-2 text-left text-b4 font-normal">
                      #
                    </th>
                    <th className="px-4 py-2 text-left text-b4 font-normal">
                      Capa
                    </th>
                    <th className="px-4 py-2 text-left text-b4 font-normal">
                      Música
                    </th>
                    <th className="px-4 py-2 text-left text-b4 font-normal">
                      Artista(s)
                    </th>
                    <th className="px-4 py-2 text-left text-b4 font-normal">
                      Data/Hora
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedItems.map((item, index) => (
                    <tr
                      key={`${item.track.id}-${index}`}
                      className="hover:bg-b3/10 transition-colors"
                    >
                      <td className="px-4 py-2 text-b4">{index + 1}</td>
                      <td className="px-4 py-2">
                        <div className="min-w-[48px] h-12 aspect-square bg-b3/30 rounded overflow-hidden">
                          {item.track.album.images[0]?.url && (
                            <img
                              src={item.track.album.images[0]?.url}
                              alt={item.track.album.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-white font-medium truncate max-w-[180px]">
                        <Link
                          to={`/track/${item.track.id}`}
                          className="hover:underline"
                        >
                          {item.track.name}
                        </Link>
                      </td>
                      <td className="px-4 py-2 text-b4 truncate max-w-[160px]">
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
                      </td>
                      <td className="px-4 py-2 text-b4 text-nowrap min-w-[120px]">
                        {formatPlayedDate(item.played_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
