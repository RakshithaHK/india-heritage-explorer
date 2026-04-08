import { X, MapPin, Volume2, Square } from 'lucide-react';
import { useState } from 'react';
import type { Place, Language } from '@/types/place';
import { CATEGORY_LABELS } from '@/types/place';
import ImageCarousel from './ImageCarousel';

interface Props {
  place: Place;
  language: Language;
  onClose: () => void;
}

function getDescription(place: Place, lang: Language): string {
  const key = `description_${lang}` as keyof Place;
  return (place[key] as string) || place.description_en || '';
}

export default function PlaceModal({ place, language, onClose }: Props) {
  const description = getDescription(place, language);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speakText = (text: string, lang: string) => {
    if (isSpeaking) {
      speechSynthesis.cancel();
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4" onClick={onClose}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-lg glass-panel rounded-xl animate-slide-up max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center text-foreground hover:bg-background transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Image carousel */}
        <div className="p-4 pb-0">
          <ImageCarousel images={place.images ?? []} name={place.name} />
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                {place.name}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs text-muted-foreground">
                  {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary capitalize">
              {CATEGORY_LABELS[place.category] ?? place.category}
            </span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Read Aloud Buttons */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => speakText(place.description_en || '', 'en-US')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary/20 text-primary rounded-md hover:bg-primary/30 transition-colors"
              disabled={isSpeaking}
            >
              <Volume2 className="w-3.5 h-3.5" />
              Read English
            </button>
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-red-500/20 text-red-600 rounded-md hover:bg-red-500/30 transition-colors"
              >
                <Square className="w-3.5 h-3.5" />
                Stop
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
