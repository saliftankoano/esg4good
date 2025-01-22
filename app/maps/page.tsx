'use client';

import { useEffect, useRef, useState } from 'react';

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
import { SideBar } from '@/components/SideBar';

import 'mapbox-gl/dist/mapbox-gl.css';

export default function MapsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const focusOnMarker = (coordinates: [number, number]) => {
    mapRef.current?.flyTo({
      center: coordinates,
      zoom: 14,
      duration: 1500,
    });
  };

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

      mapRef.current.on('click', (e) => {
        const target = e.originalEvent.target as HTMLElement;
        if (target.closest('.mapboxgl-marker')) {
          return;
        }
        setIsSidebarOpen(false);
      });
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
              const coordinates = project.georeference.coordinates;
              const marker = new mapboxgl.Marker({
                element: MarkerElement({ icon: faBolt, color: '#ccac00' }),
              })
                .setLngLat(coordinates)
                .addTo(mapRef.current!);

              marker.getElement().addEventListener('click', () => {
                setIsSidebarOpen(true);
                focusOnMarker(coordinates);
              });
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
              const coordinates: [number, number] = [
                outage.longitude,
                outage.latitude,
              ];
              const marker = new mapboxgl.Marker({
                element: MarkerElement({
                  icon: faPlugCircleXmark,
                  color: '#ff0000',
                }),
              })
                .setLngLat(coordinates)
                .addTo(mapRef.current!);

              marker.getElement().addEventListener('click', () => {
                setIsSidebarOpen(true);
                focusOnMarker(coordinates);
              });
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
          evChargingStations.forEach((station) => {
            if (station.latitude && station.longitude) {
              const coordinates: [number, number] = [
                station.longitude,
                station.latitude,
              ];
              const marker = new mapboxgl.Marker({
                element: MarkerElement({
                  icon: faChargingStation,
                  color: '#008800',
                }),
              })
                .setLngLat(coordinates)
                .addTo(mapRef.current!);

              marker.getElement().addEventListener('click', () => {
                setIsSidebarOpen(true);
                focusOnMarker(coordinates);
              });
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
          ratSightings.forEach((sighting) => {
            if (
              sighting.location?.coordinates[0] &&
              sighting.location?.coordinates[1]
            ) {
              const coordinates = sighting.location.coordinates;
              const marker = new mapboxgl.Marker({
                element: MarkerElement({ icon: faBugs, color: '#000000' }),
              })
                .setLngLat(coordinates)
                .addTo(mapRef.current!);

              marker.getElement().addEventListener('click', () => {
                setIsSidebarOpen(true);
                focusOnMarker(coordinates);
              });
            }
          });
        }
      } catch (error) {
        console.error('Error loading rat sightings:', error);
      }
    };

    loadRatSightings();
  }, []);

  return (
    <>
      <main ref={mapContainerRef} className='h-[100vh] w-[100vw]' />
      <SideBar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </>
  );
}
