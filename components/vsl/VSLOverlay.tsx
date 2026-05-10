import Image from 'next/image'
import { PLAY_ICON } from '@/hooks/useInteractiveVSL'

type VSLOverlayProps = {
  showCenterPlay: boolean
  showResumePlay: boolean
  autoplayBlocked: boolean
  videoError: boolean
  onPrimaryPlay: () => void
  onResumeFromOverlay: () => void
}

export default function VSLOverlay({
  showCenterPlay,
  showResumePlay,
  autoplayBlocked,
  videoError,
  onPrimaryPlay,
  onResumeFromOverlay,
}: VSLOverlayProps) {
  return (
    <>
      {showCenterPlay && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center p-5">
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={onPrimaryPlay}
              className="pointer-events-auto group flex h-[78px] w-[78px] items-center justify-center rounded-full border border-white/18 bg-white/10 shadow-[0_0_0_12px_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_0_16px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] sm:h-[88px] sm:w-[88px]"
              aria-label="Play video with audio"
            >
              <Image
                src={PLAY_ICON}
                alt=""
                width={56}
                height={56}
                sizes="56px"
                className="drop-shadow-lg transition-transform duration-300 group-hover:scale-[1.03] sm:h-[68px] sm:w-[68px]"
              />
            </button>
          </div>
        </div>
      )}

      {showResumePlay && (
        <div
          className="absolute inset-0 z-[25] flex items-center justify-center p-5"
          onClick={onResumeFromOverlay}
          role="button"
          tabIndex={-1}
          aria-label="Resume video"
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation()
              onResumeFromOverlay()
            }}
            className="group flex h-[78px] w-[78px] items-center justify-center rounded-full border border-white/18 bg-white/10 shadow-[0_0_0_12px_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:shadow-[0_0_0_16px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] sm:h-[88px] sm:w-[88px]"
            aria-label="Resume video"
          >
            <Image
              src={PLAY_ICON}
              alt=""
              width={56}
              height={56}
              sizes="56px"
              className="drop-shadow-lg transition-transform duration-300 group-hover:scale-[1.03] sm:h-[68px] sm:w-[68px]"
            />
          </button>
        </div>
      )}

      {autoplayBlocked && !videoError && !showCenterPlay && (
        <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center p-5 text-center">
          <div className="max-w-[360px] rounded-[26px] border border-white/18 bg-black/42 p-5 text-white shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl">
            <button
              type="button"
              onClick={onPrimaryPlay}
              className="pointer-events-auto group mx-auto flex h-[78px] w-[78px] items-center justify-center rounded-full border border-white/18 bg-white/10 shadow-[0_0_0_12px_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)]"
              aria-label="Play video"
            >
              <Image
                src={PLAY_ICON}
                alt=""
                width={56}
                height={56}
                sizes="56px"
                className="drop-shadow-lg transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
