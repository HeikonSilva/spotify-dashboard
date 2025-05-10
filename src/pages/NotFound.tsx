import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'motion/react'
import { AlertOctagon, Home, Search, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="max-w-lg mx-auto w-full"
    >
      <Card className="bg-b1/80 text-white border-b3/30 overflow-hidden backdrop-blur-md shadow-lg">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/80 via-orange-400/80 to-yellow-300/80" />
        <CardHeader className="relative z-10">
          <CardTitle className="text-white flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-red-400" />
            Página não encontrada
          </CardTitle>
        </CardHeader>

        {/* Glass effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-b1/5 via-b2/10 to-b1/20 z-0 pointer-events-none" />

        <CardContent className="flex flex-col items-center py-10 px-4 relative z-10">
          <div className="relative mb-8">
            <div className="text-[10rem] font-bold text-b3/20 select-none">
              404
            </div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
              transition={{
                duration: 1,
                delay: 0.5,
                times: [0, 0.2, 0.4, 0.6, 0.8, 1],
              }}
            >
              <AlertOctagon className="h-20 w-20 text-red-400/80" />
            </motion.div>
          </div>

          <p className="text-lg font-medium text-center mb-2 text-white">
            Parece que esta página não existe ou foi movida
          </p>
          <p className="text-b4 text-center mb-8">
            O endereço que você está tentando acessar não foi encontrado em
            nossos servidores.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-md">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="bg-b3/90 border-b3/30 hover:text-white text-zinc-300 hover:bg-b3/20 transition-all backdrop-blur-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <Button
              onClick={() => navigate('/')}
              className="bg-sprimary hover:bg-sprimary/90 text-black font-medium hover:text-white transition-all shadow-md shadow-sprimary/20"
            >
              <Home className="h-4 w-4 mr-2" />
              Início
            </Button>
            <Button
              onClick={() => navigate('/search')}
              variant="outline"
              className="bg-b3/90 border-b3/30 hover:text-white text-zinc-300 hover:bg-b3/20 transition-all backdrop-blur-sm"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
