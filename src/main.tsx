import { HashRouter } from 'react-router'
import { createRoot } from 'react-dom/client'
import './index.css'
import AnimatedRoutes from './routes'

createRoot(document.getElementById('root')!).render(
  <HashRouter>
    <AnimatedRoutes />
  </HashRouter>
)
