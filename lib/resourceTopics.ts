export const RESOURCE_TOPICS = [
  {
    value: 'echo-control',
    title: 'Echo Control',
    description: 'Why speech turns harsh, smeared, or tiring in reflective rooms.',
  },
  {
    value: 'office-acoustics',
    title: 'Office Acoustics',
    description: 'Focus, privacy, and meeting-room clarity for working environments.',
  },
  {
    value: 'restaurant-noise',
    title: 'Restaurant Noise',
    description: 'How to keep atmosphere lively without exhausting guests and staff.',
  },
  {
    value: 'worship-spaces',
    title: 'Worship Spaces',
    description: 'Speech intelligibility, music balance, and reverberation control.',
  },
  {
    value: 'buying-guides',
    title: 'Buying Guides',
    description: 'Practical advice before choosing panels, layouts, or consultation scope.',
  },
  {
    value: 'project-lessons',
    title: 'Project Lessons',
    description: 'What real installs taught us about treating rooms more effectively.',
  },
] as const

export type ResourceTopic = (typeof RESOURCE_TOPICS)[number]['value']
