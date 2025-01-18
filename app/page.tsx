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
    <div className='absolute top-0 left-0 w-[400px] h-[100vh] bg-white shadow-lg'>
      {/* Header Image Section */}
      <div className='relative w-full h-48'>
        <Image
          src='https://placehold.co/600x400'
          alt={project.project_name}
          className='object-cover w-full h-full'
          width={600}
          height={400}
        />
        <button
          className='absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100'
          onClick={() => window.print()} // Replace with actual share functionality
        >
          <i className='fas fa-share-alt text-gray-600'></i>
        </button>
      </div>

      {/* Content Section */}
      <div className='p-6 space-y-6'>
        {/* Project Title & Type */}
        <div>
          <h1 className='text-2xl font-semibold text-gray-900 mb-1'>
            {project.project_name}
          </h1>
          <p className='text-sm text-gray-600'>{project.project_type}</p>
        </div>

        {/* Key Stats */}
        <div className='grid grid-cols-2 gap-4'>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <p className='text-sm text-gray-600 mb-1'>Capacity</p>
            <p className='text-lg font-semibold text-gray-900'>
              {project.new_renewable_capacity_mw} MW
            </p>
          </div>
          <div className='bg-gray-50 p-4 rounded-lg'>
            <p className='text-sm text-gray-600 mb-1'>Status</p>
            <p className='text-lg font-semibold text-gray-900'>
              {project.project_status}
            </p>
          </div>
        </div>

        {/* Project Details */}
        <div className='space-y-4'>
          <div className='flex items-center space-x-4 text-gray-700'>
            <i className='fas fa-building w-6'></i>
            <div>
              <p className='font-medium'>Developer</p>
              <p className='text-sm text-gray-600'>{project.developer_name}</p>
            </div>
          </div>

          <div className='flex items-center space-x-4 text-gray-700'>
            <i className='fas fa-map-marker-alt w-6'></i>
            <div>
              <p className='font-medium'>Location</p>
              <p className='text-sm text-gray-600'>
                {project.county_province}, {project.state_province}
              </p>
            </div>
          </div>

          <div className='flex items-center space-x-4 text-gray-700'>
            <i className='fas fa-calendar w-6'></i>
            <div>
              <p className='font-medium'>Commercial Operation</p>
              <p className='text-sm text-gray-600'>
                {project.year_of_commercial_operation}
              </p>
            </div>
          </div>
        </div>

        {/* Technology Details */}
        <div className='border-t pt-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-4'>
            Technology Details
          </h2>
          <div className='space-y-3'>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Renewable Type</span>
              <span className='font-medium text-gray-900'>
                {project.renewable_technology}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>NYISO Zone</span>
              <span className='font-medium text-gray-900'>
                {project.nyiso_zone}
              </span>
            </div>
            <div className='flex justify-between'>
              <span className='text-gray-600'>Contract Duration</span>
              <span className='font-medium text-gray-900'>
                {project.contract_duration}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex space-x-4 pt-4'>
          <button className='flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors'>
            Contact Developer
          </button>
          <button className='flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors'>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
