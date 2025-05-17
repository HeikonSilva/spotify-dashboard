import type { ReactNode } from 'react'

type NotAuthenticatedCardProps = {
  icon?: ReactNode
  title?: string
  description?: string
  className?: string
}

export function NotAuthenticatedCard({
  icon = (
    <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="#888" strokeWidth="2" />
      <path
        d="M9 10a3 3 0 1 1 6 0v2a3 3 0 1 1-6 0v-2z"
        stroke="#888"
        strokeWidth="2"
      />
      <path
        d="M12 17h.01"
        stroke="#888"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ),
  title = 'Você não está autenticado',
  description = 'Faça login para acessar esta página.',
  className = '',
}: NotAuthenticatedCardProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-8 text-center ${className}`}
    >
      <div className="text-b4 mb-2">{icon}</div>
      <p className="text-b4 font-medium">{title}</p>
      <p className="text-sm text-b4/70 mt-1">{description}</p>
    </div>
  )
}
