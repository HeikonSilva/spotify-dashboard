import { Route, Routes, useLocation } from 'react-router'
import Top from './pages/Musics'
import Home from './pages/Home'
import Layout from './components/Layout'
import { AnimatePresence } from 'motion/react'
import Login from './pages/Login'
import Callback from './pages/Callback'
import Profile from './pages/Profile'
import History from './pages/History'

export default function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="top" element={<Top />} />
          <Route path="login" element={<Login />} />
          <Route path="callback" element={<Callback />} />
          <Route path="profile" element={<Profile />} />
          <Route path="history" element={<History />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
