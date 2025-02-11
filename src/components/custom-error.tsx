import { cn } from '@/lib/cn'
import { Refresh } from '@mui/icons-material'
import { IconButton } from '@mui/joy'
import { Card } from './layout/card'

interface CustomErrorProps extends ErrorRouteProps {
  className?: string
}

export const CustomError = ({ error, reset, className }: CustomErrorProps) => {
  return (
    <Card className={cn('absolute inset-0 flex flex-col items-center justify-center px-3 py-5 text-center', className)} component="section">
      <p className="text-lg">Something went wrong!</p>
      <p className="mb-8 mt-5 text-sm text-slate-500">{error.message}</p>
      <IconButton variant="soft" onClick={reset}>
        <Refresh />
      </IconButton>
    </Card>
  )
}
