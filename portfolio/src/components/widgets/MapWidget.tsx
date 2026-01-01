'use client';

import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Custom red icon for Spider-Verse theme
const redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function MapUpdater({ center }: { center: [number, number] }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo(center, 13, {
            duration: 2
        });
    }, [center, map]);
    return null;
}

export default function MapWidget({ lat, lon }: { lat: number; lon: number }) {
    return (
        <MapContainer
            key={`${lat}-${lon}`}
            center={[lat, lon]}
            zoom={13}
            style={{ height: '100%', width: '100%', background: 'transparent' }}
            zoomControl={false}
            dragging={false} // Keep it static-ish for the widget vibe
            scrollWheelZoom={false}
        >
            <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
            <Marker position={[lat, lon]} icon={redIcon} />
            <MapUpdater center={[lat, lon]} />
        </MapContainer>
    );
}
