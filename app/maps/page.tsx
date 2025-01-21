'use client';

import { useEffect, useRef } from 'react';

import mapboxgl from 'mapbox-gl';

export default function MapsPage() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-74.0242, 40.6941],
        zoom: 10.12,
      });
    }

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return <main ref={mapContainerRef} className='h-[100vh] w-[100vw]' />;
}
