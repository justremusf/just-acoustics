import type { CSSProperties } from 'react'
import type { SwatchRegion } from './types'

export function colourSwatchStyle(src?: string, region?: SwatchRegion): CSSProperties | undefined {
  if (!src || !region || region.width <= 0 || region.height <= 0 || region.imageWidth <= region.width || region.imageHeight <= region.height) return undefined
  return {
    backgroundImage: `url("${src}")`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: `${region.imageWidth / region.width * 100}% ${region.imageHeight / region.height * 100}%`,
    backgroundPosition: `${region.x / (region.imageWidth - region.width) * 100}% ${region.y / (region.imageHeight - region.height) * 100}%`,
  }
}
