/*
 * Just Acoustics room check: signal processing.
 * Runs in the browser (window.JADSP) and in Node (module.exports) so the same code is tested
 * against synthetic impulse responses in scripts/noise-index/test-dsp.mjs.
 *
 * Ambient level: FFT-domain A-weighting (IEC 61672 curve, exact per bin), energy per frame,
 *   LAeq over the whole capture plus L10 / L90 / LAmax of short frames.
 * Reverb: impulse detection, octave band filtering (500 Hz and 1 kHz), noise floor estimate,
 *   noise-compensated Schroeder backward integration, T20 / T30 / EDT linear fits, quality checks.
 */
(function (root, factory) {
  const api = factory()
  if (typeof module === 'object' && module.exports) module.exports = api
  else root.JADSP = api
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict'

  // ---------- helpers ----------
  const LOG10 = Math.log(10)
  const dB = (energy) => 10 * Math.log10(Math.max(energy, 1e-30))

  function nextPow2(n) {
    let p = 1
    while (p < n) p <<= 1
    return p
  }

  // In-place iterative radix-2 FFT on separate real / imaginary arrays.
  function fft(re, im) {
    const n = re.length
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1
      for (; j & bit; bit >>= 1) j ^= bit
      j ^= bit
      if (i < j) {
        let t = re[i]; re[i] = re[j]; re[j] = t
        t = im[i]; im[i] = im[j]; im[j] = t
      }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = (-2 * Math.PI) / len
      const wr = Math.cos(ang), wi = Math.sin(ang)
      for (let i = 0; i < n; i += len) {
        let cr = 1, ci = 0
        const half = len >> 1
        for (let k = 0; k < half; k++) {
          const a = i + k, b = a + half
          const tr = re[b] * cr - im[b] * ci
          const ti = re[b] * ci + im[b] * cr
          re[b] = re[a] - tr; im[b] = im[a] - ti
          re[a] += tr; im[a] += ti
          const ncr = cr * wr - ci * wi
          ci = cr * wi + ci * wr
          cr = ncr
        }
      }
    }
  }

  // ---------- A-weighting ----------
  // IEC 61672-1 analogue A curve, as a linear power gain at frequency f (Hz). 0 dB at 1 kHz.
  function aWeightPowerGain(f) {
    if (f <= 0) return 0
    const f2 = f * f
    const c1 = 20.598997 ** 2, c2 = 107.65265 ** 2, c3 = 737.86223 ** 2, c4 = 12194.217 ** 2
    const ra = (c4 * f2 * f2) / ((f2 + c1) * Math.sqrt((f2 + c2) * (f2 + c3)) * (f2 + c4))
    const gain = ra * 10 ** (2.0 / 20) // +2.00 dB normalises to 0 dB at 1 kHz
    return gain * gain
  }
  function aWeightDb(f) {
    return dB(aWeightPowerGain(f))
  }

  /**
   * Ambient level analyser. Feed it Float32 blocks of any size; it frames internally.
   * Levels are dBFS (A) until a calibration offset is added: dB SPL ~= dBFS + offset.
   */
  function createLevelMeter(sampleRate, opts = {}) {
    const frameSize = opts.frameSize || nextPow2(Math.round(sampleRate * 0.1)) // ~0.1 s frames
    const hop = frameSize / 2 // 50% overlap with a Hann window: no leakage bias between bins
    const win = new Float64Array(frameSize)
    let winSq = 0
    for (let i = 0; i < frameSize; i++) { win[i] = 0.5 - 0.5 * Math.cos((2 * Math.PI * i) / frameSize); winSq += win[i] * win[i] }
    const weights = new Float64Array(frameSize / 2 + 1)
    for (let k = 0; k <= frameSize / 2; k++) weights[k] = aWeightPowerGain((k * sampleRate) / frameSize)
    const buf = new Float64Array(frameSize)
    let fill = 0
    let peak = 0
    let clipped = 0
    let totalSamples = 0
    const frames = [] // A-weighted mean-square per frame
    const re = new Float64Array(frameSize), im = new Float64Array(frameSize)

    function processFrame() {
      for (let i = 0; i < frameSize; i++) re[i] = buf[i] * win[i]
      im.fill(0)
      fft(re, im)
      // Parseval: mean square = (1/N^2) * sum |X_k|^2 over all bins; use one side doubled.
      let e = (re[0] * re[0] + im[0] * im[0]) * weights[0]
      for (let k = 1; k < frameSize / 2; k++) e += 2 * (re[k] * re[k] + im[k] * im[k]) * weights[k]
      const nyq = frameSize / 2
      e += (re[nyq] * re[nyq] + im[nyq] * im[nyq]) * weights[nyq]
      frames.push(e / (frameSize * winSq))
    }

    return {
      frameSeconds: hop / sampleRate,
      push(block) {
        for (let i = 0; i < block.length; i++) {
          const v = block[i]
          const a = v < 0 ? -v : v
          if (a > peak) peak = a
          if (a >= 0.999) clipped++
          buf[fill++] = v
          if (fill === frameSize) { processFrame(); buf.copyWithin(0, hop); fill = frameSize - hop }
        }
        totalSamples += block.length
      },
      /** Latest short-term level (dBFS A), for the live needle. */
      current() {
        if (!frames.length) return null
        const n = Math.min(frames.length, 3)
        let s = 0
        for (let i = frames.length - n; i < frames.length; i++) s += frames[i]
        return dB(s / n)
      },
      result(offsetDb = 0) {
        if (!frames.length) return null
        const levels = frames.map((e) => dB(e) + offsetDb).sort((a, b) => a - b)
        const pct = (p) => levels[Math.min(levels.length - 1, Math.max(0, Math.round((p / 100) * (levels.length - 1))))]
        const meanE = frames.reduce((a, b) => a + b, 0) / frames.length
        return {
          laeq: dB(meanE) + offsetDb,
          l10: pct(90), // exceeded 10% of the time
          l50: pct(50),
          l90: pct(10), // exceeded 90% of the time (background)
          lamax: levels[levels.length - 1],
          seconds: totalSamples / sampleRate,
          frames: frames.length,
          peakDbfs: 20 * Math.log10(Math.max(peak, 1e-9)),
          clippedSamples: clipped,
        }
      },
    }
  }

  // ---------- filters for reverb bands ----------
  // RBJ biquad band-pass (constant 0 dB peak gain). Q = 1.414 approximates one octave.
  function bandpassCoefs(fc, fs, Q) {
    const w0 = (2 * Math.PI * fc) / fs
    const alpha = Math.sin(w0) / (2 * Q)
    const a0 = 1 + alpha
    return {
      b0: alpha / a0, b1: 0, b2: -alpha / a0,
      a1: (-2 * Math.cos(w0)) / a0, a2: (1 - alpha) / a0,
    }
  }
  function biquad(x, c) {
    const y = new Float64Array(x.length)
    let x1 = 0, x2 = 0, y1 = 0, y2 = 0
    for (let i = 0; i < x.length; i++) {
      const xi = x[i]
      const yi = c.b0 * xi + c.b1 * x1 + c.b2 * x2 - c.a1 * y1 - c.a2 * y2
      x2 = x1; x1 = xi; y2 = y1; y1 = yi
      y[i] = yi
    }
    return y
  }
  // Two cascaded sections: steeper skirts, still short ringing at mid bands.
  function octaveBand(x, fc, fs) {
    const c = bandpassCoefs(fc, fs, 1.414)
    return biquad(biquad(x, c), c)
  }

  // ---------- reverb ----------
  function linfit(xs, ys) {
    const n = xs.length
    let sx = 0, sy = 0, sxx = 0, sxy = 0, syy = 0
    for (let i = 0; i < n; i++) { sx += xs[i]; sy += ys[i]; sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; syy += ys[i] * ys[i] }
    const den = n * sxx - sx * sx
    if (n < 3 || den === 0) return null
    const slope = (n * sxy - sx * sy) / den
    const icept = (sy - slope * sx) / n
    const ssTot = syy - (sy * sy) / n
    let ssRes = 0
    for (let i = 0; i < n; i++) { const r = ys[i] - (icept + slope * xs[i]); ssRes += r * r }
    return { slope, icept, r2: ssTot > 0 ? 1 - ssRes / ssTot : 0 }
  }

  /** Fit the Schroeder curve (dB, 0 at start) between two levels. Returns RT60 (s) or null. */
  function fitDecay(edcDb, fs, hi, lo, step) {
    const xs = [], ys = []
    for (let i = 0; i < edcDb.length; i += step) {
      const v = edcDb[i]
      if (v <= hi && v >= lo) { xs.push(i / fs); ys.push(v) }
      if (v < lo) break
    }
    // The curve must actually reach the lower limit.
    const reached = edcDb.some((v) => v < lo)
    if (!reached) return null
    const f = linfit(xs, ys)
    if (!f || f.slope >= 0) return null
    return { rt: -60 / f.slope, r2: f.r2, points: xs.length }
  }

  /** Smoothed energy envelope in dB with block length blk samples. */
  function envelopeDb(sq, blk) {
    const out = []
    for (let i = 0; i + blk <= sq.length; i += blk) {
      let s = 0
      for (let j = i; j < i + blk; j++) s += sq[j]
      out.push(dB(s / blk))
    }
    return out
  }

  /**
   * Analyse one band of a captured impulse response that starts at its peak.
   * x: Float64Array starting at the impulse peak.
   */
  function analyseBand(x, fs) {
    const sq = new Float64Array(x.length)
    for (let i = 0; i < x.length; i++) sq[i] = x[i] * x[i]
    const blk = Math.max(1, Math.round(fs * 0.01)) // 10 ms blocks
    const env = envelopeDb(sq, blk)
    if (env.length < 20) return { ok: false, reason: 'capture too short' }

    // Noise floor: mean energy of the last 20% of the capture (simplified Lundeby).
    const tailStart = Math.floor(sq.length * 0.8)
    let ns = 0
    for (let i = tailStart; i < sq.length; i++) ns += sq[i]
    const noiseE = ns / (sq.length - tailStart)
    const noiseDb = dB(noiseE)
    const peakDb = Math.max(...env.slice(0, 3))
    const inr = peakDb - noiseDb // impulse-to-noise ratio (dB)

    // Truncation: first block where the envelope falls within 5 dB of the noise floor.
    let cross = env.length - 1
    for (let i = 0; i < env.length; i++) if (env[i] <= noiseDb + 5) { cross = i; break }
    const tEnd = Math.min(sq.length, (cross + 1) * blk)

    // Noise-compensated backward integration. The tail term (noiseE * remaining_time-constant)
    // is approximated by adding the energy the decay would still have below the truncation point,
    // estimated from the late slope; here we use the standard noise subtraction and a small
    // correction equal to the noise energy over the truncated section.
    const edc = new Float64Array(tEnd)
    let acc = 0
    for (let i = tEnd - 1; i >= 0; i--) {
      acc += sq[i] - noiseE
      edc[i] = acc
    }
    // Compensate for the energy lost after truncation: assume the decay continues with the
    // slope fitted on the last 10 dB above the truncation point.
    const lateFrom = Math.max(0, env.findIndex((v) => v <= noiseDb + 15))
    let corr = 0
    if (lateFrom > 0 && cross > lateFrom + 2) {
      const xs = [], ys = []
      for (let i = lateFrom; i <= cross; i++) { xs.push(i); ys.push(env[i]) }
      const f = linfit(xs, ys)
      if (f && f.slope < 0) {
        // energy per block at truncation, decaying with time constant tau (blocks)
        const k = (-f.slope * LOG10) / 10 // per block, natural-log decay of energy
        const eAtCross = (10 ** ((f.icept + f.slope * cross) / 10)) * blk
        corr = eAtCross / (1 - Math.exp(-k)) - eAtCross
        if (!isFinite(corr) || corr < 0) corr = 0
      }
    }
    const e0 = edc[0] + corr
    if (!(e0 > 0)) return { ok: false, reason: 'no decay found', inr }
    const edcDb = new Float64Array(tEnd)
    for (let i = 0; i < tEnd; i++) edcDb[i] = dB(Math.max(edc[i] + corr, 1e-30) / e0)

    const step = Math.max(1, Math.round(fs / 2000)) // fit on ~2 kHz grid
    const edt = fitDecay(edcDb, fs, 0, -10, step)
    const t20 = inr >= 35 ? fitDecay(edcDb, fs, -5, -25, step) : null
    const t30 = inr >= 45 ? fitDecay(edcDb, fs, -5, -35, step) : null
    return { ok: !!(t20 || t30), inr, noiseDb, edt, t20, t30, reason: t20 || t30 ? null : 'not enough decay above background noise' }
  }

  /**
   * Find the impulse in a capture and estimate reverberation time.
   * samples: Float32Array / Float64Array of the raw capture; fs: sample rate.
   * Returns { ok, rt60, method, bands, confidence, issues[] }.
   */
  function analyseImpulse(samples, fs, opts = {}) {
    const bandsHz = opts.bands || [500, 1000]
    const issues = []
    const n = samples.length
    let pk = 0, pkI = 0, clipped = 0 // pkI is reused as the onset index below
    for (let i = 0; i < n; i++) {
      const a = Math.abs(samples[i])
      if (a > pk) { pk = a; pkI = i }
      if (a >= 0.999) clipped++
    }
    if (pk < 1e-4) return { ok: false, issues: ['No sound picked up. Check microphone permission.'] }

    // Onset (ISO 3382 style): first sample within 20 dB of the maximum. Long decays of a
    // noise-like signal can put the single largest sample a little after the true start.
    let onI = pkI
    for (let i = 0; i < pkI; i++) if (Math.abs(samples[i]) >= pk * 0.1) { onI = i; break }
    // Background before the impulse (excluding 50 ms before onset).
    const pre = Math.max(0, onI - Math.round(0.05 * fs))
    let preE = 0
    for (let i = 0; i < pre; i++) preE += samples[i] * samples[i]
    const preDb = pre > fs * 0.1 ? dB(preE / pre) : null
    // Peak level: 5 ms around the maximum.
    const w = Math.round(0.0025 * fs)
    let pkE = 0, cnt = 0
    for (let i = Math.max(0, pkI - w); i < Math.min(n, pkI + w); i++) { pkE += samples[i] * samples[i]; cnt++ }
    const pkDb = dB(pkE / cnt)
    if (preDb !== null && pkDb - preDb < 25) {
      return { ok: false, issues: ['No clear clap found: the loudest moment is too close to the background level. Clap louder or move closer to the phone.'] }
    }
    // Impulsive onset: little energy in the 20 to 60 ms before the onset.
    const onsetWin = Math.round(0.02 * fs)
    let onsetE = 0
    for (let i = Math.max(0, onI - onsetWin * 3); i < Math.max(0, onI - onsetWin); i++) onsetE += samples[i] * samples[i]
    const onsetDb = dB(onsetE / (onsetWin * 2) || 1e-30)
    if (pkDb - onsetDb < 15) issues.push('The sound did not start sharply. Use a single hard clap or a balloon pop.')
    if (clipped > 0.0005 * fs) issues.push('The clap overloaded the microphone. Move the phone a little further away.')

    const maxLen = Math.min(n - onI, Math.round((opts.maxSeconds || 4) * fs))
    if (maxLen < fs * 0.5) return { ok: false, issues: ['The clap was too close to the end of the recording. Clap after the countdown.'] }
    const seg = samples.subarray ? samples.subarray(onI, onI + maxLen) : samples.slice(onI, onI + maxLen)
    pkI = onI

    // Second event check (double clap, someone talking): broadband envelope rising again.
    const bsq = new Float64Array(seg.length)
    for (let i = 0; i < seg.length; i++) bsq[i] = seg[i] * seg[i]
    const benv = envelopeDb(bsq, Math.round(0.01 * fs))
    let runMin = benv[0]
    for (let i = 1; i < benv.length; i++) {
      if (benv[i] < runMin) runMin = benv[i]
      if (benv[i] - runMin > 12 && benv[0] - benv[i] < 30) {
        return { ok: false, issues: ['A second sound was picked up during the decay (a double clap or voices). Try again when it is quieter.'] }
      }
    }

    // Per-band analysis. Include some samples before the peak so filter onset is captured.
    const lead = Math.round(0.005 * fs)
    const startI = Math.max(0, pkI - lead)
    const raw = samples.slice(startI, pkI + maxLen)
    const bands = []
    for (const fc of bandsHz) {
      const y = octaveBand(Float64Array.from(raw), fc, fs)
      // Re-align to the band's own peak.
      let bp = 0, bi = 0
      for (let i = 0; i < Math.min(y.length, lead * 6 + Math.round(0.03 * fs)); i++) { const a = Math.abs(y[i]); if (a > bp) { bp = a; bi = i } }
      const r = analyseBand(y.subarray(bi), fs)
      bands.push({ hz: fc, ...r })
    }
    const good = bands.filter((b) => b.ok)
    if (!good.length) {
      const inr = Math.max(...bands.map((b) => b.inr || 0))
      return { ok: false, bands, issues: [...issues, `Not enough decay above the background (${inr.toFixed(0)} dB, need 35 dB). Clap louder, or measure when the room is quieter.`] }
    }
    // Prefer T30 when every good band has it; else T20.
    const useT30 = good.every((b) => b.t30 && b.t30.r2 >= 0.98)
    const method = useT30 ? 'T30' : 'T20'
    const vals = good.map((b) => (useT30 ? b.t30 : b.t20) || b.t30).filter(Boolean)
    const rt60 = vals.reduce((a, v) => a + v.rt, 0) / vals.length
    const minR2 = Math.min(...vals.map((v) => v.r2))
    const spread = vals.length > 1 ? (Math.max(...vals.map((v) => v.rt)) - Math.min(...vals.map((v) => v.rt))) / rt60 : 0
    const minInr = Math.min(...good.map((b) => b.inr))

    if (minR2 < 0.95) return { ok: false, bands, issues: [...issues, 'The decay was irregular, so the reading is unreliable. Try again from the middle of the room.'] }
    if (rt60 < 0.1 || rt60 > 6) return { ok: false, bands, issues: [...issues, 'The result is outside a believable range. Try again.'] }

    let confidence = 'high'
    if (method === 'T20' || minR2 < 0.99 || spread > 0.25 || good.length < bandsHz.length) confidence = 'medium'
    if (minR2 < 0.98 || minInr < 40 || spread > 0.4 || issues.length) confidence = 'low'
    if (good.length < bandsHz.length) issues.push(`Only the ${good.map((b) => b.hz + ' Hz').join(', ')} band had a usable decay.`)

    return { ok: true, rt60, method, confidence, minR2, spread, inr: minInr, bands, issues }
  }

  /** Combine several accepted claps into one reading (median, with spread). */
  function combineClaps(results) {
    const ok = results.filter((r) => r && r.ok)
    if (!ok.length) return null
    const v = ok.map((r) => r.rt60).sort((a, b) => a - b)
    const mid = v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2
    const spread = v.length > 1 ? (v[v.length - 1] - v[0]) / mid : null
    const rank = { low: 0, medium: 1, high: 2 }
    let conf = ok.map((r) => r.confidence).sort((a, b) => rank[a] - rank[b])[Math.floor(ok.length / 2)]
    if (ok.length >= 3 && spread !== null && spread < 0.15 && conf === 'medium') conf = 'high'
    if (spread !== null && spread > 0.3) conf = 'low'
    if (ok.length === 1 && conf === 'high') conf = 'medium'
    return { rt60: mid, n: ok.length, spread, confidence: conf, method: ok[0].method }
  }

  // ---------- targets and scoring ----------
  // Mid-frequency RT60 targets (seconds) and comfortable ambient LAeq (busy) by space type.
  // Ranges follow common design guidance (e.g. BB93 / AS/NZS 2107 / DIN 18041 style values).
  const TARGETS = {
    cafe: { label: 'Café', rt: [0.5, 0.8], laeq: 65 },
    restaurant: { label: 'Restaurant', rt: [0.6, 0.8], laeq: 68 },
    bar: { label: 'Bar', rt: [0.6, 0.9], laeq: 72 },
    office: { label: 'Office', rt: [0.4, 0.6], laeq: 50 },
    meeting: { label: 'Meeting room', rt: [0.4, 0.6], laeq: 45 },
    classroom: { label: 'Classroom', rt: [0.4, 0.6], laeq: 45 },
    gym: { label: 'Gym or studio class', rt: [0.6, 1.0], laeq: 75 },
    worship: { label: 'Place of worship', rt: [0.8, 1.4], laeq: 45 },
    library: { label: 'Library or quiet space', rt: [0.4, 0.6], laeq: 40 },
    home: { label: 'Home', rt: [0.3, 0.5], laeq: 40 },
    other: { label: 'Other', rt: [0.5, 0.8], laeq: 60 },
  }

  /**
   * 0 to 100 sound comfort score. 100 = inside the target RT60 range and at or below the
   * comfortable level. Each half (reverb, loudness) is worth 50 points.
   */
  function comfortScore(spaceType, rt60, laeq) {
    const t = TARGETS[spaceType] || TARGETS.other
    let rtPts = null, lvPts = null
    if (rt60 != null) {
      const over = rt60 > t.rt[1] ? (rt60 - t.rt[1]) / t.rt[1] : rt60 < t.rt[0] * 0.7 ? (t.rt[0] * 0.7 - rt60) / t.rt[0] : 0
      rtPts = Math.max(0, 50 * (1 - over / 1.0)) // 100% over the top of the range = 0
    }
    if (laeq != null) {
      const over = Math.max(0, laeq - t.laeq)
      lvPts = Math.max(0, 50 * (1 - over / 15)) // 15 dB over = 0
    }
    if (rtPts == null && lvPts == null) return null
    if (rtPts == null) return Math.round(lvPts * 2)
    if (lvPts == null) return Math.round(rtPts * 2)
    return Math.round(rtPts + lvPts)
  }

  return { fft, aWeightDb, aWeightPowerGain, createLevelMeter, analyseImpulse, combineClaps, octaveBand, TARGETS, comfortScore }
})
