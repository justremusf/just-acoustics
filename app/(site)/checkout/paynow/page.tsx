import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Download, LockKeyhole, ShoppingBag } from 'lucide-react'

const PAYNOW_VPA = 'UEN202336944WA00#XNAP'
const PAYNOW_QR_SRC = '/assets/paynow/just-acoustics-paynow-qr.png'

export const metadata: Metadata = {
  title: 'PayNow QR | Just Acoustics',
  description: 'View the Just Acoustics PayNow QR code and payment instructions.',
}

export default function PayNowPage() {
  return (
    <div className="page-wrap page-stack">
      <section className="home-shell page-hero-shell flex flex-col gap-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="page-kicker">Checkout</p>
            <h1 className="m-0 mt-3 text-[clamp(38px,6vw,76px)] font-medium leading-none tracking-[-0.04em] text-[var(--color-dark-100)]" style={{ fontFamily: 'var(--font-heading)' }}>
              PayNow QR
            </h1>
          </div>
          <Link
            href="/checkout"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-black/8 bg-white/76 px-5 text-sm font-semibold text-[var(--color-dark-100)] shadow-[0_10px_24px_rgba(15,23,42,0.05)] no-underline"
          >
            <ShoppingBag className="h-4 w-4" />
            Back to checkout
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(280px,340px)_minmax(0,1fr)] lg:items-start">
          <div className="rounded-[28px] border border-white/60 bg-white/82 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6">
            <div className="rounded-[24px] border border-black/8 bg-white p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
              <Image
                src={PAYNOW_QR_SRC}
                alt="Just Acoustics PayNow QR code"
                width={1024}
                height={1024}
                className="aspect-square w-full rounded-[18px] object-contain"
                priority
              />
            </div>

            <a
              href={PAYNOW_QR_SRC}
              download="just-acoustics-paynow-qr.png"
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-black/8 bg-white px-4 text-sm font-semibold text-[var(--color-dark-100)] no-underline shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
            >
              <Download className="h-4 w-4" />
              Download QR
            </a>
          </div>

          <div className="rounded-[28px] border border-white/60 bg-white/82 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl sm:p-6 lg:p-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[rgba(19,126,137,0.12)] px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#137e89]">
                <LockKeyhole className="h-3.5 w-3.5" />
                Manual PayNow
              </span>
              <span className="rounded-full bg-[rgba(255,165,0,0.14)] px-3 py-1 text-xs font-bold text-[rgba(180,106,0,0.95)]">
                SGD payment
              </span>
            </div>

            <h2 className="m-0 mt-4 text-2xl font-semibold text-[var(--color-dark-100)]">Scan this QR to pay</h2>
            <p className="m-0 mt-3 max-w-[64ch] text-sm leading-6 text-[var(--color-gray-100)]">
              Open your Singapore banking app, choose PayNow, and scan the QR code. If your app asks for a VPA instead, paste the value below.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-[20px] border border-black/8 bg-white/76 p-4">
                <p className="m-0 text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--color-gray-200)]">VPA</p>
                <code className="mt-2 block break-all text-base font-bold text-[var(--color-dark-100)]">{PAYNOW_VPA}</code>
              </div>

              <div className="rounded-[20px] border border-black/8 bg-white/76 p-4 text-sm leading-6 text-[var(--color-gray-100)]">
                <p className="m-0 font-semibold text-[var(--color-dark-100)]">Payment reference</p>
                <p className="m-0 mt-2">
                  Use your name or order reference from checkout. On localhost, this page is provided as a direct preview so you don’t need to submit the delivery form first.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/checkout"
                className="page-cta inline-flex min-h-[54px] items-center justify-center rounded-full px-6 no-underline"
              >
                Go to checkout
              </Link>
              <Link
                href="/shop"
                className="inline-flex min-h-[54px] items-center justify-center rounded-full border border-black/8 bg-white/76 px-6 text-sm font-semibold text-[var(--color-dark-100)] no-underline shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
              >
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
