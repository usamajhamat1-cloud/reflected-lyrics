export interface Track {
  id: string;
  title: string;
  album: string;
  category: string;
  duration: number; // in seconds
  audioUrl?: string;
  synthFrequency?: number; // fallback synth baseline frequency
}

export interface BookChapter {
  id: number;
  title: string;
  content: string[];
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  type: string;
  message: string;
  timestamp: string;
  status: 'Received' | 'In Review' | 'Replied';
}
