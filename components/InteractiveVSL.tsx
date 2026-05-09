'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { trackEvent } from '@/components/analytics/trackEvent'
import type { InteractiveVSLConfig, VSLCategory, VSLCheckpoint } from '@/data/vslConfig'
import VSLCardGrid from '@/components/VSLCardGrid'
import VSLProgressTracker from '@/components/VSLProgressTracker'

type InteractiveVSLProps = {
  config: InteractiveVSLConfig
  pageLocation: string
  compact?: boolean
}

type PlaybackSpeed = 1 | 1.5 | 2
type WebkitFullscreenVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void
  webkitExitFullscreen?: () => void
  webkitDisplayingFullscreen?: boolean
}

type FullscreenCapableElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
  msRequestFullscreen?: () => Promise<void> | void
}

const introCheckpoints: VSLCheckpoint[] = [
  { label: 'Choose space type', at: 1 },
]

const speedOptions: PlaybackSpeed[] = [1, 1.5, 2]
const PLAY_ICON = '/assets/webflow/6967a0f62bd9b7dce9e01040_Play%20icon.png'

function getProgressTransform(progress: number) {
  const safeProgress = Math.min(Math.max(progress, 0), 1)
  return `translate3d(0, 0, 0) scaleX(${safeProgress})`
}

function getProgressValue(progress: number) {
  return String(Math.min(Math.max(progress, 0), 1))
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return '00:00'

  const rounded = Math.floor(value)
  const hours = Math.floor(rounded / 3600)
  const minutes = Math.floor((rounded % 3600) / 60)
  const seconds = rounded % 60

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function SpeakerIcon({ muted = false }: { muted?: boolean }) {
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

function FullscreenIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M8 3H4.5A1.5 1.5 0 0 0 3 4.5V8h2V5h3V3Zm13 5V4.5A1.5 1.5 0 0 0 19.5 3H16v2h3v3h2ZM5 16H3v3.5A1.5 1.5 0 0 0 4.5 21H8v-2H5v-3Zm16 0v3h-3v2h3.5A1.5 1.5 0 0 0 23 19.5V16h-2Z" />
    </svg>
  )
}

function SpeedIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M12 5a7 7 0 1 0 7 7 7.01 7.01 0 0 0-7-7Zm.75 3.25V12c0 .2-.08.39-.22.53l-2 2-1.06-1.06 1.78-1.78V8.25h1.5Z" />
    </svg>
  )
}

export default function InteractiveVSL({ config, pageLocation, compact = false }: InteractiveVSLProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const speedMenuRef = useRef<HTMLDivElement>(null)
  const speedButtonRef = useRef<HTMLButtonElement>(null)
  const muteRef = useRef(true)
  const progressLoopRef = useRef<number | null>(null)
  const progressAnimationRef = useRef<Animation | null>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const lastProgressStateUpdateRef = useRef(0)
  const progressClockRef = useRef({
    mediaTime: 0,
    wallTime: 0,
  })

  const [selectedCategory, setSelectedCategory] = useState<VSLCategory | null>(null)
  const [showSelector, setShowSelector] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const [videoError, setVideoError] = useState(false)
  const [isSwitching, setIsSwitching] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasStartedWithAudio, setHasStartedWithAudio] = useState(false)
  const [progress, setProgress] = useState(0)
  const [showFinalCta, setShowFinalCta] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [playbackRate, setPlaybackRate] = useState<PlaybackSpeed>(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isPseudoFullscreen, setIsPseudoFullscreen] = useState(false)

  const activeVideo = selectedCategory ?? config.intro
  const activeCheckpoints = selectedCategory?.checkpoints ?? introCheckpoints
  const sourceKey = selectedCategory ? selectedCategory.id : 'intro'
  const formattedElapsed = formatTime(currentTime)
  const formattedTotal = formatTime(duration)
  const progressForTracker = progress
  const showInitialPlay = !videoError && !selectedCategory && !hasStartedWithAudio
  const showCenterPlay =
    !isPlaying && (showInitialPlay || (!videoError && autoplayBlocked && !showSelector && !showFinalCta))
  const showResumePlay =
    !videoError && !showCenterPlay && !showSelector && !showFinalCta && !isPlaying && currentTime > 0.1
  const fullscreenActive = isFullscreen || isPseudoFullscreen

  const applyMuteState = useCallback((muted: boolean) => {
    setIsMuted(muted)
    muteRef.current = muted

    const video = videoRef.current
    if (!video) return

    video.muted = muted
    video.volume = muted ? 0 : 1
  }, [])

  const syncVideoState = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = isMuted
    video.volume = isMuted ? 0 : 1
    video.playbackRate = playbackRate
  }, [isMuted, playbackRate])

  const stopProgressAnimation = useCallback(() => {
    progressAnimationRef.current?.cancel()
    progressAnimationRef.current = null
  }, [])

  const updateProgressVisual = useCallback((nextProgress: number) => {
    stopProgressAnimation()
    if (progressFillRef.current) {
      progressFillRef.current.style.setProperty('--vsl-progress', getProgressValue(nextProgress))
    }
  }, [stopProgressAnimation])

  const startProgressAnimation = useCallback(() => {
    const video = videoRef.current
    const fill = progressFillRef.current
    if (!video || !fill || !Number.isFinite(video.duration) || video.duration <= 0) return

    const startProgress = video.currentTime / video.duration
    const remainingMs = Math.max(((video.duration - video.currentTime) / video.playbackRate) * 1000, 0)

    stopProgressAnimation()
    fill.style.setProperty('--vsl-progress', getProgressValue(startProgress))

    if (remainingMs <= 0) {
      fill.style.setProperty('--vsl-progress', getProgressValue(1))
      return
    }

    const animation = fill.animate(
      [
        { transform: getProgressTransform(startProgress) },
        { transform: getProgressTransform(1) },
      ],
      {
        duration: remainingMs,
        easing: 'linear',
        fill: 'forwards',
      }
    )

    progressAnimationRef.current = animation
    animation.onfinish = () => {
      if (progressAnimationRef.current !== animation) return
      fill.style.setProperty('--vsl-progress', getProgressValue(1))
      progressAnimationRef.current = null
    }
  }, [stopProgressAnimation])

  const resetProgressClock = useCallback((mediaTime?: number) => {
    const video = videoRef.current
    const nextMediaTime =
      typeof mediaTime === 'number' && Number.isFinite(mediaTime) ? mediaTime : video?.currentTime ?? 0

    progressClockRef.current = {
      mediaTime: nextMediaTime,
      wallTime: window.performance.now(),
    }
  }, [])

  const getSmoothCurrentTime = useCallback(() => {
    const video = videoRef.current
    if (!video) return 0

    const rawTime = video.currentTime
    if (video.paused || video.ended || video.seeking) {
      resetProgressClock(rawTime)
      return rawTime
    }

    const elapsedSeconds =
      ((window.performance.now() - progressClockRef.current.wallTime) / 1000) * video.playbackRate
    const estimatedTime = progressClockRef.current.mediaTime + elapsedSeconds

    if (Math.abs(rawTime - estimatedTime) > 1.5) {
      resetProgressClock(rawTime)
      return rawTime
    }

    return estimatedTime
  }, [resetProgressClock])

  const playSource = useCallback(
    async ({
      fromBeginning = false,
      mute = muteRef.current,
    }: {
      fromBeginning?: boolean
      mute?: boolean
    } = {}) => {
      const video = videoRef.current
      if (!video) return

      try {
        setAutoplayBlocked(false)
        applyMuteState(mute)
        if (fromBeginning) {
          if (video.readyState >= 1) {
            video.currentTime = 0
          } else {
            await new Promise<void>((resolve) => {
              const handleLoaded = () => {
                video.removeEventListener('loadedmetadata', handleLoaded)
                video.currentTime = 0
                resolve()
              }

              video.addEventListener('loadedmetadata', handleLoaded, { once: true })
            })
          }
        }

        await video.play()
      } catch {
        setAutoplayBlocked(true)
      }
    },
    [applyMuteState]
  )

  useEffect(() => {
    setVideoError(false)
    setAutoplayBlocked(false)
    setIsPlaying(false)
    setProgress(0)
    updateProgressVisual(0)
    resetProgressClock(0)
    setCurrentTime(0)
    setDuration(0)
    setShowSpeedMenu(false)
    setShowFinalCta(false)
    setHasStartedWithAudio(Boolean(selectedCategory))
    if (selectedCategory) setShowSelector(false)

    const timer = window.setTimeout(() => {
      void playSource({
        fromBeginning: Boolean(selectedCategory),
        mute: sourceKey === 'intro' ? true : muteRef.current,
      })
    }, 80)

    return () => window.clearTimeout(timer)
  }, [playSource, resetProgressClock, selectedCategory, sourceKey, updateProgressVisual])

  useEffect(() => {
    muteRef.current = isMuted
  }, [isMuted])

  useEffect(() => {
    syncVideoState()
    resetProgressClock()
    if (videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
      startProgressAnimation()
    }
  }, [isMuted, playbackRate, resetProgressClock, startProgressAnimation, syncVideoState])

  const syncProgressFromVideo = useCallback((options: { smooth?: boolean; visual?: boolean } = {}) => {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return

    const nextCurrentTime = options.smooth ? getSmoothCurrentTime() : video.currentTime
    const ratio = nextCurrentTime / video.duration
    if (options.visual !== false) {
      updateProgressVisual(ratio)
    }

    const now = window.performance.now()
    if (now - lastProgressStateUpdateRef.current < 250 && ratio > 0 && ratio < 1) return

    lastProgressStateUpdateRef.current = now
    setDuration(video.duration)
    setCurrentTime(nextCurrentTime)
    setProgress(ratio)
  }, [getSmoothCurrentTime, updateProgressVisual])

  const stopProgressLoop = useCallback(() => {
    if (progressLoopRef.current === null) return
    window.cancelAnimationFrame(progressLoopRef.current)
    progressLoopRef.current = null
  }, [])

  const startProgressLoop = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    startProgressAnimation()
    if (progressLoopRef.current !== null) return

    resetProgressClock(video.currentTime)

    const update = () => {
      syncProgressFromVideo({ smooth: true, visual: false })
      if (!video.paused && !video.ended) {
        progressLoopRef.current = window.requestAnimationFrame(update)
      } else {
        progressLoopRef.current = null
      }
    }

    progressLoopRef.current = window.requestAnimationFrame(update)
  }, [resetProgressClock, startProgressAnimation, syncProgressFromVideo])

  useEffect(() => {
    return () => {
      stopProgressLoop()
      stopProgressAnimation()
    }
  }, [stopProgressAnimation, stopProgressLoop])

  useEffect(() => {
    stopProgressLoop()
    stopProgressAnimation()
  }, [sourceKey, stopProgressAnimation, stopProgressLoop])

  useEffect(() => {
    const updateFullscreen = () => {
      const active = document.fullscreenElement === containerRef.current
      setIsFullscreen(active)
      if (active) setIsPseudoFullscreen(false)
    }
    const updateVideoFullscreen = () => {
      const video = videoRef.current as WebkitFullscreenVideo | null
      const active = Boolean(video?.webkitDisplayingFullscreen)
      setIsFullscreen(active)
      if (active) setIsPseudoFullscreen(false)
    }

    document.addEventListener('fullscreenchange', updateFullscreen)
    videoRef.current?.addEventListener('webkitbeginfullscreen', updateVideoFullscreen)
    videoRef.current?.addEventListener('webkitendfullscreen', updateVideoFullscreen)
    updateFullscreen()

    return () => {
      document.removeEventListener('fullscreenchange', updateFullscreen)
      videoRef.current?.removeEventListener('webkitbeginfullscreen', updateVideoFullscreen)
      videoRef.current?.removeEventListener('webkitendfullscreen', updateVideoFullscreen)
    }
  }, [sourceKey])

  useEffect(() => {
    if (!isPseudoFullscreen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isPseudoFullscreen])

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
  }, [showSpeedMenu])

  const handleSelectCategory = useCallback(
    (category: VSLCategory) => {
      const eventParams = {
        space_type: category.id,
        page_location: pageLocation,
        timestamp: new Date().toISOString(),
      }

      trackEvent('vsl_space_type_selected', eventParams)

      if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'vsl_space_type_selected', eventParams)
      }

      setIsSwitching(true)
      window.setTimeout(() => {
        setSelectedCategory(category)
        setShowSelector(false)
        setShowFinalCta(false)
        setIsSwitching(false)
      }, 220)
    },
    [pageLocation]
  )

  const handleEnded = useCallback(() => {
    stopProgressLoop()

    if (!selectedCategory) {
      const video = videoRef.current
      setShowSelector(true)

      if (!hasStartedWithAudio && video) {
        applyMuteState(true)
        setProgress(0)
        updateProgressVisual(0)
        resetProgressClock(0)
        setCurrentTime(0)
        video.currentTime = 0
        void video
          .play()
          .then(() => {
            setIsPlaying(true)
            startProgressLoop()
          })
          .catch(() => {
            setIsPlaying(false)
            setAutoplayBlocked(true)
          })
        return
      }

      video?.pause()
      setProgress(1)
      updateProgressVisual(1)
      resetProgressClock(duration > 0 ? duration : currentTime)
      setCurrentTime(duration > 0 ? duration : currentTime)
      return
    }

    const video = videoRef.current
    if (video) {
      video.pause()
      if (Number.isFinite(video.duration) && video.duration > 0) {
        video.currentTime = Math.max(video.duration - 0.04, 0)
        resetProgressClock(video.duration)
        setDuration(video.duration)
        setCurrentTime(video.duration)
      }
    }

    setProgress(1)
    updateProgressVisual(1)
    setShowFinalCta(true)
  }, [
    applyMuteState,
    currentTime,
    duration,
    hasStartedWithAudio,
    resetProgressClock,
    selectedCategory,
    stopProgressLoop,
    updateProgressVisual,
  ])

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current
    if (video?.paused || video?.ended || video?.seeking) {
      resetProgressClock(video.currentTime)
      syncProgressFromVideo({ visual: false })
      return
    }

    syncProgressFromVideo({ smooth: true, visual: false })
  }, [resetProgressClock, syncProgressFromVideo])

  const handleSeek = useCallback((nextProgress: number) => {
    const video = videoRef.current
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return

    const safeProgress = Math.min(Math.max(nextProgress, 0), 1)
    const nextTime = video.duration * safeProgress
    video.currentTime = nextTime
    resetProgressClock(nextTime)
    updateProgressVisual(safeProgress)
    lastProgressStateUpdateRef.current = window.performance.now()
    setDuration(video.duration)
    setCurrentTime(nextTime)
    setProgress(safeProgress)

    if (selectedCategory && safeProgress < 0.86) {
      setShowFinalCta(false)
    }
  }, [resetProgressClock, selectedCategory, updateProgressVisual])

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const nextDuration = video.duration || 0
    const nextCurrentTime = video.currentTime || 0
    setDuration(nextDuration)
    setCurrentTime(nextCurrentTime)
    updateProgressVisual(nextDuration > 0 ? nextCurrentTime / nextDuration : 0)
    resetProgressClock(nextCurrentTime)
    syncVideoState()
    if (!video.paused && !video.ended) {
      setIsPlaying(true)
      startProgressLoop()
    }
  }, [resetProgressClock, startProgressLoop, syncVideoState, updateProgressVisual])

  const handlePrimaryPlay = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    setAutoplayBlocked(false)
    setHasStartedWithAudio(true)
    applyMuteState(false)
    setShowSpeedMenu(false)
    setProgress(0)
    updateProgressVisual(0)
    resetProgressClock(0)
    setCurrentTime(0)
    video.currentTime = 0
    setShowSelector(false)
    setShowFinalCta(false)
    setIsPlaying(true)
    startProgressLoop()
    void video.play().catch(() => {
      setIsPlaying(false)
      stopProgressLoop()
      setAutoplayBlocked(true)
    })
  }, [applyMuteState, resetProgressClock, startProgressLoop, stopProgressLoop, updateProgressVisual])

  const handleResumeFromOverlay = useCallback(() => {
    const video = videoRef.current
    if (!video || videoError || showSelector || showFinalCta) return

    setAutoplayBlocked(false)
    setShowSpeedMenu(false)
    setIsPlaying(true)
    startProgressLoop()
    void video.play().catch(() => {
      setIsPlaying(false)
      stopProgressLoop()
      setAutoplayBlocked(true)
    })
  }, [showFinalCta, showSelector, startProgressLoop, stopProgressLoop, videoError])

  const handleTogglePlayback = useCallback(() => {
    const video = videoRef.current
    if (!video || videoError || showSelector || showFinalCta) return

    setShowSpeedMenu(false)

    if (video.paused) {
      setIsPlaying(true)
      startProgressLoop()
      void video.play().catch(() => {
        setIsPlaying(false)
        stopProgressLoop()
        setAutoplayBlocked(true)
      })
      return
    }

    video.pause()
  }, [showFinalCta, showSelector, startProgressLoop, stopProgressLoop, videoError])

  const handleVideoSurfaceClick = useCallback(() => {
    if (videoError || showSelector || showFinalCta) return

    if (!hasStartedWithAudio || autoplayBlocked) {
      handlePrimaryPlay()
      return
    }

    handleTogglePlayback()
  }, [
    autoplayBlocked,
    handlePrimaryPlay,
    handleTogglePlayback,
    hasStartedWithAudio,
    showFinalCta,
    showSelector,
    videoError,
  ])

  const handleToggleMute = useCallback(() => {
    const nextMuted = !isMuted
    applyMuteState(nextMuted)
    setShowSpeedMenu(false)

    const video = videoRef.current
    if (!video || nextMuted || videoError || showSelector || showFinalCta) return

    setAutoplayBlocked(false)
    setIsPlaying(true)
    startProgressLoop()
    void video.play().catch(() => {
      setIsPlaying(false)
      stopProgressLoop()
      setAutoplayBlocked(true)
    })
  }, [applyMuteState, isMuted, showFinalCta, showSelector, startProgressLoop, stopProgressLoop, videoError])

  const handleToggleFullscreen = useCallback(async () => {
    const element = containerRef.current as FullscreenCapableElement | null
    const video = videoRef.current as WebkitFullscreenVideo | null
    if (!element) return

    try {
      if (isPseudoFullscreen) {
        setIsPseudoFullscreen(false)
        return
      }

      if (document.fullscreenElement === element) {
        await document.exitFullscreen()
        return
      }

      if (document.fullscreenElement) {
        await document.exitFullscreen()
        return
      }

      const requesters = [
        () => element.requestFullscreen?.(),
        () => video?.requestFullscreen?.(),
        () => element.webkitRequestFullscreen?.(),
        () => element.msRequestFullscreen?.(),
      ]

      for (const request of requesters) {
        try {
          const result = request()
          if (result) await result
          if (document.fullscreenElement) return
        } catch {
          // Try the next fullscreen API variant.
        }
      }

      if (video?.webkitDisplayingFullscreen && video.webkitExitFullscreen) {
        video.webkitExitFullscreen()
        return
      }

      if (video?.webkitEnterFullscreen) {
        video.webkitEnterFullscreen()
        return
      }

      setIsPseudoFullscreen(true)
    } catch {
      setIsPseudoFullscreen(true)
    }
  }, [isPseudoFullscreen])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return

      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return
      }

      if (event.key === 'Escape' && isPseudoFullscreen) {
        event.preventDefault()
        setIsPseudoFullscreen(false)
        return
      }

      if (event.key === 'Escape' && showSpeedMenu) {
        event.preventDefault()
        setShowSpeedMenu(false)
        return
      }

      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        if (showSelector || showFinalCta) return

        if (!isPlaying) {
          if (!hasStartedWithAudio || autoplayBlocked) {
            handlePrimaryPlay()
          } else {
            handleResumeFromOverlay()
          }
          return
        }

        videoRef.current?.pause()
        return
      }

      if (event.key === 'm') {
        event.preventDefault()
        handleToggleMute()
        return
      }

      if (event.key === 'f') {
        event.preventDefault()
        void handleToggleFullscreen()
        return
      }
    },
    [
      autoplayBlocked,
      handleResumeFromOverlay,
      handlePrimaryPlay,
      handleToggleFullscreen,
      handleToggleMute,
      hasStartedWithAudio,
      isPlaying,
      isPseudoFullscreen,
      showFinalCta,
      showSelector,
      showSpeedMenu,
    ]
  )

  return (
    <section className={compact ? 'py-6 md:py-8' : 'py-7 md:py-9'}>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-5">
        <div className="home-shell overflow-hidden p-4 sm:p-5 md:p-6">
          <div className="mx-auto max-w-[960px]">
            <div
              ref={containerRef}
              tabIndex={0}
              onKeyDown={handleKeyDown}
              className={[
                'glass-card relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)]',
                isPseudoFullscreen
                  ? 'fixed inset-0 z-[9999] flex items-center justify-center rounded-none border-0 bg-black p-0 shadow-none'
                  : 'rounded-[28px]',
                '[&:fullscreen]:flex [&:fullscreen]:items-center [&:fullscreen]:justify-center [&:fullscreen]:rounded-none [&:fullscreen]:border-0 [&:fullscreen]:bg-black [&:fullscreen]:p-0 [&:fullscreen]:shadow-none',
              ].join(' ')}
            >
              <div
                className={[
                  'relative overflow-hidden bg-[var(--color-dark-100)] bg-cover bg-center',
                  fullscreenActive
                    ? 'h-[100dvh] w-[100vw] rounded-none'
                    : 'aspect-[9/16] rounded-[24px] sm:aspect-video',
                ].join(' ')}
                style={{ backgroundImage: `url("${activeVideo.poster}")` }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.10),rgba(1,1,1,0.72))]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-[linear-gradient(180deg,rgba(0,0,0,0.42),rgba(0,0,0,0))]" />

                {!videoError && (
                  <video
                    key={sourceKey}
                    ref={videoRef}
                    className={[
                      'relative z-10 h-full w-full transition-opacity duration-300 ease-out',
                      fullscreenActive ? 'object-contain' : 'object-cover',
                      isSwitching ? 'opacity-0' : 'opacity-100',
                    ].join(' ')}
                    poster={activeVideo.poster}
                    playsInline
                    autoPlay
                    muted={isMuted}
                    preload={selectedCategory ? 'auto' : 'metadata'}
                    onEnded={handleEnded}
                    onError={() => {
                      setVideoError(true)
                      setAutoplayBlocked(false)
                      if (!selectedCategory) setShowSelector(true)
                      if (selectedCategory) setShowFinalCta(true)
                    }}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={handleVideoSurfaceClick}
                    onPause={() => {
                      setIsPlaying(false)
                      resetProgressClock()
                      syncProgressFromVideo()
                      stopProgressLoop()
                    }}
                    onPlay={() => {
                      setIsPlaying(true)
                      resetProgressClock()
                      startProgressLoop()
                    }}
                    onPlaying={() => {
                      setIsPlaying(true)
                      resetProgressClock()
                      startProgressLoop()
                    }}
                    onTimeUpdate={handleTimeUpdate}
                  >
                    {activeVideo.videoWebm && <source src={activeVideo.videoWebm} type="video/webm" />}
                    <source src={activeVideo.videoMp4} type="video/mp4" />
                  </video>
                )}

                <VSLProgressTracker
                  checkpoints={activeCheckpoints}
                  progress={progressForTracker}
                  elapsedLabel={formattedElapsed}
                  totalLabel={formattedTotal}
                  onSeek={handleSeek}
                  showCheckpoints={!selectedCategory}
                  showProgressFill={Boolean(selectedCategory) || hasStartedWithAudio}
                  progressFillRef={progressFillRef}
                />

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
                      onClick={handleToggleMute}
                      className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-white/18 bg-black/30 text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-200 hover:bg-black/42 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] sm:h-11 sm:w-11 sm:rounded-[16px]"
                      aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                      aria-pressed={!isMuted}
                    >
                      <SpeakerIcon muted={isMuted} />
                    </button>

                    <button
                      type="button"
                      onClick={handleToggleFullscreen}
                      className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-[14px] border border-white/18 bg-black/30 text-white shadow-[0_14px_34px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-200 hover:bg-black/42 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] sm:h-11 sm:w-11 sm:rounded-[16px]"
                      aria-label={fullscreenActive ? 'Exit fullscreen' : 'Enter fullscreen'}
                      aria-pressed={fullscreenActive}
                    >
                      <FullscreenIcon />
                    </button>
                  </div>
                </div>

                {showCenterPlay && (
                  <div className="pointer-events-none absolute inset-0 z-40 flex items-center justify-center p-5">
                    <div className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={handlePrimaryPlay}
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
                    onClick={handleResumeFromOverlay}
                    role="button"
                    tabIndex={-1}
                    aria-label="Resume video"
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        handleResumeFromOverlay()
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
                        onClick={handlePrimaryPlay}
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

                {showSelector && (
                  <div className="absolute inset-x-4 bottom-5 z-30 mx-auto max-w-[560px] rounded-[26px] border border-white/18 bg-black/38 p-3 text-white shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:bottom-6">
                    <VSLCardGrid
                      categories={config.categories}
                      selectedCategoryId={selectedCategory?.id}
                      onSelect={handleSelectCategory}
                    />
                  </div>
                )}

                {selectedCategory && showFinalCta && (
                  <div className="absolute inset-x-4 bottom-5 z-30 mx-auto max-w-[360px] rounded-[26px] border border-white/18 bg-black/38 p-3 text-center text-white shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:bottom-6 sm:p-4">
                    <Link href={selectedCategory.ctaHref} className="page-cta w-full">
                      {selectedCategory.ctaLabel}
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
