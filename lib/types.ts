export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; height: number; width: number }
  alt?: string
}

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  category?: string
  mainImage?: SanityImage
  excerpt?: string
  publishedAt?: string
  body?: unknown[]
  seo?: { metaTitle?: string; metaDescription?: string }
}

export interface Product {
  _id: string
  title: string
  slug: { current: string }
  category?: string
  mainImage?: SanityImage
  gallery?: SanityImage[]
  description?: string
  features?: string[]
  body?: unknown[]
  seo?: { metaTitle?: string; metaDescription?: string }
}

export interface Service {
  _id: string
  title: string
  slug: { current: string }
  icon?: SanityImage
  mainImage?: SanityImage
  shortDescription?: string
  benefits?: string[]
  body?: unknown[]
  seo?: { metaTitle?: string; metaDescription?: string }
}

export interface Project {
  _id: string
  title: string
  slug: { current: string }
  clientName?: string
  location?: string
  category?: string
  mainImage?: SanityImage
  gallery?: SanityImage[]
  description?: string
  testimonial?: {
    quote?: string
    authorName?: string
    authorRole?: string
  }
  completionDate?: string
}

export interface Testimonial {
  _id: string
  authorName: string
  company?: string
  role?: string
  review: string
  rating?: number
  image?: SanityImage
  videoUrl?: string
}

export interface ShopItem {
  _id: string
  title: string
  slug: { current: string }
  category?: string
  mainImage?: SanityImage
  gallery?: SanityImage[]
  price?: number
  sku?: string
  madeToOrder?: boolean
  shortDescription?: string
  features?: string[]
  body?: unknown[]
  seo?: { metaTitle?: string; metaDescription?: string }
}

export interface SiteSettings {
  phone?: string
  whatsapp?: string
  email?: string
  address?: string
  socialLinks?: {
    instagram?: string
    facebook?: string
    youtube?: string
    linkedin?: string
  }
  brandLogos?: SanityImage[]
  googleReviewLink?: string
}
