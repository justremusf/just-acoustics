import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { trackEvent } from '@/components/analytics/trackEvent'
import type { InteractiveVSLConfig, VSLCategory, VSLCheckpoint } from '@/data/vslConfig'

export type PlaybackSpeed = 1 | 1.5 | 2
export type WebkitFullscreenVideo = HTMLVideoElement & {
  webkitEnterFullscreen?: () => void
  webkitExitFullscreen?: () => void
  webkitDisplayingFullscreen?: boolean
}

export type FullscreenCapableElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
  msRequestFullscreen?: () => Promise<void> | void
}

const introCheckpoints: VSLCheckpoint[] = [
  { label: 'Choose space type', at: 1 },
]

export const speedOptions: PlaybackSpeed[] = [1, 1.5, 2]
export const PLAY_ICON = '/assets/webflow/6967a0f62bd9b7dce9e01040_Play%20icon.png'

export function getProgressTransform(progress: number) {
  const safeProgress = Math.min(Math.max(progress, 0), 1)
  return `translate3d(0, 0, 0) scaleX(${safeProgress})`
}

export function getProgressValue(progress: number) {
  return String(Math.min(Math.max(progress, 0), 1))
}

export function formatTime(value: number) {
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

export function useInteractiveVSL(config: InteractiveVSLConfig, pageLocation: string) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const ambientVideoRef = useRef<HTMLVideoElement>(null)
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
  const isAutoPlayingSilently = isPlaying && isMuted && !hasStartedWithAudio
  const showCenterPlay =
    (!isPlaying && (showInitialPlay || (!videoError && autoplayBlocked && !showSelector && !showFinalCta))) || isAutoPlayingSilently
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

    const ambient = ambientVideoRef.current
    if (ambient) {
      ambient.playbackRate = playbackRate
      if (Math.abs(ambient.currentTime - video.currentTime) > 0.3) {
        ambient.currentTime = video.currentTime
      }
      if (!video.paused && !video.ended) {
        ambient.play().catch(() => {})
      } else {
        ambient.pause()
      }
    }
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
            if (ambientVideoRef.current) ambientVideoRef.current.currentTime = 0
          } else {
            await new Promise<void>((resolve) => {
              const handleLoaded = () => {
                video.removeEventListener('loadedmetadata', handleLoaded)
                video.currentTime = 0
                if (ambientVideoRef.current) ambientVideoRef.current.currentTime = 0
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

    const ambient = ambientVideoRef.current
    if (ambient && Math.abs(ambient.currentTime - video.currentTime) > 0.3) {
      ambient.currentTime = video.currentTime
    }

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
    if (fullscreenActive) {
      syncVideoState()
    }
  }, [fullscreenActive, syncVideoState])

  useEffect(() => {
    if (!isPseudoFullscreen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isPseudoFullscreen])

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
        if (ambientVideoRef.current) ambientVideoRef.current.currentTime = 0
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
    if (ambientVideoRef.current) {
      ambientVideoRef.current.currentTime = nextTime
    }
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
    if (ambientVideoRef.current) ambientVideoRef.current.currentTime = 0
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

  return {
    refs: {
      videoRef,
      ambientVideoRef,
      containerRef,
      speedMenuRef,
      speedButtonRef,
      progressFillRef,
    },
    state: {
      selectedCategory, setSelectedCategory,
      showSelector, setShowSelector,
      autoplayBlocked, setAutoplayBlocked,
      videoError, setVideoError,
      isSwitching, setIsSwitching,
      isPlaying, setIsPlaying,
      hasStartedWithAudio, setHasStartedWithAudio,
      progress, setProgress,
      showFinalCta, setShowFinalCta,
      isMuted, setIsMuted,
      playbackRate, setPlaybackRate,
      showSpeedMenu, setShowSpeedMenu,
      duration, setDuration,
      currentTime, setCurrentTime,
      isFullscreen, setIsFullscreen,
      isPseudoFullscreen, setIsPseudoFullscreen,
    },
    derived: {
      activeVideo,
      activeCheckpoints,
      sourceKey,
      formattedElapsed,
      formattedTotal,
      progressForTracker,
      showInitialPlay,
      showCenterPlay,
      showResumePlay,
      fullscreenActive,
    },
    handlers: {
      handleSelectCategory,
      handleEnded,
      handleTimeUpdate,
      handleSeek,
      handleLoadedMetadata,
      handlePrimaryPlay,
      handleResumeFromOverlay,
      handleTogglePlayback,
      handleVideoSurfaceClick,
      handleToggleMute,
      handleToggleFullscreen,
      handleKeyDown,
      syncProgressFromVideo,
      stopProgressLoop,
      startProgressLoop,
      resetProgressClock,
    }
  }
}
