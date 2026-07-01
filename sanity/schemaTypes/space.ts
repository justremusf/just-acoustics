import { defineArrayMember, defineField, defineType } from 'sanity'

const imageWithAlt = defineArrayMember({
  type: 'image',
  options: { hotspot: true },
  fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
})

export default defineType({
  name: 'space',
  title: 'Space',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({ name: 'heroTagline', title: 'Hero Tagline', type: 'string' }),
    defineField({ name: 'shortDescription', title: 'Short Description', type: 'text', rows: 3 }),
    defineField({
      name: 'mainImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({
      name: 'benefits',
      title: 'Core Benefits',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'audiences',
      title: 'Audience / Use Cases',
      type: 'array',
      validation: (rule) => rule.max(4),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', type: 'string', title: 'Title' }),
            defineField({ name: 'description', type: 'text', title: 'Description', rows: 3 }),
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'editorialSections',
      title: 'Challenge and Solution Sections',
      type: 'array',
      validation: (rule) => rule.max(3),
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'eyebrow', type: 'string', title: 'Short Label' }),
            defineField({ name: 'title', type: 'string', title: 'Heading' }),
            defineField({ name: 'description', type: 'text', title: 'Description', rows: 5 }),
            defineField({
              name: 'image',
              type: 'image',
              title: 'Image',
              options: { hotspot: true },
              fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Additional Content',
      type: 'array',
      of: [{ type: 'block' }, imageWithAlt],
    }),
    defineField({
      name: 'recommendedShopItems',
      title: 'Recommended Shop Items',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'shopItem' }] }],
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [imageWithAlt],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'question', type: 'string', title: 'Question' }),
            defineField({ name: 'answer', type: 'text', title: 'Answer', rows: 4 }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'Final Consultation CTA',
      type: 'object',
      fields: [
        defineField({ name: 'title', type: 'string', title: 'Heading' }),
        defineField({ name: 'body', type: 'text', title: 'Body', rows: 3 }),
        defineField({ name: 'label', type: 'string', title: 'Button Label' }),
        defineField({ name: 'href', type: 'string', title: 'Button Link' }),
      ],
    }),
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        defineField({ name: 'metaTitle', type: 'string', title: 'Meta Title' }),
        defineField({ name: 'metaDescription', type: 'text', title: 'Meta Description', rows: 2 }),
      ],
    }),
  ],
  preview: {
    select: { title: 'title', media: 'mainImage', subtitle: 'shortDescription' },
  },
})
