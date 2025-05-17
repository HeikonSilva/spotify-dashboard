import { useAuth } from '@/contexts/AuthContext'
import { Outlet } from 'react-router'
import { NotAuthenticatedCard } from './ui/NotAuthenticatedCard'

export default function PrivateRoute({
  children,
}: {
  children?: React.ReactNode
}) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <NotAuthenticatedCard />
  }

  return children ? <>{children}</> : <Outlet />
}
