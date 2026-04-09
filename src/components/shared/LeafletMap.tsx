'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapProps {
    latitude: number;
    longitude: number;
    zoom?: number;
    className?: string;
}

const LeafletMap = ({ latitude, longitude, zoom = 13, className }: LeafletMapProps) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (!mapRef.current) return;

        // Leaflet icon fix for Next.js / Webpack
        // Delete the default icon because it will try to use the local images which might not be found
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        if (!mapInstance.current) {
            mapInstance.current = L.map(mapRef.current).setView([latitude, longitude], zoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);

            L.marker([latitude, longitude]).addTo(mapInstance.current);
        } else {
            mapInstance.current.setView([latitude, longitude], zoom);
            // Update marker position if needed
            // Currently we just clear and re-add or just re-init on dependency change
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [latitude, longitude, zoom]);

    return (
        <div 
            ref={mapRef} 
            className={className} 
            style={{ height: '100%', width: '100%', borderRadius: 'inherit' }} 
        />
    );
};

export default LeafletMap;
