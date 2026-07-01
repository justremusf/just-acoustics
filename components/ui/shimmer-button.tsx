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
        'inline-flex min-h-[54px] animate-[shimmer2_2.5s_infinite_linear] items-center justify-center rounded-[100px] border border-[#e58f00] bg-[linear-gradient(110deg,#ffa500,40%,#ffd064,50%,#ffa500)] bg-[length:200%_100%] px-8 font-semibold text-white shadow-[0_12px_28px_rgba(255,165,0,0.24),0_1px_0_rgba(255,255,255,0.78)_inset,0_0_0_1px_rgba(255,255,255,0.34)_inset] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.025] hover:border-[#d88400] hover:shadow-[0_0_24px_6px_rgba(255,165,0,0.42),0_1px_0_rgba(255,255,255,0.88)_inset] active:scale-[0.985] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
