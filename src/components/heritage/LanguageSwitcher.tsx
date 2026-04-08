import { Language, LANGUAGE_LABELS } from '@/types/place';

interface Props {
  current: Language;
  onChange: (lang: Language) => void;
}

export default function LanguageSwitcher({ current, onChange }: Props) {
  return (
    <div className="flex gap-1 glass-panel rounded-lg p-1">
      {(Object.keys(LANGUAGE_LABELS) as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => onChange(lang)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
            current === lang
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {LANGUAGE_LABELS[lang]}
        </button>
      ))}
    </div>
  );
}
