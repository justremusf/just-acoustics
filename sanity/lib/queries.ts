import { client } from './client'

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export async function getAllPosts() {
  return client.fetch(`
    *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
      _id, title, slug, category, mainImage, excerpt, publishedAt
    }
  `)
}

export async function getLatestPosts(count = 3) {
  return client.fetch(
    `*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...$count] {
      _id, title, slug, category, mainImage, excerpt, publishedAt
    }`,
    { count }
  )
}

export async function getPostBySlug(slug: string) {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id, title, slug, category, mainImage, excerpt, publishedAt, body, seo
    }`,
    { slug }
  )
}

export async function getAllPostSlugs() {
  return client.fetch(`*[_type == "post" && !(_id in path("drafts.**"))] { "slug": slug.current }`)
}

// ─── Products ─────────────────────────────────────────────────────────────────

export async function getAllProducts() {
  return client.fetch(`
    *[_type == "product" && !(_id in path("drafts.**"))] | order(_createdAt asc) {
      _id, title, slug, mainImage, category, description, features
    }
  `)
}

export async function getProductBySlug(slug: string) {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id, title, slug, mainImage, gallery, category, description, features, body, seo
    }`,
    { slug }
  )
}

export async function getAllProductSlugs() {
  return client.fetch(`*[_type == "product" && !(_id in path("drafts.**"))] { "slug": slug.current }`)
}

// ─── Services ─────────────────────────────────────────────────────────────────

export async function getAllServices() {
  return client.fetch(`
    *[_type == "service" && !(_id in path("drafts.**"))] | order(_createdAt asc) {
      _id, title, slug, icon, mainImage, shortDescription, benefits
    }
  `)
}

export async function getServiceBySlug(slug: string) {
  return client.fetch(
    `*[_type == "service" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id, title, slug, icon, mainImage, shortDescription, benefits, body, seo
    }`,
    { slug }
  )
}

export async function getAllServiceSlugs() {
  return client.fetch(`*[_type == "service" && !(_id in path("drafts.**"))] { "slug": slug.current }`)
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getAllProjects() {
  return client.fetch(`
    *[_type == "project" && !(_id in path("drafts.**"))] | order(completionDate desc) {
      _id, title, slug, mainImage, category, location, clientName
    }
  `)
}

export async function getProjectBySlug(slug: string) {
  return client.fetch(
    `*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id, title, slug, mainImage, gallery, category, location, clientName, description, testimonial, completionDate
    }`,
    { slug }
  )
}

export async function getAllProjectSlugs() {
  return client.fetch(`*[_type == "project" && !(_id in path("drafts.**"))] { "slug": slug.current }`)
}

// ─── Shop Items ───────────────────────────────────────────────────────────────

export async function getAllShopItems() {
  return client.fetch(`
    *[_type == "shopItem" && !(_id in path("drafts.**"))] | order(_createdAt asc) {
      _id, title, slug, mainImage, category, price, inStock, shortDescription
    }
  `)
}

export async function getShopItemBySlug(slug: string) {
  return client.fetch(
    `*[_type == "shopItem" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
      _id, title, slug, mainImage, gallery, category, price, sku, inStock, shortDescription, features,
      specifications[]{label, value},
      body, seo
    }`,
    { slug }
  )
}

export async function getAllShopItemSlugs() {
  return client.fetch(`*[_type == "shopItem" && !(_id in path("drafts.**"))] { "slug": slug.current }`)
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getFeaturedTestimonials() {
  return client.fetch(`
    *[_type == "testimonial" && featured == true && !(_id in path("drafts.**"))] | order(_createdAt asc) {
      _id, authorName, company, role, review, rating, image, videoUrl
    }
  `)
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettings() {
  return client.fetch(`
    *[_type == "siteSettings" && !(_id in path("drafts.**"))][0] {
      phone, whatsapp, email, address, socialLinks, brandLogos, googleReviewLink
    }
  `)
}
