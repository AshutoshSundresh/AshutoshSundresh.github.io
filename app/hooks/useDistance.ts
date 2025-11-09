import { useEffect, useState } from 'react';

interface GeoLocation {
  lat: number;
  lon: number;
}

interface IPApi {
  name: string;
  url: string;
  parse: (data: unknown) => GeoLocation;
}

// Table of IP geolocation APIs with their parsers
const IP_APIS: IPApi[] = [
  {
    name: 'geojs.io',
    url: 'https://get.geojs.io/v1/ip/geo.json',
    parse: (data: unknown) => {
      const response = data as { latitude?: string; longitude?: string };
      return {
        lat: parseFloat(response.latitude || '0'),
        lon: parseFloat(response.longitude || '0'),
      };
    },
  },
  {
    name: 'ipapi.co',
    url: 'https://ipapi.co/json/',
    parse: (data: unknown) => {
      const response = data as { latitude?: number; longitude?: number };
      return {
        lat: response.latitude || 0,
        lon: response.longitude || 0,
      };
    },
  },
  {
    name: 'ip-api.com',
    url: 'https://ip-api.com/json/',
    parse: (data: unknown) => {
      const response = data as { lat?: number; lon?: number };
      return {
        lat: response.lat || 0,
        lon: response.lon || 0,
      };
    },
  },
  {
    name: 'ipwho.is',
    url: 'https://ipwho.is/',
    parse: (data: unknown) => {
      const response = data as { latitude?: number; longitude?: number };
      return {
        lat: response.latitude || 0,
        lon: response.longitude || 0,
      };
    },
  },
];

export function useDistance(targetLat: number, targetLon: number) {
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateDistance = (userLat: number, userLon: number) => {
      // Haversine formula to calculate distance
      const R = 3959; // Earth's radius in miles
      const dLat = (userLat - targetLat) * Math.PI / 180;
      const dLon = (userLon - targetLon) * Math.PI / 180;
      const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(targetLat * Math.PI / 180) * Math.cos(userLat * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const fetchLocation = async () => {
      // Try each API in order until one works
      for (const api of IP_APIS) {
        try {
          const response = await fetch(api.url);
          
          if (!response.ok) {
            console.warn(`${api.name} returned status ${response.status}, trying next API...`);
            continue;
          }
          
          const data = await response.json();
          const { lat, lon } = api.parse(data);
          
          if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
            const distanceInMiles = calculateDistance(lat, lon);
            setDistance(Math.round(distanceInMiles));
            console.log(`Successfully fetched location from ${api.name}`);
            return; // Success, exit the loop
          } else {
            console.warn(`${api.name} returned invalid coordinates, trying next API...`);
          }
        } catch (error) {
          console.warn(`${api.name} failed:`, error, 'trying next API...');
        }
      }
      
      // If all APIs failed
      console.error('All IP geolocation APIs failed');
      setLoading(false);
    };

    fetchLocation().finally(() => setLoading(false));
  }, [targetLat, targetLon]);

  return { distance, loading };
}

