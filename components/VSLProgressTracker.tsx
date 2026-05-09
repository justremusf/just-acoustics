import type { RefObject } from 'react'
import type { VSLCheckpoint } from '@/data/vslConfig'

type VSLProgressTrackerProps = {
  checkpoints: VSLCheckpoint[]
  progress: number
  elapsedLabel: string
  totalLabel: string
  onSeek: (progress: number) => void
  showCheckpoints?: boolean
  showProgressFill?: boolean
  progressFillRef?: RefObject<HTMLDivElement | null>
}

const progressFillStyle = {
  transform: 'translate3d(0, 0, 0) scaleX(var(--vsl-progress, 0))',
}

export default function VSLProgressTracker({
  checkpoints,
  progress,
  elapsedLabel,
  totalLabel,
  onSeek,
  showCheckpoints = true,
  showProgressFill = true,
  progressFillRef,
}: VSLProgressTrackerProps) {
  const safeProgress = Math.min(Math.max(progress, 0), 1)
  const handleSeek = (clientX: number, track: HTMLDivElement) => {
    const rect = track.getBoundingClientRect()
    const nextProgress = (clientX - rect.left) / rect.width
    onSeek(Math.min(Math.max(nextProgress, 0), 1))
  }

  return (
    <div className="absolute inset-x-0 top-0 z-40 px-0">
      <div
        className="group relative h-2 cursor-pointer touch-none overflow-visible rounded-t-[24px] bg-black/24 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:h-2.5"
        role="slider"
        aria-label="Video progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(safeProgress * 100)}
        tabIndex={0}
        onClick={(event) => handleSeek(event.clientX, event.currentTarget)}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          handleSeek(event.clientX, event.currentTarget)
        }}
        onPointerMove={(event) => {
          if (!event.currentTarget.hasPointerCapture(event.pointerId)) return
          handleSeek(event.clientX, event.currentTarget)
        }}
        onPointerUp={(event) => {
          if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId)
          }
        }}
        onKeyDown={(event) => {
          if (event.key === 'Home') {
            event.preventDefault()
            onSeek(0)
            return
          }

          if (event.key === 'End') {
            event.preventDefault()
            onSeek(1)
            return
          }

          if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return
          event.preventDefault()
          const direction = event.key === 'ArrowRight' ? 1 : -1
          onSeek(safeProgress + direction * 0.05)
        }}
      >
        <div
          ref={progressFillRef}
          className={[
            'h-full w-full origin-left rounded-tr-full bg-[linear-gradient(90deg,#ffa500,#ffcc55)] will-change-transform',
            showProgressFill ? 'opacity-100' : 'opacity-0',
          ].join(' ')}
          style={progressFillStyle}
        />
        <div className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] z-10 -translate-x-1/2 rounded-full border border-white/14 bg-black/70 px-3 py-1.5 text-[11px] font-semibold text-white opacity-0 shadow-[0_12px_28px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-opacity duration-150 group-hover:opacity-100">
          {elapsedLabel} / {totalLabel}
        </div>
        {showCheckpoints &&
          checkpoints.map((checkpoint) => {
            const reached = safeProgress >= checkpoint.at

            return (
              <span
                key={checkpoint.label}
                className={[
                  'absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border transition-colors duration-300 sm:h-3.5 sm:w-3.5',
                  reached
                    ? 'border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)] shadow-[0_0_16px_rgba(255,165,0,0.62)]'
                    : 'border-white/46 bg-white/48',
                ].join(' ')}
                style={{ left: `${checkpoint.at * 100}%` }}
                aria-hidden="true"
              />
            )
          })}
      </div>
    </div>
  )
}
