import { client } from './client'
import { serverClient } from './serverClient'

// ─── Blog Posts ───────────────────────────────────────────────────────────────

export async function getAllPosts() {
  try {
    return await client.fetch(`
      *[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
        _id, title, slug, category, contentType, mainImage, excerpt, publishedAt
      }
    `)
  } catch (error) {
    console.error('Error fetching all posts:', error)
    return []
  }
}

export async function getLatestPosts(count = 3) {
  try {
    return await client.fetch(
      `*[_type == "post" && !(_id in path("drafts.**"))] | order(publishedAt desc) [0...$count] {
        _id, title, slug, category, contentType, mainImage, excerpt, publishedAt
      }`,
      { count }
    )
  } catch (error) {
    console.error('Error fetching latest posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string) {
  try {
    return await client.fetch(
      `*[_type == "post" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
        _id, title, slug, category, contentType, mainImage, excerpt, publishedAt, body, seo,
        faqs[]{ question, answer },
        imagePrompts[]{ role, placement, prompt, alt, aspectRatio }
      }`,
      { slug }
    )
  } catch (error) {
    console.error(`Error fetching post by slug ${slug}:`, error)
    return null
  }
}

export async function getAllPostSlugs() {
  try {
    return await client.fetch(`*[_type == "post" && !(_id in path("drafts.**"))] { "slug": slug.current }`)
  } catch (error) {
    console.error('Error fetching all post slugs:', error)
    return []
  }
}

// ─── Spaces ───────────────────────────────────────────────────────────────────

export async function getAllSpaces() {
  try {
    return await serverClient.fetch(`
      *[_type == "space" && !(_id in path("drafts.**"))] | order(_createdAt asc) {
        _id, title, slug, heroTagline, mainImage, shortDescription, benefits
      }
    `)
  } catch (error) {
    console.error('Error fetching all spaces:', error)
    return []
  }
}

export async function getSpaceBySlug(slug: string) {
  try {
    return await serverClient.fetch(
      `*[_type == "space" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
        _id, title, slug, heroTagline, mainImage, shortDescription, benefits,
        audiences[]{ _key, title, description, image },
        editorialSections[]{ _key, eyebrow, title, description, image },
        body,
        recommendedShopItems[]->{
          _id, title, slug, category, mainImage, price, shortDescription, configuratorEnabled
        },
        featuredProjects[]->{
          _id, title, slug, mainImage, category, location, clientName, description
        },
        gallery,
        faqs[]{ question, answer },
        cta,
        seo
      }`,
      { slug }
    )
  } catch (error) {
    console.error(`Error fetching space by slug ${slug}:`, error)
    return null
  }
}

export async function getAllSpaceSlugs() {
  try {
    return await serverClient.fetch(`*[_type == "space" && !(_id in path("drafts.**"))] { "slug": slug.current }`)
  } catch (error) {
    console.error('Error fetching all space slugs:', error)
    return []
  }
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getAllProjects() {
  try {
    return await client.fetch(`
      *[_type == "project" && !(_id in path("drafts.**"))] | order(completionDate desc) {
        _id, title, slug, mainImage, category, location, clientName
      }
    `)
  } catch (error) {
    console.error('Error fetching all projects:', error)
    return []
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    return await client.fetch(
      `*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
        _id, title, slug, mainImage, gallery, category, location, clientName, description,
        spaceType, spaceSize, problem, solution, result,
        metrics[]{label, value},
        beforeImage, afterImage,
        testimonial, completionDate
      }`,
      { slug }
    )
  } catch (error) {
    console.error(`Error fetching project by slug ${slug}:`, error)
    return null
  }
}

export async function getAllProjectSlugs() {
  try {
    return await client.fetch(`*[_type == "project" && !(_id in path("drafts.**"))] { "slug": slug.current }`)
  } catch (error) {
    console.error('Error fetching all project slugs:', error)
    return []
  }
}

// ─── Shop Items ───────────────────────────────────────────────────────────────

export async function getAllShopItems() {
  try {
    return await serverClient.fetch(`
      *[_type == "shopItem" && !(_id in path("drafts.**"))] | order(_createdAt asc) {
        _id, title, slug, mainImage, gallery, category, productLine, price, shortDescription,
        configuratorEnabled, leadTime, defaultQuantity, minQuantity, maxQuantity,
        defaultSizeId, defaultThicknessId,
        sizeOptions[]{id, label, widthMm, heightMm, description, previewImage, priceAdjustment, available},
        thicknessOptions[]{id, label, millimeters, nrc, description, priceAdjustment, available},
        installationOptions[]{id, label, description, priceType, price, available},
        colourOptions[]{id, name, hex, swatchImage, available}
      }
    `)
  } catch (error) {
    console.error('Error fetching all shop items:', error)
    return []
  }
}

export async function getShopItemBySlug(slug: string) {
  try {
    return await serverClient.fetch(
      `*[_type == "shopItem" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
        _id, title, slug, mainImage, gallery, category, productLine, price,
        leadTime, configuratorEnabled, defaultQuantity, defaultSizeId, defaultThicknessId, minQuantity, maxQuantity,
        shortDescription,
        sizeOptions[]{id, label, widthMm, heightMm, description, previewImage, priceAdjustment, available},
        thicknessOptions[]{id, label, millimeters, nrc, description, priceAdjustment, available},
        colourOptions[]{id, name, hex, description, swatchImage, priceAdjustment, available},
        installationOptions[]{id, label, description, priceType, price, available},
        specifications[]{label, value},
        acousticalSpecs{
          title,
          subtitle,
          rows[]{
            thickness,
            hz125,
            hz250,
            hz500,
            hz1000,
            hz2000,
            hz4000,
            nrc
          }
        },
        installation,
        body, seo
      }`,
      { slug }
    )
  } catch (error) {
    console.error(`Error fetching shop item by slug ${slug}:`, error)
    return null
  }
}

export async function getAllShopItemSlugs() {
  try {
    return await serverClient.fetch(
      `*[_type == "shopItem" && !(_id in path("drafts.**"))] { "slug": slug.current }`
    )
  } catch (error) {
    console.error('Error fetching all shop item slugs:', error)
    return []
  }
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

export async function getFeaturedTestimonials() {
  try {
    return await client.fetch(`
      *[_type == "testimonial" && featured == true && !(_id in path("drafts.**"))] | order(_createdAt asc) {
        _id, authorName, company, role, review, rating, image, videoUrl
      }
    `)
  } catch (error) {
    console.error('Error fetching featured testimonials:', error)
    return []
  }
}

// ─── Site Settings ────────────────────────────────────────────────────────────

export async function getSiteSettings() {
  try {
    return await client.fetch(`
      *[_type == "siteSettings" && !(_id in path("drafts.**"))][0] {
        phone, whatsapp, email, address, socialLinks, brandLogos, googleReviewLink,
        shopPage
      }
    `)
  } catch (error) {
    console.error('Error fetching site settings:', error)
    return null
  }
}

// ─── Navigation Menu Queries (lightweight — header dropdowns only) ─────────────

export async function getMenuSpaces() {
  try {
    return await serverClient.fetch(`
      *[_type == "space" && !(_id in path("drafts.**"))] | order(_createdAt asc) {
        _id, title, "slug": slug.current, shortDescription, mainImage
      }
    `)
  } catch (error) {
    console.error('Error fetching menu spaces:', error)
    return []
  }
}

export async function getMenuProjects() {
  try {
    return await client.fetch(`
      *[_type == "project" && !(_id in path("drafts.**"))] | order(completionDate desc) {
        _id, category, mainImage
      }
    `)
  } catch (error) {
    console.error('Error fetching menu projects:', error)
    return []
  }
}

export async function getMenuShopItems() {
  try {
    return await serverClient.fetch(`
      *[_type == "shopItem" && !(_id in path("drafts.**"))] | order(_createdAt asc) {
        _id, title, "slug": slug.current, category, productLine, mainImage, price, configuratorEnabled
      }
    `)
  } catch (error) {
    console.error('Error fetching menu shop items:', error)
    return []
  }
}
