'use client';

import { useEffect, useRef } from 'react';

import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

import * as powerOutages from '../../datasets/power_outage_complaints_20250118.json';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export interface PowerOutage {
  'Unique Key': string;
  'Created Date': string;
  'Incident Address': string;
  Borough: string;
  Latitude: string;
  Longitude: string;
  Location: string;
}

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const getPowerOutageData = async () => {
      // Transform the data into GeoJSON format
      const geojsonData: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: (powerOutages as PowerOutage[])
          .filter((outage: PowerOutage) => outage.Latitude && outage.Longitude)
          .map((outage: PowerOutage) => ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [
                parseFloat(outage.Longitude),
                parseFloat(outage.Latitude),
              ],
            },
            properties: {
              incidents: 1, // Each point represents one incident
              created_date: outage['Created Date'],
              address: outage['Incident Address'],
              borough: outage.Borough,
            },
          })),
      };

      // If map is already initialized, update the source
      if (mapRef.current) {
        const source = mapRef.current.getSource(
          'power-outages'
        ) as mapboxgl.GeoJSONSource;
        if (source) {
          source.setData(geojsonData);
        }
      }

      return geojsonData;
    };

    if (mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        style: 'mapbox://styles/tanksalif/cm1c4amlx00o301qkd5racncv',
        container: mapContainerRef.current,
        center: [-73.989357, 40.74855], // NYC coordinates
        zoom: 11.5,
      });

      // Add the data source and layer when the map loads
      mapRef.current.on('load', async () => {
        const geojsonData = await getPowerOutageData();

        // Add the source with power outage data
        mapRef.current?.addSource('power-outages', {
          type: 'geojson',
          data: geojsonData,
        });

        // Add the heatmap layer
        mapRef.current?.addLayer({
          id: 'power-outage-heat',
          type: 'heatmap',
          source: 'power-outages',
          paint: {
            // Increase weight based on number of incidents
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'incidents'],
              0,
              0,
              10,
              1,
            ],
            // Increase intensity as zoom level increases
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              1,
              15,
              3,
            ],
            // Color ramp for heatmap from blue to red
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0,
              'rgba(0,0,255,0)',
              0.2,
              'rgb(0,0,255)',
              0.4,
              'rgb(0,255,255)',
              0.6,
              'rgb(255,255,0)',
              0.8,
              'rgb(255,128,0)',
              1,
              'rgb(255,0,0)',
            ],
            // Adjust the heatmap radius with zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0,
              2,
              15,
              20,
            ],
            'heatmap-opacity': 0.8,
          },
        });
      });
    }

    // Cleanup function
    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div>
      <h1 className='p-4 text-2xl font-bold'>NYC Power Outages Heatmap</h1>
      <div ref={mapContainerRef} className='h-[100vh] w-full' />
    </div>
  );
}
