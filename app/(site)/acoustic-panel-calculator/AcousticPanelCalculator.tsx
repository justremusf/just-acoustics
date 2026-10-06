'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import TrackedAnchor from '@/components/analytics/TrackedAnchor'
import { trackEvent } from '@/components/analytics/trackEvent'

type RoomPreset = { factor: number; tips: string[] }

const ROOM_TYPES: Record<string, RoomPreset> = {
  Bedroom: { factor: 1.0, tips: ['Wall behind the bed or desk', 'Side wall at head height', 'One panel opposite the window'] },
  'Home office': { factor: 0.9, tips: ['Wall behind you on video calls', 'Wall facing your screen', 'Side wall at seated head height'] },
  'Living room': { factor: 1.0, tips: ['Wall opposite the TV or sofa', 'Side walls at seated ear height', 'Ceiling above the dining table if hard'] },
  'Meeting room': { factor: 0.8, tips: ['Solid wall facing the screen', 'Back wall behind the chairs', 'A ceiling cloud over the table if walls are glass'] },
  Classroom: { factor: 1.1, tips: ['Back wall facing the teacher', 'Upper side walls', 'Ceiling panels if it is high or bare'] },
  'Café': { factor: 1.3, tips: ['Ceiling clouds over the seating', 'Long wall opposite the counter', 'Keep panels away from the coffee machine and steam'] },
  Restaurant: { factor: 1.4, tips: ['Ceiling clouds over the busiest tables', 'Long walls above head height', 'Keep panels well away from the kitchen and grease'] },
  'Gym or studio': { factor: 1.15, tips: ['Upper walls above mirror and kit height', 'Ceiling over the class floor', 'Wall facing the instructor'] },
  'Church or hall': { factor: 1.8, tips: ['Rear wall facing the stage', 'Upper side walls', 'Ceiling areas if the hall is tall and hard'] },
}

const ECHO_LEVELS: Record<string, number> = {
  'A little': 0.85,
  Noticeable: 1.0,
  'Very echoey': 1.15,
}

const PANEL_SIZES = [
  { value: '0.72', label: '1200 × 600 mm (most common)' },
  { value: '1.08', label: '1800 × 600 mm (tall walls)' },
  { value: '0.36', label: '600 × 600 mm (squares)' },
]

const INSTALLED_PRICE_PER_PANEL = 165
const WHATSAPP_NUMBER = '6589301905'

const money = (n: number) => `S$${Math.round(n).toLocaleString('en-SG')}`

function estimatePanels({
  length,
  width,
  height,
  panelArea,
  factor,
}: {
  length: number
  width: number
  height: number
  panelArea: number
  factor: number
}) {
  const L = Math.max(1, length || 0)
  const W = Math.max(1, width || 0)
  const H = Math.max(2, height || 0)
  const usable = 2 * (L + W) * H * 0.75
  const low = Math.max(2, Math.round((usable * 0.2 * factor) / panelArea))
  const high = Math.max(low + 1, Math.round((usable * 0.3 * factor) / panelArea))
  return { low, high, usable }
}

function optionClass(active: boolean) {
  return `min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 ${
    active
      ? 'border-[var(--color-dark-100)] bg-[var(--color-dark-100)] text-white'
      : 'border-black/8 bg-white/76 text-[var(--color-gray-100)] hover:-translate-y-px hover:border-[rgba(255,165,0,0.45)]'
  }`
}

const fieldLabel = 'text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-gray-200)]'
const inputClass =
  'min-h-12 w-full rounded-[14px] border border-black/8 bg-white px-4 text-base font-semibold text-[var(--color-dark-100)] outline-none focus:border-[var(--color-brand-orange)] focus:ring-2 focus:ring-[rgba(255,165,0,0.12)]'

export default function AcousticPanelCalculator() {
  const [roomType, setRoomType] = useState('Meeting room')
  const [echo, setEcho] = useState('Noticeable')
  const [length, setLength] = useState('6')
  const [width, setWidth] = useState('4')
  const [height, setHeight] = useState('2.8')
  const [panelSize, setPanelSize] = useState('0.72')

  const preset = ROOM_TYPES[roomType]
  const { low, high } = useMemo(
    () =>
      estimatePanels({
        length: Number(length),
        width: Number(width),
        height: Number(height),
        panelArea: Number(panelSize),
        factor: preset.factor * ECHO_LEVELS[echo],
      }),
    [length, width, height, panelSize, preset, echo],
  )

  const sizeLabel = PANEL_SIZES.find((s) => s.value === panelSize)?.label.split(' (')[0] ?? ''
  const message = `Hi Just Acoustics, I used the panel calculator.
Room: ${roomType}, ${length}m x ${width}m, ${height}m ceiling
Echo: ${echo}
Panel size: ${sizeLabel}
Estimate: ${low}-${high} panels
I can send 2-3 photos of the room. Could you confirm the count, layout and price?`
  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

  // calculator_used: once per visit to the page, after the visitor has changed an input and paused.
  const inputsKey = [roomType, echo, length, width, height, panelSize].join('|')
  const initialInputs = useRef(inputsKey)
  const usedTracked = useRef(false)
  useEffect(() => {
    if (usedTracked.current || inputsKey === initialInputs.current) return
    const timer = window.setTimeout(() => {
      usedTracked.current = true
      trackEvent('calculator_used', {
        calculator: 'panel_calculator',
        room_type: roomType,
        echo_level: echo,
        panels_low: low,
        panels_high: high,
      })
    }, 1500)
    return () => window.clearTimeout(timer)
  }, [inputsKey, roomType, echo, low, high])

  const dims = [
    { id: 'calc-length', label: 'Length', value: length, set: setLength, min: 1, max: 60 },
    { id: 'calc-width', label: 'Width', value: width, set: setWidth, min: 1, max: 60 },
    { id: 'calc-height', label: 'Ceiling', value: height, set: setHeight, min: 2, max: 15 },
  ]

  return (
    <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
      <form
        className="glass-card flex flex-col gap-6 p-5 md:p-7"
        aria-label="Room details"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col gap-3">
          <span className={fieldLabel}>Room type</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Room type">
            {Object.keys(ROOM_TYPES).map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={roomType === name}
                onClick={() => setRoomType(name)}
                className={optionClass(roomType === name)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className={fieldLabel}>Room size (metres)</span>
          <div className="grid grid-cols-3 gap-3">
            {dims.map((field) => (
              <div key={field.id} className="flex min-w-0 flex-col gap-2">
                <label htmlFor={field.id} className="text-sm font-semibold text-[var(--color-gray-100)]">
                  {field.label}
                </label>
                <input
                  id={field.id}
                  type="number"
                  inputMode="decimal"
                  min={field.min}
                  max={field.max}
                  step="0.1"
                  value={field.value}
                  onChange={(e) => field.set(e.target.value)}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label htmlFor="calc-panel-size" className={fieldLabel}>
            Panel size
          </label>
          <select
            id="calc-panel-size"
            value={panelSize}
            onChange={(e) => setPanelSize(e.target.value)}
            className={inputClass}
          >
            {PANEL_SIZES.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3">
          <span className={fieldLabel}>How bad is the echo now?</span>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Echo level">
            {Object.keys(ECHO_LEVELS).map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={echo === name}
                onClick={() => setEcho(name)}
                className={optionClass(echo === name)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <p className="m-0 text-xs leading-5 text-[var(--color-gray-200)]">
          Method: about a quarter of the usable wall area (20–30%), adjusted for how busy and hard the room is. Busy rooms
          like restaurants and halls usually also need ceiling panels.
        </p>
      </form>

      <section className="glass-card flex flex-col gap-6 p-5 md:p-7 lg:sticky lg:top-28" aria-live="polite">
        <div>
          <p className="page-kicker m-0 text-[var(--color-brand-orange)]">Estimated panels</p>
          <p
            className="m-0 mt-2 text-[clamp(48px,7vw,72px)] font-semibold leading-none tracking-[-0.05em] text-[var(--color-dark-100)] tabular-nums"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            {low}–{high}
            <span className="ml-2 text-base font-medium tracking-normal text-[var(--color-gray-200)]">panels</span>
          </p>
        </div>

        <div className="rounded-[18px] border border-black/7 bg-white/72 p-4">
          <p className="m-0 text-2xl font-semibold text-[var(--color-dark-100)] tabular-nums">
            {money(low * INSTALLED_PRICE_PER_PANEL)} – {money(high * INSTALLED_PRICE_PER_PANEL)}
          </p>
          <p className="m-0 mt-1 text-sm leading-6 text-[var(--color-gray-100)]">
            Installed, at S${INSTALLED_PRICE_PER_PANEL} per panel ({low} × S${INSTALLED_PRICE_PER_PANEL} to {high} × S$
            {INSTALLED_PRICE_PER_PANEL}). Example maths, not a quote.
          </p>
        </div>

        <div>
          <p className={`${fieldLabel} m-0`}>Where to start</p>
          <ul className="m-0 mt-3 flex list-none flex-col gap-2 p-0">
            {preset.tips.map((tip) => (
              <li key={tip} className="flex gap-3 text-[15px] leading-6 text-[var(--color-gray-100)]">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand-orange)]" aria-hidden="true" />
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3 rounded-[18px] bg-[rgba(255,165,0,0.08)] p-5">
          <p className="m-0 text-lg font-semibold text-[var(--color-dark-100)]">Get the exact count free</p>
          <p className="m-0 text-sm leading-6 text-[var(--color-gray-100)]">
            Send 2–3 photos of the room on WhatsApp and we&apos;ll reply with the count, layout and price.
          </p>
          <TrackedAnchor href={whatsappHref} trackingSource="panel_calculator" target="_blank" rel="noopener noreferrer" className="page-cta w-fit">
            WhatsApp +65 8930 1905
          </TrackedAnchor>
        </div>

        <p className="m-0 text-xs leading-5 text-[var(--color-gray-200)]">
          Prices: from S$120 per panel plus S$45 installation per panel (S$165 installed); accessories quoted separately.
          Panels cut echo inside the room; they do not block noise from neighbours.
        </p>
      </section>
    </div>
  )
}
