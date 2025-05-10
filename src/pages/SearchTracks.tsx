import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { ArrowLeft, Search as SearchIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSpotifySearch } from '@/hooks/useSpotifySearch'
import { SearchResults } from '@/components/search/SearchResults'

export default function SearchTracks() {
  const location = useLocation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search)
    const q = searchParams.get('q')
    if (q) setQuery(q)
  }, [location.search])

  const { data, loading, error } = useSpotifySearch({
    query,
    type: 'track',
    limit: 25,
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="mb-6 flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/search')}
          className="border-b3/30 text-white hover:bg-b3/20 bg-b2"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <SearchIcon className="h-5 w-5 text-sprimary" />
          Resultados para: <span className="text-sprimary">{query}</span>
        </h1>
      </div>

      <div>
        <SearchResults
          title="Músicas"
          type="tracks"
          data={data}
          loading={loading}
          error={error}
          query={query}
        />
      </div>
    </motion.div>
  )
}
