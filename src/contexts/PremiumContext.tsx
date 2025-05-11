import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { useSpotifyMe } from '@/hooks/useSpotifyMe'

interface PremiumContextType {
  isPremium: boolean
  loading: boolean
}

const PremiumContext = createContext<PremiumContextType | undefined>(undefined)

export const PremiumProvider = ({ children }: { children: ReactNode }) => {
  const { data: profile, loading } = useSpotifyMe()
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    if (profile && profile.product === 'premium') {
      setIsPremium(true)
    } else {
      setIsPremium(false)
    }
  }, [profile])

  return (
    <PremiumContext.Provider value={{ isPremium, loading }}>
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  const ctx = useContext(PremiumContext)
  if (!ctx) throw new Error('usePremium must be used within PremiumProvider')
  return ctx
}
