import { useEffect, useState } from 'react';

export function useDistance(targetLat: number, targetLon: number) {
  const [distance, setDistance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        // Use IP-based geolocation
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.latitude && data.longitude) {
          const userLat = data.latitude;
          const userLon = data.longitude;
          
          // Haversine formula to calculate distance
          const R = 3959; // Earth's radius in miles
          const dLat = (userLat - targetLat) * Math.PI / 180;
          const dLon = (userLon - targetLon) * Math.PI / 180;
          const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(targetLat * Math.PI / 180) * Math.cos(userLat * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distanceInMiles = R * c;
          
          setDistance(Math.round(distanceInMiles));
        }
      } catch (error) {
        console.error('Error fetching location:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [targetLat, targetLon]);

  return { distance, loading };
}

