import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Place, Language } from '@/types/place';

// Fix default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface Props {
  places: Place[];
  language: Language;
  onSelectPlace: (place: Place) => void;
}

const INDIA_CENTER: [number, number] = [22.5, 79];
const INDIA_ZOOM = 5;

// Custom gold marker icon
const goldIcon = new L.DivIcon({
  html: `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0z" fill="hsl(43, 80%, 55%)"/>
    <circle cx="14" cy="14" r="6" fill="hsl(222, 47%, 6%)"/>
  </svg>`,
  className: 'custom-marker',
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -36],
});

export default function HeritageMap({ places, language, onSelectPlace }: Props) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: INDIA_CENTER,
      zoom: INDIA_ZOOM,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapRef.current = map;
    markersRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when places change
  useEffect(() => {
    if (!mapRef.current || !markersRef.current) return;

    markersRef.current.clearLayers();

    places.forEach((place) => {
      const marker = L.marker([place.latitude, place.longitude], { icon: goldIcon })
        .bindPopup(`<strong>${place.name}</strong>`)
        .on('click', () => onSelectPlace(place));
      markersRef.current!.addLayer(marker);
    });
  }, [places, language, onSelectPlace]);

  // Reset view function exposed via ref
  const resetView = () => {
    mapRef.current?.setView(INDIA_CENTER, INDIA_ZOOM, { animate: true });
  };

  return (
    <div className="relative w-full h-full">
      <div ref={containerRef} className="w-full h-full" />
      <button
        onClick={resetView}
        className="absolute bottom-20 right-3 z-[400] px-3 py-2 rounded-lg glass-panel text-xs font-medium text-foreground hover:bg-secondary transition-colors"
      >
        Reset View
      </button>
    </div>
  );
}
