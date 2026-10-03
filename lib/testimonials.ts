import type { Testimonial } from '@/lib/types'

// Real client reviews, shown when Sanity has no featured testimonials.
export const FALLBACK_TESTIMONIALS: Omit<Testimonial, '_id' | 'image'>[] = [
  {
    authorName: 'Gerald',
    company: 'Mortgage Hub',
    review:
      'They are patient and explained the options of reducing echoes in the office space professionally. I recommend Just Acoustics for both residential and commercial projects.',
    rating: 5,
  },
  {
    authorName: 'Irvin',
    company: 'Church of Christ',
    review:
      'The Just Acoustics team were professional, efficient and detailed in their work. Highly recommended for homes and businesses!',
    rating: 5,
  },
  {
    authorName: 'Madeleine',
    company: 'Concentricheal',
    review:
      'Working with the team was very smooth! They are highly knowledgeable in elaborating on the sound treatment options and recommending the best one that fits our requirements.',
    rating: 5,
  },
]
