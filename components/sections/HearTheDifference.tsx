'use client'

import { useState } from 'react'
import Image from 'next/image'

const videos = [
  {
    videoId: '8DURhlYt3wQ',
    thumbnail: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69687b1239333b922d70b26a_Title.avif',
    label: 'Meeting Room Transformation',
  },
  {
    videoId: 'bm-q3dQWB6g',
    thumbnail: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69687d6c4e41c7a3a58f9107_Title.avif',
    label: 'Restaurant Acoustic Treatment',
  },
  {
    videoId: 'Y9b0NNTRnFw',
    thumbnail: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69687c96d1feff52c5d91be4_3.avif',
    label: 'Church Sound Improvement',
  },
]

const PLAY_ICON = 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6967a0f62bd9b7dce9e01040_Play%20icon.png'

export default function HearTheDifference() {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <>
      <section className="py-28 md:py-36">
        <div className="max-w-[1280px] mx-auto px-5">
          <div className="text-center mb-20 md:mb-24">
            <h2
              className="text-[var(--color-dark-100)] m-0 mb-5"
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'clamp(28px, 4vw, var(--fs-h3))',
                lineHeight: '124%',
                fontWeight: 500,
                letterSpacing: '-1.04px',
              }}
            >
              Hear the Difference
            </h2>
            <p className="text-[var(--color-gray-100)] text-base m-0">
              Listen to real spaces before and after acoustic treatment
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {videos.map((v) => (
              <button
                key={v.videoId}
                onClick={() => setActiveId(v.videoId)}
                className="relative block rounded-[16px] overflow-hidden group w-full p-0 border-0 bg-transparent cursor-pointer"
                aria-label={`Play: ${v.label}`}
              >
                <Image
                  src={v.thumbnail}
                  alt={v.label}
                  width={430}
                  height={280}
                  className="w-full object-cover"
                  unoptimized
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/25 transition-colors">
                  <Image
                    src={PLAY_ICON}
                    alt="Play"
                    width={70}
                    height={70}
                    className="drop-shadow-lg"
                    unoptimized
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube overlay */}
      {activeId && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80"
          onClick={() => setActiveId(null)}
        >
          <div
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setActiveId(null)}
              className="absolute -top-10 right-0 text-white text-3xl leading-none hover:text-gray-300 transition-colors"
              aria-label="Close video"
            >
              ✕
            </button>
            {/* 16:9 iframe wrapper */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 w-full h-full rounded-[12px]"
                src={`https://www.youtube.com/embed/${activeId}?autoplay=1`}
                title="YouTube video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}
