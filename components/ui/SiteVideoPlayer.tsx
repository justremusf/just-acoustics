'use client'

import type { SiteVideo } from '@/lib/videos'

type Props = {
  video: SiteVideo
  className?: string
}

// Runs during the commit triggered by the play tap, so iOS still treats play()
// as user-initiated and allows sound. `autoPlay` alone is ignored there.
const startPlayback = (video: HTMLVideoElement | null) => {
  void video?.play().catch(() => {})
}

// Plays a site video once the visitor has tapped play. Self-hosted MP4 when the
// file exists (instant start, no YouTube chrome), YouTube embed otherwise.
export default function SiteVideoPlayer({ video, className = 'absolute inset-0 h-full w-full' }: Props) {
  if (video.src) {
    return (
      <video
        ref={startPlayback}
        className={`${className} bg-black object-contain`}
        src={video.src}
        poster={video.poster}
        title={video.title}
        controls
        autoPlay
        playsInline
        preload="auto"
      />
    )
  }

  return (
    <iframe
      className={className}
      src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0&playsinline=1&modestbranding=1`}
      title={video.title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      // YouTube refuses to play (Error 153) when the embed request has no Referer.
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    />
  )
}
