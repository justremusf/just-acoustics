// Single source of truth for every before/after and case-study video on the site.
//
// `src` points at a self-hosted MP4 in public/media/videos. Leave it unset and the
// player falls back to the YouTube embed for `youtubeId`. Generate the files with
// `npm run videos` (scripts/fetch-site-videos.sh), then fill in `src` + `poster`.

export type SiteVideo = {
  youtubeId: string
  title: string
  src?: string
  poster?: string
}

export type SiteVideoKey = 'meetingRoom' | 'restaurant' | 'functionRoom' | 'yogaStudio'

export const SITE_VIDEOS: Record<SiteVideoKey, SiteVideo> = {
  meetingRoom: {
    youtubeId: '8DURhlYt3wQ',
    title: 'Meeting Room — before & after',
  },
  restaurant: {
    youtubeId: 'bm-q3dQWB6g',
    title: 'Noisy Restaurant — before & after',
  },
  functionRoom: {
    youtubeId: 'Y9b0NNTRnFw',
    title: 'Function Room — before & after',
  },
  yogaStudio: {
    youtubeId: '-1WDATPou2Y',
    title: 'Case Study: Noisy Yoga Studio',
  },
}
