import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

type PageLoaderProps = {
  cardCount?: number
}

export function PageLoader({ cardCount = 3 }: PageLoaderProps) {
  return (
    <div className="w-full space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: cardCount }, (_, i) => (
          <Card key={i} className="bg-b1 border-b3/30">
            <CardHeader className="pb-2">
              <Skeleton className="h-5 w-3/4 bg-b3/30" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-1/2 bg-b3/30" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="bg-b1 border-b3/30">
        <CardHeader>
          <Skeleton className="h-6 w-1/4 bg-b3/30" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[250px] w-full bg-b3/30" />
        </CardContent>
      </Card>
    </div>
  )
}
