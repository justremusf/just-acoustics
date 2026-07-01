export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  hotspot?: { x: number; y: number; height: number; width: number }
  alt?: string
}

export interface KeyValueSpec {
  label: string
  value: string
}

export interface AcousticalSpecRow {
  thickness: string
  hz125: string
  hz250: string
  hz500: string
  hz1000: string
  hz2000: string
  hz4000: string
  nrc: string
}

export interface AcousticalSpecsTable {
  title?: string
  subtitle?: string
  rows?: AcousticalSpecRow[]
}

export interface ShopConfigOption {
  id?: string
  label?: string
  description?: string
  priceAdjustment?: number
  available?: boolean
}

export interface ShopSizeOption extends ShopConfigOption {
  widthMm?: number
  heightMm?: number
  previewImage?: SanityImage
}

export interface ShopThicknessOption extends ShopConfigOption {
  millimeters?: number
  nrc?: string
}

export interface ShopColourOption extends ShopConfigOption {
  name?: string
  hex?: string
  swatchImage?: SanityImage
  projectPreviewImage?: SanityImage
  swatchSrc?: string
  fabricSeries?: '8080' | '2020'
  swatchCrop?: { x: number; y: number }
}

export interface ShopInstallationOption extends ShopConfigOption {
  priceType?: 'none' | 'fixed' | 'perUnit'
  price?: number
}

export interface ShopPackageOption {
  id?: string
  name?: string
  panelCount?: number
  description?: string
  bestFor?: string
  price?: number
  discountPercent?: number
  available?: boolean
}

export interface FaqItem {
  question: string
  answer: string
}

export interface ImagePrompt {
  role: 'hero' | 'inline'
  placement?: string
  prompt: string
  alt: string
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2'
}

export interface Post {
  _id: string
  title: string
  slug: { current: string }
  category?: string
  contentType?: string
  mainImage?: SanityImage
  excerpt?: string
  publishedAt?: string
  body?: unknown[]
  seo?: { metaTitle?: string; metaDescription?: string }
  faqs?: FaqItem[]
  imagePrompts?: ImagePrompt[]
}

export interface SpaceAudience {
  _key?: string
  title?: string
  description?: string
  image?: SanityImage
}

export interface SpaceEditorialSection {
  _key?: string
  eyebrow?: string
  title?: string
  description?: string
  image?: SanityImage
}

export interface Space {
  _id: string
  title: string
  slug: { current: string }
  heroTagline?: string
  mainImage?: SanityImage
  shortDescription?: string
  benefits?: string[]
  audiences?: SpaceAudience[]
  editorialSections?: SpaceEditorialSection[]
  body?: unknown[]
  recommendedShopItems?: ShopItem[]
  featuredProjects?: Project[]
  gallery?: SanityImage[]
  faqs?: FaqItem[]
  cta?: {
    title?: string
    body?: string
    label?: string
    href?: string
  }
  seo?: { metaTitle?: string; metaDescription?: string }
}

export interface Project {
  _id: string
  title: string
  slug: { current: string }
  clientName?: string
  location?: string
  category?: 'standard-panels' | 'ceiling-panels' | 'custom-solutions' | 'soundproofing' | 'package-deals' | 'accessories'
  mainImage?: SanityImage
  gallery?: SanityImage[]
  description?: string
  spaceType?: string
  spaceSize?: string
  problem?: unknown[]
  solution?: unknown[]
  result?: unknown[]
  metrics?: { label?: string; value?: string }[]
  beforeImage?: SanityImage
  afterImage?: SanityImage
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
  productLine?: 'flexi-panel' | 'bass-trap' | 'gobo' | 'custom-print-panels' | 'pet-panel' | 'accessory'
  mainImage?: SanityImage
  gallery?: SanityImage[]
  price?: number
  inStock?: boolean
  madeToOrder?: boolean
  checkoutMode?: 'quote-only' | 'configurable-quote' | 'payment-ready'
  leadTime?: string
  configuratorEnabled?: boolean
  defaultQuantity?: number
  minQuantity?: number
  maxQuantity?: number
  defaultSizeId?: string
  defaultThicknessId?: string
  allowCustomPrint?: boolean
  customPrintLabel?: string
  customPrintPrice?: number
  customPrintRequiresReview?: boolean
  paymentReadinessNote?: string
  sizeOptions?: ShopSizeOption[]
  thicknessOptions?: ShopThicknessOption[]
  colourOptions?: ShopColourOption[]
  installationOptions?: ShopInstallationOption[]
  packageOptions?: ShopPackageOption[]
  shortDescription?: string
  features?: string[]
  specifications?: KeyValueSpec[]
  acousticalSpecs?: AcousticalSpecsTable
  installation?: unknown[]
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
  shopPage?: {
    heroTitle?: string
    heroDescription?: string
    heroImage?: SanityImage
    consultationTitle?: string
    consultationDescription?: string
    consultationImage?: SanityImage
  }
}
