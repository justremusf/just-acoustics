'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: (() => void) | undefined
  }
}

export default function StudioBeforeAfter() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [track, setTrack] = useState<'before' | 'after'>('before')
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(20) // 20s total loop track matching 0:20 in mockup
  const [apiReady, setApiReady] = useState(false)
  const playerRef = useRef<any>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const videoId = '8DURhlYt3wQ'
  
  // Custom segment loop timestamps
  const segments = {
    before: { start: 2, end: 22 },
    after: { start: 25, end: 45 },
  }

  // Load YouTube Player API
  useEffect(() => {
    if (window.YT && window.YT.Player) {
      setApiReady(true)
      return
    }

    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true)
    }

    return () => {
      window.onYouTubeIframeAPIReady = undefined
    }
  }, [])

  // Initialize YT Player
  useEffect(() => {
    if (!apiReady || playerRef.current) return

    playerRef.current = new window.YT.Player('yt-bg-player-rebuild', {
      height: '1',
      width: '1',
      videoId: videoId,
      playerVars: {
        autoplay: 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        playsinline: 1,
      },
      events: {
        onReady: () => {
          playerRef.current.seekTo(segments.before.start, true)
          playerRef.current.pauseVideo()
        },
        onStateChange: (event: any) => {
          if (event.data === 1) {
            setIsPlaying(true)
            startProgressTracker()
          } else {
            setIsPlaying(false)
            stopProgressTracker()
          }
        },
      },
    })

    return () => {
      stopProgressTracker()
      if (playerRef.current?.destroy) {
        playerRef.current.destroy()
        playerRef.current = null
      }
    }
  }, [apiReady])

  const startProgressTracker = () => {
    stopProgressTracker()
    intervalRef.current = setInterval(() => {
      if (!playerRef.current || typeof playerRef.current.getCurrentTime !== 'function') return

      const curr = playerRef.current.getCurrentTime()
      const currentSegment = segments[track]

      if (curr < currentSegment.start || curr >= currentSegment.end) {
        playerRef.current.seekTo(currentSegment.start, true)
        setCurrentTime(0)
      } else {
        setCurrentTime(curr - currentSegment.start)
      }
    }, 100)
  }

  const stopProgressTracker = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  const togglePlay = () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      const currentSegment = segments[track]
      playerRef.current.seekTo(currentSegment.start + currentTime, true)
      playerRef.current.playVideo()
    }
  }

  const handleTrackChange = (newTrack: 'before' | 'after') => {
    if (newTrack === track) return

    setTrack(newTrack)
    
    if (playerRef.current) {
      const targetTime = segments[newTrack].start + currentTime
      playerRef.current.seekTo(targetTime, true)
      if (!isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    }
  }

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60)
    const secs = Math.floor(time % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  return (
    <section id="audio-player" className="px-4 py-12 md:px-12 bg-[#faf9f6]">
      <div className="mx-auto max-w-[1200px]">
        
        {/* hidden frame */}
        <div id="yt-bg-player-rebuild" className="hidden" />

        {/* Rebuilt Layout: Left player card, Right side-by-side images */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.9fr] gap-8 items-start">
          
          {/* Left Player block */}
          <div className="flex flex-col gap-6">
            
            {/* Left Header */}
            <div className="text-left">
              <h2 
                className="text-2xl sm:text-[28px] font-bold text-[#0a0a0a] leading-tight" 
                style={{ fontFamily: 'var(--font-heading)', letterSpacing: '-0.5px' }}
              >
                Hear the difference <br />
                before you book.
              </h2>
              <p className="text-xs text-black/50 font-semibold mt-2">
                Same room. Same mic. Only the acoustics changed.
              </p>
            </div>

            {/* Before/After Selector */}
            <div className="flex gap-1.5 rounded-xl bg-black/5 p-1 w-fit">
              <button
                onClick={() => handleTrackChange('before')}
                className={`rounded-lg px-6 py-2 text-xs font-bold tracking-wide transition-all duration-300 ${
                  track === 'before'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-black/60 hover:text-black hover:bg-white/40'
                }`}
              >
                Before
              </button>
              <button
                onClick={() => handleTrackChange('after')}
                className={`rounded-lg px-6 py-2 text-xs font-bold tracking-wide transition-all duration-300 ${
                  track === 'after'
                    ? 'bg-[var(--color-brand-orange)] text-black shadow-sm'
                    : 'text-black/60 hover:text-black hover:bg-white/40'
                }`}
              >
                After
              </button>
            </div>

            {/* Player Card UI */}
            <div className="glass-card flex flex-col justify-between rounded-[24px] border border-black/8 bg-white/70 p-5 shadow-[0_16px_36px_rgba(0,0,0,0.03)] backdrop-blur-xl">
              <div>
                
                {/* Horizontal Player Row */}
                <div className="flex items-center gap-4">
                  
                  {/* Play circle */}
                  <button
                    onClick={togglePlay}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white hover:scale-105 transition shrink-0 shadow-md"
                    aria-label={isPlaying ? 'Pause' : 'Play before/after'}
                  >
                    {isPlaying ? (
                      <span className="text-sm font-black">❚❚</span>
                    ) : (
                      <span className="text-xl ml-1">▶</span>
                    )}
                  </button>

                  {/* Waveform bars */}
                  <div className="flex-1 flex flex-col justify-between h-14">
                    <div className="flex items-center gap-0.5 justify-between h-10 w-full opacity-80">
                      {Array.from({ length: 36 }).map((_, idx) => {
                        const progressRatio = currentTime / duration
                        const barIndexRatio = idx / 36
                        const isActive = barIndexRatio <= progressRatio
                        
                        const baseHeight = 15 + Math.sin(idx * 0.5) * 35 + Math.cos(idx * 0.3) * 10
                        const height = Math.max(10, Math.min(80, baseHeight))
                        
                        let bgClass = 'bg-black/10'
                        if (isActive) {
                          bgClass = track === 'before' ? 'bg-amber-600' : 'bg-[var(--color-brand-orange)]'
                        }

                        return (
                          <div
                            key={idx}
                            className={`w-[2.5px] rounded-full transition-all duration-200 ${bgClass}`}
                            style={{ height: `${height}%` }}
                          />
                        )
                      })}
                    </div>
                    {/* Timer right-aligned */}
                    <span className="text-[9px] text-black/50 font-bold self-end leading-none">
                      {formatTime(currentTime)} / 0:20
                    </span>
                  </div>

                </div>

              </div>

              {/* Headphone and voice details row */}
              <div className="mt-5 pt-3 border-t border-black/5 flex items-center justify-between text-[10px] text-black/50 font-bold">
                <span className="flex items-center gap-1.5">
                  <span>🎧</span> Best experienced with headphones
                </span>
                <span className="uppercase text-[var(--color-brand-orange-dark)]">
                  Voice • Male Vocal (Dry)
                </span>
              </div>

            </div>

          </div>

          {/* Right side-by-side images */}
          <div className="grid grid-cols-2 gap-4 items-stretch h-full min-h-[300px]">
            
            {/* Before */}
            <div className="relative rounded-[24px] overflow-hidden border border-black/8 shadow-md min-h-[280px]">
              <Image
                src="/assets/webflow/696a4efbb798931f99abbc38_1.avif"
                alt="Before"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
              <span className="absolute top-4 left-4 z-10 rounded-full bg-white/90 border border-black/5 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-black shadow-sm">
                Before
              </span>
            </div>

            {/* After */}
            <div className="relative rounded-[24px] overflow-hidden border border-black/8 shadow-md min-h-[280px]">
              <Image
                src="/assets/webflow/696a4efb255645d4686056e2_7.png"
                alt="After"
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
              <span className="absolute top-4 left-4 z-10 rounded-full bg-[var(--color-brand-orange)] border border-orange-500/10 px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-black shadow-sm">
                After
              </span>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}
