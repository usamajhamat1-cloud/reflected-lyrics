import { Track, BookChapter } from '../types';

export const MUSIC_CATALOG: Track[] = [
  {
    id: 'track-1',
    title: 'The Midnight Reflection',
    album: 'Lyrical Masters Vol. 1',
    category: 'Orchestral Score',
    duration: 225, // 3:45
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    synthFrequency: 110, // A2 (Deep moody chord)
  },
  {
    id: 'track-2',
    title: 'Lyrical Verse #4',
    album: 'Acoustic Sessions 2024',
    category: 'Acoustic Session',
    duration: 260, // 4:20
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    synthFrequency: 130.81, // C3 (Warming baseline)
  },
  {
    id: 'track-3',
    title: 'Golden Horizon',
    album: 'Cinematic Soundscapes',
    category: 'Epic Ambient',
    duration: 312, // 5:12
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    synthFrequency: 82.41, // E2 (Profound organic rumble)
  },
  {
    id: 'track-4',
    title: 'Whispers of the Wind',
    album: 'Poetry in Motion',
    category: 'Lyrical Poetry',
    duration: 195, // 3:15
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    synthFrequency: 146.83, // D3 (Mellow atmospheric lead)
  },
];

export const BOOK_CHAPTERS: BookChapter[] = [
  {
    id: 1,
    title: 'Chapter I: The Dust of Departed Leaves',
    content: [
      'The archives of the Midnight Library did not smell of decay, but of potential. Every shelf stretched vertically into a velvet vertical draft that felt remarkably like the breathing of some colossal sleeper.',
      'Linn had spent eighteen years cataloging the exact frequency of sighing produced by turning pages of forgotten novels. She knew, with mathematical certainty, that a leather-bound folio printed in London in 1642 sighed at exactly forty-two hertz when exposed to a southern breeze.',
      '“Nothing is truly lost,” the chief archivist, Amy Matthew, had told her during their first winter inside the vault. “Every word spoken has a physical footprint. When you write a page of poetry, you are not inventing ink; you are rearranging light.”',
      'Tonight, Linn found the volume that did not sigh. It vibrated.',
    ],
  },
  {
    id: 2,
    title: 'Chapter II: The Resonance of Amber',
    content: [
      'The sound was not loud, but it possessed what musicians call presence—the quality of standing next to you in an empty room.',
      'Holding the miniature octavo volume between her index finger and thumb, Linn felt her pulse syncopate. The gold lettering on the spine had been worn down to a faint outline, yet the characters read clearly in her palms: REFL-LYR.',
      'As she parted the gilded leaf edges, a thin ray of polarized light split the dark rotunda gallery. The words inside did not stand still; they drifted like charcoal flakes over a frozen lake.',
      'To read them was to hear them. A low piano melody, unresolved and heavy with amber reverb, began playing directly behind her temples...',
    ],
  },
];

export const TESTIMONIALS = [
  {
    quote: "Reflected Lyrical brings a rare depth to every project. Their ability to bridge music and storytelling is unmatched in the modern industry.",
    author: "Executive Producer",
    company: "Global Film Studio",
  },
  {
    quote: "A world-class creative partner. They don't just produce content; they curate legacies that resonate across media.",
    author: "Award-Winning Lyricist",
    company: "Independent Artist Group",
  }
];

export const PARTNERS = [
  { name: 'SONY', category: 'Music Distribution' },
  { name: 'WARNER', category: 'Publishing Powerhouse' },
  { name: 'UNIVERSAL', category: 'Sound Syndicate' },
  { name: 'PARAMOUNT', category: 'Dramatic Picture Houses' },
  { name: 'A24', category: 'Avant-Garde Narrative' },
  { name: 'NETFLIX', category: 'Global Distribution Syndicate' }
];
