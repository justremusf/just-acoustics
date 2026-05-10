'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import AnimatedGenerateButton from '@/components/ui/AnimatedGenerateButton'

export default function NotFound() {
  const router = useRouter()
  const [isRouting, setIsRouting] = useState(false)

  const handleRouteHome = () => {
    setIsRouting(true)
    setTimeout(() => {
      router.push('/')
    }, 600)
  }

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-white px-5 py-20">
      {/* Animated Background Orbs (Restored) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute left-[-10%] top-[10%] h-[600px] w-[600px] animate-[spin_30s_linear_infinite] rounded-full bg-[var(--color-brand-orange)] opacity-15 blur-[140px]" />
        <div className="absolute right-[-5%] top-[20%] h-[500px] w-[500px] animate-[spin_35s_linear_infinite_reverse] rounded-full bg-orange-300 opacity-20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[15%] h-[700px] w-[700px] animate-[pulse_12s_ease-in-out_infinite] rounded-full bg-amber-100 opacity-25 blur-[160px]" />
        <div className="absolute top-[30%] left-[40%] h-[400px] w-[400px] animate-[pulse_15s_ease-in-out_infinite] rounded-full bg-white opacity-40 blur-[100px]" />
      </div>

      {/* Static Subtle Gradient Overlay */}
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(255,255,255,0.7)_85%)]" />

      {/* Main Floating Glass Card (Proper Floating, No Mouse Follow) */}
      <div 
        className="animate-[card-float_6s_ease-in-out_infinite] relative z-10 flex w-full max-w-2xl flex-col items-center rounded-[48px] border border-black/5 bg-white/60 p-12 text-center shadow-[0_40px_100px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,1)_inset] backdrop-blur-[40px] sm:p-16"
      >
        <div className="relative">
          <h1 
            className="m-0 bg-gradient-to-b from-[var(--color-dark-100)] to-black/30 bg-clip-text text-[clamp(120px,18vw,240px)] font-bold leading-none text-transparent"
            style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.06em' }}
          >
            404
          </h1>
          <div className="absolute inset-0 -z-10 blur-3xl bg-[var(--color-brand-orange)] opacity-10 rounded-full scale-75" />
        </div>
        
        <p className="mt-6 text-[clamp(24px,4vw,32px)] font-bold tracking-tight text-[var(--color-dark-100)]">
          This page doesn't exist.
        </p>
        
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-[var(--color-gray-100)] opacity-80">
          Looks like the sound waves got lost in the void. Let's treat your space before the echo gets too bad.
        </p>

        <div className="mt-14 flex w-full flex-col items-center justify-center">
          <AnimatedGenerateButton 
            labelIdle="Back to Home"
            labelActive="Routing..."
            generating={isRouting}
            onClick={handleRouteHome}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes card-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  )
}
