import { BrowserRouter } from 'react-router'
import { createRoot } from 'react-dom/client'
import './index.css'
import AnimatedRoutes from './routes'
import { AuthProvider } from './contexts/AuthContext'
import { PremiumProvider } from '@/contexts/PremiumContext'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <PremiumProvider>
        <AnimatedRoutes />
      </PremiumProvider>
    </AuthProvider>
  </BrowserRouter>
)
