'use client'

import { useState } from 'react'
import Image from 'next/image'

const videos = [
  {
    videoId: '8DURhlYt3wQ',
    thumbnail: '/assets/webflow/69687b1239333b922d70b26a_Title.avif',
    label: 'Meeting Room',
    category: 'Meeting Room',
    note: 'Clearer voices',
  },
  {
    videoId: 'bm-q3dQWB6g',
    thumbnail: '/assets/webflow/69687d6c4e41c7a3a58f9107_Title.avif',
    label: 'Noisy Restaurant',
    category: 'Restaurant',
    note: 'Comfortable dining',
  },
  {
    videoId: 'Y9b0NNTRnFw',
    thumbnail: '/assets/webflow/69687c96d1feff52c5d91be4_3.avif',
    label: 'Function Room',
    category: 'Church',
    note: 'Comfortable event space',
  },
]

const PLAY_ICON = '/assets/webflow/6967a0f62bd9b7dce9e01040_Play%20icon.png'

export default function HearTheDifference() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)

  return (
    <>
      <section className="px-4 py-12 md:px-5 md:py-14">
        <div
          className="section-shell-pad mx-auto max-w-[1580px] overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,243,236,0.96))] shadow-[0_26px_80px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.82)_inset]"
          style={{ borderRadius: 'var(--section-radius)', border: '1px solid var(--section-border)' }}
        >
          <div className="mb-8 flex flex-col gap-4 md:mb-12">
            <div className="max-w-[700px]">
              <h2 className="home-heading max-w-[700px] text-[var(--color-dark-100)]">
                Listen to the results yourself
              </h2>
              <p className="mt-5 max-w-[52ch] text-[15px] leading-7 text-[var(--color-gray-100)] sm:text-base">
                The before &amp; after difference.
              </p>
            </div>
          </div>

          {/* Single responsive grid — renders all videos once, collapses to 1 column on mobile showing only first video */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {videos.map((v, index) => {
              const isActive = activeVideoId === v.videoId
              const isHiddenOnMobile = index > 0
              const previewSrc = `https://www.youtube-nocookie.com/embed/${v.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${v.videoId}&rel=0&playsinline=1&modestbranding=1&disablekb=1&iv_load_policy=3`
              const activeSrc = `https://www.youtube-nocookie.com/embed/${v.videoId}?autoplay=1&controls=1&rel=0&playsinline=1&modestbranding=1`

              return (
                <button
                  key={v.videoId}
                  onClick={() => setActiveVideoId(v.videoId)}
                  className={[
                    'group relative w-full overflow-hidden rounded-[24px] border border-white/55 bg-white/35 p-0 text-left shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_64px_rgba(0,0,0,0.12)]',
                    isHiddenOnMobile ? 'hidden md:block' : '',
                  ].join(' ')}
                  aria-label={`Play: ${v.label}`}
                >
                  <div className="relative aspect-[9/16] md:h-[410px] md:aspect-auto lg:h-[430px] xl:h-auto xl:aspect-[5/6]">
                    {!isActive ? (
                      <>
                        <iframe
                          className="absolute inset-0 h-full w-full pointer-events-none"
                          src={previewSrc}
                          title={`${v.label} preview`}
                          loading="lazy"
                          allow="autoplay; encrypted-media; picture-in-picture"
                          aria-hidden="true"
                        />
                        <Image
                          src={v.thumbnail}
                          alt={v.label}
                          fill
                          sizes="(min-width: 1024px) 320px, (min-width: 768px) 300px, 92vw"
                          className="absolute inset-0 object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,186,88,0.16),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.22)_38%,rgba(0,0,0,0.84)_100%)]" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-black">
                        <iframe
                          className="absolute inset-0 h-full w-full"
                          src={activeSrc}
                          title={v.label}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}

                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                      <span className="inline-flex rounded-full border border-white/14 bg-black/26 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72 backdrop-blur-md">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="inline-flex rounded-full border border-white/14 bg-black/26 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62 backdrop-blur-md">
                        {isActive ? 'Playing' : 'Video'}
                      </span>
                    </div>

                    {!isActive && (
                      <>
                        <div className="absolute inset-0 z-20 flex items-center justify-center">
                          <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full border border-white/18 bg-white/10 shadow-[0_0_0_10px_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_0_14px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.4)] sm:h-[76px] sm:w-[76px]">
                            <Image src={PLAY_ICON} alt="Play" width={56} height={56} sizes="56px" className="h-[52px] w-[52px] drop-shadow-lg sm:h-[58px] sm:w-[58px]" />
                          </div>
                        </div>

                        <div className="absolute inset-x-0 bottom-0 z-10 p-3 sm:p-4 xl:p-5">
                          <div className="rounded-[20px] border border-white/12 bg-[linear-gradient(180deg,rgba(20,20,20,0.38),rgba(8,8,8,0.88))] p-3.5 backdrop-blur-xl sm:p-4">
                            <div className="flex items-center justify-between gap-3">
                              <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/58">
                                {v.category}
                              </p>
                              <span className="sr-only">Tap to play</span>
                            </div>
                            <h3
                              className="mt-2 text-[20px] leading-[1.02] font-medium tracking-[-0.7px] text-white sm:text-[22px] xl:mt-3 xl:text-[28px]"
                              style={{ fontFamily: 'var(--font-heading)' }}
                            >
                              {v.label}
                            </h3>
                            <p className="mt-2 mb-0 text-[13px] leading-5 text-white/64 xl:mt-3 xl:text-sm xl:leading-6">{v.note}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

        </div>
      </section>
    </>
  )
}
