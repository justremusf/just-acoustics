import { useEffect } from 'react'
import type { PlaybackSpeed } from '@/hooks/useInteractiveVSL'
import { speedOptions } from '@/hooks/useInteractiveVSL'

export function SpeakerIcon({ muted = false }: { muted?: boolean }) {
  return muted ? (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M10 5.5 6.7 8H4c-.6 0-1 .4-1 1v6c0 .6.4 1 1 1h2.7L10 18.5c.7.5 1.7 0 1.7-.9V6.4c0-.9-1-1.4-1.7-.9Zm8.7 2.2c-.4-.4-1-.4-1.4 0L16 9l-1.3-1.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4L14.6 10l-1.3 1.3c-.4.4-.4 1 0 1.4s1 .4 1.4 0L16 11.4l1.3 1.3c.4.4 1 .4 1.4 0s.4-1 0-1.4L17.4 10l1.3-1.3c.4-.4.4-1 0-1.4Z" />
    </svg>
  ) : (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M10 5.5 6.7 8H4c-.6 0-1 .4-1 1v6c0 .6.4 1 1 1h2.7L10 18.5c.7.5 1.7 0 1.7-.9V6.4c0-.9-1-1.4-1.7-.9Zm5.3 2.2c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4c1.1 1.1 1.1 2.9 0 4-.4.4-.4 1 0 1.4s1 .4 1.4 0c1.9-1.9 1.9-5 0-6.8Z" />
    </svg>
  )
}

export function FullscreenIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M8 3H4.5A1.5 1.5 0 0 0 3 4.5V8h2V5h3V3Zm13 5V4.5A1.5 1.5 0 0 0 19.5 3H16v2h3v3h2ZM5 16H3v3.5A1.5 1.5 0 0 0 4.5 21H8v-2H5v-3Zm16 0v3h-3v2h3.5A1.5 1.5 0 0 0 23 19.5V16h-2Z" />
    </svg>
  )
}

export function SpeedIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M12 5a7 7 0 1 0 7 7 7.01 7.01 0 0 0-7-7Zm.75 3.25V12c0 .2-.08.39-.22.53l-2 2-1.06-1.06 1.78-1.78V8.25h1.5Z" />
    </svg>
  )
}

type VSLControlsProps = {
  speedMenuRef: React.RefObject<HTMLDivElement | null>
  speedButtonRef: React.RefObject<HTMLButtonElement | null>
  showSpeedMenu: boolean
  setShowSpeedMenu: React.Dispatch<React.SetStateAction<boolean>>
  playbackRate: PlaybackSpeed
  setPlaybackRate: (speed: PlaybackSpeed) => void
  isMuted: boolean
  onToggleMute: () => void
  fullscreenActive: boolean
  onToggleFullscreen: () => void
}

export default function VSLControls({
  speedMenuRef,
  speedButtonRef,
  showSpeedMenu,
  setShowSpeedMenu,
  playbackRate,
  setPlaybackRate,
  isMuted,
  onToggleMute,
  fullscreenActive,
  onToggleFullscreen,
}: VSLControlsProps) {
  useEffect(() => {
    if (!showSpeedMenu) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target) return

      if (speedMenuRef.current?.contains(target) || speedButtonRef.current?.contains(target)) return
      setShowSpeedMenu(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [showSpeedMenu, setShowSpeedMenu, speedButtonRef, speedMenuRef])

  return (
    <div className="absolute inset-x-3 top-5 z-50 flex items-start justify-between gap-2 sm:inset-x-4 sm:top-9">
      <div ref={speedMenuRef} className="relative">
        <button
          ref={speedButtonRef}
          type="button"
          onClick={() => setShowSpeedMenu((previous) => !previous)}
          className="inline-flex h-[42px] items-center gap-1.5 rounded-[14px] border border-white/18 bg-black/30 px-2.5 text-[12px] font-semibold text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-200 hover:bg-black/42 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] sm:h-11 sm:rounded-[16px] sm:px-3"
          aria-expanded={showSpeedMenu}
          aria-haspopup="menu"
          aria-label={`Playback speed ${playbackRate}x`}
        >
          <SpeedIcon />
          <span>{playbackRate}x</span>
        </button>

        {showSpeedMenu && (
          <div className="absolute left-0 top-[calc(100%+10px)] z-40 w-28 overflow-hidden rounded-[18px] border border-white/16 bg-black/42 p-1.5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl">
            {speedOptions.map((speed) => {
              const selected = playbackRate === speed
              return (
                <button
                  key={speed}
                  type="button"
                  onClick={() => {
                    setPlaybackRate(speed)
                    setShowSpeedMenu(false)
                  }}
                  className={[
                    'flex w-full items-center justify-center rounded-[12px] px-3 py-2.5 text-center text-[13px] font-semibold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)]',
                    selected
                      ? 'bg-white text-[var(--color-dark-100)]'
                      : 'text-white/84 hover:bg-white/10',
                  ].join(' ')}
                  role="menuitemradio"
                  aria-checked={selected}
                >
                  <span>{speed}x</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={onToggleMute}
          className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-white/18 bg-black/30 text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-200 hover:bg-black/42 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] sm:h-11 sm:w-11 sm:rounded-[16px]"
          aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          aria-pressed={!isMuted}
        >
          <SpeakerIcon muted={isMuted} />
        </button>

        <button
          type="button"
          onClick={onToggleFullscreen}
          className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-white/18 bg-black/30 text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-200 hover:bg-black/42 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] sm:h-11 sm:w-11 sm:rounded-[16px]"
          aria-label={fullscreenActive ? 'Exit fullscreen' : 'Enter fullscreen'}
          aria-pressed={fullscreenActive}
        >
          <FullscreenIcon />
        </button>
      </div>
    </div>
  )
}
