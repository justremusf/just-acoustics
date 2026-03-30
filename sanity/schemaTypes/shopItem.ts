import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'shopItem',
  title: 'Shop Item',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Product Name',
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
          { title: 'Package Deals', value: 'package-deals' },
          { title: 'Standard Panels', value: 'standard-panels' },
          { title: 'Custom Panels', value: 'custom-panels' },
          { title: 'Ceiling Panels', value: 'ceiling-panels' },
          { title: 'Accessories', value: 'accessories' },
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
      name: 'price',
      title: 'Price (SGD)',
      type: 'number',
      description: 'Price in Singapore dollars',
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Stock keeping unit / product code',
    }),
    defineField({
      name: 'madeToOrder',
      title: 'Made to Order',
      type: 'boolean',
      initialValue: true,
      description: 'All products are made to order by default',
      readOnly: true,
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description: 'Shown on the shop listing page',
    }),
    defineField({
      name: 'features',
      title: 'Features / Benefits',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Key selling points, e.g. "NRC 0.95", "Fire-rated"',
    }),
    defineField({
      name: 'body',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
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
    prepare({ title, media, subtitle }) {
      return {
        title,
        media,
        subtitle: subtitle ? subtitle.replace(/-/g, ' ') : 'No category',
      }
    },
  },
})
