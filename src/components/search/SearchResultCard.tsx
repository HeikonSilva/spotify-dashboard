import { Music, User, Disc, ListMusic } from 'lucide-react'
import { motion } from 'motion/react'

interface SearchResultCardProps {
  id: string
  type: 'artist' | 'album' | 'playlist'
  name: string
  imageUrl?: string
  subtitle?: string
  index: number
}

export function SearchResultCard({
  type,
  name,
  imageUrl,
  subtitle,
  index,
}: SearchResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-b2 rounded-lg overflow-hidden border border-b3/30 hover:border-sprimary/50 transition-all hover:shadow-md hover:-translate-y-1"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="aspect-square bg-b3/30 relative overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            {type === 'artist' && <User className="h-12 w-12 text-b4" />}
            {type === 'album' && <Disc className="h-12 w-12 text-b4" />}
            {type === 'playlist' && <ListMusic className="h-12 w-12 text-b4" />}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-bold text-white truncate">{name}</h3>
        {subtitle && <p className="text-sm text-b4 truncate">{subtitle}</p>}
      </div>
    </motion.div>
  )
}
