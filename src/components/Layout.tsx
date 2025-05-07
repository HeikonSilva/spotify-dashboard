import { Disc3, House, LogIn, Search } from 'lucide-react'
import { Outlet, NavLink } from 'react-router'
import SpotifyIcon from '/svgs/spotify_icon.svg'
import { motion } from 'motion/react'

export const items = [
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
    name: 'Pesquisar',
    icon: <Search />,
    url: '/search',
  },
  {
    name: 'Login',
    icon: <LogIn />,
    url: '/login',
  },
]

export default function Layout() {
  const token = localStorage.getItem('access_token')

  console.log(token)
  return (
    <div className="bg-b2 w-screen h-screen flex gap-2 p-2 flex-row">
      <div className=" w-1/4 p-2 flex flex-col gap-2 bg-b1 rounded-xl">
        <div className="flex flex-row gap-5 py-4 px-6 text-sprimary items-center rounded-2xl">
          <img src={SpotifyIcon} alt="Spotify Logo" width={32} height={32} />
          <h1 className="font-bold text-2xl">Spotify</h1>
        </div>
        {items.map((item) => (
          <NavLink to={item.url} key={item.name}>
            <div
              key={item.name}
              className="flex flex-row gap-5 py-4 px-6 text-b4 items-center hover:text-white hover:bg-b3 transition-colors rounded-2xl cursor-pointer"
            >
              {item.icon}
              <h1 className="font-bold text-xl">{item.name}</h1>
            </div>
          </NavLink>
        ))}
      </div>
      <div className="text-white w-3/4 p-2 flex flex-col gap-2 bg-b1 rounded-xl">
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
