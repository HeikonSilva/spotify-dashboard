import { Disc3, House } from 'lucide-react'
import { Outlet, NavLink } from 'react-router'
import SpotifyIcon from '/svgs/spotify_icon.svg'

export const items = [
  {
    name: 'Home',
    icon: <House />,
    url: '/',
  },
  {
    name: 'Musics',
    icon: <Disc3 />,
    url: '/musics',
  },
]

export default function Layout() {
  return (
    <div className="bg-b2 w-screen h-screen flex gap-2 p-2 flex-row">
      <div className=" w-1/4 p-2 flex flex-col gap-2 bg-b1 rounded-xl">
        <div className="flex flex-row gap-5 py-4 px-6 text-primary items-center rounded-2xl">
          <img src={SpotifyIcon} alt="Spotify Logo" width={32} height={32} />
          <h1 className="font-bold text-2xl">Spotify</h1>
        </div>
        {items.map((item) => (
          <NavLink to={item.url} key={item.name}>
            <div
              key={item.name}
              className="flex flex-row gap-5 py-4 px-6 text-b4 items-center hover:text-primary hover:bg-b3 transition-colors rounded-2xl cursor-pointer"
            >
              {item.icon}
              <h1 className="font-bold text-xl">{item.name}</h1>
            </div>
          </NavLink>
        ))}
      </div>
      <div className="w-3/4 p-2 flex flex-col gap-2 bg-b1 rounded-xl">
        <Outlet />
      </div>
    </div>
  )
}
