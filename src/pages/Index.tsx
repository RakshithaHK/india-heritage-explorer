import { useState, useMemo, useCallback } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import HeritageMap from '@/components/heritage/HeritageMap';
import SearchBar from '@/components/heritage/SearchBar';
import CategoryFilter from '@/components/heritage/CategoryFilter';
import LanguageSwitcher from '@/components/heritage/LanguageSwitcher';
import PlaceModal from '@/components/heritage/PlaceModal';
import { usePlaces } from '@/hooks/usePlaces';
import type { Place, Language } from '@/types/place';

export default function Index() {
  const { data: places, isLoading, error } = usePlaces();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [language, setLanguage] = useState<Language>('en');
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const filtered = useMemo(() => {
    if (!places) return [];
    return places.filter((p) => {
      const matchesCategory = category === 'all' || p.category === category;
      const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [places, search, category]);

  const handleSelectPlace = useCallback((place: Place) => {
    setSelectedPlace(place);
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="glass-panel border-b border-border z-[500] px-4 py-3">
        <div className="max-w-screen-2xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <MapPin className="w-5 h-5 text-primary" />
            <h1 className="font-heading text-lg font-semibold gold-text">Heritage India</h1>
          </div>

          {/* Controls */}
          <div className="flex flex-1 items-center gap-3 w-full sm:w-auto flex-wrap">
            <div className="flex-1 min-w-[180px] max-w-xs">
              <SearchBar value={search} onChange={setSearch} />
            </div>
            <CategoryFilter current={category} onChange={setCategory} />
            <div className="ml-auto">
              <LanguageSwitcher current={language} onChange={setLanguage} />
            </div>
          </div>
        </div>
      </header>

      {/* Map */}
      <main className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 z-[400] flex items-center justify-center bg-background/80">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 z-[400] flex items-center justify-center bg-background/80">
            <p className="text-destructive">Failed to load places. Please try again.</p>
          </div>
        )}
        <HeritageMap
          places={filtered}
          language={language}
          onSelectPlace={handleSelectPlace}
        />
      </main>

      {/* Place Modal */}
      {selectedPlace && (
        <PlaceModal
          place={selectedPlace}
          language={language}
          onClose={() => setSelectedPlace(null)}
        />
      )}

      {/* Place count badge */}
      <div className="absolute bottom-4 left-4 z-[400] glass-panel rounded-full px-3 py-1.5 text-xs text-muted-foreground">
        {filtered.length} heritage site{filtered.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
