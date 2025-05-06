import { Route, Routes, useLocation } from 'react-router'
import Musics from './pages/Musics'
import Home from './pages/Home'
import Layout from './components/Layout'
import { AnimatePresence } from 'motion/react'
import Search from './pages/Search'
import Login from './pages/Login'
import Callback from './pages/Callback'

export default function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="musics" element={<Musics />} />
          <Route path="search" element={<Search />} />
          <Route path="login" element={<Login />} />
          <Route path="callback" element={<Callback />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
