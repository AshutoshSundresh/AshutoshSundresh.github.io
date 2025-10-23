"use client";
import React from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useLeafletIcon } from '../hooks/useLeafletIcon';
import type { MapProps } from '../types';

export default function Map({ latitude, longitude }: MapProps) {
  useLeafletIcon();
  
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={12}
      scrollWheelZoom={false}
      zoomControl={false}
      dragging={false}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={[latitude, longitude]} />
    </MapContainer>
  );
}

