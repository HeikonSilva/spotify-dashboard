import {
  Home,
  History,
  LogIn,
  LogOut,
  MoreVertical,
  User,
  List,
} from 'lucide-react'
import { Outlet, NavLink, useLocation, Link } from 'react-router'
import SpotifyIcon from '/svgs/spotify_icon.svg'
import { motion } from 'motion/react'
import { useSpotifyMe } from '@/hooks/useSpotifyMe'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState, useCallback } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
    name: 'Ranking',
    icon: <List className="h-5 w-5" />,
    url: '/top',
  },
  {
    name: 'History',
    icon: <History className="h-5 w-5" />,
    url: '/history',
  },
]

export default function Layout() {
  const location = useLocation()
  const currentItem = primaryItems.find((item) =>
    item.url === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(item.url)
  )

  const { isAuthenticated, userProfile, logout } = useAuth()
  const { data, error } = useSpotifyMe()

  const profileData = userProfile || data

  // Mouse position state for gradient effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Handle mouse move for gradient effect
  const handleMouseMove = useCallback((event: MouseEvent) => {
    const { clientX, clientY } = event
    setMousePosition({
      x: (clientX / window.innerWidth) * 100,
      y: (clientY / window.innerHeight) * 100,
    })
  }, [])

  // Add and remove mouse move event listener
  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [handleMouseMove])

  useEffect(() => {
    if (error) {
      console.error('Error fetching user profile:', error)
    }
  }, [error])

  const profileImageUrl =
    profileData?.images && profileData.images.length > 0
      ? profileData.images[0]?.url
      : undefined

  // Calculate gradient position based on mouse
  const gradientStyle = {
    background: `radial-gradient(
      800px circle at ${mousePosition.x}% ${mousePosition.y}%, 
      rgba(29, 185, 84, 0.15) 0%, 
      rgba(18, 18, 24, 0) 60%
    ), 
    radial-gradient(
      600px circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%,
      rgba(90, 50, 220, 0.15) 0%,
      rgba(18, 18, 24, 0) 70%
    )`,
  }

  return (
    <div className="bg-b2 w-screen h-screen flex gap-3 p-3 flex-row overflow-hidden relative">
      {/* Dynamic background gradient */}
      <div
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-300 ease-in-out"
        style={gradientStyle}
      />

      {/* Sidebar - now with translucent background */}
      <aside className="w-1/4 max-w-[300px] flex flex-col gap-3 bg-b1/80 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden z-10 relative">
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
                  <DropdownMenuItem className="cursor-pointer hover:bg-b3/40 hover:text-white focus:bg-b3/40 focus:text-white">
                    <Link to="/profile" className="flex items-center w-full">
                      <User className="mr-2 h-4 w-4" />
                      <span>View Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-b3/50" />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-400 hover:text-red-300 hover:text-white focus:text-white hover:bg-red-900/30 focus:bg-red-900/30"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
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
              <span>Login</span>
            </NavLink>
          )}
        </div>
      </aside>

      {/* Main content area */}
      <main className="text-white flex-1 flex flex-col overflow-hidden bg-b1/80 backdrop-blur-sm rounded-xl shadow-lg z-10 relative">
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="border-b border-b-b3/30 px-6 py-4 flex justify-between items-center"
        >
          <h1 className="font-bold text-2xl">
            {currentItem ? currentItem.name : 'Spotify'}
          </h1>
        </motion.header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 overflow-auto p-6 max-w-7xl mx-auto w-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  )
}
