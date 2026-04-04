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
      name: 'specifications',
      title: 'Specifications',
      type: 'array',
      of: [
        defineField({
          name: 'specification',
          title: 'Specification',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              validation: (r) => r.required(),
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'value',
            },
          },
        }),
      ],
      description: 'Structured product specs shown under the Specs tab',
    }),
    defineField({
      name: 'acousticalSpecs',
      title: 'Acoustical Specs',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Table Title',
          type: 'string',
          initialValue: 'Acoustic Performance',
        }),
        defineField({
          name: 'subtitle',
          title: 'Subtitle',
          type: 'string',
          initialValue: 'ASTM C423 - Mounting A as per ASTM E795',
        }),
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
                defineField({ name: 'thickness', title: 'Thickness', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'hz125', title: '125Hz', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'hz250', title: '250Hz', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'hz500', title: '500Hz', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'hz1000', title: '1kHz', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'hz2000', title: '2kHz', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'hz4000', title: '4kHz', type: 'string', validation: (r) => r.required() }),
                defineField({ name: 'nrc', title: 'NRC', type: 'string', validation: (r) => r.required() }),
              ],
              preview: {
                select: {
                  title: 'thickness',
                  subtitle: 'nrc',
                },
                prepare({ title, subtitle }) {
                  return {
                    title: title ? `${title} thickness` : 'Acoustical spec row',
                    subtitle: subtitle ? `NRC ${subtitle}` : 'No NRC set',
                  }
                },
              },
            }),
          ],
          description: 'Sound absorption values shown under the Acoustical Specs tab',
        }),
      ],
      description: 'Acoustical performance table for frequency absorption values',
    }),
    defineField({
      name: 'installation',
      title: 'Installation',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Installation notes shown under the Installation tab',
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
