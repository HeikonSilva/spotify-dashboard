import { Disc3, Home, LogIn, LogOut, Search, User } from 'lucide-react'
import { Outlet, NavLink, useLocation } from 'react-router'
import SpotifyIcon from '/svgs/spotify_icon.svg'
import { motion } from 'motion/react'
import { useSpotifyMe } from '../hooks/useSpotifyMe'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuth } from '@/contexts/AuthContext'

export const primaryItems = [
  {
    name: 'Home',
    icon: <Home className="h-5 w-5" />,
    url: '/',
  },
  {
    name: 'Musicas',
    icon: <Disc3 className="h-5 w-5" />,
    url: '/musics',
  },
  {
    name: 'Albuns',
    icon: <Search className="h-5 w-5" />,
    url: '/albuns',
  },
]

export const secondaryItems = [
  {
    name: 'Login',
    icon: <LogIn className="h-5 w-5" />,
    url: '/login',
    requiresNoAuth: true,
  },
  {
    name: 'Logout',
    icon: <LogOut className="h-5 w-5" />,
    requiresAuth: true,
  },
]

export default function Layout() {
  const location = useLocation()
  const currentItem = [...primaryItems, ...secondaryItems].find((item) =>
    item.url === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.url)
  )

  const { data } = useSpotifyMe()
  const { isAuthenticated, userProfile, logout } = useAuth()

  // Utilizando userProfile do contexto com fallback para dados do hook
  const profileData = userProfile || data

  return (
    <div className="bg-b2 w-screen h-screen flex gap-3 p-3 flex-row overflow-hidden">
      {/* Sidebar */}
      <aside className="w-1/4 max-w-[300px] flex flex-col gap-3 bg-b1 rounded-xl shadow-lg overflow-hidden">
        {/* Logo section */}
        <div className="flex items-center gap-3 py-5 px-6 text-sprimary">
          <img
            src={SpotifyIcon}
            alt="Spotify Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <h1 className="font-bold text-2xl tracking-tight">Spotify</h1>
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

        {/* Secondary navigation at the bottom */}
        <div className="mt-auto px-2 pb-4">
          <Separator className="bg-b3/30 mb-3" />

          {isAuthenticated && profileData ? (
            <>
              <div className="flex items-center gap-3 px-4 py-3 text-white rounded-lg mb-2">
                <Avatar className="h-8 w-8 border border-b3/30">
                  {profileData.images && profileData.images[0]?.url ? (
                    <AvatarImage
                      src={profileData.images[0].url}
                      alt="Profile"
                    />
                  ) : null}
                  <AvatarFallback className="bg-b3/50">
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium truncate">
                  {profileData.display_name}
                </span>
              </div>

              <TooltipProvider>
                {secondaryItems
                  .filter((item) => item.requiresAuth)
                  .map((item) => (
                    <Tooltip key={item.name}>
                      <TooltipTrigger asChild>
                        <button
                          onClick={logout}
                          className="cursor-pointer w-full flex items-center gap-3 px-4 py-3 text-b4 hover:text-white hover:bg-b3/50 transition-colors rounded-lg"
                        >
                          {item.icon}
                          <span className="font-medium">{item.name}</span>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sair da sua conta</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
              </TooltipProvider>
            </>
          ) : (
            <ul className="space-y-1">
              {secondaryItems
                .filter((item) => !isAuthenticated || item.requiresNoAuth)
                .map((item) => (
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
          )}
        </div>
      </aside>

      {/* Main content area */}
      <main className="text-white flex-1 flex flex-col overflow-hidden bg-b1 rounded-xl shadow-lg">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border-b border-b-b3/30 p-4"
        >
          <h1 className="font-bold text-2xl">
            {currentItem ? currentItem.name : 'Spotify'}
          </h1>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto p-6"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
