import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from 'react'
import { isAuthenticated as checkAuth, logout } from '@/utils/spotifyAuth'

// Interface para o perfil do usuário Spotify
interface SpotifyUserProfile {
  id: string
  display_name: string
  email?: string
  images?: Array<{ url: string; height: number; width: number }>
  followers?: { total: number }
  country?: string
  product?: string
  uri?: string
  explicit_content?: { filter_enabled: boolean; filter_locked: boolean }
  external_urls?: { spotify: string }
}

interface AuthContextType {
  isAuthenticated: boolean
  userProfile: SpotifyUserProfile | null
  logout: () => void
  updateAuth: (status: boolean) => void
  updateProfile: (profile: SpotifyUserProfile) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [userProfile, setUserProfile] = useState<SpotifyUserProfile | null>(
    null
  )

  // Verificar autenticação quando o componente é montado
  useEffect(() => {
    setIsAuthenticated(checkAuth())
  }, [])

  const updateAuth = (status: boolean) => {
    setIsAuthenticated(status)
  }

  const updateProfile = (profile: SpotifyUserProfile) => {
    setUserProfile(profile)
  }

  const handleLogout = () => {
    logout()
    setIsAuthenticated(false)
    setUserProfile(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        userProfile,
        logout: handleLogout,
        updateAuth,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
