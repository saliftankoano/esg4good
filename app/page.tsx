'use client';
import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getProjects } from '@/app/actions/projects';
import FontawesomeMarker from 'mapbox-gl-fontawesome-markers';
import Image from 'next/image';
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export interface Project {
  georeference: {
    type: string;
    coordinates: [number, number];
  };
  project_name: string;
  project_status: string;
  project_type: string;
  redc: string;
  zip_code: string;
  energy_storage_energy_capacity_mwh: number;
  energy_storage_power_capacity_mwac: number;
  developer_name: string;
  renewable_technology: string;
  project_met_economic_benefits_threshold: string;
  incremental_economic_benefits_claimed: string;
  counterparty: string;
  fixed_rec_price: number;
  nyiso_zone: string;
  county_province: string;
  state_province: string;
  year_of_commercial_operation: string;
  year_of_delivery_start_date: string;
  contract_duration: string;
  new_renewable_capacity_mw: number;
  bid_capacity_mw: number;
  bid_quantity_mwh: number;
  max_annual_contract_quantity: number;
  permit_process: string;
  regulatory_permitting: string;
}

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    undefined
  );

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const initializeMap = async () => {
      if (!mapContainerRef.current) return;

      mapRef.current = new mapboxgl.Map({
        style: 'mapbox://styles/tanksalif/cm1c4amlx00o301qkd5racncv',
        container: mapContainerRef.current,
        bounds: [
          [-74.2709, 40.48972],
          [-73.7042, 40.93288],
        ],
        fitBoundsOptions: {
          padding: 15,
        },
        zoom: 11.5,
      });

      mapRef.current.addControl(new mapboxgl.FullscreenControl());
      // Wait for map to load before adding markers
      mapRef.current.on('load', async () => {
        try {
          const projects = await getProjects();

          projects
            .filter((project: Project) => project.state_province === 'NY')
            .forEach((project: Project) => {
              if (project.georeference?.coordinates) {
                const [lng, lat] = project.georeference.coordinates;

                // Create marker with click handler
                const marker = new FontawesomeMarker({
                  icon: 'fa-solid fa-house',
                  iconColor: 'white',
                  color: '#fa7132',
                })
                  .setLngLat([lng, lat])
                  .addTo(mapRef.current!);

                // Add click handler to marker element
                marker.getElement().addEventListener('click', () => {
                  setSelectedProject(project);
                });
              }
            });
        } catch (error) {
          console.error('Error loading projects:', error);
        }
      });
    };

    initializeMap();

    // Cleanup function
    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <div>
      <div ref={mapContainerRef} className='w-full h-[100vh]' />
      {selectedProject && <SideBar project={selectedProject} />}
    </div>
  );
}

function SideBar({ project }: { project: Project }) {
  return (
    <div className='absolute top-0 left-0 w-1/4 h-[100vh] bg-gray-100'>
      <div className='w-full h-1/4'>
        <Image
          src='https://placehold.co/600x400'
          alt={project.project_name}
          className='object-cover w-full h-full'
          width={600}
          height={400}
        />
      </div>
      <div className='p-4'>
        <h1 className='text-2xl font-bold text-black'>
          {project.project_name}
        </h1>
        <p className='text-sm text-gray-500'>{project.project_type}</p>
        <div className='flex flex-row border-y border-black gap-2 py-2'>
          <div className='flex flex-col items-center justify-center'>
            <div className='text-black rounded-full w-10 h-10 bg-red-500 flex items-center justify-center'>
              <p>{project.project_status.charAt(0)}</p>
            </div>
            <p className='text-black'>Status</p>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <div className='text-black rounded-full w-10 h-10 bg-green-500 flex items-center justify-center'>
              <p>{project.renewable_technology.charAt(0)}</p>
            </div>
            <p className='text-black'>Type</p>
          </div>
          <div className='flex flex-col items-center justify-center'>
            <div className='text-black rounded-full w-10 h-10 bg-blue-500 flex items-center justify-center'>
              <p>{project.redc.charAt(0)}</p>
            </div>
            <p className='text-black'>Region</p>
          </div>
        </div>
      </div>
    </div>
  );
}
