import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';

function FitBounds({ bounds }) {
  const map = useMap();

  useEffect(() => {
    if (!bounds || !Array.isArray(bounds) || bounds.length < 2) return;
    const [[lat1, lng1], [lat2, lng2]] = bounds;
    const latLngBounds = L.latLngBounds(
      [Math.min(lat1, lat2), Math.min(lng1, lng2)],
      [Math.max(lat1, lat2), Math.max(lng1, lng2)]
    );
    map.fitBounds(latLngBounds, { padding: [40, 40], maxZoom: 16 });
  }, [map, JSON.stringify(bounds)]);

  return null;
}

function MapResizer() {
  const map = useMap();

  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 150);
    return () => clearTimeout(t);
  }, [map]);

  return null;
}

export default function ViewerMap({
  cropTypeTilesUrl,
  cropHealthTilesUrl,
  activeLayer,
  opacity,
  bounds,
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
        url="https://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}"
        attribution="Google"
        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
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
      <FitBounds bounds={bounds} />
      <MapResizer />
    </MapContainer>
  );
}
