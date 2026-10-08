'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from '@/components/ui/Image'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { ViewImage } from '@/lib/contentView'

/** Plain photo grid; tapping a photo opens it full-size in a native dialog with prev/next. */
export default function ProjectGallery({ images }: { images: ViewImage[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const count = images.length

  const open = (index: number) => {
    setActive(index)
    dialogRef.current?.showModal()
  }
  const close = useCallback(() => dialogRef.current?.close(), [])
  const step = useCallback((delta: number) => setActive((i) => (i === null ? i : (i + delta + count) % count)), [count])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const onClose = () => setActive(null)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    dialog.addEventListener('close', onClose)
    dialog.addEventListener('keydown', onKey)
    return () => {
      dialog.removeEventListener('close', onClose)
      dialog.removeEventListener('keydown', onKey)
    }
  }, [step])

  const columns = count === 1 ? '' : count === 2 || count === 4 ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'
  const sizes = count === 1 ? '(min-width: 1580px) 1540px, 100vw' : count === 2 || count === 4 ? '(min-width: 640px) 50vw, 100vw' : '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw'
  const current = active === null ? null : images[active]

  return (
    <>
      <ul className={`m-0 grid list-none gap-4 p-0 ${columns}`}>
        {images.map((image, index) => (
          <li key={`${index}-${image.src}`}>
            <button
              type="button"
              onClick={() => open(index)}
              className={`group relative block w-full cursor-zoom-in overflow-hidden rounded-[22px] border-0 bg-[var(--color-white-200)] p-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--color-brand-orange)] ${count === 1 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}
              aria-label={`Enlarge photo ${index + 1} of ${count}: ${image.alt}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={sizes}
                style={{ objectPosition: image.position ?? 'center' }}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transition-none"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Project photo viewer"
        onClick={(e) => {
          if (e.target === e.currentTarget) close()
        }}
        className="m-0 h-[100dvh] max-h-none w-screen max-w-none border-0 bg-black/95 p-0 text-white backdrop:bg-black/70"
      >
        {current && (
          <div className="flex h-full flex-col" onClick={(e) => e.target === e.currentTarget && close()}>
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <p className="m-0 text-sm tabular-nums text-white/75">
                {(active ?? 0) + 1} / {count}
              </p>
              <button
                type="button"
                onClick={close}
                autoFocus
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-white/10 text-white hover:bg-white/20"
                aria-label="Close photo viewer"
              >
                <X size={20} aria-hidden="true" />
              </button>
            </div>
            <div className="relative min-h-0 flex-1" onClick={(e) => e.target === e.currentTarget && close()}>
              <Image key={current.src} src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
            </div>
            <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <p className="m-0 line-clamp-2 min-w-0 flex-1 text-sm text-white/75">{current.alt}</p>
              {count > 1 && (
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => step(-1)}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-white/10 text-white hover:bg-white/20"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft size={20} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => step(1)}
                    className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-0 bg-white/10 text-white hover:bg-white/20"
                    aria-label="Next photo"
                  >
                    <ChevronRight size={20} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </dialog>
    </>
  )
}
