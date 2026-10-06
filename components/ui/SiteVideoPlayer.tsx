'use client'

import { useEffect, useRef } from 'react'
import type { SiteVideo } from '@/lib/videos'

type Props = {
  video: SiteVideo
  className?: string
}

// Plays a site video once the visitor has tapped play. Self-hosted MP4 when the
// file exists (instant start, no YouTube chrome), YouTube embed otherwise.
export default function SiteVideoPlayer({ video, className = 'absolute inset-0 h-full w-full' }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    // The tap that mounted this player counts as the user gesture, so sound is allowed.
    videoRef.current?.play().catch(() => {})
  }, [])

  if (video.src) {
    return (
      <video
        ref={videoRef}
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
