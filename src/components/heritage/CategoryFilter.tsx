import { CATEGORIES, CATEGORY_LABELS } from '@/types/place';

interface Props {
  current: string;
  onChange: (cat: string) => void;
}

export default function CategoryFilter({ current, onChange }: Props) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
            current === cat
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-secondary text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
          }`}
        >
          {CATEGORY_LABELS[cat]}
        </button>
      ))}
    </div>
  );
}
