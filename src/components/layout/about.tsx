import Link, { LinkProps } from 'next/link'

interface OuterLinkProps extends LinkProps, React.PropsWithChildren {}

const OuterLink: React.FC<OuterLinkProps> = ({ children, ...props }) => {
  return (
    <Link
      className="text-sky-500 decoration-wavy underline-offset-2 hover:underline"
      rel="noreferrer nofollow"
      tabIndex={-1}
      target="_blank"
      {...props}
    >
      {children}
    </Link>
  )
}

export const About = () => {
  return (
    <section className="flex select-none flex-col items-center gap-y-2 text-sm text-secondary-foreground/50">
      <span>©2020 - {new Date().getFullYear()} By Flysky</span>
      <div className="flex gap-x-1">
        <span>框架</span>
        <OuterLink href="https://nextjs.org/">Next.js</OuterLink>
        <span>|</span>
        <span>主题</span>
        <OuterLink href="https://www.shadcn.com.cn">Shadcn</OuterLink>
      </div>
      <span>Built by vercel on {new Date().toUTCString()}</span>
    </section>
  )
}
