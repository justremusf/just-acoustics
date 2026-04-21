import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
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
      name: 'clientName',
      title: 'Client / Venue Name',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
      description: 'e.g. Singapore CBD, Orchard Road',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Restaurant', value: 'restaurants' },
          { title: 'Office Space', value: 'office-spaces' },
          { title: 'School / Education', value: 'schools' },
          { title: 'Studio / Home', value: 'studios-homes' },
          { title: 'Church / Event Space', value: 'churches' },
          { title: 'Gym / Leisure', value: 'gym-leisure' },
          { title: 'Cinema', value: 'cinema' },
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
      name: 'spaceType',
      title: 'Space Type',
      type: 'string',
      description: 'e.g. Open-plan office, Restaurant dining room, Recording studio',
    }),
    defineField({
      name: 'spaceSize',
      title: 'Space Size',
      type: 'string',
      description: 'e.g. 120 sqm, 3,000 sq ft',
    }),
    defineField({
      name: 'problem',
      title: 'Problem',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'What acoustic challenge did the client face?',
    }),
    defineField({
      name: 'solution',
      title: 'Solution',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'What was installed and why?',
    }),
    defineField({
      name: 'result',
      title: 'Result',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Outcome and client impact.',
    }),
    defineField({
      name: 'metrics',
      title: 'Key Metrics',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', type: 'string', title: 'Label' }),
            defineField({ name: 'value', type: 'string', title: 'Value' }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'value' },
          },
        },
      ],
    }),
    defineField({
      name: 'beforeImage',
      title: 'Before Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({
      name: 'afterImage',
      title: 'After Image',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', type: 'string', title: 'Alt Text' })],
    }),
    defineField({
      name: 'testimonial',
      title: 'Client Testimonial',
      type: 'object',
      fields: [
        defineField({ name: 'quote', type: 'text', title: 'Quote', rows: 3 }),
        defineField({ name: 'authorName', type: 'string', title: 'Author Name' }),
        defineField({ name: 'authorRole', type: 'string', title: 'Role / Title' }),
      ],
    }),
    defineField({
      name: 'completionDate',
      title: 'Completion Date',
      type: 'date',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'mainImage',
      subtitle: 'category',
    },
  },
})
