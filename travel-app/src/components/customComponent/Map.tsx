'use client';

import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';

// ✅ Custom icon fix
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

type MapProps = {
  coordinates: [number, number];
  address: string;
};

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (positions.length >= 2) {
      // Leaflet wants exactly two points for bounds
      const bounds: L.LatLngBoundsExpression = [positions[0], positions[1]];
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [map, positions]);
  return null;
}


export default function Map({ coordinates, address }: MapProps) {
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);

  const [lng, lat] = coordinates;
  const tourCoords: [number, number] = [lat, lng];

  // Get user's location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserCoords([latitude, longitude]);
      },
      (err) => console.warn('Geolocation error:', err.message || 'Unavailable')
    );
  }, []);

  // Gradient colors for the line (splitting into 5 segments for demo)
  const gradientColors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff'];

  // Split the line into segments for a colorful effect
  const segments =
    userCoords?.map((coord, i) => [coord, tourCoords]) || (userCoords ? [[userCoords, tourCoords]] : []);

  return (
    <div className="h-80 w-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={userCoords || tourCoords}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM contributors</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Tour Marker */}
        <Marker position={tourCoords}>
          <Popup>
            <div className="space-y-1">
              <p className="font-semibold text-emerald-700">{address}</p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View on Google Maps
              </a>
            </div>
          </Popup>
        </Marker>

        {/* User Marker */}
        {userCoords && (
          <Marker position={userCoords}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {/* Colorful line */}
        {userCoords &&
          gradientColors.map((color, idx) => (
            <Polyline
              key={idx}
              positions={[userCoords, tourCoords]}
              pathOptions={{ color, weight: 5, dashArray: '10,10', opacity: 0.8 }}
            />
          ))}

        {/* Fit map to show both points */}
        {userCoords && <FitBounds positions={[userCoords, tourCoords]} />}
      </MapContainer>
    </div>
  );
}
