import { ReactNode } from 'react'

type EmptyStateProps = {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  className = '',
}: EmptyStateProps) {
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
