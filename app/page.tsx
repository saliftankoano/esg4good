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

      // Add click handler to map to close sidebar
      mapRef.current.on('click', (e) => {
        // Get the HTML element at the clicked point
        const clickedElement = document.elementFromPoint(e.point.x, e.point.y);

        // Check if the clicked element is part of a marker
        const isMarkerClick = clickedElement?.closest('.mapboxgl-marker');

        // Only close if click was not on a marker
        if (!isMarkerClick) {
          setSelectedProject(undefined);
        }
      });

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
      {selectedProject && (
        <SideBar
          project={selectedProject}
          onClose={() => setSelectedProject(undefined)}
        />
      )}
    </div>
  );
}

function SideBar({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  // Helper function to display N/A for empty values
  const displayValue = (value: string | number | null | undefined) => {
    if (value === '' || value === null || value === undefined) {
      return 'N/A';
    }
    return value;
  };

  // Helper function to format number with MW unit
  const formatMW = (value: number | null | undefined) => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    return `${value} MW`;
  };

  return (
    <>
      <div className='absolute top-0 left-0 w-[400px] h-[100vh] bg-white shadow-lg overflow-y-auto z-50'>
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
            onClick={onClose}
          >
            <i className='fas fa-xmark text-gray-600'></i>
          </button>
        </div>

        {/* Content Section */}
        <div className='p-6 space-y-6'>
          {/* Project Title & Type */}
          <div>
            <h1 className='text-2xl font-semibold text-gray-900 mb-1'>
              {displayValue(project.project_name)}
            </h1>
            <p className='text-sm text-gray-600'>
              Type: {displayValue(project.project_type)}
            </p>
          </div>

          {/* ESG Score Section */}
          <div className='bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              ESG Score
            </h2>
            <div className='grid grid-cols-3 gap-4'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-green-600'>85</div>
                <p className='text-sm text-gray-600'>Environmental</p>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-blue-600'>78</div>
                <p className='text-sm text-gray-600'>Social</p>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-purple-600'>92</div>
                <p className='text-sm text-gray-600'>Governance</p>
              </div>
            </div>
            <div className='mt-4 pt-4 border-t border-gray-200'>
              <div className='text-center'>
                <div className='text-3xl font-bold text-indigo-600'>85</div>
                <p className='text-sm text-gray-600'>Overall Score</p>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className='grid grid-cols-2 gap-4'>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <p className='text-sm text-gray-600 mb-1'>Renewable Capacity</p>
              <p className='text-lg font-semibold text-gray-900'>
                {formatMW(project.new_renewable_capacity_mw)}
              </p>
            </div>
            <div className='bg-gray-50 p-4 rounded-lg'>
              <p className='text-sm text-gray-600 mb-1'>Bid Capacity</p>
              <p className='text-lg font-semibold text-gray-900'>
                {formatMW(project.bid_capacity_mw)}
              </p>
            </div>
          </div>

          {/* Project Details */}
          <div className='space-y-4'>
            <div className='flex items-center space-x-4 text-gray-700'>
              <i className='fas fa-building w-6'></i>
              <div>
                <p className='font-medium'>Developer</p>
                <p className='text-sm text-gray-600'>
                  {displayValue(project.developer_name)}
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-4 text-gray-700'>
              <i className='fas fa-map-marker-alt w-6'></i>
              <div>
                <p className='font-medium'>Location</p>
                <p className='text-sm text-gray-600'>
                  {displayValue(project.county_province)},{' '}
                  {displayValue(project.state_province)}{' '}
                  {displayValue(project.zip_code)}
                </p>
              </div>
            </div>

            <div className='flex items-center space-x-4 text-gray-700'>
              <i className='fas fa-calendar w-6'></i>
              <div>
                <p className='font-medium'>Timeline</p>
                <p className='text-sm text-gray-600'>
                  Operation:{' '}
                  {displayValue(project.year_of_commercial_operation)}
                  <br />
                  Delivery Start:{' '}
                  {displayValue(project.year_of_delivery_start_date)}
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
                  {displayValue(project.renewable_technology)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>NYISO Zone</span>
                <span className='font-medium text-gray-900'>
                  {displayValue(project.nyiso_zone)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Contract Duration</span>
                <span className='font-medium text-gray-900'>
                  {displayValue(project.contract_duration)}
                </span>
              </div>
            </div>
          </div>

          {/* Energy Storage Details */}
          <div className='border-t pt-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Energy Storage
            </h2>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Energy Capacity</span>
                <span className='font-medium text-gray-900'>
                  {project.energy_storage_energy_capacity_mwh
                    ? `${project.energy_storage_energy_capacity_mwh} MWh`
                    : 'N/A'}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Power Capacity</span>
                <span className='font-medium text-gray-900'>
                  {project.energy_storage_power_capacity_mwac
                    ? `${project.energy_storage_power_capacity_mwac} MWac`
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Economic Benefits */}
          <div className='border-t pt-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Economic Benefits
            </h2>
            <div className='space-y-3'>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Benefits Threshold Met</span>
                <span className='font-medium text-gray-900'>
                  {displayValue(
                    project.project_met_economic_benefits_threshold
                  )}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Incremental Benefits</span>
                <span className='font-medium text-gray-900'>
                  {displayValue(project.incremental_economic_benefits_claimed)}
                </span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-600'>Fixed REC Price</span>
                <span className='font-medium text-gray-900'>
                  {project.fixed_rec_price
                    ? `$${project.fixed_rec_price}`
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          {/* Permitting Status */}
          <div className='border-t pt-6'>
            <h2 className='text-lg font-semibold text-gray-900 mb-4'>
              Permitting Status
            </h2>
            <div className='space-y-3'>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <p className='text-sm text-gray-600 mb-2'>Process Status</p>
                <p className='text-gray-900'>
                  {displayValue(project.permit_process)}
                </p>
              </div>
              <div className='bg-gray-50 p-4 rounded-lg'>
                <p className='text-sm text-gray-600 mb-2'>Regulatory Status</p>
                <p className='text-gray-900'>
                  {displayValue(project.regulatory_permitting)}
                </p>
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
    </>
  );
}
