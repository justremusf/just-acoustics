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
  ],
  preview: {
    select: { title: 'email' },
    prepare() {
      return { title: 'Site Settings' }
    },
  },
})
