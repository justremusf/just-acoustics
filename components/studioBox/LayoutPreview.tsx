import { layoutFor, type Placed, type RoomMm } from '@/lib/studioBox/layout'
import type { StudioPack } from '@/lib/studioBox/packages'

type Props = {
  pack: StudioPack
  room: RoomMm
  colour: string
  accent?: string
  extras?: number
  className?: string
  /** Drawing only, no plan or caption. */
  compact?: boolean
}

// One-point perspective of the room seen from the doorway: the wall you face, both side walls, floor and
// ceiling. A small plan underneath shows all four walls, so panels behind you are visible too.
const VIEW_W = 640
const VIEW_H = 380
const EYE_MM = 1500
const VIEWER_MM = 2300

function shade(hex: string, amount: number) {
  const n = parseInt(hex.slice(1), 16)
  const ch = (v: number) => Math.max(0, Math.min(255, Math.round(v + (amount > 0 ? (255 - v) * amount : v * amount))))
  return `#${[ch(n >> 16), ch((n >> 8) & 255), ch(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join('')}`
}

export default function LayoutPreview({ pack, room, colour, accent, extras = 0, className = '', compact = false }: Props) {
  const { widthMm: W, lengthMm: L, heightMm: H } = room
  const placed = layoutFor(pack, room, extras)
  // Scale so the far wall fills about 45% of the frame; the near edges of the room run off the frame,
  // like a photo taken from the doorway.
  const kFar = VIEWER_MM / (VIEWER_MM + L)
  const K = Math.min((0.44 * VIEW_H) / (H * kFar), (0.56 * VIEW_W) / (W * kFar))
  const cx = VIEW_W / 2
  const cy = VIEW_H / 2 + ((H - EYE_MM - EYE_MM) / 2) * K * kFar
  const project = (X: number, Y: number, Z: number) => {
    const k = VIEWER_MM / (VIEWER_MM + Z)
    return [cx + (X - W / 2) * K * k, cy - (Y - EYE_MM) * K * k] as const
  }
  const poly = (pts: (readonly [number, number])[]) => pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')

  const corner = { fl: project(0, 0, L), fr: project(W, 0, L), cl: project(0, H, L), cr: project(W, H, L), ofl: project(0, 0, 0), ofr: project(W, 0, 0), ocl: project(0, H, 0), ocr: project(W, H, 0) }

  // Accent colour (if any) goes on every other panel of each wall, so a two-tone room reads clearly.
  const fillFor = (index: number) => (accent && index % 2 === 1 ? accent : colour)

  const toQuad = (p: Placed) => {
    const { x, y, w, h } = p
    const depth = p.kind === 'bass-100' ? 100 : 50
    switch (p.surface) {
      case 'front':
        return [project(x, y, L - depth), project(x + w, y, L - depth), project(x + w, y + h, L - depth), project(x, y + h, L - depth)]
      case 'left':
        return [project(depth, y, L - x), project(depth, y, L - x - w), project(depth, y + h, L - x - w), project(depth, y + h, L - x)]
      case 'right':
        return [project(W - depth, y, L - x), project(W - depth, y, L - x - w), project(W - depth, y + h, L - x - w), project(W - depth, y + h, L - x)]
      case 'ceiling': {
        const Y = H - 150
        return [project(x, Y, L - y), project(x + w, Y, L - y), project(x + w, Y, L - y - h), project(x, Y, L - y - h)]
      }
      default:
        return null
    }
  }

  const visible = placed.filter((p) => p.surface !== 'rear')
  const counters: Record<string, number> = {}

  // Plan (top-down), 1 px ≈ 32 mm.
  const ps = 1 / 32
  const pw = W * ps
  const pl = L * ps
  const planPad = 14
  const thick = 5

  return (
    <figure className={`m-0 ${className}`}>
      <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} role="img" aria-label={`Layout of the ${pack.name} pack in a ${(W / 1000).toFixed(1)} by ${(L / 1000).toFixed(1)} metre room`} className="block h-auto w-full">
        <defs>
          <linearGradient id="sib-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#d8c3a5" />
            <stop offset="1" stopColor="#c9ae8a" />
          </linearGradient>
          <linearGradient id="sib-back" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#f6f5f2" />
            <stop offset="1" stopColor="#ecebe7" />
          </linearGradient>
        </defs>
        <polygon points={poly([corner.ocl, corner.ocr, corner.cr, corner.cl])} fill="#f1f0ed" />
        <polygon points={poly([corner.ofl, corner.ofr, corner.fr, corner.fl])} fill="url(#sib-floor)" />
        <polygon points={poly([corner.ocl, corner.cl, corner.fl, corner.ofl])} fill="#e6e4df" />
        <polygon points={poly([corner.ocr, corner.cr, corner.fr, corner.ofr])} fill="#dcdad5" />
        <polygon points={poly([corner.cl, corner.cr, corner.fr, corner.fl])} fill="url(#sib-back)" />
        <g stroke="rgba(1,1,1,0.12)" strokeWidth="1" fill="none">
          <polyline points={poly([corner.cl, corner.cr, corner.fr, corner.fl, corner.cl])} />
          <line x1={corner.cl[0]} y1={corner.cl[1]} x2={corner.ocl[0]} y2={corner.ocl[1]} />
          <line x1={corner.cr[0]} y1={corner.cr[1]} x2={corner.ocr[0]} y2={corner.ocr[1]} />
          <line x1={corner.fl[0]} y1={corner.fl[1]} x2={corner.ofl[0]} y2={corner.ofl[1]} />
          <line x1={corner.fr[0]} y1={corner.fr[1]} x2={corner.ofr[0]} y2={corner.ofr[1]} />
        </g>
        {(() => {
          // Desk or table as a simple box: x0..x1 across, z0..z1 deep, 740 mm high.
          const [x0, x1, z0, z1] = pack.use === 'office' ? [W * 0.3, W * 0.7, L * 0.15, L * 0.85] : pack.id === 'podcast-room' ? [W * 0.32, W * 0.68, L * 0.38, L * 0.62] : [W * 0.22, W * 0.78, L - 700, L - 50]
          const top = [project(x0, 740, z1), project(x1, 740, z1), project(x1, 740, z0), project(x0, 740, z0)]
          const front = [project(x0, 740, z0), project(x1, 740, z0), project(x1, 690, z0), project(x0, 690, z0)]
          const legs = [x0 + 40, x1 - 60].map((x) => [project(x, 690, z0 + 40), project(x + 30, 690, z0 + 40), project(x + 30, 0, z0 + 40), project(x, 0, z0 + 40)])
          return (
            <g>
              {legs.map((leg, i) => <polygon key={i} points={poly(leg)} fill="#8f7558" />)}
              <polygon points={poly(top)} fill="#c9ab80" stroke="rgba(1,1,1,0.12)" />
              <polygon points={poly(front)} fill="#a98c64" />
            </g>
          )
        })()}
        {visible.map((p, i) => {
          const quad = toQuad(p)
          if (!quad) return null
          const key = `${p.surface}`
          counters[key] = (counters[key] ?? 0) + 1
          const base = fillFor(counters[key] - 1)
          const fill = p.surface === 'left' ? shade(base, -0.08) : p.surface === 'right' ? shade(base, -0.14) : p.surface === 'ceiling' ? shade(base, 0.04) : base
          return <polygon key={i} points={poly(quad)} fill={fill} stroke={shade(base, -0.28)} strokeWidth="1" strokeLinejoin="round" />
        })}
      </svg>
      {!compact && <div className="mt-3 flex items-center gap-4">
        <svg viewBox={`0 0 ${pw + planPad * 2} ${pl + planPad * 2}`} className="h-[96px] w-auto shrink-0" aria-hidden="true">
          <rect x={planPad} y={planPad} width={pw} height={pl} fill="#fbfbfa" stroke="#bdbcb8" strokeWidth="2" />
          {placed.map((p, i) => {
            const c = p.kind === 'cloud-1200' || p.surface === 'ceiling' ? shade(colour, 0.25) : colour
            if (p.surface === 'ceiling') return <rect key={i} x={planPad + p.x * ps} y={planPad + p.y * ps} width={p.w * ps} height={p.h * ps} fill={c} opacity="0.8" stroke={shade(colour, -0.3)} strokeWidth="0.8" />
            if (p.surface === 'front') return <rect key={i} x={planPad + p.x * ps} y={planPad - thick + 2} width={p.w * ps} height={thick} fill={c} />
            if (p.surface === 'rear') return <rect key={i} x={planPad + p.x * ps} y={planPad + pl - 2} width={p.w * ps} height={thick} fill={c} />
            if (p.surface === 'left') return <rect key={i} x={planPad - thick + 2} y={planPad + p.x * ps} width={thick} height={p.w * ps} fill={c} />
            return <rect key={i} x={planPad + pw - 2} y={planPad + p.x * ps} width={thick} height={p.w * ps} fill={c} />
          })}
        </svg>
        <figcaption className="text-[13px] leading-relaxed text-[var(--color-gray-200)]">
          Plan from above, the wall you face at the top. Illustration only: we confirm exact positions from your photos before installing.
        </figcaption>
      </div>}
    </figure>
  )
}
