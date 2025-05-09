import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { exchangeToken, saveToken } from '@/utils/spotifyAuth'
import { Loader2, Check, X, Home, LogIn } from 'lucide-react'
import { motion } from 'motion/react'
import SpotifyIcon from '/svgs/spotify_icon.svg'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function Callback() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { updateAuth } = useAuth()

  useEffect(() => {
    const handleAuthentication = async () => {
      try {
        // Obter código de autorização da URL
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')

        // Se houver erro explícito na URL, tratamos aqui
        if (error) {
          console.error('Error from Spotify auth:', error)
          setStatus('error')
          setErrorMessage(error)
          return
        }

        // Verificamos se o código está presente
        if (!code) {
          console.error('No authorization code found in URL')
          setStatus('error')
          setErrorMessage('Código de autorização não encontrado')
          return
        }

        console.log('Authentication code received, exchanging for token...')

        try {
          // Troca o código por um token
          const token = await exchangeToken(code)

          // Log do resultado da troca
          console.log(
            'Token exchange successful:',
            token ? 'Token received' : 'No token received'
          )

          // Salva o token e atualiza o estado de autenticação
          saveToken(token)
          updateAuth(true)

          // Limpa a URL por questões de segurança
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname
          )

          // Atualiza o status para sucesso
          setStatus('success')
        } catch (tokenError) {
          console.error('Token exchange error:', tokenError)
          setStatus('error')
          setErrorMessage(
            tokenError instanceof Error
              ? tokenError.message
              : 'Falha ao trocar o código por token'
          )

          // Important: Make sure we're not updating auth state on error
          updateAuth(false)
        }
      } catch (err) {
        console.error('Error during authentication process:', err)
        setStatus('error')
        setErrorMessage(
          err instanceof Error ? err.message : 'Falha na autenticação'
        )

        // Important: Make sure we're not updating auth state on error
        updateAuth(false)
      }
    }

    handleAuthentication()
  }, [updateAuth]) // Dependency array is correct

  // If status is error but we have an active token, it means we're displaying the wrong state
  useEffect(() => {
    if (status === 'error') {
      // Check localStorage for access token
      const token = localStorage.getItem('access_token')
      const expires = localStorage.getItem('expires')

      if (token && expires && Date.now() < parseInt(expires)) {
        console.log('Valid token found despite error status, correcting state')
        setStatus('success')
        setErrorMessage(null)
        updateAuth(true)
      }
    }
  }, [status, updateAuth])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-center h-full"
    >
      <div className="bg-b1 border border-b3/30 rounded-xl p-8 max-w-md w-full shadow-xl">
        <div className="flex flex-col items-center gap-6">
          <div className="bg-b2 p-4 rounded-full">
            <img
              src={SpotifyIcon}
              alt="Spotify Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold">
              {status === 'loading' && 'Autenticando...'}
              {status === 'success' && 'Autenticação concluída!'}
              {status === 'error' && 'Falha na autenticação'}
            </h1>

            <p className="text-b4">
              {status === 'loading' && 'Conectando com sua conta Spotify'}
              {status === 'success' && 'Clique no botão abaixo para continuar'}
              {status === 'error' &&
                (errorMessage || 'Tente novamente mais tarde')}
            </p>
          </div>

          <div className="py-2">
            {status === 'loading' && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 className="h-10 w-10 text-sprimary" />
              </motion.div>
            )}

            {status === 'success' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <div className="bg-green-500/20 p-3 rounded-full">
                  <Check className="h-10 w-10 text-green-500" />
                </div>
              </motion.div>
            )}

            {status === 'error' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <div className="bg-red-500/20 p-3 rounded-full">
                  <X className="h-10 w-10 text-red-500" />
                </div>
              </motion.div>
            )}
          </div>

          {status === 'loading' && (
            <div className="w-full bg-b2 rounded-full h-2 overflow-hidden">
              <motion.div
                className="bg-sprimary h-full"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 3 }}
              />
            </div>
          )}

          {/* Botões de navegação */}
          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full"
            >
              <Button
                onClick={() => navigate('/')}
                className="cursor-pointer w-full bg-sprimary hover:bg-sprimary/90 text-black font-medium"
              >
                <Home className="h-4 w-4 mr-2" />
                Ir para a página inicial
              </Button>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="w-full"
            >
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className="cursor-pointer w-full bg-red-500 hover:bg-red-600 border-b3/30 hover:text-white text-white"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Tentar novamente
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
