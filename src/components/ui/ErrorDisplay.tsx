import { AlertCircle } from 'lucide-react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

interface ErrorDisplayProps {
  title?: string
  message: string
}

export function ErrorDisplay({ title = 'Erro', message }: ErrorDisplayProps) {
  return (
    <Alert variant="destructive" className="bg-red-900/20 border-red-800">
      <AlertCircle className="h-4 w-4 text-red-400" />
      <AlertTitle className="text-red-400">{title}</AlertTitle>
      <AlertDescription className="text-red-100/80">{message}</AlertDescription>
    </Alert>
  )
}
