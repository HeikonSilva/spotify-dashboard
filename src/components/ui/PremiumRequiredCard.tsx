import { Music, Crown } from 'lucide-react'

type PremiumRequiredCardProps = {
  title?: string
  description?: string
  className?: string
}

export function PremiumRequiredCard({
  title = 'Requer Spotify Premium',
  description = 'A visualização da fila de reprodução está disponível apenas para contas Spotify Premium.',
  className = '',
}: PremiumRequiredCardProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center py-8 text-center ${className}`}
    >
      <div className="mb-2 flex items-center justify-center">
        <Crown className="h-8 w-8 text-yellow-400 mr-2" />
        <Music className="h-8 w-8 text-b4" />
      </div>
      <p className="text-b4 font-medium">{title}</p>
      <p className="text-sm text-b4/70 mt-1">{description}</p>
    </div>
  )
}
