'use client';

import { useEffect, useRef } from 'react';

import {
  faBolt,
  faBugs,
  faChargingStation,
  faPlugCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import mapboxgl from 'mapbox-gl';

import {
  getEVChargingStations,
  getOutages,
  getProjects,
  getRatSightings,
} from '@/app/maps/actions';
import { MarkerElement } from '@/components/Marker';

import 'mapbox-gl/dist/mapbox-gl.css';

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

      mapRef.current.addControl(new mapboxgl.NavigationControl());
    }

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const projects = await getProjects();

        if (projects) {
          projects.forEach((project) => {
            if (
              project.georeference?.coordinates[0] &&
              project.georeference?.coordinates[1]
            ) {
              new mapboxgl.Marker({
                element: MarkerElement({ icon: faBolt, color: '#ccac00' }),
              })
                .setLngLat(project.georeference.coordinates)
                .addTo(mapRef.current!);
            }
          });
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };

    loadProjects();
  }, []);

  useEffect(() => {
    const loadOutages = async () => {
      try {
        const outages = await getOutages();

        if (outages) {
          outages.forEach((outage) => {
            if (outage.latitude && outage.longitude) {
              new mapboxgl.Marker({
                element: MarkerElement({
                  icon: faPlugCircleXmark,
                  color: '#ff0000',
                }),
              })
                .setLngLat([outage.longitude, outage.latitude])
                .addTo(mapRef.current!);
            }
          });
        }
      } catch (error) {
        console.error('Error loading outages:', error);
      }
    };

    loadOutages();
  }, []);

  useEffect(() => {
    const loadEVChargingStations = async () => {
      try {
        const evChargingStations = await getEVChargingStations();

        if (evChargingStations) {
          evChargingStations.forEach((evChargingStation) => {
            if (evChargingStation.latitude && evChargingStation.longitude) {
              new mapboxgl.Marker({
                element: MarkerElement({
                  icon: faChargingStation,
                  color: '#008800',
                }),
              })
                .setLngLat([
                  evChargingStation.longitude,
                  evChargingStation.latitude,
                ])
                .addTo(mapRef.current!);
            }
          });
        }
      } catch (error) {
        console.error('Error loading EV charging stations:', error);
      }
    };

    loadEVChargingStations();
  }, []);

  useEffect(() => {
    const loadRatSightings = async () => {
      try {
        const ratSightings = await getRatSightings();

        if (ratSightings) {
          ratSightings.forEach((ratSighting) => {
            if (
              ratSighting.location?.coordinates[0] &&
              ratSighting.location?.coordinates[1]
            ) {
              new mapboxgl.Marker({
                element: MarkerElement({ icon: faBugs, color: '#000000' }),
              })
                .setLngLat(ratSighting.location.coordinates)
                .addTo(mapRef.current!);
            }
          });
        }
      } catch (error) {
        console.error('Error loading rat sightings:', error);
      }
    };

    loadRatSightings();
  }, []);

  return <main ref={mapContainerRef} className='h-[100vh] w-[100vw]' />;
}
