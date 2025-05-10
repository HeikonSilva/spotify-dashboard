import { useState } from 'react'
import { useNavigate } from 'react-router'
import { motion } from 'motion/react'
import { Search as SearchIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function Search() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searchType, setSearchType] = useState<string>('tracks')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    navigate(`/search/${searchType}?q=${encodeURIComponent(query)}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto w-full"
    >
      <Card className="bg-b1 border border-b3/30 text-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2 text-white">
            <SearchIcon className="h-6 w-6 text-sprimary" />
            Pesquisar no Spotify
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="search-query" className="text-b4">
                O que você quer encontrar?
              </Label>
              <div className="flex gap-2">
                <Input
                  id="search-query"
                  placeholder="Digite artistas, músicas ou álbuns..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="bg-b2 border border-b3/30 text-white placeholder:text-b4/50 focus:ring-sprimary focus:border-sprimary flex-1"
                />
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="w-36 bg-b2 border-b3/30 text-white focus:ring-sprimary focus:border-sprimary">
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent className="bg-b2 border-b3/30 text-white">
                    <SelectItem value="tracks">Músicas</SelectItem>
                    <SelectItem value="artists">Artistas</SelectItem>
                    <SelectItem value="albums">Álbuns</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!query.trim()}
              className="w-full bg-sprimary hover:bg-sprimary/90 text-black font-medium shadow"
            >
              <SearchIcon className="h-4 w-4 mr-2" />
              Pesquisar
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}
