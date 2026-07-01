'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, MessageSquare, Volume2, Sparkles, ShieldCheck, Play, ChevronDown, ChevronUp } from 'lucide-react'
import {
  type RoomType,
  type MainProblem,
  calculatePanels,
  generateWhatsAppUrl,
} from '@/lib/panel-calculator'

// ─── Asset helpers ───────────────────────────────────────────────────────────
const pricingAsset = (name: string) => `/assets/pricing/${name}`

// ─── Hero slideshow ───────────────────────────────────────────────────────────
const HERO_SLIDES = [
  {
    image: pricingAsset('church_hero1.png'),
    headline: 'Worship with\nAbsolute Clarity.',
  },
  {
    image: pricingAsset('church_hero2.png'),
    headline: 'Hear Every\nWord, Clean.',
  },
  {
    image: pricingAsset('church.jpg'),
    headline: 'Sanctuaries\nTransformed.',
  },
]

// ─── Case studies ─────────────────────────────────────────────────────────────
const CASE_STUDIES = [
  {
    id: 'ppcoc',
    churchName: 'PPCOC',
    fullName: 'Pasir Panjang Christ Church of China',
    location: 'Pasir Panjang, Singapore',
    description:
      'A multi-room project addressing long reverberation in a large sanctuary and adjacent fellowship hall. Panels were installed to integrate seamlessly with the existing interior aesthetic.',
    images: [
      {
        roomName: 'Sanctuary',
        src: pricingAsset('church_hero1.png'),
        hotspots: [
          { text: 'Flexi Wall Panels', top: '22%', left: '14%', href: '/shop/standard-flexi-acoustic-panel' },
          { text: 'Ceiling Cloud Grid', top: '8%', left: '52%', href: '/shop/acoustic-ceiling-panels' },
        ],
      },
      {
        roomName: 'Fellowship Hall',
        src: pricingAsset('church.jpg'),
        hotspots: [
          { text: 'Custom Print Panels', top: '36%', left: '20%', href: '/shop/custom-print-acoustic-panel' },
          { text: 'Broadband Absorbers', top: '44%', left: '72%', href: '/shop/standard-flexi-acoustic-panel' },
        ],
      },
    ],
    videoId: 'Y9b0NNTRnFw',
  },
  {
    id: 'lengkwang',
    churchName: 'Leng Kwang Baptist',
    fullName: 'Leng Kwang Baptist Church',
    location: 'Geylang, Singapore',
    description:
      'Flutter echo and low-mid frequency buildup in a high-ceiling sanctuary made sermon delivery difficult. Broadband ceiling clouds dramatically improved intelligibility in every row.',
    images: [
      {
        roomName: 'Main Sanctuary',
        src: pricingAsset('church_hero2.png'),
        hotspots: [
          { text: 'Broadband Ceiling Cloud', top: '14%', left: '40%', href: '/shop/acoustic-ceiling-panels' },
          { text: 'Fabric Wall Panels', top: '34%', left: '18%', href: '/shop/standard-flexi-acoustic-panel' },
        ],
      },
    ],
    videoId: 'Y9b0NNTRnFw',
  },
  {
    id: 'grace',
    churchName: 'Grace Community',
    fullName: 'Grace Community Worship Hall',
    location: 'Bukit Timah, Singapore',
    description:
      'A modern concrete-ceiling conversion space used for hybrid worship and live streaming. Panels were placed to support both in-person clarity and clean room acoustics for recording.',
    images: [
      {
        roomName: 'Auditorium',
        src: pricingAsset('church.jpg'),
        hotspots: [
          { text: 'Corner Bass Traps', top: '30%', left: '12%', href: '/shop/150mm-studio-bass-trap' },
          { text: 'Ceiling Baffles', top: '8%', left: '64%', href: '/shop/acoustic-ceiling-panels' },
        ],
      },
    ],
    videoId: 'Y9b0NNTRnFw',
  },
]

// ─── Products ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    title: 'Flexi™ Acoustic Panel',
    image: '/assets/shop/standard-flexi/standard-flexi-1200x600.png',
    badge: 'Best Seller',
    description: 'Slim, fabric-wrapped panels ideal for wall placement at first-reflection points in sanctuaries.',
    href: '/shop/standard-flexi-acoustic-panel',
  },
  {
    title: 'Ceiling Cloud Panels',
    image: pricingAsset('church_hero2.png'),
    badge: 'Echo Control',
    description: 'Suspended cloud systems that absorb overhead flutter echoes in high-ceiling worship halls.',
    href: '/shop/acoustic-ceiling-panels',
  },
  {
    title: 'Custom Print Panels',
    image: pricingAsset('church.jpg'),
    badge: 'Aesthetic Fit',
    description: 'Print scripture, logos, or artwork directly onto high-performance acoustic surfaces.',
    href: '/shop/custom-print-acoustic-panel',
  },
]

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS = [
  {
    value: '100%',
    label: 'Speaker Quality',
    copy: 'Eliminate back-wall reflections so your PA system sounds the way it was designed to.',
  },
  {
    value: '>95%',
    label: 'Speech Clarity',
    copy: 'Every row hears every word — sermons, announcements, and worship vocals land clearly.',
  },
  {
    value: '-60%',
    label: 'Echo Reduction',
    copy: 'A comfortable, calm sanctuary where members can focus on worship rather than strain to hear.',
  },
]

// ─── Process steps ────────────────────────────────────────────────────────────
const STEPS = [
  { num: '1', title: 'Send Photos/Videos', copy: 'Share photos, video clips, or a floor plan of your sanctuary.', icon: <MessageSquare className="h-5 w-5" /> },
  { num: '2', title: 'Consultation Call', copy: 'We contact you to understand your specific acoustic problems.', icon: <Volume2 className="h-5 w-5" /> },
  { num: '3', title: '3-Point Site Assessment', copy: 'On-site frequency measurements, flutter echo tests, and layout analysis.', icon: <MapPin className="h-5 w-5" /> },
  { num: '4', title: '3D Design & Simulation', copy: 'Our engineers model your space and recommend panel placement visually.', icon: <Sparkles className="h-5 w-5" /> },
  { num: '5', title: 'Hassle-Free Install', copy: 'Dustless drilling, discrete hardware, and a clean finish from our certified team.', icon: <ShieldCheck className="h-5 w-5" /> },
]

// ─── Testimonials ─────────────────────────────────────────────────────────────
const REVIEWS = [
  {
    quote: 'The difference in clarity is night and day. Preaching felt tiring before — the echo was severe. Now members can hear every syllable, even in the back row.',
    author: 'Pastor Marcus Tan',
    role: 'Senior Pastor, Pasir Panjang Fellowship',
    initials: 'MT',
  },
  {
    quote: 'We were worried panels would ruin our architecture, but Just Acoustics customised the fabric to match our wood finishes perfectly. Highly recommended.',
    author: 'Bro. David Lim',
    role: 'AV Administrator, Leng Kwang Baptist',
    initials: 'DL',
  },
  {
    quote: 'The 3D proposal helped us explain the budget and benefit to our church council. The dustless installation was fast and did not disrupt our services.',
    author: 'Sis. Evelyn Ng',
    role: 'Operations Manager, Grace Auditorium',
    initials: 'EN',
  },
]

// ─── FAQs ─────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    q: 'How many panels does our sanctuary need?',
    a: 'Coverage depends on the room volume, layout, and surface materials. On average, treating 20–30% of the wall and ceiling area resolves most speech intelligibility and flutter echo issues. We confirm the exact amount through our 3D simulation.',
  },
  {
    q: 'Why is our church so echoey?',
    a: 'Most sanctuaries have tall ceilings and hard surfaces like concrete, brick, tile, or glass. Sound waves bounce off these without being absorbed, creating a long reverberation time that causes words to overlap and sound muddy.',
  },
  {
    q: 'Does installation require drilling?',
    a: 'Yes, secure mechanical fastening is required for ceiling clouds and wall panels. Our team uses dustless drilling methods and discrete hardware so the process is clean, fast, and safe for your congregation.',
  },
  {
    q: 'Can members still hear with the panels installed?',
    a: 'Yes — acoustic panels absorb excess reflections while preserving natural room ambience. They do not over-dampen the space. The result is clarity, not silence.',
  },
  {
    q: 'How much does church acoustic treatment cost?',
    a: 'A basic wall panel package for small halls starts around SGD 1,500. Full design, simulation, and professional installation for large main sanctuaries typically ranges between SGD 5,000 and SGD 25,000.',
  },
]

// ─── Inline Calculator ────────────────────────────────────────────────────────

type CalcStep = 1 | 2 | 3 | 4

const ROOM_OPTIONS: { id: RoomType; label: string }[] = [
  { id: 'church', label: 'Church / Worship Hall' },
  { id: 'office', label: 'Office / Meeting' },
  { id: 'restaurant', label: 'Restaurant / Café' },
  { id: 'tuition', label: 'Tuition / Classroom' },
  { id: 'gym', label: 'Gym / Fitness Studio' },
  { id: 'residential', label: 'Residential Space' },
  { id: 'studio', label: 'Home Studio / Music' },
  { id: 'other', label: 'Other Space' },
]

const PROBLEM_OPTIONS: { id: MainProblem; label: string }[] = [
  { id: 'echo', label: 'Echo & reverberation' },
  { id: 'speech', label: 'Speech is unclear' },
  { id: 'loud', label: 'Room gets too loud when busy' },
  { id: 'video', label: 'Video calls sound boxy / echoey' },
  { id: 'music', label: 'Music sounds harsh / muddy' },
  { id: 'noise', label: 'Noise leaking to another room' },
  { id: 'unsure', label: 'Not sure / multiple issues' },
]

function PanelCalculator() {
  const [step, setStep] = useState<CalcStep>(1)
  const [roomType, setRoomType] = useState<RoomType>('church')
  const [problem, setProblem] = useState<MainProblem>('echo')
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const progressPct = step === 4 ? 100 : ((step - 1) / 3) * 100

  const results = useMemo(() => {
    if (!length || !width || !height) return null
    return calculatePanels({
      roomType,
      mainProblem: problem,
      length: Number(length),
      width: Number(width),
      height: Number(height),
      treatmentArea: 'unsure',
      severity: 'noticeable',
    })
  }, [roomType, problem, length, width, height])

  const validate = () => {
    const e: Record<string, string> = {}
    const l = Number(length), w = Number(width), h = Number(height)
    if (!length || isNaN(l) || l < 1 || l > 80) e.length = 'Must be 1–80 m'
    if (!width || isNaN(w) || w < 1 || w > 80) e.width = 'Must be 1–80 m'
    if (!height || isNaN(h) || h < 2 || h > 12) e.height = 'Must be 2–12 m'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleGenerate = () => {
    if (validate()) setStep(4)
  }

  const handleWhatsApp = () => {
    if (!results) return
    const url = generateWhatsAppUrl(
      { roomType, mainProblem: problem, length: Number(length), width: Number(width), height: Number(height), treatmentArea: 'unsure', severity: 'noticeable' },
      results
    )
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const MAX_VIS = 24
  const minVis = results ? Math.min(results.recommendedMin, MAX_VIS) : 0
  const diffVis = results ? Math.max(0, Math.min(results.recommendedMax - results.recommendedMin, MAX_VIS - minVis)) : 0
  const capped = results ? results.recommendedMax > MAX_VIS : false
  const cappedN = results ? results.recommendedMax - (minVis + diffVis) : 0

  return (
    <div className="glass-card section-shell-pad">
      {/* Progress */}
      {step < 4 && (
        <div className="mb-6">
          <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-black/5">
            <div
              className="h-full rounded-full bg-[var(--color-brand-orange)] transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-gray-200)]">
            Step {step} of 3
          </span>
        </div>
      )}

      {/* Step 1 — Room Type */}
      {step === 1 && (
        <div>
          <h3 className="home-heading text-[var(--color-dark-100)]" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>
            Select room type
          </h3>
          <p className="home-copy mt-3 mb-6">Choose the space where you want to control echo and noise.</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {ROOM_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => { setRoomType(opt.id); setTimeout(() => setStep(2), 180) }}
                className={[
                  'rounded-[16px] border px-3 py-4 text-center text-sm font-semibold transition-all duration-200',
                  roomType === opt.id
                    ? 'border-[var(--color-brand-orange)] bg-[rgba(255,165,0,0.06)] text-[var(--color-dark-100)] shadow-[0_4px_12px_rgba(255,165,0,0.12)]'
                    : 'border-black/8 bg-white/70 text-[var(--color-gray-100)] hover:-translate-y-0.5 hover:border-[rgba(255,165,0,0.3)]',
                ].join(' ')}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2 — Main Problem */}
      {step === 2 && (
        <div>
          <h3 className="home-heading text-[var(--color-dark-100)]" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>
            What's the main issue?
          </h3>
          <p className="home-copy mt-3 mb-5">Identify the acoustic problem you want to solve.</p>
          <div className="relative mb-6">
            <select
              value={problem}
              onChange={(e) => setProblem(e.target.value as MainProblem)}
              className="w-full appearance-none rounded-[14px] border border-black/8 bg-white px-4 py-4 pr-10 text-sm font-semibold text-[var(--color-dark-100)] transition-all focus:border-[var(--color-brand-orange)] focus:outline-none focus:ring-2 focus:ring-[rgba(255,165,0,0.14)]"
            >
              {PROBLEM_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-gray-200)]" />
          </div>
          {problem === 'noise' && (
            <div className="mb-5 rounded-[14px] border border-[rgba(255,165,0,0.18)] bg-[rgba(255,165,0,0.05)] p-4 text-sm text-[var(--color-gray-100)]">
              <strong className="text-[var(--color-dark-100)]">Note:</strong> Acoustic panels reduce internal echoes, not structural sound leakage through walls. You can still calculate panels to treat internal reflections.
            </div>
          )}
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-5 py-3 text-sm font-bold text-[var(--color-gray-100)] transition-all hover:bg-black/[0.02]">Back</button>
            <button type="button" onClick={() => setStep(3)} className="page-cta flex-1">Next Step</button>
          </div>
        </div>
      )}

      {/* Step 3 — Dimensions */}
      {step === 3 && (
        <div>
          <h3 className="home-heading text-[var(--color-dark-100)]" style={{ fontSize: 'clamp(22px, 3vw, 32px)' }}>
            Enter room dimensions
          </h3>
          <p className="home-copy mt-3 mb-5">Enter length, width, and height in metres.</p>
          <div className="mb-5 grid grid-cols-3 gap-3">
            {[
              { field: 'length' as const, label: 'Length', placeholder: '15', val: length, set: setLength },
              { field: 'width' as const, label: 'Width', placeholder: '12', val: width, set: setWidth },
              { field: 'height' as const, label: 'Height', placeholder: '6', val: height, set: setHeight },
            ].map(({ field, label, placeholder, val, set }) => (
              <div key={field}>
                <label htmlFor={`calc-${field}`} className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-gray-200)]">{label}</label>
                <div className="relative">
                  <input
                    id={`calc-${field}`}
                    type="number"
                    inputMode="decimal"
                    placeholder={placeholder}
                    value={val}
                    onChange={(e) => { set(e.target.value); setErrors(prev => ({ ...prev, [field]: '' })) }}
                    className={[
                      'w-full rounded-[14px] border bg-white py-3.5 pl-4 pr-8 text-sm font-semibold transition-all focus:outline-none focus:ring-2',
                      errors[field]
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-100'
                        : 'border-black/8 focus:border-[var(--color-brand-orange)] focus:ring-[rgba(255,165,0,0.14)]',
                    ].join(' ')}
                  />
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-bold uppercase text-[var(--color-gray-200)]">m</span>
                </div>
                {errors[field] && <p className="mt-1 text-[11px] text-red-500">{errors[field]}</p>}
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="inline-flex items-center justify-center rounded-full border border-black/8 bg-white px-5 py-3 text-sm font-bold text-[var(--color-gray-100)] transition-all hover:bg-black/[0.02]">Back</button>
            <button type="button" onClick={handleGenerate} className="page-cta flex-1">Generate Estimate</button>
          </div>
        </div>
      )}

      {/* Step 4 — Results */}
      {step === 4 && results && (
        <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
          {/* Left */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-black/6 pb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(255,165,0,0.2)] bg-[rgba(255,165,0,0.08)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-brand-orange)]">
                Result
              </span>
              <button type="button" onClick={() => { setStep(1); setLength(''); setWidth(''); setHeight(''); setErrors({}) }} className="text-[13px] font-bold text-[var(--color-gray-200)] transition-colors hover:text-[var(--color-brand-orange)]">
                ← Recalculate
              </button>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-gray-200)]">Recommended Quantity</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-[3.5rem] font-semibold leading-tight tracking-[-2px] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {results.recommendedMin}–{results.recommendedMax}
                </span>
                <span className="text-lg font-semibold text-[var(--color-brand-orange)]">panels</span>
              </div>
              <p className="text-sm text-[var(--color-gray-100)]">
                Standard <strong>1.2 m × 0.6 m</strong> panels (0.72 sqm each, 50 mm thick).
              </p>
            </div>

            {/* Panel visualiser */}
            <div className="rounded-[14px] border border-dashed border-black/8 bg-black/[0.015] p-4">
              <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(26px, 1fr))' }}>
                {Array.from({ length: minVis }).map((_, i) => (
                  <div key={`m${i}`} className="aspect-[1/2] rounded-sm bg-[var(--color-brand-orange)] shadow-[0_1px_3px_rgba(255,165,0,0.15)]" />
                ))}
                {Array.from({ length: diffVis }).map((_, i) => (
                  <div key={`d${i}`} className="aspect-[1/2] rounded-sm border border-dashed border-[var(--color-brand-orange)] bg-[rgba(255,165,0,0.14)]" />
                ))}
                {capped && (
                  <div className="col-span-2 flex items-center justify-center text-[11px] font-bold text-[var(--color-brand-orange)]">+{cappedN}</div>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-4 text-[12px] text-[var(--color-gray-200)]">
                <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-2 rounded-sm bg-[var(--color-brand-orange)]" /> Baseline ({results.recommendedMin})</span>
                <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-2 rounded-sm border border-dashed border-[var(--color-brand-orange)] bg-[rgba(255,165,0,0.14)]" /> Upper range (+{results.recommendedMax - results.recommendedMin})</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={handleWhatsApp} type="button" className="page-cta w-full">
                Get Free Personalised Plan
              </button>
              <Link href="/shop" className="flex min-h-[48px] items-center justify-center rounded-full border border-black/10 bg-white text-sm font-bold text-[var(--color-dark-100)] transition-all hover:border-black/20 hover:bg-black/[0.02]">
                Browse Acoustic Products
              </Link>
            </div>
          </div>

          {/* Right — placement guidance */}
          <div className="flex flex-col gap-4 border-t border-black/6 pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
            <div>
              <p className="page-kicker text-[var(--color-brand-orange)]">Placement Guidance</p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-gray-100)]">{results.placementGuidance}</p>
            </div>
            <div className="rounded-[16px] border border-black/6 bg-white p-4">
              <p className="page-kicker mb-3">What panels do</p>
              <ul className="space-y-2 text-sm text-[var(--color-gray-100)]">
                <li className="flex gap-2"><span className="shrink-0 font-bold text-green-500">✓</span> Reduce internal echo and flutter noise</li>
                <li className="flex gap-2"><span className="shrink-0 font-bold text-green-500">✓</span> Improve speech clarity throughout the space</li>
                <li className="flex gap-2"><span className="shrink-0 font-bold text-red-400">✗</span> Stop noise leaking through walls</li>
                <li className="flex gap-2"><span className="shrink-0 font-bold text-red-400">✗</span> Block outside traffic or street noise</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function ChurchLanderClient() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeCaseId, setActiveCaseId] = useState('ppcoc')
  const [activeRoomIdx, setActiveRoomIdx] = useState(0)
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const iv = setInterval(() => setActiveSlide((c) => (c + 1) % HERO_SLIDES.length), 6000)
    return () => clearInterval(iv)
  }, [])

  const activeCase = CASE_STUDIES.find((c) => c.id === activeCaseId) ?? CASE_STUDIES[0]

  return (
    <div className="page-wrap page-stack overflow-x-hidden">

      {/* ── Hero Slideshow ────────────────────────────────────────────────── */}
      <section className="home-shell page-hero-shell relative min-h-[580px] overflow-hidden p-0 text-white sm:min-h-[660px]">
        {HERO_SLIDES.map((slide, i) => (
          <Image
            key={i}
            src={slide.image}
            alt={slide.headline.replace('\n', ' ')}
            fill
            priority={i === 0}
            className={[
              'object-cover transition-opacity duration-1000',
              i === activeSlide ? 'opacity-70' : 'opacity-0 pointer-events-none',
            ].join(' ')}
          />
        ))}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.86)_0%,rgba(0,0,0,0.54)_48%,rgba(0,0,0,0.18)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />

        <div className="relative z-10 flex min-h-[580px] flex-col p-5 sm:min-h-[660px] sm:p-8 lg:p-12">
          {/* Hero content */}
          <div className="mt-auto max-w-[760px] pb-8 pt-16">
            <span className="soft-pill border-white/18 bg-black/32 text-white/80 backdrop-blur-md">
              ✦ Church &amp; Worship Hall Acoustics
            </span>
            <h1
              className="mt-4 whitespace-pre-line text-[48px] font-medium leading-[0.95] tracking-[-0.045em] text-white sm:text-[68px] lg:text-[78px]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {HERO_SLIDES[activeSlide].headline}
            </h1>
            <p className="mt-5 max-w-[560px] text-[16px] leading-7 text-white/82">
              Singapore's specialist acoustic team for houses of worship. We design and install custom panels that make every word and note land clearly.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/contact" className="page-cta">
                Get Free Sanctuary Assessment <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
              <Link
                href="#hear-results"
                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 text-sm font-bold text-white backdrop-blur-md transition-all hover:-translate-y-0.5 hover:bg-white/18"
              >
                <Play className="h-4 w-4 fill-white text-white" /> Hear the Results
              </Link>
            </div>

            {/* Slide dots */}
            <div className="mt-10 flex gap-2">
              {HERO_SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === activeSlide ? 'w-8 bg-[var(--color-brand-orange)]' : 'w-2 bg-white/30'}`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Benefits + Stats ──────────────────────────────────────────────── */}
      <section className="home-shell section-shell-pad">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <span className="soft-pill">Acoustic Advantage</span>
            <h2 className="home-heading mt-4 text-[var(--color-dark-100)]">
              Elevate your service.<br />Engage your congregation.
            </h2>
            <p className="home-copy mt-5 max-w-[52ch]">
              Acoustic treatment isn't about soundproofing the building — it's about tuning the interior so the word can be spoken and received with absolute clarity.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              {[
                { head: 'Custom Fabric Swatches', body: "Over 30 colour options to match your church's existing interior design seamlessly." },
                { head: 'Fire-Rated Materials', body: 'All panels use commercial-grade cores that meet Singapore fire safety regulations.' },
              ].map((item) => (
                <div key={item.head} className="glass-card flex gap-4 p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(255,165,0,0.1)] text-[var(--color-brand-orange)] font-bold">✓</span>
                  <div>
                    <p className="m-0 text-sm font-bold text-[var(--color-dark-100)]">{item.head}</p>
                    <p className="m-0 mt-1 text-[13px] text-[var(--color-gray-100)]">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="glass-card flex flex-col justify-between p-5">
                <span
                  className="text-[44px] font-black leading-none text-[var(--color-brand-orange)]"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {s.value}
                </span>
                <div className="mt-4">
                  <p className="m-0 text-sm font-bold text-[var(--color-dark-100)]">{s.label}</p>
                  <p className="m-0 mt-2 text-[13px] text-[var(--color-gray-100)]">{s.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Case Studies ──────────────────────────────────────────────────── */}
      <section className="home-shell section-shell-pad">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="soft-pill">Case Studies</span>
            <h2 className="home-heading mt-4 text-[var(--color-dark-100)]">
              Proven results in Singaporean sanctuaries.
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {CASE_STUDIES.map((cs) => (
              <button
                key={cs.id}
                onClick={() => { setActiveCaseId(cs.id); setActiveRoomIdx(0); setActiveVideoId(null) }}
                className={`rounded-full px-4 py-2 text-[13px] font-bold transition-all ${activeCaseId === cs.id ? 'bg-[var(--color-dark-100)] text-white' : 'bg-black/6 text-black/60 hover:bg-black/10'}`}
              >
                {cs.churchName}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Image + hotspots */}
          <div>
            <div id="hear-results" className="relative aspect-[16/10] overflow-hidden rounded-[24px] border border-black/8 bg-black/5 shadow-md">
              <Image
                src={activeCase.images[activeRoomIdx].src}
                alt={`${activeCase.fullName} — ${activeCase.images[activeRoomIdx].roomName}`}
                fill
                sizes="(max-width: 1024px) 100vw, 56vw"
                className="object-cover transition-all duration-500"
              />
              {activeCase.images[activeRoomIdx].hotspots.map((h, i) => (
                <div key={i} className="group absolute z-20" style={{ top: h.top, left: h.left }}>
                  <span className="absolute inline-flex h-5 w-5 animate-ping rounded-full bg-[var(--color-brand-orange)] opacity-60" />
                  <span className="relative flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[var(--color-brand-orange)] text-[10px] font-bold text-white shadow-lg">+</span>
                  <Link
                    href={h.href}
                    className="absolute left-6 top-1/2 -translate-y-1/2 origin-left scale-0 whitespace-nowrap rounded-[8px] bg-[var(--color-dark-100)] px-3 py-1.5 text-[11px] font-bold text-white no-underline shadow-xl transition-all duration-200 group-hover:scale-100"
                  >
                    {h.text} <span className="text-[var(--color-brand-orange)]">→</span>
                  </Link>
                </div>
              ))}
            </div>
            {activeCase.images.length > 1 && (
              <div className="mt-3 flex gap-2">
                {activeCase.images.map((room, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveRoomIdx(idx)}
                    className={`rounded-full border px-4 py-1.5 text-[13px] font-semibold transition-all ${idx === activeRoomIdx ? 'border-[var(--color-dark-100)] bg-[var(--color-dark-100)] text-white' : 'border-black/10 bg-white text-black/60 hover:bg-black/5'}`}
                  >
                    {room.roomName}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info + video player */}
          <div className="flex flex-col justify-between gap-6">
            <div>
              <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-gray-200)]">
                <MapPin className="h-3.5 w-3.5" /> {activeCase.location}
              </p>
              <h3 className="m-0 mt-3 text-[22px] font-medium leading-tight tracking-tight text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                {activeCase.fullName}
              </h3>
              <p className="mt-4 text-sm leading-7 text-[var(--color-gray-100)]">{activeCase.description}</p>
            </div>

            {/* Hear Results — YouTube embed */}
            <div className="glass-card overflow-hidden">
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                {activeVideoId === activeCase.videoId ? (
                  <iframe
                    className="absolute inset-0 h-full w-full"
                    src={`https://www.youtube.com/embed/${activeCase.videoId}?autoplay=1&rel=0&playsinline=1`}
                    title={`${activeCase.fullName} — Before & After`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveVideoId(activeCase.videoId)}
                    className="group absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-dark-100)] text-white"
                    aria-label="Play before & after audio"
                  >
                    <Image
                      src={activeCase.images[activeRoomIdx].src}
                      alt=""
                      fill
                      className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-brand-orange)] shadow-[0_0_0_12px_rgba(255,165,0,0.12),0_24px_60px_rgba(0,0,0,0.4)] transition-all duration-500 group-hover:scale-[1.06] group-hover:shadow-[0_0_0_18px_rgba(255,165,0,0.15)]">
                        <Play className="h-5 w-5 translate-x-[2px] fill-white text-white" />
                      </span>
                      <p className="m-0 text-[13px] font-bold text-white">Hear the Results</p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products ──────────────────────────────────────────────────────── */}
      <section className="home-shell section-shell-pad">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="soft-pill">Recommended Products</span>
            <h2 className="home-heading mt-4 text-[var(--color-dark-100)]">Sanctuary-ready solutions.</h2>
          </div>
          <Link href="/shop" className="home-link hidden sm:inline-flex">
            All products →
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {PRODUCTS.map((prod) => (
            <article
              key={prod.title}
              className="glass-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.12),0_10px_28px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.78)_inset]"
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-b-none">
                <Image src={prod.image} alt={prod.title} fill className="object-cover" />
                <span className="absolute left-3 top-3 rounded-full bg-[var(--color-brand-orange)] px-3 py-1 text-[10px] font-black text-white">
                  {prod.badge}
                </span>
              </div>
              <div className="p-5">
                <h3 className="m-0 text-lg font-medium text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {prod.title}
                </h3>
                <p className="m-0 mt-2 text-[13px] leading-5 text-[var(--color-gray-100)]">{prod.description}</p>
                <div className="mt-4">
                  <Link href={prod.href} className="home-link inline-flex items-center gap-1">
                    View Details <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Calculator ────────────────────────────────────────────────────── */}
      <section id="calculator" className="scroll-mt-28 home-shell section-shell-pad">
        <div className="mb-8 max-w-[620px]">
          <span className="soft-pill">Panel Calculator</span>
          <h2 className="home-heading mt-4 text-[var(--color-dark-100)]">How many panels does your space need?</h2>
          <p className="home-copy mt-4">
            Use our interactive estimator to get a ballpark panel count for your sanctuary. Takes under a minute.
          </p>
        </div>
        <PanelCalculator />
      </section>

      {/* ── Process ───────────────────────────────────────────────────────── */}
      <section className="home-shell section-shell-pad">
        <div className="mb-10 max-w-[600px] text-center sm:mx-auto">
          <span className="soft-pill">How It Works</span>
          <h2 className="home-heading mt-4 text-[var(--color-dark-100)]">Your journey to perfect sound.</h2>
          <p className="home-copy mt-4">From layout analysis to final install — we manage the entire process.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          {STEPS.map((step, idx) => (
            <div key={step.num} className="relative flex flex-col items-center rounded-[22px] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(249,249,249,0.92))] p-5 text-center shadow-sm">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-brand-orange)] text-white shadow-md">
                {step.icon}
              </span>
              <p className="m-0 mt-4 text-[11px] font-black uppercase tracking-wider text-[var(--color-brand-orange)]">Step {step.num}</p>
              <h3 className="m-0 mt-2 text-sm font-bold text-[var(--color-dark-100)] leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>{step.title}</h3>
              <p className="m-0 mt-2 text-[13px] leading-5 text-[var(--color-gray-100)]">{step.copy}</p>
              {idx < STEPS.length - 1 && (
                <span className="absolute -right-[10px] top-10 hidden text-xl font-bold text-black/12 md:block" aria-hidden>→</span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Reviews ───────────────────────────────────────────────────────── */}
      <section className="home-shell section-shell-pad">
        <span className="soft-pill">Testimonials</span>
        <h2 className="home-heading mt-4 text-[var(--color-dark-100)]">Hear from church leaders.</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {REVIEWS.map((rev) => (
            <blockquote key={rev.author} className="glass-card m-0 flex flex-col justify-between p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(0,0,0,0.12)]">
              <div className="flex gap-0.5 text-[var(--color-brand-orange)]">{'★★★★★'}</div>
              <p className="m-0 mt-4 text-sm leading-7 italic text-[var(--color-gray-100)]">"{rev.quote}"</p>
              <div className="mt-6 flex items-center gap-3 border-t border-black/6 pt-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-gray-600)] text-sm font-bold text-white">
                  {rev.initials}
                </div>
                <div>
                  <p className="m-0 text-sm font-bold text-[var(--color-dark-100)]">{rev.author}</p>
                  <p className="m-0 text-[12px] text-[var(--color-gray-200)]">{rev.role}</p>
                </div>
              </div>
            </blockquote>
          ))}
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="home-shell section-shell-pad">
        <div className="grid gap-8 md:grid-cols-[0.55fr_1.45fr]">
          <div>
            <span className="soft-pill">FAQ</span>
            <h2 className="home-heading mt-4 text-[var(--color-dark-100)]">Got questions? We have answers.</h2>
            <p className="home-copy mt-4 max-w-[36ch]">Common questions from church leaders about acoustic treatment.</p>
          </div>
          <div>
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="glass-card mb-3 cursor-pointer p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_28px_70px_rgba(0,0,0,0.12),0_10px_28px_rgba(0,0,0,0.05),0_1px_0_rgba(255,255,255,0.78)_inset] md:p-6"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                role="button"
                aria-expanded={openFaq === idx}
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpenFaq(openFaq === idx ? null : idx) } }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`text-[18px] font-medium leading-snug tracking-[-0.5px] transition-all duration-300 sm:text-[22px] ${openFaq === idx ? 'translate-x-1 text-[var(--color-brand-orange)]' : 'text-[var(--color-dark-100)]'}`}
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {faq.q}
                  </span>
                  <span className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white transition-colors ${openFaq === idx ? 'border-[var(--color-brand-orange)]' : 'border-black/8'}`}>
                    <span className={`absolute h-0.5 w-4 transition-colors ${openFaq === idx ? 'bg-[var(--color-brand-orange)]' : 'bg-[var(--color-dark-100)]'}`} />
                    <span className={`absolute h-4 w-0.5 transition-all ${openFaq === idx ? 'bg-[var(--color-brand-orange)] opacity-0' : 'bg-[var(--color-dark-100)]'}`} />
                  </span>
                </div>
                {openFaq === idx && (
                  <p className="m-0 pt-4 text-sm leading-7 text-[var(--color-gray-100)]">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Footer ────────────────────────────────────────────────────── */}
      <section className="home-shell page-hero-shell flex flex-col items-center gap-5 text-center">
        <span className="soft-pill mx-auto">Ready to Transform Your Space?</span>
        <h2 className="page-title mx-auto max-w-[22ch]" style={{ fontSize: 'clamp(26px, 4vw, 44px)' }}>
          Let's make your congregation hear every word.
        </h2>
        <p className="home-copy mx-auto max-w-[52ch]">
          Book a free, no-obligation site assessment and we'll show you exactly what treatment your sanctuary needs.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/contact" className="page-cta">
            Book Free Assessment <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
          <a
            href="https://wa.me/6589301905"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-full border border-black/10 bg-white px-7 text-sm font-bold text-[var(--color-dark-100)] transition-all hover:-translate-y-0.5 hover:border-black/20"
          >
            WhatsApp Us
          </a>
        </div>
      </section>

    </div>
  )
}
