import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

export default function ViewerMap({
  cropTypeTilesUrl,
  cropHealthTilesUrl,
  activeLayer,
  opacity,
}) {
  const tileUrl = activeLayer === 'crop_type' ? cropTypeTilesUrl : cropHealthTilesUrl;

  return (
    <MapContainer
      center={[26.8206, 30.8025]}
      zoom={6}
      minZoom={3}
      maxZoom={19}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
      attributionControl={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19}
      />
      {tileUrl && (
        <TileLayer
          key={`${activeLayer}-${opacity}`}
          url={tileUrl}
          opacity={opacity}
          maxZoom={19}
          tms={false}
        />
      )}
    </MapContainer>
  );
}
