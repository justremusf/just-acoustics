import { defineField, defineType } from 'sanity'
import { RESOURCE_TOPICS } from '../../lib/resourceTopics'

export default defineType({
  name: 'post',
  title: 'Blog Post',
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
      title: 'Resource Topic',
      type: 'string',
      options: {
        list: RESOURCE_TOPICS.map((topic) => ({
          title: topic.title,
          value: topic.value,
        })),
      },
      description: 'Used to group articles inside the resource center.',
    }),
    defineField({
      name: 'contentType',
      title: 'Content Type',
      type: 'string',
      options: {
        list: [
          { title: 'Article', value: 'article' },
          { title: 'Guide', value: 'guide' },
          { title: 'Comparison', value: 'comparison' },
          { title: 'Video', value: 'video' },
          { title: 'Case Study', value: 'case-study' },
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      description: 'Short summary shown on blog listing page',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
        },
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      description: 'Per-article FAQs. Renders on-page and as FAQPage JSON-LD.',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          fields: [
            defineField({
              name: 'question',
              type: 'string',
              title: 'Question',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'answer',
              type: 'text',
              title: 'Answer',
              rows: 3,
              validation: (r) => r.required(),
            }),
          ],
          preview: { select: { title: 'question' } },
        },
      ],
    }),
    defineField({
      name: 'imagePrompts',
      title: 'Image Prompts',
      type: 'array',
      description:
        'Ready-to-paste diagram / infographic prompts for Gemini Nano Banana. Hero = TLDR visual abstract of the whole article. Inline = one diagram per major concept.',
      of: [
        {
          type: 'object',
          name: 'imagePrompt',
          fields: [
            defineField({
              name: 'role',
              type: 'string',
              title: 'Role',
              options: {
                list: [
                  { title: 'Hero (TLDR visual abstract)', value: 'hero' },
                  { title: 'Inline (concept diagram)', value: 'inline' },
                ],
              },
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'placement',
              type: 'string',
              title: 'Placement',
              description: 'e.g. "hero", "after-h2-1", "after-h2-2"',
            }),
            defineField({
              name: 'prompt',
              type: 'text',
              title: 'Prompt',
              rows: 6,
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'aspectRatio',
              type: 'string',
              title: 'Aspect Ratio',
              options: { list: ['16:9', '4:3', '1:1', '3:2'] },
              initialValue: '16:9',
            }),
          ],
          preview: { select: { title: 'role', subtitle: 'placement' } },
        },
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
  orderings: [
    {
      title: 'Published Date, Newest First',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: { title: 'title', media: 'mainImage', subtitle: 'publishedAt' },
  },
})
