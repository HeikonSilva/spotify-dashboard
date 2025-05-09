import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface TopItemsListProps {
  title: string
  items: Array<{
    id: string
    name: string
    imageUrl?: string
    subtitle?: string
    index: number
  }>
  loading?: boolean
  error?: string | null
}

export function TopItemsList({
  title,
  items,
  loading,
  error,
}: TopItemsListProps) {
  if (loading) {
    return (
      <Card className="bg-b1 border-b3/30">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <Skeleton className="h-10 w-10 bg-b3/30 rounded" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Skeleton className="h-4 w-3/4 bg-b3/30" />
                    <Skeleton className="h-3 w-1/2 bg-b3/30" />
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-b1 border-b3/30">
        <CardHeader>
          <CardTitle className="text-white">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-400">Erro ao carregar dados: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-b1 border-b3/30">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="flex items-center justify-center w-6 text-b4">
                {item.index}.
              </div>
              {item.imageUrl && (
                <div className="flex-shrink-0 w-10 h-10 bg-b3/30 rounded overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    'font-medium truncate',
                    item.subtitle ? 'text-white' : 'text-b4'
                  )}
                >
                  {item.name}
                </p>
                {item.subtitle && (
                  <p className="text-sm text-b4 truncate">{item.subtitle}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
