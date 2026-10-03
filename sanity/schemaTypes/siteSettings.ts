import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      description: 'e.g. +65 8930 1905',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Digits only, e.g. 6589301905',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'object',
      fields: [
        defineField({ name: 'instagram', type: 'url', title: 'Instagram' }),
        defineField({ name: 'facebook', type: 'url', title: 'Facebook' }),
        defineField({ name: 'youtube', type: 'url', title: 'YouTube' }),
        defineField({ name: 'linkedin', type: 'url', title: 'LinkedIn' }),
      ],
    }),
    defineField({
      name: 'brandLogos',
      title: 'Client / Brand Logos',
      type: 'array',
      of: [
        {
          type: 'image',
          fields: [{ name: 'alt', type: 'string', title: 'Brand Name' }],
        },
      ],
      description: 'Logos shown in the scrolling ticker on the homepage',
    }),
    defineField({
      name: 'googleReviewLink',
      title: 'Google Review Link',
      type: 'url',
      description: 'Link to your Google Business reviews',
    }),
    defineField({
      name: 'googleRating',
      title: 'Google Rating',
      type: 'number',
      description: 'Your current Google star rating, e.g. 4.9. Shown next to consultation buttons. Leave empty to hide.',
      validation: (r) => r.min(1).max(5),
    }),
    defineField({
      name: 'googleReviewCount',
      title: 'Google Review Count',
      type: 'number',
      description: 'Number of Google reviews, e.g. 48. Shown with the rating.',
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: 'shopPage',
      title: 'Shop Page',
      type: 'object',
      fields: [
        defineField({ name: 'heroTitle', title: 'Hero Title', type: 'string' }),
        defineField({ name: 'heroDescription', title: 'Hero Description', type: 'text', rows: 3 }),
        defineField({
          name: 'heroImage',
          title: 'Hero Image',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
        }),
        defineField({ name: 'consultationTitle', title: 'Consultation Card Title', type: 'string' }),
        defineField({ name: 'consultationDescription', title: 'Consultation Card Description', type: 'text', rows: 3 }),
        defineField({
          name: 'consultationImage',
          title: 'Consultation Card Image',
          type: 'image',
          options: { hotspot: true },
          fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
        }),
      ],
    }),
  ],
  preview: {
    select: { title: 'email' },
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
