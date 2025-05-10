import { useState, useEffect } from 'react'
import { PageLoader } from '@/components/ui/PageLoader'

export default function Top() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return <PageLoader />
  }

  return <h1>teste</h1>
}
