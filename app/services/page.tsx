import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getAllServices } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import type { Service } from '@/lib/types'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Acoustic Services',
  description: 'Office acoustics, restaurant sound treatment, church audio, studio soundproofing and more across Singapore.',
}

export default async function ServicesPage() {
  const services: Service[] = await getAllServices().catch(() => [])

  return (
    <div className="max-w-[1280px] mx-auto px-5 py-20">
      <div className="mb-14">
        <span className="inline-block border border-[var(--color-dark-100)] rounded-[100px] px-4 py-2 text-sm mb-4">
          Services
        </span>
        <h1
          className="text-[var(--color-dark-100)] m-0 mb-4"
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(32px, 5vw, var(--fs-h2))',
            lineHeight: '112%',
            fontWeight: 500,
            letterSpacing: '-1.28px',
          }}
        >
          Space Applications
        </h1>
        <p className="text-[var(--color-gray-100)] text-base m-0 max-w-xl">
          Whether you need to soundproof an office or create a unique ambience for your venue, we can help.
        </p>
      </div>

      {services.length === 0 ? (
        <p className="text-[var(--color-gray-200)]">Services coming soon.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Link
              key={service._id}
              href={`/services/${service.slug.current}`}
              className="block no-underline group rounded-[16px] overflow-hidden"
            >
              {service.mainImage && (
                <div className="overflow-hidden h-56">
                  <Image
                    src={urlFor(service.mainImage).width(600).height(224).url()}
                    alt={service.mainImage.alt || service.title}
                    width={600}
                    height={224}
                    className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="bg-[var(--color-white-200)] p-6">
                <h2
                  className="text-[var(--color-dark-100)] m-0 mb-2 text-xl font-semibold group-hover:text-[var(--color-brand-orange)] transition-colors"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {service.title}
                </h2>
                {service.shortDescription && (
                  <p className="text-[var(--color-gray-100)] text-sm m-0 leading-relaxed">
                    {service.shortDescription}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
