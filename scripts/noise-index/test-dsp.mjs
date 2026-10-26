// Tests the room-check DSP against synthetic signals with known answers.
// Run: node scripts/noise-index/test-dsp.mjs
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const D = require('../../public/tools/room-check/dsp.js')

let seed = 12345
const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296)
const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-12)) * Math.cos(2 * Math.PI * rand())

/** Exponentially decaying noise IR in background noise, as a phone would capture a clap. */
function synthClap({ fs, rt, inrDb, pre = 0.6, len = 4, peak = 0.5, secondAt = null }) {
  const n = Math.round(len * fs)
  const x = new Float64Array(n)
  const noiseRms = peak / 3 / 10 ** (inrDb / 20) // peak ~3 sigma of the decay noise
  for (let i = 0; i < n; i++) x[i] = noiseRms * gauss()
  const start = Math.round(pre * fs)
  const k = (3 * Math.log(10)) / rt // amplitude decay rate: energy down 60 dB in rt seconds
  const addDecay = (s0, amp) => {
    for (let i = s0; i < n; i++) x[i] += (amp / 3) * gauss() * Math.exp(-k * ((i - s0) / fs))
  }
  addDecay(start, peak)
  if (secondAt) addDecay(start + Math.round(secondAt * fs), peak * 0.8)
  return x
}

const results = []
let fail = 0
function check(name, pass, detail) {
  results.push({ name, pass, detail })
  if (!pass) fail++
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}  ${detail}`)
}

// 1. A-weighting curve against IEC 61672 table values.
for (const [f, want] of [[31.5, -39.4], [100, -19.1], [250, -8.6], [1000, 0], [4000, 1.0], [10000, -2.5]]) {
  const got = D.aWeightDb(f)
  check(`A-weighting ${f} Hz`, Math.abs(got - want) < 0.2, `${got.toFixed(2)} dB (table ${want})`)
}

// 2. Level meter: 1 kHz sine at amplitude 1 has RMS -3.01 dBFS; A at 1 kHz = 0.
for (const fs of [48000, 44100]) {
  const m = D.createLevelMeter(fs)
  const n = fs * 30
  const blk = new Float32Array(1024)
  for (let i = 0; i < n; i += 1024) {
    for (let j = 0; j < 1024; j++) blk[j] = 0.1 * Math.sin((2 * Math.PI * 1000 * (i + j)) / fs)
    m.push(blk)
  }
  const r = m.result(0)
  check(`LAeq 1 kHz sine @${fs}`, Math.abs(r.laeq - -23.01) < 0.3, `${r.laeq.toFixed(2)} dBFS (expected -23.01)`)
  const m2 = D.createLevelMeter(fs)
  for (let i = 0; i < n; i += 1024) {
    for (let j = 0; j < 1024; j++) blk[j] = 0.1 * Math.sin((2 * Math.PI * 100 * (i + j)) / fs)
    m2.push(blk)
  }
  const r2 = m2.result(0)
  check(`LAeq 100 Hz sine @${fs}`, Math.abs(r2.laeq - (-23.01 - 19.1)) < 0.5, `${r2.laeq.toFixed(2)} dBFS (expected ${(-23.01 - 19.1).toFixed(2)})`)
}

// 3. RT60 from synthetic claps with known decay.
const rtRows = []
for (const fs of [48000, 44100]) {
  for (const rt of [0.4, 0.8, 1.5]) {
    for (const inr of [60, 45]) {
      const trials = []
      for (let t = 0; t < 10; t++) trials.push(D.analyseImpulse(synthClap({ fs, rt, inrDb: inr, len: Math.max(3, rt * 2.6 + 1) }), fs))
      const ok = trials.filter((r) => r.ok)
      const est = ok.map((r) => r.rt60)
      const worst = est.length ? Math.max(...est.map((v) => Math.abs(v - rt) / rt)) : 1
      const comb = D.combineClaps(trials)
      rtRows.push({ fs, rt, inr, est, method: ok[0]?.method, conf: comb?.confidence })
      check(
        `RT60 ${rt}s, INR ${inr} dB @${fs}`,
        ok.length === 10 && worst <= 0.15,
        `estimates ${est.map((v) => v.toFixed(3)).join(', ')} (${ok[0]?.method}), worst error ${(worst * 100).toFixed(1)}%, combined ${comb?.rt60.toFixed(3)} s ${comb?.confidence}`,
      )
    }
  }
}

// 4. Bad captures must be rejected, not reported.
{
  const fs = 48000
  const noise = new Float64Array(fs * 4)
  for (let i = 0; i < noise.length; i++) noise[i] = 0.01 * gauss()
  const r1 = D.analyseImpulse(noise, fs)
  check('Rejects background noise only', !r1.ok, r1.issues?.[0] || '')
  const r2 = D.analyseImpulse(synthClap({ fs, rt: 0.8, inrDb: 25 }), fs)
  check('Rejects a weak clap (25 dB above noise)', !r2.ok, r2.issues?.slice(-1)[0] || '')
  const r3 = D.analyseImpulse(synthClap({ fs, rt: 0.8, inrDb: 60, secondAt: 0.35 }), fs)
  check('Rejects a double clap', !r3.ok, r3.issues?.slice(-1)[0] || '')
  const r4 = D.analyseImpulse(new Float64Array(fs * 4), fs)
  check('Rejects silence (no mic signal)', !r4.ok, r4.issues?.[0] || '')
}

console.log(`\n${results.length - fail}/${results.length} passed`)
if (process.argv.includes('--json')) console.log(JSON.stringify({ results, rtRows }, null, 1))
process.exit(fail ? 1 : 0)
