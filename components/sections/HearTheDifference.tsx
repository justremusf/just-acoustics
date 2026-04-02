'use client'

import { useState } from 'react'
import Image from 'next/image'

const videos = [
  {
    videoId: '8DURhlYt3wQ',
    thumbnail: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69687b1239333b922d70b26a_Title.avif',
    label: 'Meeting Room Transformation',
    category: 'Office',
    note: 'Clearer voices',
  },
  {
    videoId: 'bm-q3dQWB6g',
    thumbnail: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69687d6c4e41c7a3a58f9107_Title.avif',
    label: 'Restaurant Acoustic Treatment',
    category: 'Hospitality',
    note: 'Comfortable dining',
  },
  {
    videoId: 'Y9b0NNTRnFw',
    thumbnail: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69687c96d1feff52c5d91be4_3.avif',
    label: 'Church Sound Improvement',
    category: 'Worship',
    note: 'Quiet worship',
  },
]

const PLAY_ICON = 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6967a0f62bd9b7dce9e01040_Play%20icon.png'

export default function HearTheDifference() {
  const [activeId, setActiveId] = useState<string | null>(null)

  return (
    <>
      <section className="px-4 py-12 md:px-5 md:py-14">
        <div className="section-shell-pad mx-auto max-w-[1280px] overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,243,236,0.96))] shadow-[0_26px_80px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.82)_inset]" style={{ borderRadius: 'var(--section-radius)', border: '1px solid var(--section-border)' }}>
          <div className="mb-8 flex flex-col gap-4 md:mb-12">
            <div className="max-w-[700px]">
              <span className="inline-flex rounded-[100px] border border-black/8 bg-white/82 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-black/52">
                Hear the difference
              </span>
              <h2 className="mt-4 max-w-[12ch] text-[var(--color-dark-100)] home-heading">
                Listen to the results yourself
              </h2>
              <p className="mt-5 max-w-[52ch] text-[15px] leading-7 text-[var(--color-gray-100)] sm:text-base">
                How spaces like yours sound after acoustic panels
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[32px] bg-white md:overflow-visible md:rounded-none md:bg-transparent">
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex w-16 items-center justify-end bg-[linear-gradient(270deg,rgba(255,255,255,0.92),rgba(255,255,255,0))] pr-2 md:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/55 bg-[linear-gradient(180deg,rgba(255,255,255,0.72),rgba(255,255,255,0.36))] text-base font-medium text-[var(--color-dark-100)] shadow-[0_18px_36px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.9)_inset] backdrop-blur-xl">
                <span className="translate-x-[0.5px]">→</span>
              </div>
            </div>
            <div className="no-scrollbar flex gap-4 overflow-x-auto overflow-y-hidden md:grid md:grid-cols-3 md:gap-5 md:overflow-visible">
              {videos.map((v, index) => (
                <button
                  key={v.videoId}
                  onClick={() => setActiveId(v.videoId)}
                  className="group relative w-[76vw] max-w-[292px] flex-none overflow-hidden rounded-[28px] border border-white/18 bg-[linear-gradient(180deg,rgba(22,22,22,0.94),rgba(8,8,8,1))] p-0 text-left shadow-[0_28px_70px_rgba(0,0,0,0.16),0_10px_28px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.16)_inset] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_34px_82px_rgba(0,0,0,0.22),0_14px_34px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.18)_inset] md:w-full md:max-w-none"
                  aria-label={`Play: ${v.label}`}
                >
                  <div className="relative aspect-[9/16] md:aspect-[4/5] xl:aspect-[5/6]">
                    <Image
                      src={v.thumbnail}
                      alt={v.label}
                      fill
                      sizes="(min-width: 1024px) 320px, (min-width: 768px) 300px, 78vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,186,88,0.2),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.22)_38%,rgba(0,0,0,0.84)_100%)]" />

                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                      <span className="inline-flex rounded-full border border-white/14 bg-black/26 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72 backdrop-blur-md">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="inline-flex rounded-full border border-white/14 bg-black/26 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62 backdrop-blur-md">
                        Video
                      </span>
                    </div>

                    <div className="absolute inset-x-0 top-[34%] flex items-center justify-center">
                      <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full border border-white/18 bg-white/10 shadow-[0_0_0_12px_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_0_16px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.4)] sm:h-[88px] sm:w-[88px]">
                        <Image src={PLAY_ICON} alt="Play" width={56} height={56} className="drop-shadow-lg sm:h-[68px] sm:w-[68px]" unoptimized />
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <div className="rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(20,20,20,0.28),rgba(8,8,8,0.82))] p-4 backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-3">
                          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/58">
                            {v.category}
                          </p>
                          <span className="text-[11px] font-medium text-white/42">Tap to play</span>
                        </div>
                        <h3 className="mt-3 text-[24px] leading-[1.02] font-medium tracking-[-0.9px] text-white sm:text-[28px]" style={{ fontFamily: 'var(--font-heading)' }}>
                          {v.label}
                        </h3>
                        <p className="mt-3 mb-0 text-sm leading-6 text-white/58">
                          {v.note}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {activeId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/82" onClick={() => setActiveId(null)}>
          <div className="relative mx-4 w-full max-w-4xl pt-10 sm:pt-0" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setActiveId(null)}
              className="absolute right-0 top-0 h-10 w-10 rounded-full border border-white/18 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/18 sm:-top-12"
              aria-label="Close video"
            >
              ✕
            </button>
            <div className="relative w-full overflow-hidden rounded-[20px] border border-white/12 shadow-[0_24px_80px_rgba(0,0,0,0.35)]" style={{ paddingBottom: '56.25%' }}>
              <iframe
                className="absolute inset-0 h-full w-full"
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
