'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const asset = (name: string) => `/assets/studio-lander/${name}`

type SolutionLabel = {
  text: string
  href: string
  top?: string
  right?: string
  bottom?: string
  left?: string
}

type SolutionCard = {
  title: string
  image: string
  problem: string
  result: string
  labels: SolutionLabel[]
}

const solutions: SolutionCard[] = [
  {
    title: 'HDB Bedroom Studio',
    image: asset('solution-hdb.jpg'),
    problem: 'Muddiness, boxy sound, neighbor complaints.',
    result: 'Cleaner mixes, tighter bass, more accurate monitoring.',
    labels: [
      { text: 'Wall Panels', top: '14%', left: '12%', href: '/shop/standard-flexi-acoustic-panel' },
      { text: 'Bass Trap', bottom: '18%', left: '10%', href: '/shop/150mm-studio-bass-trap' },
    ],
  },
  {
    title: 'Condo Mixing Room',
    image: asset('solution-condo.jpg'),
    problem: 'Unclear low-end, harsh highs, translation issues.',
    result: 'Balanced room, better mixes that translate anywhere.',
    labels: [
      { text: 'Bass Traps', top: '20%', left: '12%', href: '/shop/150mm-studio-bass-trap' },
      { text: 'First Reflection', top: '34%', right: '12%', href: '/shop/standard-flexi-acoustic-panel' },
    ],
  },
  {
    title: 'Drum Room + Gobos',
    image: asset('solution-drum.jpg'),
    problem: 'Excessive reflections, uncontrolled bleed.',
    result: 'Focused drums, tighter sound, more punch.',
    labels: [
      { text: 'Gobos', top: '30%', left: '18%', href: '/contact' },
      { text: 'Bass Traps', bottom: '22%', left: '36%', href: '/shop/150mm-studio-bass-trap' },
    ],
  },
  {
    title: 'Ceiling Cloud for Tight Spaces',
    image: asset('solution-ceiling.jpg'),
    problem: 'Low ceiling, flutter echo, no space for thick panels.',
    result: 'Controlled reflections without losing headroom.',
    labels: [
      { text: 'Ceiling Cloud', top: '12%', left: '34%', href: '/shop/acoustic-ceiling-panels' },
      { text: 'Wall Panel', bottom: '22%', right: '10%', href: '/shop/standard-flexi-acoustic-panel' },
    ],
  },
]

const processSteps = [
  {
    number: '1',
    title: 'Site recce',
    image: asset('process-recce.jpg'),
    body: 'We understand your space, goals, and budget.',
    checks: ['Room measurement', 'Acoustic assessment', 'Discuss use + issues', 'Budget alignment'],
  },
  {
    number: '2',
    title: '3D studio proposal',
    image: asset('process-3d.jpg'),
    body: 'We design and simulate for your room.',
    checks: ['3D modelling', 'Acoustic simulation', 'Panel layout plan', 'Finishes & colours'],
  },
  {
    number: '3',
    title: 'Quote + install',
    image: asset('process-install.jpg'),
    body: 'Transparent quote. Professional installation.',
    checks: ['Transparent pricing', 'Quality materials', 'Expert installation', 'Aftercare support'],
  },
]

const shopProducts = [
  {
    title: 'Single Studio Panel',
    image: asset('product-panel.jpg'),
    subtitle: 'High-performance broadband panel',
    price: 'SGD 129',
    oldPrice: '',
    badge: 'Best seller',
    includes: 'Size: 600 x 1200 x 50mm',
  },
  {
    title: '6-Panel Starter Kit',
    image: asset('product-kit-6.jpg'),
    subtitle: 'Perfect for small rooms',
    price: 'SGD 699',
    oldPrice: 'SGD 798',
    badge: '',
    includes: 'Includes: 6 panels + mounting kit',
  },
  {
    title: '8-Panel Mix Room Kit',
    image: asset('product-kit-8.jpg'),
    subtitle: 'For serious mixing & production',
    price: 'SGD 1,249',
    oldPrice: 'SGD 1,498',
    badge: '',
    includes: 'Includes: 8 panels + mounting kit',
  },
]

const colours = [
  ['Charcoal', '#3d3d3d'],
  ['Black', '#111111'],
  ['Silver', '#b8b8b8'],
  ['Warm Grey', '#706b63'],
  ['Cream', '#d5c7b5'],
  ['Brown', '#6b4c38'],
  ['Navy', '#21354b'],
  ['Forest', '#2f5039'],
  ['Red', '#8f2d2d'],
]

function Waveform({ active, playing }: { active: 'before' | 'after'; playing: boolean }) {
  return (
    <div className="flex h-14 flex-1 items-center justify-between gap-[3px]">
      {Array.from({ length: 44 }).map((_, index) => {
        const height = 22 + Math.abs(Math.sin(index * 0.55)) * 36 + Math.abs(Math.cos(index * 0.25)) * 15
        const isLit = index < 20 || (playing && index % 4 === 0)
        return (
          <span
            key={index}
            className={[
              'block w-[3px] rounded-full transition-all duration-300',
              isLit ? 'bg-[var(--color-brand-orange)]' : 'bg-black/14',
              playing ? 'animate-pulse' : '',
            ].join(' ')}
            style={{ height: `${height}%`, animationDelay: `${index * 22}ms` }}
            aria-hidden="true"
          />
        )
      })}
    </div>
  )
}

function FrequencyGraph() {
  return (
    <div className="rounded-[14px] border border-black/8 bg-white px-3 py-2">
      <svg viewBox="0 0 220 82" className="h-[82px] w-full" aria-hidden="true">
        {[16, 32, 48, 64].map((y) => (
          <line key={y} x1="0" x2="220" y1={y} y2={y} stroke="rgba(0,0,0,0.07)" />
        ))}
        <path
          d="M0 66 C30 50 48 37 77 30 C105 24 143 22 176 26 C195 29 208 43 220 55"
          fill="none"
          stroke="#ffa500"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex justify-between text-[9px] font-bold uppercase text-black/38">
        <span>125</span>
        <span>250</span>
        <span>500</span>
        <span>1k</span>
        <span>2k</span>
        <span>4k</span>
        <span>Hz</span>
      </div>
    </div>
  )
}

export default function StudioLanderClient() {
  const [audioMode, setAudioMode] = useState<'before' | 'after'>('before')
  const [isPlaying, setIsPlaying] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [thickness, setThickness] = useState('50mm')
  const [selectedColour, setSelectedColour] = useState('Charcoal')

  return (
    <main className="bg-white pb-6 text-[var(--color-dark-100)]">
      <div className="mx-auto flex max-w-[1580px] flex-col gap-4 px-3 py-4 sm:px-4 lg:gap-5">
        <section className="relative min-h-[660px] overflow-hidden rounded-[32px] bg-black text-white shadow-[0_28px_80px_rgba(0,0,0,0.18)] lg:min-h-[720px]">
          <Image
            src={asset('hero-studio.jpg')}
            alt="Dark music studio with acoustic panels and production desk"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-72"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.88)_0%,rgba(0,0,0,0.62)_42%,rgba(0,0,0,0.22)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-52 bg-gradient-to-t from-black/85 to-transparent" />

          <div className="relative z-10 flex min-h-[660px] flex-col p-5 sm:p-8 lg:min-h-[720px] lg:p-14">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <Link href="/" className="inline-flex items-center gap-3 text-white no-underline">
                <span className="text-3xl font-black leading-none text-[var(--color-brand-orange)]">|||</span>
                <span className="text-sm font-extrabold uppercase leading-4 tracking-[0.08em]">Just<br />Acoustics</span>
              </Link>
              <nav className="hidden items-center gap-8 text-xs font-semibold text-white/86 md:flex">
                <Link href="/spaces" className="transition-colors hover:text-[var(--color-brand-orange)]">Spaces</Link>
                <Link href="/shop" className="transition-colors hover:text-[var(--color-brand-orange)]">Shop</Link>
                <Link href="/projects" className="transition-colors hover:text-[var(--color-brand-orange)]">Projects</Link>
                <Link href="/blog" className="transition-colors hover:text-[var(--color-brand-orange)]">Resources</Link>
                <Link href="/about" className="transition-colors hover:text-[var(--color-brand-orange)]">About</Link>
              </nav>
              <Link
                href="/contact"
                className="rounded-full border border-white/18 bg-black/46 px-6 py-3 text-xs font-bold text-white shadow-[0_0_0_1px_rgba(255,165,0,0.35),0_14px_34px_rgba(255,165,0,0.18)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-brand-orange)]"
              >
                Get Studio Advice
              </Link>
            </div>

            <div className="mt-auto max-w-[690px] pb-10 pt-24">
              <span className="inline-flex rounded-full border border-[var(--color-brand-orange)] bg-black/30 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-brand-orange)] backdrop-blur-md">
                Music Studio Acoustics Singapore
              </span>
              <h1
                className="mt-7 mb-0 max-w-[620px] text-[52px] font-semibold leading-[0.94] tracking-[-0.05em] text-white sm:text-[76px] lg:text-[82px]"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Make your room tell the truth.
              </h1>
              <p className="mt-6 max-w-[560px] text-[17px] leading-8 text-white/82">
                Acoustic panels and bass traps for home studios, mixing rooms, vocal rooms, and compact spaces across Singapore.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link href="/contact" className="page-cta min-h-[58px] px-7">
                  Get Studio Room Advice <span aria-hidden="true">{'->'}</span>
                </Link>
                <a
                  href="#hear-difference"
                  className="inline-flex min-h-[58px] items-center justify-center gap-4 rounded-full border border-white/30 bg-white/8 px-7 text-sm font-bold text-white no-underline backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/14"
                >
                  Hear Before / After <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-black">▶</span>
                </a>
              </div>
              <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/18 bg-black/24 px-4 py-2 text-sm font-semibold text-white/86 backdrop-blur-md">
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[var(--color-brand-orange)] text-xs text-black">✓</span>
                Built for HDB, condo & professional studios
              </div>
            </div>
          </div>
        </section>

        <section id="hear-difference" className="rounded-[28px] border border-black/8 bg-[linear-gradient(180deg,#fff,#fafafa)] p-5 shadow-[0_18px_50px_rgba(0,0,0,0.07)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <h2 className="m-0 max-w-[420px] text-[36px] font-semibold leading-[0.98] tracking-[-0.04em] text-black sm:text-[44px]" style={{ fontFamily: 'var(--font-heading)' }}>
                Hear the difference before you book.
              </h2>
              <p className="mt-4 text-sm font-semibold text-black/58">Same room. Same mic. Only the acoustics changed.</p>
              <div className="mt-5 inline-flex rounded-full bg-black/6 p-1">
                {(['before', 'after'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setAudioMode(mode)}
                    className={`rounded-full px-7 py-2 text-xs font-bold capitalize transition-all ${audioMode === mode ? 'bg-[var(--color-brand-orange)] text-white shadow-sm' : 'text-black/62 hover:bg-white'}`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
              <div className="mt-5 rounded-[24px] border border-black/8 bg-white p-5 shadow-[0_14px_34px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setIsPlaying((value) => !value)}
                    className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-black text-white shadow-lg transition-transform hover:scale-105"
                    aria-label={isPlaying ? 'Pause demo' : 'Play demo'}
                  >
                    {isPlaying ? 'Ⅱ' : '▶'}
                  </button>
                  <Waveform active={audioMode} playing={isPlaying} />
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-black/6 pt-3 text-[11px] font-bold text-black/46">
                  <span>Best experienced with headphones</span>
                  <span>0:00 / 0:20</span>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Before', asset('before-room.jpg'), 'bg-white/78 text-black'],
                ['After', asset('after-room.jpg'), 'bg-[var(--color-brand-orange)] text-white'],
              ].map(([label, image, badgeClass]) => (
                <div key={label} className="relative min-h-[340px] overflow-hidden rounded-[24px] border border-black/8 bg-black/5 shadow-[0_16px_42px_rgba(0,0,0,0.08)]">
                  <Image src={image} alt={`${label} acoustic studio room`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  <span className={`absolute left-1/2 top-5 -translate-x-1/2 rounded-full px-8 py-2 text-xs font-bold ${badgeClass}`}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.07)] sm:p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="m-0 text-[30px] font-semibold tracking-[-0.04em] text-black sm:text-[36px]" style={{ fontFamily: 'var(--font-heading)' }}>
              Solutions for every studio.
            </h2>
            <Link href="/spaces" className="hidden text-sm font-bold text-[var(--color-brand-orange)] no-underline transition-colors hover:text-black sm:inline-flex">
              View all solutions {'->'}
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {solutions.map((card) => (
              <article key={card.title} className="group overflow-hidden rounded-[20px] border border-black/8 bg-white shadow-[0_12px_34px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)]">
                <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
                  <Image src={card.image} alt={card.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  {card.labels.map((label) => (
                    <Link
                      key={label.text}
                      href={label.href}
                      className="absolute rounded-[8px] bg-[var(--color-brand-orange)] px-3 py-1.5 text-[10px] font-extrabold text-white shadow-lg transition-transform hover:scale-105"
                      style={{ top: label.top, bottom: label.bottom, left: label.left, right: label.right }}
                    >
                      {label.text}
                    </Link>
                  ))}
                </div>
                <div className="p-4">
                  <h3 className="m-0 text-lg font-semibold tracking-[-0.02em] text-black" style={{ fontFamily: 'var(--font-heading)' }}>{card.title}</h3>
                  <p className="mt-4 mb-0 text-xs leading-5 text-black/62"><strong className="text-black">Problem:</strong> {card.problem}</p>
                  <p className="mt-2 mb-0 text-xs leading-5 text-black/62"><strong className="text-black">Result:</strong> {card.result}</p>
                  <Link href="/contact" className="mt-4 inline-flex text-xs font-bold text-[var(--color-brand-orange)] no-underline hover:text-black">Explore {'->'}</Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.07)] sm:p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="m-0 text-[30px] font-semibold tracking-[-0.04em] text-black sm:text-[36px]" style={{ fontFamily: 'var(--font-heading)' }}>
              Our process. Simple, practical, proven.
            </h2>
            <Link href="/about" className="hidden text-sm font-bold text-[var(--color-brand-orange)] no-underline transition-colors hover:text-black sm:inline-flex">
              Learn more about our process {'->'}
            </Link>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {processSteps.map((step) => (
              <article key={step.title} className="grid overflow-hidden rounded-[20px] border border-black/8 bg-white shadow-[0_12px_34px_rgba(0,0,0,0.05)] sm:grid-cols-[0.92fr_1.08fr]">
                <div className="p-5">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-[var(--color-brand-orange)] text-sm font-black text-white">{step.number}</span>
                  <h3 className="mt-4 mb-0 text-lg font-semibold text-black" style={{ fontFamily: 'var(--font-heading)' }}>{step.title}</h3>
                  <p className="mt-2 text-xs font-semibold leading-5 text-black/55">{step.body}</p>
                  <ul className="mt-4 space-y-2 pl-0 text-xs font-semibold text-black/68">
                    {step.checks.map((check) => (
                      <li key={check} className="flex gap-2"><span className="text-[var(--color-brand-orange)]">✓</span>{check}</li>
                    ))}
                  </ul>
                </div>
                <div className="relative min-h-[230px] bg-black/5">
                  <Image src={step.image} alt={step.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative rounded-[28px] border border-black/8 bg-white p-5 shadow-[0_18px_50px_rgba(0,0,0,0.07)] sm:p-8">
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="m-0 text-[30px] font-semibold tracking-[-0.04em] text-black sm:text-[36px]" style={{ fontFamily: 'var(--font-heading)' }}>
              Shop acoustic panels & kits.
            </h2>
            <Link href="/shop" className="hidden text-sm font-bold text-[var(--color-brand-orange)] no-underline transition-colors hover:text-black sm:inline-flex">
              View all products {'->'}
            </Link>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {shopProducts.map((product) => (
              <article key={product.title} className="rounded-[20px] border border-black/8 bg-white p-4 shadow-[0_12px_34px_rgba(0,0,0,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.1)]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[14px] bg-black/5">
                  <Image src={product.image} alt={product.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  {product.badge && <span className="absolute left-3 top-3 rounded-full bg-[var(--color-brand-orange)] px-3 py-1 text-[10px] font-black text-white">{product.badge}</span>}
                </div>
                <h3 className="mt-4 mb-0 text-lg font-semibold text-black" style={{ fontFamily: 'var(--font-heading)' }}>{product.title}</h3>
                <p className="mt-1 mb-0 text-xs font-semibold text-black/48">{product.subtitle}</p>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xl font-black text-black">{product.price}</span>
                  {product.oldPrice && <span className="text-xs font-semibold text-black/36 line-through">{product.oldPrice}</span>}
                </div>
                <p className="mt-1 text-[11px] font-bold text-black/46">{product.includes}</p>
                <div className="mt-4 flex gap-1.5">
                  {colours.slice(0, 6).map(([name, hex]) => (
                    <span key={name} title={name} className="h-5 w-5 rounded-full border border-black/10" style={{ backgroundColor: hex }} />
                  ))}
                  <span className="text-[10px] font-bold text-black/42">+6</span>
                </div>
                <div className="mt-4"><FrequencyGraph /></div>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="mt-4 flex min-h-[46px] w-full items-center justify-center rounded-full bg-black text-xs font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/88"
                >
                  Quick View
                </button>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-3 rounded-[24px] border border-black/8 bg-white p-4 shadow-[0_14px_36px_rgba(0,0,0,0.06)] sm:grid-cols-2 lg:grid-cols-4">
          {['Made in Singapore', 'Free site assessment', 'Professional installation', 'Transparent pricing'].map((item) => (
            <div key={item} className="flex items-center gap-3 rounded-[16px] bg-black/[0.03] p-4 text-sm font-bold text-black">
              <span className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white text-[var(--color-brand-orange)]">✓</span>
              {item}
            </div>
          ))}
        </section>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/42 p-3 backdrop-blur-sm sm:items-center">
          <div className="relative max-h-[92vh] w-full max-w-[470px] overflow-y-auto rounded-[24px] border border-black/10 bg-white p-5 text-black shadow-[0_30px_90px_rgba(0,0,0,0.22)]">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-white text-lg transition-colors hover:bg-black hover:text-white"
              aria-label="Close quick view"
            >
              ×
            </button>
            <div className="grid gap-4 sm:grid-cols-[1fr_150px]">
              <div>
                <h2 className="m-0 pr-8 text-xl font-semibold text-black" style={{ fontFamily: 'var(--font-heading)' }}>Single Studio Panel</h2>
                <p className="mt-1 text-xs font-semibold text-black/48">High-performance broadband panel</p>
                <p className="mt-2 text-xs font-bold text-black/68"><span className="text-[var(--color-brand-orange)]">★★★★★</span> 4.9 (126 reviews)</p>
              </div>
              <div className="relative h-36 overflow-hidden rounded-[16px] bg-black/5">
                <Image src={asset('product-panel.jpg')} alt="Single studio panel" fill sizes="150px" className="object-cover" />
              </div>
            </div>
            <div className="mt-5 border-t border-black/8 pt-4">
              <p className="page-kicker">Thickness</p>
              <div className="mt-3 flex gap-2">
                {['50mm', '75mm', '100mm'].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setThickness(value)}
                    className={`rounded-[10px] border px-4 py-2 text-xs font-bold transition-all ${thickness === value ? 'border-[var(--color-brand-orange)] bg-[var(--color-brand-orange)] text-white' : 'border-black/10 bg-white text-black hover:border-black/28'}`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5 border-t border-black/8 pt-4">
              <p className="page-kicker">Colours</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {colours.map(([name, hex]) => (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => setSelectedColour(name)}
                    className={`grid h-9 w-9 place-items-center rounded-full border transition-all ${selectedColour === name ? 'border-black ring-2 ring-[var(--color-brand-orange)] ring-offset-2' : 'border-black/14 hover:border-black/34'}`}
                  >
                    <span className="h-7 w-7 rounded-full border border-black/10" style={{ backgroundColor: hex }} />
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs font-semibold text-black/52">{selectedColour}</p>
            </div>
            <div className="mt-5 border-t border-black/8 pt-4">
              <p className="page-kicker">Frequency Response</p>
              <div className="mt-3"><FrequencyGraph /></div>
            </div>
            <div className="mt-5 border-t border-black/8 pt-4">
              <p className="page-kicker">About</p>
              <ul className="mt-3 space-y-2 pl-0 text-xs font-semibold leading-5 text-black/66">
                {['Broadband absorption across the frequency range', 'Reduces early reflections and flutter echo', 'Improves clarity and stereo imaging', 'Made in Singapore'].map((item) => (
                  <li key={item} className="flex gap-2"><span className="text-[var(--color-brand-orange)]">✓</span>{item}</li>
                ))}
              </ul>
            </div>
            <Link
              href="/shop/standard-flexi-acoustic-panel"
              className="mt-5 flex min-h-[52px] items-center justify-center rounded-[14px] bg-black text-sm font-bold text-white no-underline shadow-[0_12px_28px_rgba(255,165,0,0.22)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-black/88"
            >
              Add to Cart - SGD 129
            </Link>
          </div>
        </div>
      )}
    </main>
  )
}
