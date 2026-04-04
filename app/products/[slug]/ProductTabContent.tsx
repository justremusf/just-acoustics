'use client'

import { useState } from 'react'
import { PortableText, type PortableTextBlock } from '@portabletext/react'
import type { Product } from '@/lib/types'

export default function ProductTabContent({ product }: { product: Product }) {
  const [activeTab, setActiveTab] = useState<'details' | 'specs' | 'acoustical' | 'installation'>('details')
  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'specs', label: 'Specs' },
    { id: 'acoustical', label: 'Acoustical Specs' },
    { id: 'installation', label: 'Installation' },
  ] as const

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'page-filter active cursor-pointer' : 'page-filter cursor-pointer'}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-6 text-sm leading-7 text-[var(--color-gray-100)]">
        {activeTab === 'details' && (
          <div className="space-y-4">
            {product.description && <p className="m-0">{product.description}</p>}
            {product.body && product.body.length > 0 && (
              <div className="portable-copy">
                <PortableText value={product.body as PortableTextBlock[]} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'specs' && (
          product.specifications && product.specifications.length > 0 ? (
            <div className="grid gap-2.5">
              {product.specifications.map((spec) => (
                <div
                  key={`${spec.label}-${spec.value}`}
                  className="flex flex-col gap-1 rounded-[18px] border border-black/6 bg-white/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                >
                  <span className="font-medium text-[var(--color-dark-100)]">{spec.label}</span>
                  <span className="text-[var(--color-gray-100)] sm:text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="m-0">Specifications coming soon.</p>
          )
        )}

        {activeTab === 'acoustical' && (
          product.acousticalSpecs?.rows && product.acousticalSpecs.rows.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                {product.acousticalSpecs.title && (
                  <h3
                    className="m-0 text-[clamp(26px,3vw,38px)] font-medium tracking-[-0.03em] text-[var(--color-dark-100)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {product.acousticalSpecs.title}
                  </h3>
                )}
                {product.acousticalSpecs.subtitle && (
                  <p
                    className="m-0 text-[clamp(17px,2vw,21px)] tracking-[-0.02em] text-[var(--color-gray-100)]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {product.acousticalSpecs.subtitle}
                  </p>
                )}
              </div>

              <div className="overflow-hidden rounded-[24px] border border-black/6 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.06)]">
                <div className="overflow-x-auto">
                  <table className="min-w-[760px] w-full border-collapse text-left text-[14px] leading-6 text-[var(--color-gray-100)]">
                    <thead className="bg-[linear-gradient(180deg,rgba(255,188,42,0.10),rgba(255,255,255,0.92))]">
                      <tr>
                        <th className="border-b border-r border-black/6 px-4 py-4 font-semibold text-[var(--color-dark-100)]">Thickness</th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">125Hz</th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">250Hz</th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">500Hz</th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">1kHz</th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">2kHz</th>
                        <th className="border-b border-r border-black/6 px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">4kHz</th>
                        <th className="border-b px-4 py-4 text-center font-semibold text-[var(--color-dark-100)]">NRC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.acousticalSpecs.rows.map((row) => (
                        <tr key={row.thickness} className="bg-white even:bg-[rgba(255,188,42,0.04)]">
                          <td className="border-r border-black/6 px-4 py-4 font-medium text-[var(--color-dark-100)]">{row.thickness}</td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">{row.hz125}</td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">{row.hz250}</td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">{row.hz500}</td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">{row.hz1000}</td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">{row.hz2000}</td>
                          <td className="border-r border-black/6 px-4 py-4 text-center">{row.hz4000}</td>
                          <td className="px-4 py-4 text-center font-semibold text-[var(--color-brand-orange-dark)]">{row.nrc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <p className="m-0">Acoustical specs coming soon.</p>
          )
        )}

        {activeTab === 'installation' && (
          product.installation && product.installation.length > 0 ? (
            <div className="portable-copy">
              <PortableText value={product.installation as PortableTextBlock[]} />
            </div>
          ) : (
            <p className="m-0">Installation details coming soon.</p>
          )
        )}
      </div>
    </div>
  )
}
