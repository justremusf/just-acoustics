'use client'

import * as React from 'react'
import { useRef, useState } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type AnimatedGenerateButtonProps = {
  className?: string
  labelIdle?: string
  labelActive?: string
  generating?: boolean
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  id?: string
  ariaLabel?: string
}

export default function AnimatedGenerateButton({
  className,
  labelIdle = 'Back to Home',
  labelActive = 'Routing...',
  generating = false,
  onClick,
  type = 'button',
  disabled = false,
  id,
  ariaLabel,
}: AnimatedGenerateButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect()
    
    // Magnetic pull: move the button towards the cursor within its bounds
    const x = (clientX - (left + width / 2)) * 0.4
    const y = (clientY - (top + height / 2)) * 0.4
    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div className={cn('relative inline-block', className)} id={id}>
      <button
        ref={buttonRef}
        type={type}
        aria-label={ariaLabel || (generating ? labelActive : labelIdle)}
        aria-pressed={generating}
        disabled={disabled}
        onClick={onClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'ui-anim-btn',
          'relative flex cursor-pointer select-none items-center justify-center',
          'animate-[button-float_4s_ease-in-out_infinite]',
          'rounded-full px-10 py-5',
          'bg-white text-[var(--color-dark-100)] font-bold text-[17px]',
          'border border-black/10',
          'shadow-[0_12px_24px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,1)_inset]',
          'transition-[box-shadow,border,background-color] duration-500 ease-out',
          'group overflow-hidden'
        )}
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: position.x === 0 ? 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)' : 'none',
          willChange: 'transform'
        }}
      >
        {/* Dynamic Glow Layer */}
        <div className="absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(255,165,0,0.2)_0%,transparent_70%)]" />

        <div 
          className="relative z-10 flex items-center transition-transform duration-300"
          style={{ transform: `translate3d(${position.x * 0.3}px, ${position.y * 0.3}px, 0)` }}
        >
          <svg
            className={cn(
              'ui-anim-btn-svg mr-3.5 h-6 w-6 flex-grow-0',
              'fill-[var(--color-brand-orange)]',
              'transition-[fill,filter,opacity] duration-300'
            )}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
            ></path>
          </svg>
          <div className="ui-anim-txt-wrapper relative flex min-w-[8em] items-center justify-center">
            <div
              className={cn(
                'ui-anim-txt-1 absolute flex w-full justify-center',
                generating ? 'opacity-0 scale-90 blur-sm' : 'opacity-100 scale-100 blur-0 transition-all duration-500'
              )}
            >
              {Array.from(labelIdle).map((ch, i) => (
                <span key={i} className="ui-anim-letter inline-block">
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </div>
            <div
              className={cn(
                'ui-anim-txt-2 absolute flex w-full justify-center',
                generating ? 'opacity-100 scale-100 blur-0 transition-all duration-500' : 'opacity-0 scale-110 blur-sm'
              )}
            >
              {Array.from(labelActive).map((ch, i) => (
                <span key={i} className="ui-anim-letter inline-block">
                  {ch === ' ' ? '\u00A0' : ch}
                </span>
              ))}
            </div>
          </div>
        </div>
      </button>
      <style jsx>{`
        .ui-anim-btn {
          --radius: 100px;
          --transition: 0.5s;
          --highlight: var(--color-brand-orange);
        }

        .ui-anim-btn::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          background-image: linear-gradient(90deg, 
            transparent, 
            rgba(255, 165, 0, 0.1), 
            rgba(255, 255, 255, 0.6),
            rgba(255, 165, 0, 0.1),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 2.5s infinite linear;
          opacity: 1;
        }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        @keyframes button-float {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50% { transform: translate3d(0, -8px, 0); }
        }

        .ui-anim-letter {
          color: var(--color-dark-100);
          animation: ui-letter-anim 3s ease-in-out infinite;
        }

        @keyframes ui-letter-anim {
          0%, 100% { transform: translateY(0); opacity: 1; filter: blur(0px); }
          50% { transform: translateY(-3px); opacity: 0.6; filter: blur(0.5px); }
        }

        .ui-anim-btn:hover {
          background-color: #ffffff;
          border-color: rgba(0,0,0,0.2);
          box-shadow: 0 20px 45px rgba(0,0,0,0.12), 0 1px 0 rgba(255,255,255,1) inset;
        }
        
        .ui-anim-btn:active {
          transform: scale(0.94) !important;
          background-color: #f5f5f5;
          transition: transform 0.1s ease-out;
        }

        /* Letter stagger delays */
        ${Array.from({ length: 15 }).map((_, i) => `
          .ui-anim-letter:nth-child(${i + 1}) { animation-delay: ${i * 0.06}s; }
        `).join('')}
      `}</style>
    </div>
  )
}
