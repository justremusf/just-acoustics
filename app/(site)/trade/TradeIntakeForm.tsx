'use client'

import { useState, type FormEvent } from 'react'

// Preview build: the form is not connected to anything yet. Submitting only shows a notice.
// To go live, post the FormData to a Tally form or an API route (see JA Assistant/modules/trade-desk.md).
export default function TradeIntakeForm() {
  const [sent, setSent] = useState(false)
  const [files, setFiles] = useState<string[]>([])

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSent(true)
  }

  const field = 'w-full rounded-2xl border border-black/10 bg-white/90 px-4 py-3 text-[15px] text-[#010101] outline-none transition focus:border-[#ffa500]'
  const label = 'flex flex-col gap-2 text-[14px] font-semibold text-[#010101]'

  return (
    <form onSubmit={onSubmit} className="glass-card grid gap-4 p-6 md:grid-cols-2 md:p-8" aria-describedby="trade-form-note">
      <label className={label}>Your name<input required name="name" className={field} autoComplete="name" /></label>
      <label className={label}>Practice<input required name="practice" className={field} autoComplete="organization" /></label>
      <label className={label}>Email<input required type="email" name="email" className={field} autoComplete="email" /></label>
      <label className={label}>WhatsApp<input required type="tel" name="whatsapp" className={field} autoComplete="tel" /></label>
      <label className={label}>Project name<input name="project" className={field} placeholder="e.g. Level 3 boardroom" /></label>
      <label className={label}>Space type
        <select name="space" className={field} defaultValue="">
          <option value="" disabled>Choose one</option>
          {['Office or meeting room', 'Restaurant or café', 'Classroom or training room', 'Church or hall', 'Studio', 'Home', 'Clinic', 'Fitness studio', 'Other'].map((s) => <option key={s}>{s}</option>)}
        </select>
      </label>
      <label className={label}>Ceiling height (m)<input name="ceiling" inputMode="decimal" className={field} placeholder="e.g. 2.8" /></label>
      <label className={label}>Needed by<input type="date" name="needed_by" className={field} /></label>
      <label className={`${label} md:col-span-2`}>Plans, elevations or photos
        <input type="file" name="files" multiple accept=".pdf,.dwg,.dxf,.jpg,.jpeg,.png,.heic" className={field}
          onChange={(e) => setFiles(Array.from(e.target.files || []).map((f) => f.name))} />
        {files.length > 0 && <span className="text-[13px] font-normal text-[#6a6a6a]">{files.join(', ')}</span>}
      </label>
      <label className={`${label} md:col-span-2`}>Brief
        <textarea name="brief" rows={4} className={field} placeholder="What should the room feel like? Finishes, colours, anything to avoid." />
      </label>
      <fieldset className="md:col-span-2 flex flex-col gap-2 text-[14px] text-[#4a4a4a]">
        <legend className="mb-2 font-semibold text-[#010101]">Proposal branding</legend>
        <label className="flex items-center gap-2"><input type="radio" name="branding" value="just-acoustics" defaultChecked /> Just Acoustics branding</label>
        <label className="flex items-center gap-2"><input type="radio" name="branding" value="white-label" /> White label: our logo, Just Acoustics small (attach your logo above)</label>
      </fieldset>
      <div className="md:col-span-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <p id="trade-form-note" className="m-0 text-[13px] text-[#6a6a6a]">We reply with a spec sheet, render and trade quote, usually within the hour in working hours.</p>
        <button type="submit" className="min-h-[52px] rounded-full bg-[#010101] px-7 text-[15px] font-semibold text-white transition hover:-translate-y-px hover:shadow-[0_0_24px_6px_rgba(255,165,0,0.4)]">Send the plan</button>
      </div>
      {sent && (
        <p role="status" className="md:col-span-2 m-0 rounded-2xl border border-[#f5c26b] bg-[#fff4e0] px-4 py-3 text-[14px] text-[#7c4a03]">
          Preview only: this form is not connected yet, so nothing was sent. For now, WhatsApp the plan to +65 8930 1905.
        </p>
      )}
    </form>
  )
}
