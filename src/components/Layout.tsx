import { Disc3, House, LogIn, LogOut, Search, User } from 'lucide-react'
import { Outlet, NavLink, useLocation } from 'react-router'
import SpotifyIcon from '/svgs/spotify_icon.svg'
import { motion } from 'motion/react'
import { useSpotifyMe } from '../hooks/useSpotifyMe'
import { getAccessToken } from '@/utils/spotifyAuth'

export interface AvatarProps {
  imageUrl?: string
  alt?: string
}

function Avatar({ imageUrl, alt }: AvatarProps) {
  return imageUrl ? (
    <div className="w-6 h-6 overflow-hidden rounded-full">
      <img
        src={imageUrl}
        alt={alt || 'User avatar'}
        className="w-full h-full object-cover"
      />
    </div>
  ) : (
    <User size={24} />
  )
}

export const primaryItems = [
  {
    name: 'Home',
    icon: <House />,
    url: '/',
  },
  {
    name: 'Musicas',
    icon: <Disc3 />,
    url: '/musics',
  },
  {
    name: 'Albuns',
    icon: <Search />,
    url: '/albuns',
  },
]

export const secondaryItems = [
  {
    name: 'Login',
    icon: <LogIn />,
    url: '/login',
    requiresNoAuth: true,
  },
  {
    name: 'Logout',
    icon: <LogOut />,
    action: () => {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('expires_in')
      localStorage.removeItem('expires')
      localStorage.removeItem('code_verifier')
      window.location.href = '/'
    },
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
  const accessToken = getAccessToken()

  return (
    <div className="bg-b2 w-screen h-screen flex gap-2 p-2 flex-row">
      <div className="w-1/4 p-2 flex flex-col gap-2 bg-b1 rounded-xl">
        {/* Logo section */}
        <div className="flex flex-row gap-5 py-4 px-6 text-sprimary items-center rounded-2xl">
          <img src={SpotifyIcon} alt="Spotify Logo" width={32} height={32} />
          <h1 className="font-bold text-2xl">Spotify</h1>
        </div>

        {/* Primary navigation */}
        <div className="flex-grow">
          {primaryItems.map((item) => (
            <NavLink to={item.url} key={item.name}>
              <div className="flex flex-row gap-5 py-4 px-6 text-b4 items-center hover:text-white hover:bg-b3 transition-colors rounded-2xl cursor-pointer">
                {item.icon}
                <h1 className="font-bold text-xl">{item.name}</h1>
              </div>
            </NavLink>
          ))}
        </div>

        {/* Secondary navigation at the bottom */}
        <div className="mt-auto">
          {accessToken && data ? (
            <>
              <div className="flex flex-row gap-5 py-4 px-6 text-white items-center rounded-2xl">
                <Avatar imageUrl={data.images[0]?.url} alt="Profile" />
                <h1 className="font-bold text-xl">{data.display_name}</h1>
              </div>
              {secondaryItems
                .filter((item) => item.requiresAuth)
                .map((item) => (
                  <div
                    key={item.name}
                    onClick={item.action}
                    className="flex flex-row gap-5 py-4 px-6 text-b4 items-center hover:text-white hover:bg-b3 transition-colors rounded-2xl cursor-pointer"
                  >
                    {item.icon}
                    <h1 className="font-bold text-xl">{item.name}</h1>
                  </div>
                ))}
            </>
          ) : (
            secondaryItems
              .filter((item) => !accessToken || item.requiresNoAuth)
              .map((item) => (
                <NavLink to={item.url} key={item.name}>
                  <div className="flex flex-row gap-5 py-4 px-6 text-b4 items-center hover:text-white hover:bg-b3 transition-colors rounded-2xl cursor-pointer">
                    {item.icon}
                    <h1 className="font-bold text-xl">{item.name}</h1>
                  </div>
                </NavLink>
              ))
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="text-white w-3/4 p-2 flex flex-col gap-2 bg-b1 rounded-xl">
        <motion.div
          initial={{ opacity: 0, transition: { duration: 0.1 } }}
          animate={{ opacity: 1, transition: { duration: 0.1 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
          className="border-b-2 border-b-b4 w-full items-center flex"
        >
          <h1 className="font-bold text-2xl">
            {currentItem ? currentItem.name : 'Spotify'}
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, transition: { duration: 0.1 } }}
          animate={{ opacity: 1, transition: { duration: 0.1 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
          <Outlet />
        </motion.div>
      </div>
    </div>
  )
}
