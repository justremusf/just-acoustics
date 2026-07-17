'use client'

import { usePathname } from 'next/navigation'

export default function SiteShell({
  children,
  defaultShell,
}: {
  children: React.ReactNode
  defaultShell: React.ReactNode
}) {
  const pathname = usePathname()
  const isStandalone = pathname.startsWith('/link') || pathname.startsWith('/proposals/')

  if (isStandalone) return <>{children}</>

  return <>{defaultShell}</>
}
