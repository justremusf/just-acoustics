import { defineField, defineType } from 'sanity'

function formatCurrency(amount: number) {
  return `$${Math.round(amount).toLocaleString('en-SG')}`
}

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
          { title: 'Custom Solutions', value: 'custom-solutions' },
          { title: 'Soundproofing', value: 'soundproofing' },
          { title: 'Accessories', value: 'accessories' },
        ],
      },
    }),
    defineField({
      name: 'productLine',
      title: 'Product Page Template',
      type: 'string',
      description: 'Stable template selection. Product names and slugs can change without changing the page layout.',
      options: {
        list: [
          { title: 'Flexi Acoustic Panel', value: 'flexi-panel' },
          { title: 'Soothe Bass Trap', value: 'bass-trap' },
          { title: 'Soothe Gobo', value: 'gobo' },
          { title: 'Flexi Custom Print', value: 'custom-print-panels' },
          { title: 'Forma PET Panel', value: 'pet-panel' },
          { title: 'Accessory', value: 'accessory' },
        ],
      },
      validation: (r) => r.required(),
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
      description: 'Base unit price in Singapore dollars before configurable options.',
    }),
    defineField({
      name: 'configuratorEnabled',
      title: 'Enable Product Configurator',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'leadTime',
      title: 'Lead Time',
      type: 'string',
      initialValue: 'Made to order. Final timeline confirmed after quote review.',
    }),
    defineField({
      name: 'defaultQuantity',
      title: 'Default Quantity',
      type: 'number',
      initialValue: 1,
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'defaultSizeId',
      title: 'Default Size ID',
      type: 'string',
      description: 'The size option that should be selected by default.',
    }),
    defineField({
      name: 'defaultThicknessId',
      title: 'Default Thickness ID',
      type: 'string',
      description: 'The thickness option that should be selected by default.',
    }),
    defineField({
      name: 'minQuantity',
      title: 'Minimum Quantity',
      type: 'number',
      initialValue: 1,
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'maxQuantity',
      title: 'Maximum Quantity',
      type: 'number',
      description: 'Optional. Leave blank if there is no hard online quote limit.',
      validation: (r) => r.min(1),
    }),
    defineField({
      name: 'sizeOptions',
      title: 'Size Options',
      type: 'array',
      of: [
        defineField({
          name: 'sizeOption',
          title: 'Size Option',
          type: 'object',
          fields: [
            defineField({ name: 'id', title: 'ID', type: 'string', description: 'Stable value, e.g. square-600 or large-1200-600', validation: (r) => r.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'widthMm', title: 'Width (mm)', type: 'number' }),
            defineField({ name: 'heightMm', title: 'Height (mm)', type: 'number' }),
            defineField({ name: 'description', title: 'Description', type: 'string' }),
            defineField({ name: 'previewImage', title: 'Size Preview Image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }] }),
            defineField({ name: 'priceAdjustment', title: 'Price Adjustment (SGD per panel)', type: 'number', initialValue: 0 }),
            defineField({ name: 'available', title: 'Available', type: 'boolean', initialValue: true }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'priceAdjustment' },
            prepare({ title, subtitle }) {
              return { title, subtitle: subtitle ? `+${formatCurrency(subtitle)}` : 'No adjustment' }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'thicknessOptions',
      title: 'Thickness Options',
      type: 'array',
      of: [
        defineField({
          name: 'thicknessOption',
          title: 'Thickness Option',
          type: 'object',
          fields: [
            defineField({ name: 'id', title: 'ID', type: 'string', description: 'Stable value, e.g. 25mm or 50mm', validation: (r) => r.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'millimeters', title: 'Thickness (mm)', type: 'number' }),
            defineField({ name: 'nrc', title: 'NRC / Acoustic Note', type: 'string' }),
            defineField({ name: 'description', title: 'Description', type: 'string' }),
            defineField({ name: 'priceAdjustment', title: 'Price Adjustment (SGD per panel)', type: 'number', initialValue: 0 }),
            defineField({ name: 'available', title: 'Available', type: 'boolean', initialValue: true }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'priceAdjustment' },
            prepare({ title, subtitle }) {
              return { title, subtitle: subtitle ? `+${formatCurrency(subtitle)}` : 'No adjustment' }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'colourOptions',
      title: 'Colour / Finish Swatches',
      type: 'array',
      of: [
        defineField({
          name: 'colourOption',
          title: 'Colour / Finish',
          type: 'object',
          fields: [
            defineField({ name: 'id', title: 'ID', type: 'string', description: 'Stable value, e.g. ivory or charcoal', validation: (r) => r.required() }),
            defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'hex', title: 'Hex Colour', type: 'string', description: 'Used for the visible swatch when no swatch image is set.' }),
            defineField({ name: 'description', title: 'Description', type: 'string' }),
            defineField({ name: 'swatchImage', title: 'Swatch Image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }] }),
            defineField({ name: 'projectPreviewImage', title: 'Real Project Preview Image', type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }] }),
            defineField({ name: 'priceAdjustment', title: 'Price Adjustment (SGD per panel)', type: 'number', initialValue: 0 }),
            defineField({ name: 'available', title: 'Available', type: 'boolean', initialValue: true }),
          ],
          preview: {
            select: { title: 'name', media: 'swatchImage', subtitle: 'priceAdjustment' },
            prepare({ title, media, subtitle }) {
              return { title, media, subtitle: subtitle ? `+${formatCurrency(subtitle)}` : 'Standard finish' }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'installationOptions',
      title: 'Installation Options',
      type: 'array',
      of: [
        defineField({
          name: 'installationOption',
          title: 'Installation Option',
          type: 'object',
          fields: [
            defineField({ name: 'id', title: 'ID', type: 'string', description: 'Stable value, e.g. self-install or professional-install', validation: (r) => r.required() }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'description', title: 'Description', type: 'string' }),
            defineField({
              name: 'priceType',
              title: 'Price Type',
              type: 'string',
              initialValue: 'none',
              options: {
                list: [
                  { title: 'No charge', value: 'none' },
                  { title: 'Fixed charge', value: 'fixed' },
                  { title: 'Per panel / unit', value: 'perUnit' },
                ],
              },
            }),
            defineField({ name: 'price', title: 'Price (SGD)', type: 'number', initialValue: 0 }),
            defineField({ name: 'available', title: 'Available', type: 'boolean', initialValue: true }),
          ],
          preview: {
            select: { title: 'label', priceType: 'priceType', price: 'price' },
            prepare({ title, priceType, price }) {
              return { title, subtitle: `${priceType || 'none'} ${price ? formatCurrency(price) : ''}`.trim() }
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description: 'Shown on the shop listing page',
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
