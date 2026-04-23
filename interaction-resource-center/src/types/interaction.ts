export type CodeLanguage = 'js' | 'ts' | 'css' | 'tailwind';

export type InteractionCategory = 'Motion' | 'Transition' | 'Feedback';

export interface CodeSnippets {
  js: string;
  ts: string;
  css: string;
  tailwind: string;
}

export interface Interaction {
  id: string;
  name: string;
  description: string;
  category: InteractionCategory;
  duration: number; // ms
  easing: string;
  previewType: 'carousel' | 'rolling' | 'show' | 'slot' | 'fade' | 'bounce' | 'ripple' | 'skeleton';
  code: CodeSnippets;
  guide: string;
}

export interface TrackCase {
  id: string;
  title: string;
  description: string;
  interactionId: string;
}

export interface Track {
  id: string;
  name: string;
  cases: TrackCase[];
}
