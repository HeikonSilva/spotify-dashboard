import { InfoIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
}

export function EmptyState({
  icon = <InfoIcon className="h-10 w-10 text-b4 mb-2" />,
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      {icon}
      <p className="text-b4">{title}</p>
      {description && <p className="text-sm text-b4/70 mt-1">{description}</p>}
    </div>
  )
}
