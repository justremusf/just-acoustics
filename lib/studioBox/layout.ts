// Panel positions for the layout illustration (and the "where" notes in the back-office drafts).
// Units: millimetres. Walls are named from where you sit: `front` is the wall you face (desk, screen or
// speakers), `rear` is behind you. Side-wall x runs from the front corner towards the rear.
// Rules followed (memories no-panels-on-partitions, custom-panel-sizing-pricing): solid walls and ceiling only,
// even gaps of 75–150 mm, tall panels from 600 mm off the floor, 1200 panels centred at seated ear height.

import { extraPanelKind, PANEL_INFO, type PanelKind, type StudioPack } from './packages'

export type WallId = 'front' | 'rear' | 'left' | 'right' | 'ceiling'
export type Placed = { surface: WallId; x: number; y: number; w: number; h: number; kind: PanelKind }
export type RoomMm = { widthMm: number; lengthMm: number; heightMm: number }

const GAP = 150

function row(surface: WallId, kind: PanelKind, count: number, start: number, y: number, gap = GAP): Placed[] {
  const { wMm, hMm } = PANEL_INFO[kind]
  const vertical = kind !== 'bass-100'
  const w = vertical ? wMm : hMm * 2
  const h = vertical ? hMm : wMm / 2
  return Array.from({ length: count }, (_, i) => ({ surface, kind, x: start + i * (w + gap), y, w, h }))
}

function centred(surface: WallId, kind: PanelKind, count: number, span: number, y: number, gap = GAP) {
  const w = kind === 'bass-100' ? 1200 : PANEL_INFO[kind].wMm
  const total = count * w + (count - 1) * gap
  return row(surface, kind, count, Math.max(0, (span - total) / 2), y, gap)
}

const tallY = (room: RoomMm) => Math.max(300, Math.min(600, room.heightMm - 1800 - 200))
const earY = 700

export function layoutFor(pack: StudioPack, room: RoomMm, extras = 0): Placed[] {
  const { widthMm: W, lengthMm: L, heightMm: H } = room
  const out: Placed[] = []
  switch (pack.id) {
    case 'home-office':
      out.push(...centred('front', 'wall-1800', 2, W, tallY(room)))
      out.push(...row('left', 'wall-1800', 1, 700, tallY(room)), ...row('right', 'wall-1800', 1, 700, tallY(room)))
      break
    case 'home-studio':
      out.push(...row('left', 'wall-1200', 2, 450, earY), ...row('right', 'wall-1200', 2, 450, earY))
      out.push(...centred('rear', 'wall-1200', 4, W, earY, 100))
      break
    case 'podcast-room':
      out.push(...centred('front', 'wall-1200', 2, W, earY))
      out.push(...centred('left', 'wall-1200', 2, L, earY), ...centred('right', 'wall-1200', 2, L, earY))
      out.push(
        { surface: 'ceiling', kind: 'cloud-1200', x: W / 2 - 600 - 150, y: L / 2 - 600, w: 600, h: 1200 },
        { surface: 'ceiling', kind: 'cloud-1200', x: W / 2 + 150, y: L / 2 - 600, w: 600, h: 1200 },
      )
      break
    case 'studio-pro': {
      const bassY = H - 600
      out.push(
        { surface: 'front', kind: 'bass-100', x: 0, y: bassY, w: 1200, h: 600 },
        { surface: 'front', kind: 'bass-100', x: W - 1200, y: bassY, w: 1200, h: 600 },
        { surface: 'rear', kind: 'bass-100', x: 0, y: bassY, w: 1200, h: 600 },
        { surface: 'rear', kind: 'bass-100', x: W - 1200, y: bassY, w: 1200, h: 600 },
      )
      const tY = Math.min(tallY(room), H - 600 - 1800 - 75)
      out.push(...row('left', 'wall-1800', 2, 700, tY), ...row('right', 'wall-1800', 2, 700, tY))
      out.push(...centred('rear', 'wall-1800', 2, W, Math.max(150, tY - 200)))
      const cloudY = L * 0.38 - 600
      out.push(
        { surface: 'ceiling', kind: 'cloud-1200', x: W / 2 - 600 - 100, y: cloudY, w: 600, h: 1200 },
        { surface: 'ceiling', kind: 'cloud-1200', x: W / 2 + 100, y: cloudY, w: 600, h: 1200 },
      )
      break
    }
    case 'meeting-room': {
      const pitch = (L - 600) / 4
      out.push(...Array.from({ length: 4 }, (_, i) => ({ surface: 'left' as const, kind: 'wall-1800' as const, x: 300 + i * pitch, y: tallY(room) + 100, w: 600, h: 1800 })))
      out.push(...Array.from({ length: 4 }, (_, i) => ({ surface: 'right' as const, kind: 'wall-1800' as const, x: 300 + pitch / 2 + i * pitch, y: tallY(room) + 100, w: 600, h: 1800 })))
      break
    }
  }
  if (extras > 0) {
    const kind = extraPanelKind(pack)
    const target: WallId = out.some((p) => p.surface === 'rear' && p.kind !== 'bass-100') ? 'front' : 'rear'
    out.push(...centred(target, kind, extras, W, kind === 'wall-1800' ? tallY(room) : earY))
  }
  return out
}

/** Plain-words summary per wall, for quotes and the HRD brief. */
export function placementNotes(placed: Placed[]) {
  const names: Record<WallId, string> = { front: 'wall you face', rear: 'wall behind you', left: 'left wall', right: 'right wall', ceiling: 'ceiling' }
  const groups = new Map<string, number>()
  for (const p of placed) {
    const key = `${names[p.surface]}|${p.kind}`
    groups.set(key, (groups.get(key) ?? 0) + 1)
  }
  return [...groups.entries()].map(([key, n]) => {
    const [where, kind] = key.split('|') as [string, PanelKind]
    return `${n} × ${PANEL_INFO[kind].size} on the ${where}`
  })
}
