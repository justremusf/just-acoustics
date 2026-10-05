interface FadeUpProps {
  children: React.ReactNode
  delay?: number
  className?: string
}

export default function FadeUp({ children, className = '' }: FadeUpProps) {
  // This wrapper is already visible in server HTML. SitePageReveal owns the
  // entrance animation; a second observer here only repeats a no-op class write.
  return (
    <div className={`fade-up visible ${className}`}>
      {children}
    </div>
  )
}
