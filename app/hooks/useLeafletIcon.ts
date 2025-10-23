import { useEffect } from 'react';
import L from 'leaflet';

interface IconDefaultPrototype {
  _getIconUrl?: () => string;
}

export function useLeafletIcon() {
  useEffect(() => {
    // Fix for default marker icon in Next.js
    const prototype = L.Icon.Default.prototype as unknown as IconDefaultPrototype;
    delete prototype._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);
}

