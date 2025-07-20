'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

// Local marker icons setup (assuming you have these in your public/leaflet folder)
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
});

type MapProps = {
  coordinates: [number, number];
  address: string;
};

// ✅ Optional component to locate user and show marker
function LocateUser() {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          L.marker([latitude, longitude], { title: 'Your Location' })
            .addTo(map)
            .bindPopup('You are here')
            .openPopup();
        },
        (err) => {
          const errorMessage = err.message || 'Geolocation not available';
          console.warn('Geolocation error:', errorMessage);
        }
      );
      
  }, [map]);

  return null;
}

export default function Map({ coordinates, address }: MapProps) {
  const [lng, lat] = coordinates;

  return (
    <div className="h-72 w-full rounded-xl overflow-hidden shadow-lg">
      <MapContainer
        center={[lat, lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        {/* ✅ Clean light theme OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM contributors</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ✅ Main Location Marker */}
        <Marker position={[lat, lng]}>
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

        {/* ✅ User Location Marker */}
        <LocateUser />
      </MapContainer>
    </div>
  );
}
