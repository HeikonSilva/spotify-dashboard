import {
  Home,
  History,
  LogIn,
  LogOut,
  MoreVertical,
  User,
  Menu,
  ChevronLeft,
  ChevronRight,
  DiscAlbum,
  Search,
  Circle,
} from 'lucide-react'
import { Outlet, NavLink, useLocation } from 'react-router'
import SpotifyIcon from '/svgs/spotify_icon.svg'
import {
  motion,
  useMotionValue,
  useSpring,
  useAnimationFrame,
} from 'motion/react'
import { useSpotifyMe } from '@/hooks/useSpotifyMe'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState, useCallback, useRef } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

// Simplified navigation items
export const primaryItems = [
  {
    name: 'Home',
    icon: <Home className="h-5 w-5" />,
    url: '/',
  },
  {
    name: 'Historico',
    icon: <History className="h-5 w-5" />,
    url: '/history',
  },
  {
    name: 'Perfil',
    icon: <User className="h-5 w-5" />,
    url: '/profile',
  },
  {
    name: 'Player',
    icon: <DiscAlbum className="h-5 w-5" />,
    url: '/player',
  },
  {
    name: 'Pesquisar',
    icon: <Search className="h-5 w-5" />,
    url: '/search',
  },
  {
    name: 'Fatos Curiosos',
    icon: <Circle className="h-5 w-5" />,
    url: '/funfacts',
  },
]

// Adicione este mapeamento para rotas dinâmicas e extras
const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/history': 'Histórico',
  '/profile': 'Perfil',
  '/player': 'Player',
  '/search': 'Pesquisar',
  '/search/artists': 'Buscar Artistas',
  '/search/albums': 'Buscar Álbuns',
  '/search/tracks': 'Buscar Músicas',
  '/artist': 'Artista',
  '/album': 'Álbum',
  '/track': 'Música',
  '/login': 'Entrar',
  '/callback': 'Autenticando',
  '/playlist': 'Playlist',
  '*': 'Página não encontrada',
  '/funfacts': 'Fatos Aleatórios',
}

// Função para pegar o título correto
function getPageTitle(pathname: string) {
  // Checa se é rota exata
  if (routeTitles[pathname]) return routeTitles[pathname]
  // Checa se começa com rotas dinâmicas
  if (pathname.startsWith('/artist/')) return routeTitles['/artist']
  if (pathname.startsWith('/album/')) return routeTitles['/album']
  if (pathname.startsWith('/track/')) return routeTitles['/track']
  if (pathname.startsWith('/search/artists'))
    return routeTitles['/search/artists']
  if (pathname.startsWith('/search/albums'))
    return routeTitles['/search/albums']
  if (pathname.startsWith('/search/tracks'))
    return routeTitles['/search/tracks']
  return 'Spotify'
}

export default function Layout() {
  const location = useLocation()

  const { isAuthenticated, userProfile, logout } = useAuth()
  const { data } = useSpotifyMe()

  const profileData = userProfile || data

  // Motion values for mouse position
  const mouseX = useMotionValue(50)
  const mouseY = useMotionValue(50)
  const [isIdle, setIsIdle] = useState(false)
  const idleTimeout = useRef<NodeJS.Timeout | null>(null)

  // Chaotic system parameters
  const chaosRef = useRef({
    x: 50,
    y: 50,
    dx: 0.2,
    dy: 0.27,
    time: 0,
  })

  // Animate with spring for smoothness
  const springX = useSpring(mouseX, {
    stiffness: 160,
    damping: 20,
    mass: 1,
    ease: 'easeInOut',
  })
  const springY = useSpring(mouseY, {
    stiffness: 160,
    damping: 20,
    mass: 1,
    ease: 'easeInOut',
  })

  // Handle mouse move for gradient effect
  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      const { clientX, clientY } = event
      mouseX.set((clientX / window.innerWidth) * 100)
      mouseY.set((clientY / window.innerHeight) * 100)
      setIsIdle(false)
      if (idleTimeout.current) clearTimeout(idleTimeout.current)
      idleTimeout.current = setTimeout(() => setIsIdle(true), 1200)
    },
    [mouseX, mouseY]
  )

  // Idle effect: apply chaotic motion when idle
  useEffect(() => {
    if (isIdle) {
      // Initialize chaos parameters when entering idle state
      chaosRef.current = {
        x: mouseX.get(),
        y: mouseY.get(),
        dx: Math.random() * 0.1 - 0.05,
        dy: Math.random() * 0.1 - 0.05,
        time: 0,
      }
    }
  }, [isIdle, mouseX, mouseY])

  // Animation frame for chaotic movement when idle
  useAnimationFrame(() => {
    if (isIdle) {
      const chaos = chaosRef.current
      chaos.time += 0.01

      const amplitude = 45
      const speed = 0.7

      const newX =
        50 +
        amplitude * Math.sin(chaos.time * speed) * Math.cos(chaos.time * 0.5)
      const newY =
        50 +
        amplitude *
          Math.sin(chaos.time * speed * 1.3) *
          Math.sin(chaos.time * 0.7)

      mouseX.set(newX)
      mouseY.set(newY)
    }
  })

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (idleTimeout.current) clearTimeout(idleTimeout.current)
    }
  }, [handleMouseMove])

  const [gradientStyle, setGradientStyle] = useState({})
  useEffect(() => {
    const unsubscribeX = springX.on('change', (x) => {
      setGradientStyle((prev) => ({
        ...prev,
        x,
      }))
    })
    const unsubscribeY = springY.on('change', (y) => {
      setGradientStyle((prev) => ({
        ...prev,
        y,
      }))
    })
    return () => {
      unsubscribeX()
      unsubscribeY()
    }
  }, [springX, springY])

  const bgStyle = {
    background: `radial-gradient(
      800px circle at ${gradientStyle.x ?? 50}% ${gradientStyle.y ?? 50}%,
      rgba(29, 185, 84, 0.2) 0%,
      rgba(18, 18, 24, 0) 60%
    ),
    radial-gradient(
      600px circle at ${100 - (gradientStyle.x ?? 50)}% ${
      100 - (gradientStyle.y ?? 50)
    }%,
      rgba(90, 50, 220, 0.2) 0%,
      rgba(18, 18, 24, 0) 70%
    )`,
    transition: 'background 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  }

  const profileImageUrl =
    profileData?.images && profileData.images.length > 0
      ? profileData.images[0]?.url
      : undefined

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)

  return (
    <div className="bg-b2 w-screen h-screen flex flex-row gap-3 p-3 overflow-hidden relative">
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={bgStyle}
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      <button
        className="fixed top-6 right-6 z-50 bg-b1/80 hover:bg-b3/80 rounded-full p-2 shadow-lg transition-colors hidden md:block"
        onClick={() => setMinimized((v) => !v)}
        aria-label={minimized ? 'Maximizar interface' : 'Minimizar interface'}
        type="button"
      >
        {minimized ? (
          <ChevronRight className="h-6 w-6 text-white" />
        ) : (
          <ChevronLeft className="h-6 w-6 text-white" />
        )}
      </button>

      {!minimized && (
        <>
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black/40 z-30 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div
            className={cn(
              'fixed top-0 left-0 h-full w-64 max-w-[300px] flex flex-col gap-3 bg-b1/95 backdrop-blur-sm rounded-r-xl shadow-lg overflow-hidden z-40 transition-transform duration-300 md:static md:rounded-xl md:shadow-lg md:z-10 md:translate-x-0',
              sidebarOpen ? 'translate-x-0' : '-translate-x-full',
              'md:w-1/4'
            )}
            style={{ minWidth: 0 }}
          >
            <div className="flex items-start gap-3 py-5 px-6 flex-col text-sprimary">
              <div className="flex items-start flex-row gap-3">
                <img
                  src={SpotifyIcon}
                  alt="Spotify Logo"
                  width={32}
                  height={32}
                  className="h-8 w-8"
                />
                <h1 className="font-bold text-2xl tracking-tight">Spotify</h1>
              </div>
              <div className="text-white">
                <p>Heikon Silva Costa</p>
                <p>Enzo Raphael</p>
              </div>
            </div>
            <Separator className="bg-b3/30" />
            {/* Primary navigation */}
            <nav className="flex-grow px-2">
              <ul className="space-y-1">
                {primaryItems.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                          'font-medium hover:bg-b3/50 hover:text-white',
                          isActive ? 'bg-b3/70 text-white' : 'text-b4'
                        )
                      }
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* User profile and authentication - with three dot menu */}
            <div className="mt-auto px-2 pb-4">
              <Separator className="bg-b3/30 mb-3" />
              {isAuthenticated && profileData ? (
                <div className="px-2 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-b3/30">
                      {profileImageUrl ? (
                        <AvatarImage src={profileImageUrl} alt="Profile" />
                      ) : null}
                      <AvatarFallback className="bg-b3/50">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium truncate text-white">
                      {profileData.display_name || 'User'}
                    </span>
                  </div>

                  {/* Three-dots menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-b4 hover:text-white hover:bg-b3/50"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className="w-56 bg-b1 border-b3 text-zinc-300"
                      align="end"
                    >
                      {/*<DropdownMenuItem className="cursor-pointer hover:bg-b3/40 hover:text-white focus:bg-b3/40 focus:text-white">
                        <Link to="/profile" className="flex items-center w-full">
                          <User className="mr-2 h-4 w-4" />
                          <span>Ver Perfil</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-b3/50" />*/}
                      <DropdownMenuItem
                        className="cursor-pointer text-red-400 hover:text-red-300 hover:text-white focus:text-white hover:bg-red-900/30 focus:bg-red-900/30"
                        onClick={logout}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sair</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                      'font-medium hover:bg-b3/50 hover:text-white',
                      isActive ? 'bg-b3/70 text-white' : 'text-b4'
                    )
                  }
                >
                  <LogIn className="h-5 w-5" />
                  <span>Entrar</span>
                </NavLink>
              )}
            </div>
          </div>

          {/* Main content area */}
          <main className="text-white flex-1 flex flex-col overflow-hidden bg-b1/80 backdrop-blur-sm rounded-xl shadow-lg z-10 relative md:ml-0 ml-0">
            <motion.header
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="border-b border-b-b3/30 px-4 py-3 flex justify-between items-center md:px-6 md:py-4"
            >
              {/* Botão de menu mobile dentro do header para melhor UX */}
              <button
                className="md:hidden mr-2"
                onClick={() => setSidebarOpen(true)}
                aria-label="Abrir menu"
                type="button"
              >
                <Menu className="h-6 w-6 text-sprimary" />
              </button>
              <h1 className="font-bold text-xl md:text-2xl">
                {getPageTitle(location.pathname)}
              </h1>
            </motion.header>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="flex-1 overflow-auto p-3 md:p-6 max-w-7xl mx-auto w-full"
            >
              <Outlet />
            </motion.div>
          </main>
        </>
      )}
    </div>
  )
}
