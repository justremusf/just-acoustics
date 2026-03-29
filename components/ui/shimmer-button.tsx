'use client'

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: unknown[]) {
  return twMerge(clsx(inputs))
}

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  className?: string
}

export default function ShimmerButton({
  children = 'Shimmer',
  className,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-12 animate-[shimmer2_2.5s_infinite_linear] items-center justify-center rounded-[100px] border border-white/20 bg-[linear-gradient(110deg,#ffa500,40%,#ffcc55,50%,#ffa500)] bg-[length:200%_100%] px-8 font-medium text-white transition-all duration-200 ease-out hover:scale-[1.04] hover:shadow-[0_0_24px_6px_rgba(255,165,0,0.55)] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
