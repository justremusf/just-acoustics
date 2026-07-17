'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import type { InteractiveVSLConfig } from '@/data/vslConfig'
import VSLCardGrid from '@/components/VSLCardGrid'
import VSLProgressTracker from '@/components/VSLProgressTracker'
import { useInteractiveVSL } from '@/hooks/useInteractiveVSL'
import VSLControls from '@/components/vsl/VSLControls'
import VSLOverlay from '@/components/vsl/VSLOverlay'

type InteractiveVSLProps = {
  config: InteractiveVSLConfig
  pageLocation: string
  compact?: boolean
}

export default function InteractiveVSL({ config, pageLocation, compact = false }: InteractiveVSLProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false)
  const resumeAfterVisibilityRef = useRef(false)
  const { refs, state, derived, handlers } = useInteractiveVSL(config, pageLocation)

  useEffect(() => {
    const section = sectionRef.current
    if (!section || shouldLoadVideo) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShouldLoadVideo(true)
      },
      { rootMargin: '180px 0px', threshold: 0.15 },
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [shouldLoadVideo])

  const {
    videoRef,
    ambientVideoRef,
    containerRef,
    speedMenuRef,
    speedButtonRef,
    progressFillRef,
  } = refs

  useEffect(() => {
    const section = sectionRef.current
    if (!section || !shouldLoadVideo) return

    const pauseForVisibility = () => {
      const video = videoRef.current
      if (!video || video.paused) return
      resumeAfterVisibilityRef.current = true
      video.pause()
    }
    const resumeForVisibility = () => {
      if (!resumeAfterVisibilityRef.current || document.hidden) return
      resumeAfterVisibilityRef.current = false
      void videoRef.current?.play().catch(() => undefined)
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) resumeForVisibility()
      else pauseForVisibility()
    }, { threshold: 0.05 })
    const handleVisibilityChange = () => {
      if (document.hidden) pauseForVisibility()
      else if (section.getBoundingClientRect().bottom > 0 && section.getBoundingClientRect().top < window.innerHeight) {
        resumeForVisibility()
      }
    }

    observer.observe(section)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [shouldLoadVideo, videoRef])

  const {
    selectedCategory,
    showSelector,
    autoplayBlocked,
    videoError,
    isLoading,
    isSwitching,
    hasStartedWithAudio,
    showFinalCta,
    isMuted,
    playbackRate,
    showSpeedMenu,
    setShowSpeedMenu,
    setPlaybackRate,
    isPseudoFullscreen,
  } = state

  const {
    activeVideo,
    activeCheckpoints,
    sourceKey,
    formattedElapsed,
    formattedTotal,
    progressForTracker,
    showCenterPlay,
    showResumePlay,
    fullscreenActive,
  } = derived

  const {
    handleSelectCategory,
    handleEnded,
    handleTimeUpdate,
    handleSeek,
    handleLoadedMetadata,
    handlePrimaryPlay,
    handleResumeFromOverlay,
    handleVideoSurfaceClick,
    handleToggleMute,
    handleToggleFullscreen,
    handleKeyDown,
    syncProgressFromVideo,
    stopProgressLoop,
    startProgressLoop,
    resetProgressClock,
  } = handlers

  return (
    <section ref={sectionRef} className={compact ? 'px-4 py-6 sm:px-5 md:py-8' : 'px-4 py-7 sm:px-5 md:py-9'}>
      <div className="site-container">
        <div
          ref={containerRef}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          className={[
            'relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)]',
            isPseudoFullscreen
              ? 'fixed inset-0 z-[9999] flex items-center justify-center rounded-none bg-black'
              : 'rounded-[28px]',
            '[&:fullscreen]:flex [&:fullscreen]:items-center [&:fullscreen]:justify-center [&:fullscreen]:rounded-none [&:fullscreen]:bg-black',
          ].join(' ')}
        >
              <div
                className={[
                  'relative overflow-hidden bg-[var(--color-dark-100)] bg-center',
                  fullscreenActive
                    ? 'h-[100dvh] w-[100vw] rounded-none bg-black'
                    : 'aspect-[9/16] rounded-[22px] sm:aspect-video bg-cover',
                ].join(' ')}
                style={!fullscreenActive ? { backgroundImage: `url("${activeVideo.poster}")` } : undefined}
              >
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,1,0.10),rgba(1,1,1,0.72))]" />
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-28 bg-[linear-gradient(180deg,rgba(0,0,0,0.42),rgba(0,0,0,0))]" />

                {/* Ambient Blurred Background (YouTube style) */}
                {!videoError && fullscreenActive && (
                  <video
                    key={sourceKey + '-ambient'}
                    ref={ambientVideoRef}
                    className="pointer-events-none absolute inset-0 z-0 h-full w-full scale-[1.2] object-cover opacity-60 blur-[60px] saturate-150 transition-opacity duration-1000"
                    playsInline
                    muted
                  >
                    {shouldLoadVideo && activeVideo.videoWebm && <source src={activeVideo.videoWebm} type="video/webm" />}
                    {shouldLoadVideo && <source src={activeVideo.videoMp4} type="video/mp4" />}
                  </video>
                )}

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
                    autoPlay={shouldLoadVideo}
                    muted={isMuted}
                    preload={shouldLoadVideo ? 'auto' : 'none'}
                    onEnded={handleEnded}
                    onError={() => {
                      state.setVideoError(true)
                      state.setAutoplayBlocked(false)
                      if (!selectedCategory) state.setShowSelector(true)
                      if (selectedCategory) state.setShowFinalCta(true)
                    }}
                    onLoadedMetadata={handleLoadedMetadata}
                    onWaiting={() => state.setIsLoading(true)}
                    onCanPlay={() => state.setIsLoading(false)}
                    onClick={handleVideoSurfaceClick}
                    onPause={() => {
                      state.setIsPlaying(false)
                      resetProgressClock()
                      syncProgressFromVideo()
                      stopProgressLoop()
                    }}
                    onPlay={() => {
                      state.setIsPlaying(true)
                      state.setIsLoading(false)
                      resetProgressClock()
                      startProgressLoop()
                    }}
                    onPlaying={() => {
                      state.setIsPlaying(true)
                      state.setIsLoading(false)
                      resetProgressClock()
                      startProgressLoop()
                    }}
                    onTimeUpdate={handleTimeUpdate}
                  >
                    {shouldLoadVideo && activeVideo.videoWebm && <source src={activeVideo.videoWebm} type="video/webm" />}
                    {shouldLoadVideo && <source src={activeVideo.videoMp4} type="video/mp4" />}
                  </video>
                )}

                {/* Loading Screen Overlay */}
                {!videoError && ((isLoading && !showCenterPlay && !autoplayBlocked) || isSwitching) && (
                  <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-sm transition-opacity duration-300">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-[var(--color-brand-orange)]" />
                      <p className="text-sm font-medium text-white/80">Loading...</p>
                    </div>
                  </div>
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

                <VSLControls
                  speedMenuRef={speedMenuRef}
                  speedButtonRef={speedButtonRef}
                  showSpeedMenu={showSpeedMenu}
                  setShowSpeedMenu={setShowSpeedMenu}
                  playbackRate={playbackRate}
                  setPlaybackRate={setPlaybackRate}
                  isMuted={isMuted}
                  onToggleMute={handleToggleMute}
                  fullscreenActive={fullscreenActive}
                  onToggleFullscreen={handleToggleFullscreen}
                />

                <VSLOverlay
                  showCenterPlay={showCenterPlay}
                  showResumePlay={showResumePlay}
                  autoplayBlocked={autoplayBlocked}
                  videoError={videoError}
                  onPrimaryPlay={handlePrimaryPlay}
                  onResumeFromOverlay={handleResumeFromOverlay}
                />

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
    </section>
  )
}
