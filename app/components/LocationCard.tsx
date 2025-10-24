"use client";
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useDistance } from '../hooks/useDistance';
import { useTooltip } from '../hooks/useTooltip';
import Tooltip from './ui/Tooltip';
import InfoButton from './ui/InfoButton';
import type { MapProps } from '../types';

// Dynamically import the entire map to avoid SSR issues
const Map = dynamic<MapProps>(() => import('./Map'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-200/50 animate-pulse" />
});

export default function LocationCard() {
  const latitude = 34.07;
  const longitude = -118.45;
  const { distance, loading } = useDistance(latitude, longitude);
  const [mapReady, setMapReady] = useState(false);
  const { showTooltip, tooltipPosition, buttonRef, handleMouseEnter, handleMouseLeave } = useTooltip();

  useEffect(() => {
    setMapReady(true);
  }, []);
  
  return (
    <>
      <div className="backdrop-blur-xl bg-gradient-to-b from-white/20 to-white/10 text-black rounded-3xl w-[calc(100vw-16px)] md:w-[540px] lg:w-[420px] lg:h-[180px] lg:translate-y-[calc(2vw)] relative transition-all duration-700 delay-900 border-2 border-gray-300/40 overflow-hidden" data-search-title="Location — Map">
        <div className="relative z-10 overflow-hidden h-full flex flex-col">
          {mapReady && (
            <div className="h-[140px] w-full rounded-t-2xl overflow-hidden">
              <Map latitude={latitude} longitude={longitude} />
            </div>
          )}
          <div className="px-4 py-2 text-center flex-1 flex items-center justify-center">
            {loading ? (
              <p className="text-gray-600 text-sm italic">
                Calculating distance...
              </p>
            ) : distance !== null ? (
              <p className="text-gray-900 text-sm flex items-center justify-center gap-1">
                You are <span className="font-semibold">{distance.toLocaleString()}</span> {distance === 1 ? 'mile' : 'miles'} away from me
                <span className="relative inline-block">
                  <InfoButton
                    buttonRef={buttonRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="text-gray-900"
                  />
                </span>
              </p>
            ) : null}
          </div>
        </div>
      </div>
      
      <Tooltip show={showTooltip} position={tooltipPosition}>
        Your IP address is used to approximate your location, and the Haversine formula calculates the great-circle distance between us
      </Tooltip>
    </>
  );
}

