'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Camera, Check, ChevronDown, Minus, Plus } from 'lucide-react'
import TrackedAnchor from '@/components/analytics/TrackedAnchor'
import { trackEvent } from '@/components/analytics/trackEvent'
import { colourSwatchStyle } from '@/lib/colourSwatchStyle'
import { getAttribution, getAttributionEventParams } from '@/lib/tallyAttribution'
import { whatsAppHref } from '@/lib/whatsappContext'
import { DEFAULT_COLOUR_ID, getColour, POPULAR_COLOUR_IDS, STUDIO_COLOURS, type StudioColour } from '@/lib/studioBox/colours'
import {
  AFTER_HOURS_PER_PANEL, estimateRt60, extraPanelKind, formatPrice, getPack, MAX_EXTRA_PANELS, packFits, PANEL_INFO, pricePack,
  ROOM_SIZES, ROOM_TYPES, type StudioPack,
} from '@/lib/studioBox/packages'
import {
  earliestInstall, formatDay, installDays, PROPERTY_TYPES, SLOT_LABELS, toIso, type PropertyType, type SlotTime,
} from '@/lib/studioBox/schedule'
import LayoutPreview from './LayoutPreview'

type Step = 1 | 2 | 3 | 4 | 5
const STEP_NAMES: Record<Step, string> = { 1: 'Your room', 2: 'Colour', 3: 'Install day', 4: 'Your details', 5: 'Review and request' }

const inputClass =
  'h-12 w-full rounded-[14px] border border-black/10 bg-white px-4 text-base font-medium text-[var(--color-dark-100)] outline-none transition-colors placeholder:text-black/30 focus:border-[var(--color-brand-orange)] focus:ring-2 focus:ring-[rgba(255,165,0,0.18)]'
const chip = (active: boolean) =>
  `page-filter cursor-pointer select-none justify-center text-left ${active ? 'active' : ''}`

function Swatch({ colour, selected, onSelect, size = 44 }: { colour: StudioColour; selected: boolean; onSelect: () => void; size?: number }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={colour.name}
      title={colour.name}
      className={`relative shrink-0 rounded-full border transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-orange)] focus-visible:ring-offset-2 ${selected ? 'border-[var(--color-dark-100)] ring-2 ring-[var(--color-dark-100)] ring-offset-2' : 'border-black/10'}`}
      style={{ width: size, height: size, backgroundColor: colour.hex, ...colourSwatchStyle(colour.swatchSrc, colour.swatchRegion) }}
    >
      {selected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/90"><Check className="h-3.5 w-3.5 text-[var(--color-dark-100)]" aria-hidden="true" /></span>
        </span>
      )}
    </button>
  )
}

function ColourGrid({ value, onChange, idPrefix }: { value: string | undefined; onChange: (id: string) => void; idPrefix: string }) {
  const [showAll, setShowAll] = useState(false)
  const popular = POPULAR_COLOUR_IDS.map((id) => getColour(id)!).filter(Boolean)
  const list = showAll ? STUDIO_COLOURS : popular
  const selected = getColour(value)
  return (
    <div>
      <div className="flex flex-wrap gap-3" role="group" aria-labelledby={`${idPrefix}-label`}>
        {list.map((colour) => (
          <Swatch key={colour.id} colour={colour} selected={colour.id === value} onSelect={() => onChange(colour.id)} />
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
        <span className="font-semibold text-[var(--color-dark-100)]">{selected ? selected.name : 'Pick a colour'}</span>
        <button type="button" className="page-link" onClick={() => setShowAll((v) => !v)} aria-expanded={showAll}>
          {showAll ? 'Show popular colours' : `See all ${STUDIO_COLOURS.length} colours`}
        </button>
      </div>
    </div>
  )
}

function StepShell({ step, current, done, summary, onEdit, children }: { step: Step; current: Step; done: boolean; summary?: React.ReactNode; onEdit: () => void; children: React.ReactNode }) {
  const open = step === current
  const headingRef = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    if (open && step > 1) headingRef.current?.focus({ preventScroll: true })
  }, [open, step])
  return (
    <section className={`glass-card p-5 md:p-7 ${open ? '' : 'opacity-[0.92]'}`} aria-labelledby={`sib-step-${step}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[13px] font-bold ${done && !open ? 'bg-[var(--color-dark-100)] text-white' : open ? 'bg-[var(--color-brand-orange)] text-white' : 'bg-black/5 text-black/45'}`}>
            {done && !open ? <Check className="h-4 w-4" aria-hidden="true" /> : step}
          </span>
          <div>
            <h3 id={`sib-step-${step}`} ref={headingRef} tabIndex={-1} className="m-0 text-[20px] font-medium leading-tight text-[var(--color-dark-100)] outline-none" style={{ fontFamily: 'var(--font-heading)' }}>
              {STEP_NAMES[step]}
            </h3>
            {!open && done && summary && <p className="m-0 mt-1 text-sm text-[var(--color-gray-100)]">{summary}</p>}
          </div>
        </div>
        {!open && done && (
          <button type="button" className="page-link shrink-0" onClick={onEdit}>Change</button>
        )}
      </div>
      {open && <div className="mt-6">{children}</div>}
    </section>
  )
}

function newRequestId() {
  try { return crypto.randomUUID() } catch { return `sib-${Date.now()}-${Math.random().toString(36).slice(2, 12)}` }
}

export default function Configurator({ pack: initialPack, paymentMode }: { pack: StudioPack; paymentMode: 'request' | 'paynow' | 'stripe' }) {
  const pack = initialPack
  const [step, setStep] = useState<Step>(1)
  const [maxStep, setMaxStep] = useState<Step>(1)
  const [roomType, setRoomType] = useState(pack.roomTypes[0])
  const [sizeId, setSizeId] = useState<string | 'custom'>(pack.id === 'meeting-room' ? 'xl' : pack.id === 'studio-pro' ? 'l' : 'm')
  const [dims, setDims] = useState({ lengthM: '', widthM: '', heightM: '2.6' })
  const [sendPhotos, setSendPhotos] = useState(false)
  const [colourId, setColourId] = useState(DEFAULT_COLOUR_ID)
  const [twoTone, setTwoTone] = useState(false)
  const [accentId, setAccentId] = useState<string | undefined>('anchor-grey-35')
  const [extras, setExtras] = useState(0)
  const [property, setProperty] = useState<PropertyType>(pack.use === 'office' ? 'office' : 'hdb')
  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<SlotTime | ''>('')
  const [contact, setContact] = useState({ name: '', phone: '', email: '', postalCode: '', notes: '', website: '' })
  const [touched, setTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ reference: string; total: number; deposit: number } | null>(null)
  const requestId = useRef('')

  useEffect(() => {
    requestId.current = newRequestId()
    trackEvent('package_view', { product_slug: pack.id, product_name: pack.name, value: pack.price, currency: 'SGD' })
  }, [pack.id, pack.name, pack.price])

  const preset = ROOM_SIZES.find((s) => s.id === sizeId)
  const customOk = Number(dims.lengthM) >= 1.5 && Number(dims.widthM) >= 1.5
  const room = useMemo(() => {
    const heightM = Math.min(6, Math.max(2, Number(dims.heightM) || 2.6))
    if (sizeId === 'custom' && customOk) {
      const a = Number(dims.lengthM), b = Number(dims.widthM)
      return { lengthM: Math.max(a, b), widthM: Math.min(a, b), heightM }
    }
    return { lengthM: preset?.lengthM ?? 3.6, widthM: preset?.widthM ?? 3.2, heightM }
  }, [sizeId, dims, preset, customOk])
  const roomMm = { widthMm: room.widthM * 1000, lengthMm: room.lengthM * 1000, heightMm: room.heightM * 1000 }

  const rt = estimateRt60(pack, room, extras)
  const fit = packFits(pack, room, extras)
  const suggested = ROOM_TYPES.find((t) => t.id === roomType)
  const otherPack = suggested && suggested.packId !== pack.id ? getPack(suggested.packId) : undefined
  const bigger = !fit.ok && fit.reason === 'size' ? (pack.id === 'studio-pro' || pack.id === 'meeting-room' ? undefined : getPack('studio-pro')) : undefined

  const days = useMemo(() => installDays(property), [property])
  const earliest = useMemo(() => toIso(earliestInstall()), [])
  const slotsForSelected = useMemo(() => days.find((d) => d.iso === date)?.slots ?? [], [days, date])
  useEffect(() => {
    if (date && !days.some((d) => d.iso === date)) { setDate(''); setTime('') }
    else if (time && !slotsForSelected.includes(time)) setTime('')
  }, [days, date, time, slotsForSelected])

  const price = pricePack({ packId: pack.id, extraPanels: extras, afterHours: time === 'evening' })
  const colour = getColour(colourId)!
  const accent = twoTone ? getColour(accentId) : undefined

  const contactErrors = {
    name: contact.name.trim().length < 2 ? 'Please enter your name.' : '',
    phone: /^\+?[0-9 ]{8,16}$/.test(contact.phone.trim()) ? '' : 'Please enter a Singapore mobile number, for example 9123 4567.',
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email.trim()) ? '' : 'Please enter a valid email.',
    postalCode: /^\d{6}$/.test(contact.postalCode.trim()) ? '' : 'Please enter your 6-digit postal code.',
  }
  const contactValid = Object.values(contactErrors).every((e) => !e)
  const roomValid = (sizeId !== 'custom' || customOk) && fit.ok

  const goTo = (next: Step) => {
    setStep(next)
    setMaxStep((m) => (next > m ? next : m))
    trackEvent('package_configure', { product_slug: pack.id, step: next, step_name: STEP_NAMES[next] })
  }
  const option = (name: string, value: string | number | boolean) =>
    trackEvent('package_option_selected', { product_slug: pack.id, option: name, option_value: String(value) })

  async function submit() {
    setError('')
    setSubmitting(true)
    try {
      const response = await fetch('/api/studio-box/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: requestId.current,
          packId: pack.id,
          roomType,
          room: { sizeId: sizeId === 'custom' ? undefined : sizeId, ...room, sendPhotos },
          colourId,
          accentId: accent?.id,
          extraPanels: extras,
          property,
          slot: { date, time },
          contact: { name: contact.name, phone: contact.phone, email: contact.email, postalCode: contact.postalCode, notes: contact.notes || undefined },
          attribution: Object.fromEntries(Object.entries(getAttribution() ?? {}).filter(([, v]) => typeof v === 'string').map(([k, v]) => [k, String(v).slice(0, 300)])),
          website: contact.website || undefined,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.error || 'We could not send your request. Please try again.')
      setResult({ reference: data.reference, total: data.total, deposit: data.deposit })
      trackEvent('package_booking_request', {
        product_slug: pack.id, product_name: pack.name, value: data.total, currency: 'SGD', transaction_id: data.reference,
        property, install_date: date, ...getAttributionEventParams(),
      }, { dedupeId: data.reference })
      window.scrollTo({ top: (document.getElementById('book')?.offsetTop ?? 0) - 24, behavior: 'smooth' })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'We could not send your request. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const sizeSummary = sizeId === 'custom' ? `${room.lengthM} × ${room.widthM} m` : `${preset?.label} room (${preset?.detail.replace('about ', '')})`

  if (result) {
    const waText = `Hi Just Acoustics, I just requested the ${pack.name} pack (ref ${result.reference}), install ${formatDay(date)} ${time ? SLOT_LABELS[time as SlotTime].toLowerCase() : ''}. Here are photos or a short video of my room:`
    return (
      <div className="glass-card p-6 md:p-[40px]" role="status" aria-live="polite">
        <h3 className="page-title text-[clamp(28px,3.2vw,40px)]">Thanks, {contact.name.split(' ')[0]}. Your request is in.</h3>
        <p className="m-0 mt-4 text-[17px] text-[var(--color-dark-100)]">Your reference: <strong className="font-semibold">{result.reference}</strong></p>
        <p className="page-subtitle mt-2">Nothing has been charged. Here is what happens next:</p>
        <ol className="mt-6 grid gap-4 p-0 md:grid-cols-3">
          {[
            ['We check your room and day', 'Within one working day we confirm your install day, or offer the nearest one that works.'],
            ['You pay a 50% deposit', `${formatPrice(result.deposit)} by PayNow once we confirm. The balance is due after the install.`],
            ['We make and install your panels', `Panels are made to order in ${colour.name}${accent ? ` and ${accent.name}` : ''}. Our team installs them in a few hours.`],
          ].map(([title, body], i) => (
            <li key={title} className="list-none rounded-2xl border border-black/5 bg-white/60 p-5">
              <span className="text-sm font-bold text-[var(--color-brand-orange)]">{i + 1}</span>
              <p className="m-0 mt-2 font-semibold text-[var(--color-dark-100)]">{title}</p>
              <p className="m-0 mt-1 text-[15px] leading-relaxed text-[var(--color-gray-100)]">{body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
          <TrackedAnchor href={whatsAppHref(waText)} target="_blank" rel="noopener noreferrer" trackingSource="studio_box" className="page-cta">
            <Camera className="h-4 w-4" aria-hidden="true" /> Send room photos on WhatsApp
          </TrackedAnchor>
          <span className="text-sm text-[var(--color-gray-200)]">{sendPhotos ? 'You chose to send photos: this lets us confirm the layout.' : 'Optional, but photos help us place every panel right.'}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] items-start gap-5 lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className="flex min-w-0 flex-col gap-4">
        <StepShell step={1} current={step} done={maxStep > 1} onEdit={() => goTo(1)} summary={`${ROOM_TYPES.find((t) => t.id === roomType)?.label} · ${sizeSummary}${sendPhotos ? ' · photos to follow' : ''}`}>
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-3 text-sm font-semibold text-[var(--color-dark-100)]">What is the room for?</legend>
            <div className="flex flex-wrap gap-2">
              {ROOM_TYPES.map((t) => (
                <button key={t.id} type="button" className={chip(roomType === t.id)} aria-pressed={roomType === t.id} onClick={() => { setRoomType(t.id); option('room_type', t.id) }}>{t.label}</button>
              ))}
            </div>
            {otherPack && (
              <p className="m-0 mt-3 rounded-2xl bg-[rgba(255,165,0,0.08)] px-4 py-3 text-sm text-[var(--color-dark-100)]">
                Most {suggested?.label.toLowerCase()}s suit our <Link className="font-bold underline" href={`/studio-in-a-box/${otherPack.id}#book`}>{otherPack.name} pack</Link>. You can still go ahead with this one.
              </p>
            )}
          </fieldset>
          <fieldset className="m-0 mt-7 border-0 p-0">
            <legend className="mb-3 text-sm font-semibold text-[var(--color-dark-100)]">Roughly how big is it?</legend>
            <div className="grid gap-2 sm:grid-cols-2">
              {ROOM_SIZES.map((s) => (
                <button key={s.id} type="button" aria-pressed={sizeId === s.id} onClick={() => { setSizeId(s.id); option('room_size', s.id) }}
                  className={`rounded-2xl border px-4 py-3 text-left transition-colors ${sizeId === s.id ? 'border-[var(--color-dark-100)] bg-[var(--color-dark-100)] text-white' : 'border-black/10 bg-white/70 text-[var(--color-dark-100)] hover:border-black/25'}`}>
                  <span className="block font-semibold">{s.label}</span>
                  <span className={`block text-[13px] ${sizeId === s.id ? 'text-white/75' : 'text-[var(--color-gray-200)]'}`}>{s.detail}</span>
                </button>
              ))}
              <button type="button" aria-pressed={sizeId === 'custom'} onClick={() => setSizeId('custom')}
                className={`rounded-2xl border px-4 py-3 text-left transition-colors sm:col-span-2 ${sizeId === 'custom' ? 'border-[var(--color-dark-100)] bg-[var(--color-dark-100)] text-white' : 'border-black/10 bg-white/70 text-[var(--color-dark-100)] hover:border-black/25'}`}>
                <span className="block font-semibold">I know the measurements</span>
              </button>
            </div>
            {sizeId === 'custom' && (
              <div className="mt-3 grid grid-cols-3 gap-2">
                {([['lengthM', 'Length (m)'], ['widthM', 'Width (m)'], ['heightM', 'Ceiling (m)']] as const).map(([key, label]) => (
                  <label key={key} className="text-[13px] font-semibold text-[var(--color-gray-100)]">
                    {label}
                    <input inputMode="decimal" className={`${inputClass} mt-1`} value={dims[key]} placeholder={key === 'heightM' ? '2.6' : '3.2'}
                      onChange={(e) => setDims((d) => ({ ...d, [key]: e.target.value.replace(/[^0-9.]/g, '').slice(0, 5) }))} />
                  </label>
                ))}
              </div>
            )}
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-2xl border border-black/10 bg-white/70 px-4 py-3 text-[15px] text-[var(--color-dark-100)]">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-[var(--color-brand-orange)]" checked={sendPhotos} onChange={(e) => { setSendPhotos(e.target.checked); option('send_photos', e.target.checked) }} />
              <span><strong className="font-semibold">I’ll send photos or a short video instead.</strong> <span className="text-[var(--color-gray-100)]">After you send the request, one tap opens WhatsApp with your reference. We check the layout before you pay anything.</span></span>
            </label>
          </fieldset>
          <div className="mt-6 rounded-2xl border border-black/5 bg-white/60 px-4 py-3 text-[15px]" aria-live="polite">
            {fit.ok ? (
              <p className="m-0 text-[var(--color-dark-100)]">Good fit. Estimated echo time (RT60) in this room: <strong>{rt.before.toFixed(1)} s now</strong> → <strong>{rt.after.toFixed(2)} s</strong> with the {pack.name} pack.</p>
            ) : fit.reason === 'ceiling' ? (
              <p className="m-0 text-[var(--color-dark-100)]">Ceilings above 3 m need a site check, so we quote those separately. <Link className="font-bold underline" href="/contact">Ask for a quote</Link>.</p>
            ) : (
              <p className="m-0 text-[var(--color-dark-100)]">This room ({rt.floorM2} m²) is larger than the {pack.name} pack covers: it would only reach {rt.after.toFixed(2)} s. {bigger ? <>Try the <Link className="font-bold underline" href={`/studio-in-a-box/${bigger.id}#book`}>{bigger.name} pack</Link>, or </> : null}<Link className="font-bold underline" href="/contact">get a tailored quote</Link>.</p>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <button type="button" className="page-cta disabled:cursor-not-allowed disabled:opacity-50" disabled={!roomValid} onClick={() => goTo(2)}>Next: colour</button>
          </div>
        </StepShell>

        <StepShell step={2} current={step} done={maxStep > 2} onEdit={() => goTo(2)} summary={`${colour.name}${accent ? ` with ${accent.name}` : ''}${extras ? ` · ${extras} extra panel${extras > 1 ? 's' : ''}` : ''}`}>
          <p id="sib-colour-label" className="m-0 mb-3 text-sm font-semibold text-[var(--color-dark-100)]">Panel colour</p>
          <ColourGrid idPrefix="sib-colour" value={colourId} onChange={(id) => { setColourId(id); option('colour', id) }} />
          <div className="mt-5 rounded-2xl border border-black/5 bg-white/60 p-3 lg:hidden">
            <LayoutPreview pack={pack} room={roomMm} colour={colour.hex} accent={accent?.hex} extras={extras} compact />
          </div>
          <label className="mt-5 flex cursor-pointer items-center gap-3 text-[15px] text-[var(--color-dark-100)]">
            <input type="checkbox" className="h-4 w-4 accent-[var(--color-brand-orange)]" checked={twoTone} onChange={(e) => { setTwoTone(e.target.checked); option('two_tone', e.target.checked) }} />
            Mix in a second colour (no extra cost)
          </label>
          {twoTone && (
            <div className="mt-4">
              <p id="sib-accent-label" className="m-0 mb-3 text-sm font-semibold text-[var(--color-dark-100)]">Second colour</p>
              <ColourGrid idPrefix="sib-accent" value={accentId} onChange={(id) => { setAccentId(id); option('accent_colour', id) }} />
            </div>
          )}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-black/5 bg-white/60 px-4 py-3">
            <div>
              <p className="m-0 font-semibold text-[var(--color-dark-100)]">Extra wall panels</p>
              <p className="m-0 text-[13px] text-[var(--color-gray-200)]">{PANEL_INFO[extraPanelKind(pack)].size}, {formatPrice(PANEL_INFO[extraPanelKind(pack)].rate)} each installed</p>
            </div>
            <div className="flex items-center gap-3">
              <button type="button" aria-label="One fewer extra panel" className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-white text-[var(--color-dark-100)] shadow-sm disabled:opacity-35" disabled={extras === 0} onClick={() => { setExtras((n) => n - 1); option('extra_panels', extras - 1) }}><Minus className="h-4 w-4" aria-hidden="true" /></button>
              <span className="w-6 text-center text-lg font-semibold text-[var(--color-dark-100)]" aria-live="polite">{extras}</span>
              <button type="button" aria-label="One more extra panel" className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15 bg-white text-[var(--color-dark-100)] shadow-sm disabled:opacity-35" disabled={extras >= MAX_EXTRA_PANELS} onClick={() => { setExtras((n) => n + 1); option('extra_panels', extras + 1) }}><Plus className="h-4 w-4" aria-hidden="true" /></button>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button type="button" className="page-cta" onClick={() => goTo(3)}>Next: install day</button>
          </div>
        </StepShell>

        <StepShell step={3} current={step} done={maxStep > 3 && Boolean(date && time)} onEdit={() => goTo(3)} summary={date && time ? `${formatDay(date, { weekday: 'long', day: 'numeric', month: 'long' })}, ${SLOT_LABELS[time as SlotTime].toLowerCase()} · ${PROPERTY_TYPES.find((p) => p.id === property)?.label}` : undefined}>
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-3 text-sm font-semibold text-[var(--color-dark-100)]">Where is the room?</legend>
            <div className="flex flex-wrap gap-2">
              {PROPERTY_TYPES.map((p) => (
                <button key={p.id} type="button" className={chip(property === p.id)} aria-pressed={property === p.id} onClick={() => { setProperty(p.id); option('property', p.id) }}>{p.label}</button>
              ))}
            </div>
            <p className="m-0 mt-3 text-sm text-[var(--color-gray-100)]">{PROPERTY_TYPES.find((p) => p.id === property)?.note}</p>
          </fieldset>
          <p className="m-0 mt-6 text-[15px] leading-relaxed text-[var(--color-gray-100)]">
            Panels are made to order and shipped in, so the earliest install is <strong className="text-[var(--color-dark-100)]">{formatDay(earliest, { weekday: 'long', day: 'numeric', month: 'long' })}</strong>. Pick a day that suits you. It’s a request: we confirm it before you pay.
          </p>
          <fieldset className="m-0 mt-4 border-0 p-0">
            <legend className="sr-only">Install day</legend>
            <div className="no-scrollbar -mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2">
              {days.map((d) => {
                const active = d.iso === date
                return (
                  <button key={d.iso} type="button" aria-pressed={active} onClick={() => { setDate(d.iso); if (d.slots.length === 1) setTime(d.slots[0]); option('install_date', d.iso) }}
                    className={`flex w-[68px] shrink-0 snap-start flex-col items-center rounded-2xl border px-2 py-3 transition-colors ${active ? 'border-[var(--color-dark-100)] bg-[var(--color-dark-100)] text-white' : 'border-black/10 bg-white/80 text-[var(--color-dark-100)] hover:border-black/30'}`}>
                    <span className={`text-[12px] font-semibold ${active ? 'text-white/70' : 'text-[var(--color-gray-200)]'}`}>{formatDay(d.iso, { weekday: 'short' })}</span>
                    <span className="text-[22px] font-semibold leading-tight" style={{ fontFamily: 'var(--font-heading)' }}>{formatDay(d.iso, { day: 'numeric' })}</span>
                    <span className={`text-[12px] ${active ? 'text-white/70' : 'text-[var(--color-gray-200)]'}`}>{formatDay(d.iso, { month: 'short' })}</span>
                  </button>
                )
              })}
            </div>
          </fieldset>
          {date && (
            <fieldset className="m-0 mt-4 border-0 p-0">
              <legend className="mb-3 text-sm font-semibold text-[var(--color-dark-100)]">Start time on {formatDay(date, { weekday: 'long', day: 'numeric', month: 'long' })}</legend>
              <div className="flex flex-wrap gap-2">
                {slotsForSelected.map((s) => (
                  <button key={s} type="button" className={chip(time === s)} aria-pressed={time === s} onClick={() => { setTime(s); option('install_time', s) }}>
                    {SLOT_LABELS[s]}{s === 'evening' ? ` (+${formatPrice(AFTER_HOURS_PER_PANEL)} per panel)` : ''}
                  </button>
                ))}
              </div>
            </fieldset>
          )}
          <div className="mt-6 flex justify-end">
            <button type="button" className="page-cta disabled:cursor-not-allowed disabled:opacity-50" disabled={!date || !time} onClick={() => goTo(4)}>Next: your details</button>
          </div>
        </StepShell>

        <StepShell step={4} current={step} done={maxStep > 4 && contactValid} onEdit={() => goTo(4)} summary={contactValid ? `${contact.name} · ${contact.phone}` : undefined}>
          <form noValidate onSubmit={(e) => { e.preventDefault(); setTouched(true); if (contactValid) goTo(5) }}>
            <div className="grid gap-4 sm:grid-cols-2">
              {([
                ['name', 'Name', 'text', 'name'],
                ['phone', 'Mobile (WhatsApp)', 'tel', 'tel'],
                ['email', 'Email', 'email', 'email'],
                ['postalCode', 'Postal code', 'text', 'postal-code'],
              ] as const).map(([key, label, type, autoComplete]) => {
                const err = touched ? contactErrors[key] : ''
                return (
                  <label key={key} className="text-[13px] font-semibold text-[var(--color-gray-100)]">
                    {label}
                    <input type={type} autoComplete={autoComplete} inputMode={key === 'postalCode' ? 'numeric' : undefined} aria-invalid={Boolean(err)} aria-describedby={err ? `sib-err-${key}` : undefined}
                      className={`${inputClass} mt-1 ${err ? 'border-red-400' : ''}`} value={contact[key]} onChange={(e) => setContact((c) => ({ ...c, [key]: e.target.value }))} />
                    {err && <span id={`sib-err-${key}`} className="mt-1 block text-[13px] font-medium text-red-600">{err}</span>}
                  </label>
                )
              })}
              <label className="text-[13px] font-semibold text-[var(--color-gray-100)] sm:col-span-2">
                Anything we should know? (optional)
                <textarea rows={3} className={`${inputClass} mt-1 h-auto py-3`} value={contact.notes} placeholder="For example: aircon on the back wall, window on the left, cupboard to keep clear."
                  onChange={(e) => setContact((c) => ({ ...c, notes: e.target.value.slice(0, 600) }))} />
              </label>
              <label className="hidden" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={contact.website} onChange={(e) => setContact((c) => ({ ...c, website: e.target.value }))} /></label>
            </div>
            <div className="mt-6 flex justify-end">
              <button type="submit" className="page-cta">Next: review</button>
            </div>
          </form>
        </StepShell>

        <StepShell step={5} current={step} done={false} onEdit={() => goTo(5)}>
          <dl className="m-0 grid gap-x-6 gap-y-3 text-[15px] sm:grid-cols-[160px_1fr]">
            <dt className="font-semibold text-[var(--color-gray-200)]">Pack</dt><dd className="m-0 text-[var(--color-dark-100)]">{pack.name}: {pack.panels.map((l) => l.label).join(', ')}{extras ? `, plus ${extras} extra wall panel${extras > 1 ? 's' : ''}` : ''}</dd>
            <dt className="font-semibold text-[var(--color-gray-200)]">Room</dt><dd className="m-0 text-[var(--color-dark-100)]">{ROOM_TYPES.find((t) => t.id === roomType)?.label}, {sizeSummary}. RT60 {rt.before.toFixed(1)} s → {rt.after.toFixed(2)} s (estimate)</dd>
            <dt className="font-semibold text-[var(--color-gray-200)]">Colour</dt><dd className="m-0 text-[var(--color-dark-100)]">{colour.name}{accent ? ` and ${accent.name}` : ''}</dd>
            <dt className="font-semibold text-[var(--color-gray-200)]">Install</dt><dd className="m-0 text-[var(--color-dark-100)]">{date && time ? `${formatDay(date, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}, ${SLOT_LABELS[time as SlotTime].toLowerCase()}` : '–'} (to be confirmed)</dd>
            <dt className="font-semibold text-[var(--color-gray-200)]">Contact</dt><dd className="m-0 text-[var(--color-dark-100)]">{contact.name}, {contact.phone}, {contact.email}, Singapore {contact.postalCode}</dd>
          </dl>
          <div className="mt-6 flex items-baseline justify-between gap-3 border-t border-black/5 pt-4">
            <span className="text-[15px] font-semibold text-[var(--color-dark-100)]">Total, installed</span>
            <span className="text-[28px] font-medium leading-none text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>{formatPrice(price.total)}</span>
          </div>
          <div className="mt-4 rounded-2xl border border-black/5 bg-white/70 p-4 md:p-5">
            <p className="m-0 font-semibold text-[var(--color-dark-100)]">How payment works</p>
            <p className="m-0 mt-1 text-[15px] leading-relaxed text-[var(--color-gray-100)]">
              No payment now. Once we confirm your room and install day, we send a PayNow request for the 50% deposit ({formatPrice(price.deposit)}). Production starts when the deposit arrives. The balance of {formatPrice(price.balance)} is due after installation.
            </p>
            {paymentMode !== 'request' && <p className="m-0 mt-2 text-[13px] text-[var(--color-gray-200)]">Online deposit payment is being set up.</p>}
          </div>
          {error && <p className="m-0 mt-4 rounded-2xl bg-red-50 px-4 py-3 text-[15px] font-medium text-red-700" role="alert">{error}</p>}
          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="m-0 text-[13px] leading-relaxed text-[var(--color-gray-200)]">By sending this request you agree that we may contact you about it. See our <Link className="underline" href="/privacy-policy">privacy policy</Link>.</p>
            <button type="button" className="page-cta shrink-0 disabled:cursor-not-allowed disabled:opacity-60" disabled={submitting || !date || !time || !contactValid || !roomValid} onClick={submit}>
              {submitting ? 'Sending…' : 'Request booking'}
            </button>
          </div>
        </StepShell>
      </div>

      <aside className="glass-card flex min-w-0 flex-col gap-5 p-5 md:p-6 lg:sticky lg:top-[96px]" aria-label="Your pack">
        <LayoutPreview pack={pack} room={roomMm} colour={colour.hex} accent={accent?.hex} extras={extras} />
        <div className="border-t border-black/5 pt-4">
          <div className="flex items-baseline justify-between gap-3">
            <p className="m-0 text-[15px] font-semibold text-[var(--color-dark-100)]">{pack.name} pack</p>
            <p className="m-0 text-[15px] text-[var(--color-dark-100)]">{formatPrice(pack.price)}</p>
          </div>
          {price.extras > 0 && (
            <div className="mt-1 flex items-baseline justify-between gap-3 text-[15px] text-[var(--color-gray-100)]">
              <span>{price.extras} extra panel{price.extras > 1 ? 's' : ''}</span><span>{formatPrice(price.extras * price.extraRate)}</span>
            </div>
          )}
          {price.afterHoursCost > 0 && (
            <div className="mt-1 flex items-baseline justify-between gap-3 text-[15px] text-[var(--color-gray-100)]">
              <span>After-hours install</span><span>{formatPrice(price.afterHoursCost)}</span>
            </div>
          )}
          <div className="mt-3 flex items-baseline justify-between gap-3 border-t border-black/5 pt-3">
            <span className="text-[15px] font-semibold text-[var(--color-dark-100)]">Total, installed</span>
            <span className="text-[28px] font-medium leading-none text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>{formatPrice(price.total)}</span>
          </div>
          <p className="m-0 mt-2 text-[13px] leading-relaxed text-[var(--color-gray-200)]">Includes panels, delivery and installation. No GST. {formatPrice(price.deposit)} deposit after we confirm.</p>
        </div>
        <details className="group border-t border-black/5 pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold text-[var(--color-dark-100)]">
            What you get <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0 text-[14px] leading-relaxed text-[var(--color-gray-100)]">
            {pack.panels.map((line) => <li key={line.kind}><strong className="font-semibold text-[var(--color-dark-100)]">{line.label}</strong> ({PANEL_INFO[line.kind].size}): {line.where}.</li>)}
          </ul>
        </details>
      </aside>
    </div>
  )
}
