import { BrowserRouter, Route, Routes } from 'react-router'
import { createRoot } from 'react-dom/client'
import Layout from './components/Layout'
import './index.css'
import Musics from './pages/Musics'
import Home from './pages/Home'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="musics" element={<Musics />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
