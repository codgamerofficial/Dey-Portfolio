'use client';

import { MapContainer, TileLayer, Marker, useMap, Circle } from 'react-leaflet';
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
        map.flyTo(center, 16, { // Fly to street level
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
            zoom={16} // Street level precision
            style={{ height: '100%', width: '100%', background: 'transparent' }}
            zoomControl={true}
            dragging={true}
            scrollWheelZoom={true}
            minZoom={3}
        >
            <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
            />
            {/* Precision Area Homing Circle */}
            <Circle
                center={[lat, lon]}
                pathOptions={{
                    fillColor: '#ff0000',
                    color: '#ff0000',
                    weight: 1,
                    opacity: 0.8,
                    fillOpacity: 0.1
                }}
                radius={300} // Visual area indicator
            />
            <Marker position={[lat, lon]} icon={redIcon} />
            <MapUpdater center={[lat, lon]} />
        </MapContainer>
    );
}
