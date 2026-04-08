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

// Custom gold marker icon with better visibility
const goldIcon = L.divIcon({
  html: `<svg width="30" height="45" viewBox="0 0 30 45" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 0 L30 15 L30 30 L15 45 L0 30 L0 15 Z"
          fill="url(#goldGradient)"
          stroke="#B8860B"
          stroke-width="2"/>
    <circle cx="15" cy="15" r="6" fill="#B8860B" stroke="#FFD700" stroke-width="1"/>
    <defs>
      <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FFD700"/>
        <stop offset="100%" style="stop-color:#FFA500"/>
      </linearGradient>
    </defs>
  </svg>`,
  className: 'custom-gold-marker',
  iconSize: [30, 45],
  iconAnchor: [15, 45],
  popupAnchor: [0, -45]
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

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
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
    if (!mapRef.current || !markersRef.current || places.length === 0) return;

    // Small delay to ensure map is fully ready
    const timeoutId = setTimeout(() => {
      if (!mapRef.current || !markersRef.current) return;

      markersRef.current.clearLayers();

      places.forEach((place) => {
        const marker = L.marker([place.latitude, place.longitude], { icon: goldIcon })
          .on('click', (e) => {
            L.DomEvent.stopPropagation(e);
            console.log('Marker clicked:', place.name, 'at', place.latitude, place.longitude);
            console.log('Calling onSelectPlace with:', place);
            onSelectPlace(place);
          })
          .on('mouseover', function(e) {
            L.DomEvent.stopPropagation(e);
            this.openTooltip();
            console.log('Mouse over:', place.name);
          })
          .on('mouseout', function(e) {
            L.DomEvent.stopPropagation(e);
            this.closeTooltip();
            console.log('Mouse out:', place.name);
          });

        // Bind tooltip separately to avoid interference
        marker.bindTooltip(place.name, {
          permanent: false,
          direction: 'top',
          offset: [0, -20],
          opacity: 0.9
        });

        markersRef.current!.addLayer(marker);
      });

      console.log(`Added ${places.length} markers to map at ${new Date().toISOString()}`);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [places, onSelectPlace]);

  // Reset view function exposed via ref
  const resetView = () => {
    mapRef.current?.setView(INDIA_CENTER, INDIA_ZOOM, { animate: true });
  };

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ minHeight: '400px' }}
      />
      <button
        onClick={resetView}
        className="absolute bottom-20 right-3 z-[400] px-3 py-2 rounded-lg glass-panel text-xs font-medium text-foreground hover:bg-secondary transition-colors"
      >
        Reset View
      </button>
    </div>
  );
}
