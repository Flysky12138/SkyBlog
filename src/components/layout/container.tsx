import { cn } from '@/lib/cn'

interface ContainerProps extends React.PropsWithChildren {
  className?: string
  variant?: 'header'
}

export const Container = ({ children, className, variant }: ContainerProps) => {
  return (
    <section
      className={cn(
        'container mx-auto max-w-screen-xl',
        {
          'px-4 sm:px-6 xl:px-20': variant != 'header',
          'px-8 sm:px-10 xl:px-6': variant == 'header'
        },
        className
      )}
    >
      {children}
    </section>
  )
}
