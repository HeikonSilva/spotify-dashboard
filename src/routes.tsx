import { Route, Routes, useLocation } from 'react-router'
import Home from './pages/Home'
import Layout from './components/Layout'
import { AnimatePresence } from 'motion/react'
import Login from './pages/Login'
import Callback from './pages/Callback'
import Profile from './pages/Profile'
import History from './pages/History'
import Player from './pages/Player'
import Search from './pages/Search'
import SearchArtists from './pages/SearchArtists'
import SearchAlbums from './pages/SearchAlbums'
import SearchTracks from './pages/SearchTracks'
import NotFound from './pages/NotFound'

export default function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="callback" element={<Callback />} />
          <Route path="profile" element={<Profile />} />
          <Route path="player" element={<Player />} />
          <Route path="history" element={<History />} />
          <Route path="search" element={<Search />} />
          <Route path="search/artists" element={<SearchArtists />} />
          <Route path="search/albums" element={<SearchAlbums />} />
          <Route path="search/tracks" element={<SearchTracks />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
