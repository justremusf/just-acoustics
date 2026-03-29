import Image from 'next/image'

const videos = [
  {
    href: 'https://youtube.com/watch?v=8DURhlYt3wQ',
    thumbnail: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69687b1239333b922d70b26a_Title.avif',
    label: 'Meeting Room Transformation',
  },
  {
    href: 'https://www.youtube.com/watch?v=bm-q3dQWB6g',
    thumbnail: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69687d6c4e41c7a3a58f9107_Title.avif',
    label: 'Restaurant Acoustic Treatment',
  },
  {
    href: 'https://www.youtube.com/watch?v=Y9b0NNTRnFw',
    thumbnail: 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/69687c96d1feff52c5d91be4_3.avif',
    label: 'Church Sound Improvement',
  },
]

const PLAY_ICON = 'https://cdn.prod.website-files.com/6962571d2d02027389a12edb/6967a0f62bd9b7dce9e01040_Play%20icon.png'

export default function HearTheDifference() {
  return (
    <section className="py-20">
      <div className="max-w-[1280px] mx-auto px-5">
        <div className="text-center mb-14">
          <h2
            className="text-[var(--color-dark-100)] m-0 mb-4"
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
            <a
              key={v.href}
              href={v.href}
              target="_blank"
              rel="noopener noreferrer"
              className="relative block rounded-[16px] overflow-hidden no-underline group"
              aria-label={v.label}
            >
              <Image
                src={v.thumbnail}
                alt={v.label}
                width={430}
                height={280}
                className="w-full object-cover"
                unoptimized
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors">
                <Image
                  src={PLAY_ICON}
                  alt="Play"
                  width={70}
                  height={70}
                  className="drop-shadow-lg"
                  unoptimized
                />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
