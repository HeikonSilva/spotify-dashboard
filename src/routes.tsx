import { Route, Routes, useLocation } from 'react-router'
import Musics from './pages/Musics'
import Home from './pages/Home'
import Layout from './components/Layout'
import { AnimatePresence } from 'motion/react'

export default function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="musics" element={<Musics />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
