import { useState, useEffect, useRef } from 'react'
import { getAccessToken } from '@/utils/spotifyAuth'
import { useAuth } from '@/contexts/AuthContext'

// Cache em memória para armazenar a última resposta
// Usando uma variável fora do componente para persistir entre renderizações
interface CacheData {
  profileData: any
  timestamp: number
  token: string | null
}

const CACHE_DURATION = 60 * 1000 // Cache por 60 segundos
let profileCache: CacheData | null = null

export function useSpotifyMe() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Obtém as funções do contexto de autenticação
  const { isAuthenticated, updateProfile } = useAuth()

  // Ref para evitar múltiplas requisições durante montagens rápidas
  const isFetchingRef = useRef(false)

  useEffect(() => {
    let isMounted = true
    const fetchUserProfile = async () => {
      // Se o usuário não estiver autenticado, não precisamos fazer a requisição
      if (!isAuthenticated) {
        setLoading(false)
        return
      }

      // Não fazer requisição se já estiver buscando
      if (isFetchingRef.current) return

      const currentToken = getAccessToken()

      // Verificar o cache - usar dados em cache se disponíveis e ainda válidos
      const now = Date.now()
      if (
        profileCache &&
        profileCache.profileData &&
        profileCache.token === currentToken &&
        now - profileCache.timestamp < CACHE_DURATION
      ) {
        if (isMounted) {
          setData(profileCache.profileData)
          setLoading(false)
          // Ainda atualiza o contexto com os dados em cache
          updateProfile(profileCache.profileData)
        }
        return
      }

      // Marcar como estando buscando para evitar solicitações duplicadas
      isFetchingRef.current = true

      // Se não temos cache válido, prosseguir com a requisição
      setLoading(true)
      setError(null)

      try {
        if (!currentToken) {
          throw new Error('No access token found')
        }

        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`)
        }

        const profileData = await response.json()

        // Atualizar o cache
        profileCache = {
          profileData,
          timestamp: now,
          token: currentToken,
        }

        if (isMounted) {
          setData(profileData)
          setLoading(false)
          updateProfile(profileData)
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to fetch user profile')
          setLoading(false)
        }
      } finally {
        isFetchingRef.current = false
      }
    }

    fetchUserProfile()

    return () => {
      isMounted = false
    }
  }, [isAuthenticated, updateProfile])

  return { data, loading, error }
}
