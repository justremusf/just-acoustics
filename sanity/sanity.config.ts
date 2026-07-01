import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemaTypes'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '8h1saua8'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  name: 'just-acoustics',
  title: 'Just Acoustics CMS',
  projectId,
  dataset,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('post').title('Blog Posts'),
            S.documentTypeListItem('space').title('Spaces'),
            S.documentTypeListItem('project').title('Projects'),
            S.documentTypeListItem('shopItem').title('Shop Items'),
            S.documentTypeListItem('testimonial').title('Testimonials'),
            S.divider(),
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
          ]),
    }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
