import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  images: string[];
  name: string;
}

export default function ImageCarousel({ images, name }: Props) {
  const [index, setIndex] = useState(0);

  if (!images.length) {
    return (
      <div className="w-full h-56 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground">
        No images available
      </div>
    );
  }

  return (
    <div className="relative w-full h-56 rounded-lg overflow-hidden group">
      <img
        src={images[index]}
        alt={`${name} - ${index + 1}`}
        className="w-full h-full object-cover transition-transform duration-500"
        loading="lazy"
      />
      {images.length > 1 && (
        <>
          <button
            onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-foreground hover:bg-background"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIndex((i) => (i + 1) % images.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-foreground hover:bg-background"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === index ? 'bg-primary w-4' : 'bg-foreground/40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
