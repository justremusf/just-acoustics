import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Wall Panels', value: 'wall-panels' },
          { title: 'Ceiling Panels', value: 'ceiling-panels' },
          { title: 'Custom Solutions', value: 'custom-solutions' },
          { title: 'Soundproofing', value: 'soundproofing' },
        ],
      },
    }),
    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', type: 'string', title: 'Alt Text' }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'features',
      title: 'Features / Benefits',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g. "Voice Clarity", "Lower Stress Levels"',
    }),
    defineField({
      name: 'body',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      of: [
        defineField({
          name: 'specification',
          title: 'Specification',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'value', title: 'Value', type: 'string' }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'acousticalSpecs',
      title: 'Acoustical Specs',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Title', type: 'string' }),
        defineField({ name: 'subtitle', title: 'Subtitle', type: 'string' }),
        defineField({
          name: 'rows',
          title: 'Rows',
          type: 'array',
          of: [
            defineField({
              name: 'acousticalSpecRow',
              title: 'Acoustical Spec Row',
              type: 'object',
              fields: [
                defineField({ name: 'thickness', title: 'Thickness', type: 'string' }),
                defineField({ name: 'hz125', title: '125Hz', type: 'string' }),
                defineField({ name: 'hz250', title: '250Hz', type: 'string' }),
                defineField({ name: 'hz500', title: '500Hz', type: 'string' }),
                defineField({ name: 'hz1000', title: '1kHz', type: 'string' }),
                defineField({ name: 'hz2000', title: '2kHz', type: 'string' }),
                defineField({ name: 'hz4000', title: '4kHz', type: 'string' }),
                defineField({ name: 'nrc', title: 'NRC', type: 'string' }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'installation',
      title: 'Installation',
      type: 'array',
      of: [{ type: 'block' }],
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
    select: { title: 'title', media: 'mainImage', subtitle: 'category' },
  },
})
