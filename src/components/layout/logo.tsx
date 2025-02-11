export const Logo = () => {
  return (
    <span className="select-none whitespace-nowrap bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text font-title text-lg font-semibold text-transparent">
      {process.env.NEXT_PUBLIC_TITLE}
    </span>
  )
}
