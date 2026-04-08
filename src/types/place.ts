export type Language = 'en' | 'hi' | 'kn';

export interface Place {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description_en: string | null;
  description_hi: string | null;
  description_kn: string | null;
  images: string[] | null;
  category: string;
  builtYear: string | null;
  dynasty: string | null;
  architecturalStyle: string | null;
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: 'English',
  hi: 'हिन्दी',
  kn: 'ಕನ್ನಡ',
};

export const CATEGORIES = ['all', 'fort', 'temple', 'monument'] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  fort: 'Forts',
  temple: 'Temples',
  monument: 'Monuments',
};
