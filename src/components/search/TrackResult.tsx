import { Music } from 'lucide-react'
import { formatTime } from '@/utils/formatTime'
import { motion } from 'motion/react'

interface TrackResultProps {
  id: string
  name: string
  artists: string
  album: string
  imageUrl?: string
  duration: number
  index: number
}

export function TrackResult({
  name,
  artists,
  album,
  imageUrl,
  duration,
  index,
}: TrackResultProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      className="flex items-center p-3 hover:bg-b3/20 rounded-md transition-colors"
    >
      <div className="w-10 h-10 mr-4 rounded bg-b3/30 overflow-hidden flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full">
            <Music className="h-5 w-5 text-b4" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-white truncate">{name}</h3>
        <p className="text-sm text-b4 truncate">{artists}</p>
      </div>
      <div className="flex-shrink-0 hidden sm:block text-right">
        <p className="text-sm text-b4 truncate max-w-[200px]">{album}</p>
      </div>
      <div className="ml-4 text-b4 text-sm flex-shrink-0 w-12 text-right">
        {formatTime(duration)}
      </div>
    </motion.div>
  )
}
