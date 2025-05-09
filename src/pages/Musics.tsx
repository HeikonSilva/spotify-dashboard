import { useState, useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { motion } from 'motion/react'

export default function Musics() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for demo purposes
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="w-full space-y-4">
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <h1 className="text-2xl font-bold mb-4">Músicas</h1>
      <p className="text-b4">Explore suas músicas favoritas do Spotify.</p>
    </motion.div>
  )
}
