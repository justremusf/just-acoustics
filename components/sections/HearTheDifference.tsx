'use client'

import Link from 'next/link'
import { useState } from 'react'
import Image from 'next/image'

const videos = [
  {
    videoId: '8DURhlYt3wQ',
    thumbnail: '/assets/webflow/69687b1239333b922d70b26a_Title.avif',
    label: 'Meeting Room Transformation',
    category: 'Office',
    note: 'Clearer voices',
  },
  {
    videoId: 'bm-q3dQWB6g',
    thumbnail: '/assets/webflow/69687d6c4e41c7a3a58f9107_Title.avif',
    label: 'Noisy Restaurant Fix',
    category: 'Hospitality',
    note: 'Comfortable dining',
  },
  {
    videoId: 'Y9b0NNTRnFw',
    thumbnail: '/assets/webflow/69687c96d1feff52c5d91be4_3.avif',
    label: 'Church Sound Improvement',
    category: 'Worship',
    note: 'Quiet worship',
  },
]

const PLAY_ICON = '/assets/webflow/6967a0f62bd9b7dce9e01040_Play%20icon.png'

export default function HearTheDifference() {
  const [activeMobileId, setActiveMobileId] = useState<string | null>(null)
  const [activeDesktopId, setActiveDesktopId] = useState<string | null>(null)
  const featuredVideo = videos[0]

  return (
    <>
      <section className="px-4 py-12 md:px-5 md:py-14">
        <div className="section-shell-pad mx-auto max-w-[1280px] overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,243,236,0.96))] shadow-[0_26px_80px_rgba(0,0,0,0.08),0_1px_0_rgba(255,255,255,0.82)_inset]" style={{ borderRadius: 'var(--section-radius)', border: '1px solid var(--section-border)' }}>
          <div className="mb-8 flex flex-col gap-4 md:mb-12">
            <div className="max-w-[700px]">
              <span className="soft-pill">
                Hear the difference
              </span>
              <h2 className="max-w-[12ch] text-[var(--color-dark-100)] home-heading">
                Listen to the results yourself
              </h2>
              <p className="mt-5 max-w-[52ch] text-[15px] leading-7 text-[var(--color-gray-100)] sm:text-base">
                How spaces like yours sound after acoustic panels
              </p>
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setActiveMobileId(featuredVideo.videoId)}
              className="group relative w-full overflow-hidden rounded-[24px] border border-white/55 bg-white/35 p-0 text-left shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_64px_rgba(0,0,0,0.12)]"
              aria-label={`Play: ${featuredVideo.label}`}
            >
              <div className="relative aspect-[9/16]">
                {activeMobileId === featuredVideo.videoId ? (
                  <div className="absolute inset-0 bg-black">
                    <iframe
                      className="absolute inset-0 h-full w-full"
                      src={`https://www.youtube.com/embed/${featuredVideo.videoId}?autoplay=1&rel=0&playsinline=1`}
                      title={featuredVideo.label}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <>
                    <Image
                      src={featuredVideo.thumbnail}
                      alt={featuredVideo.label}
                      fill
                      sizes="92vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,186,88,0.2),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.22)_38%,rgba(0,0,0,0.84)_100%)]" />
                  </>
                )}

                <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                  <span className="inline-flex rounded-full border border-white/14 bg-black/26 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72 backdrop-blur-md">
                    01
                  </span>
                  <span className="inline-flex rounded-full border border-white/14 bg-black/26 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62 backdrop-blur-md">
                    Video
                  </span>
                </div>

                {activeMobileId !== featuredVideo.videoId && (
                  <>
                    <div className="absolute inset-x-0 top-[34%] flex items-center justify-center">
                      <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full border border-white/18 bg-white/10 shadow-[0_0_0_12px_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_0_16px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.4)] sm:h-[88px] sm:w-[88px]">
                        <Image src={PLAY_ICON} alt="Play" width={56} height={56} sizes="56px" className="drop-shadow-lg sm:h-[68px] sm:w-[68px]" />
                      </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <div className="rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(20,20,20,0.28),rgba(8,8,8,0.82))] p-4 backdrop-blur-xl">
                        <div className="flex items-center justify-between gap-3">
                          <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/58">
                            {featuredVideo.category}
                          </p>
                          <span className="text-[11px] font-medium text-white/42">Tap to play</span>
                        </div>
                        <h3 className="mt-3 text-[24px] leading-[1.02] font-medium tracking-[-0.9px] text-white sm:text-[28px]" style={{ fontFamily: 'var(--font-heading)' }}>
                          {featuredVideo.label}
                        </h3>
                        <p className="mt-3 mb-0 text-sm leading-6 text-white/58">
                          {featuredVideo.note}
                        </p>
                      </div>
                    </div>
                  </>
                )}
                {activeMobileId === featuredVideo.videoId && (
                  <div className="absolute right-4 top-4 z-10">
                    <span className="inline-flex rounded-full border border-white/16 bg-black/42 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72 backdrop-blur-md">
                      Playing
                    </span>
                  </div>
                )}
              </div>
            </button>

            <div className="mt-5 flex justify-end px-1">
              <Link href="/projects" className="home-link inline-flex items-center gap-2">
                See all videos <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block md:overflow-visible md:rounded-none md:bg-transparent">
            <div className="md:grid md:grid-cols-3 md:gap-5 md:overflow-visible">
              {videos.map((v, index) => (
                <button
                  key={v.videoId}
                  onClick={() => setActiveDesktopId(v.videoId)}
                  className="group relative w-full max-w-none overflow-hidden rounded-[24px] border border-white/55 bg-white/35 p-0 text-left shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_64px_rgba(0,0,0,0.12)]"
                  aria-label={`Play: ${v.label}`}
                >
                  <div className="relative aspect-[9/16] md:aspect-[4/5] xl:aspect-[5/6]">
                    {activeDesktopId === v.videoId ? (
                      <div className="absolute inset-0 bg-black">
                        <iframe
                          className="absolute inset-0 h-full w-full"
                          src={`https://www.youtube.com/embed/${v.videoId}?autoplay=1&rel=0&playsinline=1`}
                          title={v.label}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <>
                        <Image
                          src={v.thumbnail}
                          alt={v.label}
                          fill
                          sizes="(min-width: 1024px) 320px, (min-width: 768px) 300px, 78vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                        />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,186,88,0.2),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.22)_38%,rgba(0,0,0,0.84)_100%)]" />
                      </>
                    )}

                    <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                      <span className="inline-flex rounded-full border border-white/14 bg-black/26 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72 backdrop-blur-md">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="inline-flex rounded-full border border-white/14 bg-black/26 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/62 backdrop-blur-md">
                        Video
                      </span>
                    </div>

                    {activeDesktopId !== v.videoId && (
                      <>
                        <div className="absolute inset-x-0 top-[34%] flex items-center justify-center">
                          <div className="flex h-[78px] w-[78px] items-center justify-center rounded-full border border-white/18 bg-white/10 shadow-[0_0_0_12px_rgba(255,255,255,0.03),0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_0_16px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.4)] sm:h-[88px] sm:w-[88px]">
                            <Image src={PLAY_ICON} alt="Play" width={56} height={56} sizes="56px" className="drop-shadow-lg sm:h-[68px] sm:w-[68px]" />
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
                      </>
                    )}
                    {activeDesktopId === v.videoId && (
                      <div className="absolute right-4 top-4 z-10">
                        <span className="inline-flex rounded-full border border-white/16 bg-black/42 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/72 backdrop-blur-md">
                          Playing
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
