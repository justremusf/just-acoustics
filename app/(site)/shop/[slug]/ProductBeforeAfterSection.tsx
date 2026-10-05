"use client";

import { useState } from "react";
import Image from "next/image";
import { PRODUCT_PLAY_ICON } from "./productData";

export function ProductBeforeAfterSection() {
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const videos = [
    {
      videoId: "8DURhlYt3wQ",
      thumbnail: "/assets/webflow/69687b1239333b922d70b26a_Title.avif",
      label: "Meeting Room",
      category: "Meeting Room",
      note: "Clearer voices",
    },
    {
      videoId: "bm-q3dQWB6g",
      thumbnail: "/assets/webflow/69687d6c4e41c7a3a58f9107_Title.avif",
      label: "Noisy Restaurant",
      category: "Restaurant",
      note: "Comfortable dining",
    },
  ];

  return (
    <section className="home-shell page-hero-shell">
      <div className="flex flex-col gap-3">
        <div>
          <p className="page-kicker">Before and after</p>
          <h2
            className="m-0 mt-3 text-[clamp(34px,4vw,52px)] font-medium leading-[1.02] tracking-[-0.04em] text-[var(--color-dark-100)]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            Listen to the results yourself
          </h2>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {videos.map((video) => {
            const isActive = activeVideoId === video.videoId;

            return (
              <button
                key={video.videoId}
                type="button"
                onClick={() => setActiveVideoId(video.videoId)}
                className="group relative overflow-hidden rounded-[24px] border border-white/55 bg-white/35 p-0 text-left shadow-[0_18px_50px_rgba(0,0,0,0.08)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_28px_64px_rgba(0,0,0,0.12)]"
                aria-label={`Play ${video.label} result clip`}
              >
                <div className="relative aspect-[4/5] min-h-[300px]">
                  {isActive ? (
                    <div className="absolute inset-0 bg-black">
                      <iframe
                        className="absolute inset-0 h-full w-full"
                        src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&playsinline=1`}
                        title={video.label}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <>
                      <Image
                        src={video.thumbnail}
                        alt={video.label}
                        fill
                        sizes="(min-width: 1024px) 320px, (min-width: 768px) 30vw, 92vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.26)_42%,rgba(0,0,0,0.84))]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="inline-flex h-[76px] w-[76px] items-center justify-center rounded-full border border-white/18 bg-white/10 shadow-[0_0_0_10px_rgba(255,165,0,0.10),0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_0_15px_rgba(255,165,0,0.14),0_30px_72px_rgba(0,0,0,0.38)]">
                          <Image
                            src={PRODUCT_PLAY_ICON}
                            alt=""
                            width={58}
                            height={58}
                            sizes="58px"
                            className="h-[58px] w-[58px] drop-shadow-lg"
                          />
                        </span>
                      </div>
                    </>
                  )}

                  {!isActive && (
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <div className="rounded-[22px] border border-white/12 bg-[linear-gradient(180deg,rgba(20,20,20,0.28),rgba(8,8,8,0.82))] p-4 backdrop-blur-xl">
                        <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/58">
                          {video.category}
                        </p>
                        <h3
                          className="m-0 mt-3 text-[24px] font-medium leading-[1.02] tracking-[-0.9px] text-white"
                          style={{ fontFamily: "var(--font-heading)" }}
                        >
                          {video.label}
                        </h3>
                        <p className="m-0 mt-3 text-sm leading-6 text-white/62">
                          {video.note}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
