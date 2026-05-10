'use client'

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
  const { refs, state, derived, handlers } = useInteractiveVSL(config, pageLocation)

  const {
    videoRef,
    ambientVideoRef,
    containerRef,
    speedMenuRef,
    speedButtonRef,
    progressFillRef,
  } = refs

  const {
    selectedCategory,
    showSelector,
    autoplayBlocked,
    videoError,
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
                  'relative overflow-hidden bg-[var(--color-dark-100)] bg-center',
                  fullscreenActive
                    ? 'h-[100dvh] w-[100vw] rounded-none bg-black'
                    : 'aspect-[9/16] rounded-[24px] sm:aspect-video bg-cover',
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
                    {activeVideo.videoWebm && <source src={activeVideo.videoWebm} type="video/webm" />}
                    <source src={activeVideo.videoMp4} type="video/mp4" />
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
                    autoPlay
                    muted={isMuted}
                    preload={selectedCategory ? 'auto' : 'metadata'}
                    onEnded={handleEnded}
                    onError={() => {
                      state.setVideoError(true)
                      state.setAutoplayBlocked(false)
                      if (!selectedCategory) state.setShowSelector(true)
                      if (selectedCategory) state.setShowFinalCta(true)
                    }}
                    onLoadedMetadata={handleLoadedMetadata}
                    onClick={handleVideoSurfaceClick}
                    onPause={() => {
                      state.setIsPlaying(false)
                      resetProgressClock()
                      syncProgressFromVideo()
                      stopProgressLoop()
                    }}
                    onPlay={() => {
                      state.setIsPlaying(true)
                      resetProgressClock()
                      startProgressLoop()
                    }}
                    onPlaying={() => {
                      state.setIsPlaying(true)
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
        </div>
      </div>
    </section>
  )
}
