'use client';

import { useEffect, useRef, useState } from 'react';

import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

import Image from 'next/image';

import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from 'lucide-react';
import FontawesomeMarker from 'mapbox-gl-fontawesome-markers';

import { getProjectRecommendations } from '@/app/actions/groq';
import evStations from '@/datasets/NYC_EV_Fleet_Station_Network_20250119.json';
import powerOutagesData from '@/datasets/power_outage_complaints_20250118.json';
const powerOutages = powerOutagesData as PowerOutage[];
import largeScaleRenewablePowerProjects from '@/datasets/updated_dataset_with_scores2.json';
import { getRats } from '@/app/actions/rats';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export interface Project {
  dataThroughDate: string;
  eligibility: string;
  projectName: string;
  solicitationName?: number;
  inflationAdjustment?: string;
  fixedRecPrice?: number;
  indexORecStrikePrice?: number;
  incrementalEconomicBenefitsClaimed?: string;
  projectMetEconomicBenefitsThreshold?: string;
  renewableTechnology: string;
  generationType?: string;
  typeOfExisting?: string;
  counterparty?: string;
  developerName?: string;
  energyStoragePowerCapacityMwac?: number;
  energyStorageEnergyCapacityMwh?: number;
  nyisoZone?: string;
  ptid?: string;
  interconnectionQueueNumber?: number;
  permitProcess?: string;
  regulatoryPermitting?: string;
  articleVii?: string;
  zipCode?: number;
  countyProvince?: string;
  stateProvince?: string;
  redc?: string;
  projectStatus: string;
  yearOfCommercialOperation?: number;
  yearOfDeliveryStartDate?: number;
  contractDuration?: number;
  newRenewableCapacityMw?: number;
  bidCapacityMw?: number;
  bidQuantityMwh?: number;
  maxAnnualContractQuantityMwh?: number;
  p10AnnualOrecExceedance?: number;
  p50GenerationCalculatedByNyserdaMwhYr?: number;
  transmissionCapacityHvdc?: number;
  georeference?: string;
  householdIncome: number;
  socialScore: number;
  environmentalScore: number;
  projectScore: number;
}

export interface PowerOutage {
  uniqueKey: number;
  createdDate: string;
  closedDate: string;
  agency: string;
  agencyName: string;
  complaintType: string;
  descriptor: string;
  locationType: string;
  incidentZip: number;
  incidentAddress: string;
  streetName: string;
  crossStreet1: string;
  crossStreet2: string;
  intersectionStreet1?: string;
  intersectionStreet2?: string;
  addressType: string;
  city: string;
  landmark?: string;
  facilityType: string;
  status: string;
  dueDate?: string;
  resolutionActionUpdatedDate: string;
  communityBoard: string;
  borough: string;
  xCoordinateStatePlane: number;
  yCoordinateStatePlane: number;
  parkFacilityName: string;
  parkBorough: string;
  vehicleType?: string;
  taxiCompanyBorough?: string;
  taxiPickUpLocation?: string;
  bridgeHighwayName?: string;
  bridgeHighwayDirection?: string;
  roadRamp?: string;
  bridgeHighwaySegment?: string;
  latitude: number;
  longitude: number;
  location: string;
}

interface EVStation {
  agency: string;
  stationName: string;
  typeOfCharger: string;
  noOfPlugs: number;
  address: string;
  city: string;
  postcode: number;
  borough: string;
  latitude: number;
  longitude: number;
  publicCharger?: boolean;
  feeForCityDrivers?: boolean;
  communityDistrict: number;
  councilDistrict: number;
  censusTract2020: number;
  bin: number;
  bbl: number;
  neighborhoodTabulationAreaNta2020: string;
}

export interface RatSighting {
  latitude: number;
  longitude: number;
  created_date: string;
  incident_address: string;
  borough: string;
}

type MarkerConfig = {
  icon: string;
  color: StatusColors;
  iconColor: string;
};

type StatusColors = '#22c55e' | '#3b82f6' | '#ef4444' | '#6b7280' | '#f59e0b';

const statusColors: Record<string, StatusColors> = {
  Operational: '#22c55e',
  'Under Development': '#3b82f6',
  Cancelled: '#ef4444',
  Completed: '#22c55e',
  // Add any other statuses that appear in the data
};

function getMarkerConfig(project: Project | EVStation): MarkerConfig {
  const defaultConfig: MarkerConfig = {
    icon: 'fa-solid fa-question',
    color: '#6b7280',
    iconColor: 'white',
  };

  // Special case for EVStation type
  if ('typeOfCharger' in project) {
    return {
      icon: 'fa-solid fa-charging-station',
      color: '#22c55e',
      iconColor: 'white',
    };
  }

  if (!project.renewableTechnology) {
    return defaultConfig;
  }

  const color =
    statusColors[project.projectStatus as keyof typeof statusColors] ||
    '#6b7280';

  const tech = project.renewableTechnology.toLowerCase();

  if (tech.includes('solar')) {
    return {
      icon: 'fa-solid fa-sun',
      color,
      iconColor: 'white',
    };
  }
  if (tech.includes('wind')) {
    return {
      icon: 'fa-solid fa-wind',
      color,
      iconColor: 'white',
    };
  }
  if (tech.includes('hydro')) {
    return {
      icon: 'fa-solid fa-water',
      color,
      iconColor: 'white',
    };
  }
  if (tech.includes('biomass')) {
    return {
      icon: 'fa-solid fa-tree',
      color,
      iconColor: 'white',
    };
  }
  if (tech.includes('biogas')) {
    return {
      icon: 'fa-solid fa-gas-pump',
      color,
      iconColor: 'white',
    };
  }
  if (tech.includes('fuel')) {
    return {
      icon: 'fa-solid fa-battery-full',
      color,
      iconColor: 'white',
    };
  }

  return defaultConfig;
}

function getUniqueYears(outages: PowerOutage[]): string[] {
  const years = outages
    .map((outage) => new Date(outage.createdDate).getFullYear())
    .filter((year, index, self) => self.indexOf(year) === index)
    .sort((a, b) => b - a);

  return years.map((year) => year.toString());
}

const getRatYears = (data: RatSighting[]): string[] => {
  const years = data
    .map((sighting) => new Date(sighting.created_date).getFullYear())
    .filter((year, index, self) => self.indexOf(year) === index)
    .sort((a, b) => b - a);

  return years.map((year) => year.toString());
};

// First, update the getActiveYears function to handle the default state
const getActiveYears = (
  showHeatmap: boolean,
  showRatSightings: boolean,
  availableYears: string[],
  ratYears: string[]
) => {
  if (!showHeatmap && !showRatSightings) return []; // No years when no layer is active
  if (showHeatmap) return availableYears;
  if (showRatSightings) return ratYears;
  return [];
};

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    undefined
  );
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [availableYears] = useState<string[]>(() =>
    getUniqueYears(powerOutages)
  );
  const [showEVStations, setShowEVStations] = useState(false);
  const [showRatSightings, setShowRatSightings] = useState(false);
  const [ratSightingsData, setRatSightingsData] = useState<RatSighting[]>([]);
  const [isLoadingRats, setIsLoadingRats] = useState(false);
  const [ratYears, setRatYears] = useState<string[]>([]);

  const getPowerOutageData = async (year: string) => {
    // Transform the data into GeoJSON format
    const geojsonData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: (powerOutages as PowerOutage[])
        .filter((outage: PowerOutage) => {
          if (!outage.latitude || !outage.longitude) return false;
          if (year === 'all') return true;

          // Parse the date string (format: "MM/DD/YYYY HH:MM:SS AM/PM")
          const outageDate = new Date(outage.createdDate);
          const outageYear = outageDate.getFullYear().toString();

          return outageYear === year;
        })
        .map((outage: PowerOutage) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [outage.longitude, outage.latitude],
          },
          properties: {
            incidents: 1,
            created_date: outage.createdDate,
            address: outage.incidentAddress,
            borough: outage.borough,
          },
        })),
    };
    return geojsonData;
  };

  const getRatSightingsData = async (year: string, data: RatSighting[] = ratSightingsData) => {
    const geojsonData: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: data
        .filter((sighting: RatSighting) => {
          if (year === 'all') return true;
          const sightingYear = new Date(sighting.created_date).getFullYear().toString();
          return sightingYear === year;
        })
        .map((sighting: RatSighting) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [sighting.longitude, sighting.latitude],
          },
          properties: {
            incidents: 1,
            created_date: sighting.created_date,
            address: sighting.incident_address,
            borough: sighting.borough,
          },
        })),
    };
    return geojsonData;
  };

  // Update the heatmap when year changes
  useEffect(() => {
    if (mapRef.current?.getSource('power-outages')) {
      getPowerOutageData(selectedYear).then((data) => {
        (
          mapRef.current?.getSource('power-outages') as mapboxgl.GeoJSONSource
        )?.setData(data);
      });
    }
  }, [selectedYear]);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const initializeMap = async () => {
      if (!mapContainerRef.current) return;

      mapRef.current = new mapboxgl.Map({
        style: 'mapbox://styles/tanksalif/cm1c4amlx00o301qkd5racncv',
        container: mapContainerRef.current,
        center: [-73.9919618, 40.7485519], // NYC coordinates
        zoom: 12.5,
        fitBoundsOptions: {
          padding: 50,
        },
      });

      // Add click handler to map to close sidebar
      mapRef.current.on('click', (e) => {
        const clickedElement = document.elementFromPoint(e.point.x, e.point.y);
        const isMarkerClick = clickedElement?.closest('.mapboxgl-marker');
        if (!isMarkerClick) {
          setSelectedProject(undefined);
        }
      });

      // Wait for map to load before adding sources and layers
      mapRef.current.on('load', async () => {
        try {
          // Add power outage heatmap layer
          const outageData = await getPowerOutageData(selectedYear);
          mapRef.current?.addSource('power-outages', {
            type: 'geojson',
            data: outageData,
          });

          mapRef.current?.addLayer({
            id: 'power-outage-heat',
            type: 'heatmap',
            source: 'power-outages',
            layout: {
              visibility: 'none',
            },
            paint: {
              'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'incidents'],
                0,
                0,
                10,
                1,
              ],
              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                1,
                15,
                3,
              ],
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
              'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                2,
                15,
                20,
              ],
              'heatmap-opacity': 0.6,
            },
          });

          // Add rat sightings source and layer
          mapRef.current?.addSource('rat-sightings', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [],
            },
          });

          mapRef.current?.addLayer({
            id: 'rat-sightings-heat',
            type: 'heatmap',
            source: 'rat-sightings',
            layout: {
              visibility: 'none',
            },
            paint: {
              'heatmap-weight': [
                'interpolate',
                ['linear'],
                ['get', 'incidents'],
                0,
                0,
                10,
                1,
              ],
              'heatmap-intensity': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                1,
                15,
                3,
              ],
              'heatmap-color': [
                'interpolate',
                ['linear'],
                ['heatmap-density'],
                0,
                'rgba(33,102,172,0)',
                0.2,
                'rgb(103,169,207)',
                0.4,
                'rgb(209,229,240)',
                0.6,
                'rgb(253,219,199)',
                0.8,
                'rgb(239,138,98)',
                1,
                'rgb(178,24,43)',
              ],
              'heatmap-radius': [
                'interpolate',
                ['linear'],
                ['zoom'],
                0,
                2,
                15,
                20,
              ],
              'heatmap-opacity': 0.6,
            },
          });

          // Replace getProjects() with direct JSON usage
          // @ts-expect-error - TODO: fix this
          const projects = largeScaleRenewablePowerProjects as Project[];

          // Add markers for each project
          projects.forEach((project) => {
            if (project.georeference) {
              // Extract coordinates from georeference string
              const coordMatch = project.georeference.match(
                /POINT \(([-\d.]+) ([-\d.]+)\)/
              );
              if (coordMatch) {
                const [, longitude, latitude] = coordMatch;

                const markerConfig = getMarkerConfig(project);

                const marker = new FontawesomeMarker({
                  icon: markerConfig.icon,
                  iconColor: markerConfig.iconColor,
                  color: markerConfig.color,
                })
                  .setLngLat([parseFloat(longitude), parseFloat(latitude)])
                  .addTo(mapRef.current!);

                marker.getElement().style.cursor = 'pointer';
                marker.getElement().addEventListener('click', () => {
                  setSelectedProject(project);
                });
              }
            }
          });

          // Add EV station markers
          await addEVStationMarkers(mapRef.current!, setSelectedProject);

        } catch (error) {
          console.error('Error initializing map:', error);
        }
      });
    };

    if (mapContainerRef.current) {
      initializeMap();
    }

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  // Add layer toggle controls
  // const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    if (mapRef.current) {
      const visibility = showHeatmap ? 'visible' : 'none';
      if (mapRef.current.getLayer('power-outage-heat')) {
        mapRef.current.setLayoutProperty(
          'power-outage-heat',
          'visibility',
          visibility
        );
      }
    }
  }, [showHeatmap]);

  // Add this new useEffect to handle EV station visibility
  useEffect(() => {
    if (mapRef.current) {
      const markers = document.querySelectorAll('.mapboxgl-marker');
      markers.forEach((marker) => {
        const element = marker as HTMLElement;
        if (element.querySelector('.fa-charging-station')) {
          element.style.display = showEVStations ? 'block' : 'none';
        }
      });
    }
  }, [showEVStations]);

  useEffect(() => {
    if (mapRef.current) {
      const visibility = showRatSightings ? 'visible' : 'none';
      if (mapRef.current.getLayer('rat-sightings-heat')) {
        mapRef.current.setLayoutProperty(
          'rat-sightings-heat',
          'visibility',
          visibility
        );
      }
    }
  }, [showRatSightings]);

  // Update the rat data loading effect
  useEffect(() => {
    if (showRatSightings && ratSightingsData.length === 0) {
      setIsLoadingRats(true);
      getRats()
        .then(data => {
          setRatSightingsData(data);
          setRatYears(getRatYears(data));
          
          // Update the map source with the new data
          if (mapRef.current?.getSource('rat-sightings')) {
            getRatSightingsData(selectedYear, data).then((geoData) => {
              (mapRef.current?.getSource('rat-sightings') as mapboxgl.GeoJSONSource)?.setData(geoData);
            });
          }
        })
        .catch(error => {
          console.error('Error fetching rat data:', error);
        })
        .finally(() => {
          setIsLoadingRats(false);
        });
    }
  }, [showRatSightings, selectedYear]);

  // Add a separate effect to update sources when year changes
  useEffect(() => {
    // Update power outages data
    if (mapRef.current?.getSource('power-outages')) {
      getPowerOutageData(selectedYear).then((data) => {
        (mapRef.current?.getSource('power-outages') as mapboxgl.GeoJSONSource)?.setData(data);
      });
    }

    // Update rat sightings data
    if (mapRef.current?.getSource('rat-sightings') && ratSightingsData.length > 0) {
      getRatSightingsData(selectedYear, ratSightingsData).then((data) => {
        (mapRef.current?.getSource('rat-sightings') as mapboxgl.GeoJSONSource)?.setData(data);
      });
    }
  }, [selectedYear, ratSightingsData]);

  return (
    <div>
      <div className='absolute right-4 top-4 z-10 space-y-2 rounded-lg bg-white p-2 shadow-md'>
        <div className='flex flex-col space-y-4'>
          {/* Year selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className='form-select w-full rounded-md border border-gray-300 px-2 py-1 text-sm text-black'
            disabled={!showHeatmap && !showRatSightings}
          >
            <option value='all'>All Years</option>
            {getActiveYears(showHeatmap, showRatSightings, availableYears, ratYears).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          {/* Layer toggles */}
          <div className='space-y-2'>
            <label className='flex cursor-pointer items-center space-x-2'>
              <input
                type='checkbox'
                checked={showHeatmap}
                onChange={(e) => {
                  setShowHeatmap(e.target.checked);
                  if (e.target.checked) setShowRatSightings(false);
                }}
                className='form-checkbox h-4 w-4 text-blue-600'
              />
              <span className='text-sm font-medium text-gray-700'>
                Show Power Outages
              </span>
            </label>

            <label className='flex cursor-pointer items-center space-x-2'>
              <input
                type='checkbox'
                checked={showRatSightings}
                onChange={(e) => {
                  setShowRatSightings(e.target.checked);
                  if (e.target.checked) setShowHeatmap(false);
                }}
                className='form-checkbox h-4 w-4 text-red-600'
                disabled={isLoadingRats}
              />
              <motion.span 
                className='text-sm font-medium text-gray-700 flex items-center gap-2'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {isLoadingRats ? (
                  <>
                    <Sparkles className='h-4 w-4 animate-spin' />
                    Loading Rat Sightings...
                  </>
                ) : (
                  'Show Rat Sightings'
                )}
              </motion.span>
            </label>

            <label className='flex cursor-pointer items-center space-x-2'>
              <input
                type='checkbox'
                checked={showEVStations}
                onChange={(e) => setShowEVStations(e.target.checked)}
                className='form-checkbox h-4 w-4 text-green-600'
              />
              <span className='text-sm font-medium text-gray-700'>
                Show EV Stations
              </span>
            </label>
          </div>

          <div className='text-xs italic text-gray-500'>
            {(showHeatmap || showRatSightings) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                Showing {showHeatmap ? 'outages' : 'rat sightings'} from{' '}
                {selectedYear === 'all' ? 'all years' : selectedYear}
              </motion.span>
            )}
          </div>
        </div>
      </div>
      <div ref={mapContainerRef} className='h-[100vh] w-full' />
      <AnimatePresence mode='wait'>
        {selectedProject && (
          <SideBar
            key='sidebar'
            project={selectedProject}
            onClose={() => setSelectedProject(undefined)}
          />
        )}
      </AnimatePresence>
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
  const [recommendations, setRecommendations] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Add this useEffect to reset recommendations when project changes
  useEffect(() => {
    setRecommendations('');
  }, [project.projectName]); // Use project.projectName as dependency to detect project changes

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    try {
      const result = await getProjectRecommendations(project);
      setRecommendations(result);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      // Show error to user
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to get recommendations. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to display N/A for empty values
  const displayValue = (value: unknown): string => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }

    if (typeof value === 'object') {
      if (value instanceof URL) {
        return value.toString();
      }
      return 'N/A';
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return value.toString();
    }

    return value as string;
  };

  // Helper function to format number with MW unit
  const formatMW = (value: number | undefined) => {
    return value ? `${value} MW` : 'N/A';
  };

  // Add status indicator
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Operational':
      case 'Completed':
        return 'bg-green-500';
      case 'Under Development':
        return 'bg-blue-500';
      case 'Cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600'; // Using emerald instead of green to be distinct
    if (score >= 60) return 'text-amber-600'; // Yellow/Gold for medium scores
    return 'text-orange-600'; // Orange for low scores (distinct from red status)
  };

  // Add this function to parse and format the recommendations
  const formatRecommendations = (text: string) => {
    const sections = {
      strengths: [] as string[],
      improvements: [] as string[],
      recommendations: [] as string[],
      impacts: [] as string[],
    };

    let currentSection = '';
    text.split('\n').forEach((line) => {
      if (line.includes('Current strengths')) {
        currentSection = 'strengths';
      } else if (line.includes('Areas for improvement')) {
        currentSection = 'improvements';
      } else if (line.includes('Specific actionable recommendations')) {
        currentSection = 'recommendations';
      } else if (line.includes('Potential score impact')) {
        currentSection = 'impacts';
      } else if (
        line.trim().startsWith('- ') ||
        line.trim().startsWith('• ') ||
        /^\d+\./.test(line.trim())
      ) {
        if (currentSection && line.trim()) {
          sections[currentSection as keyof typeof sections].push(
            line.trim().replace(/^[-•\d.]\s*/, '')
          );
        }
      }
    });

    return sections;
  };

  // Replace the recommendationsButton with this section
  const recommendationsSection = (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4 }}
      className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-gray-900'>
          Project Recommendations
        </h2>
        {!recommendations && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGetRecommendations}
            disabled={isLoading}
            className='flex items-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50'>
            {isLoading ? (
              <>
                <Sparkles className='h-4 w-4 animate-spin' />
                Analyzing...
              </>
            ) : (
              <>
                <Lightbulb className='h-4 w-4' />
                Get Insights
              </>
            )}
          </motion.button>
        )}
      </div>

      {recommendations && (
        <div className='space-y-6'>
          {/* Current Strengths */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className='space-y-3 rounded-lg bg-emerald-50 p-4'>
            <div className='flex items-center gap-2 text-emerald-700'>
              <CheckCircle2 className='h-5 w-5' />
              <h3 className='font-medium'>Current Strengths</h3>
            </div>
            <ul className='space-y-2'>
              {formatRecommendations(recommendations).strengths.map(
                (strength, index) => (
                  <li
                    key={index}
                    className='flex items-start gap-2 text-sm text-emerald-800'>
                    <span className='mt-1'>•</span>
                    {strength}
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Areas for Improvement */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className='space-y-3 rounded-lg bg-amber-50 p-4'>
            <div className='flex items-center gap-2 text-amber-700'>
              <AlertTriangle className='h-5 w-5' />
              <h3 className='font-medium'>Areas for Improvement</h3>
            </div>
            <ul className='space-y-2'>
              {formatRecommendations(recommendations).improvements.map(
                (improvement, index) => (
                  <li
                    key={index}
                    className='flex items-start gap-2 text-sm text-amber-800'>
                    <span className='mt-1'>•</span>
                    {improvement}
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Actionable Recommendations */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='space-y-3 rounded-lg bg-blue-50 p-4'>
            <div className='flex items-center gap-2 text-blue-700'>
              <Target className='h-5 w-5' />
              <h3 className='font-medium'>Action Items</h3>
            </div>
            <ul className='space-y-2'>
              {formatRecommendations(recommendations).recommendations.map(
                (recommendation, index) => (
                  <li
                    key={index}
                    className='flex items-start gap-2 text-sm text-blue-800'>
                    <ArrowUpRight className='mt-0.5 h-4 w-4 flex-shrink-0' />
                    {recommendation}
                  </li>
                )
              )}
            </ul>
          </motion.div>

          {/* Potential Impact */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className='space-y-3 rounded-lg bg-purple-50 p-4'>
            <div className='flex items-center gap-2 text-purple-700'>
              <TrendingUp className='h-5 w-5' />
              <h3 className='font-medium'>Potential Impact</h3>
            </div>
            <ul className='space-y-2'>
              {formatRecommendations(recommendations).impacts.map(
                (impact, index) => (
                  <li
                    key={index}
                    className='flex items-start gap-2 text-sm text-purple-800'>
                    <Zap className='mt-0.5 h-4 w-4 flex-shrink-0' />
                    {impact}
                  </li>
                )
              )}
            </ul>
          </motion.div>
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -400, opacity: 0 }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className='absolute left-0 top-0 z-50 h-[100vh] w-[400px] overflow-y-auto bg-white shadow-lg'>
      {/* Status indicator bar */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.2 }}
        className={`absolute left-0 top-0 h-full w-2 ${getStatusColor(
          project.projectStatus
        )}`}
      />

      {/* Header with close button */}
      <div className='relative h-48 w-full'>
        <Image
          src={getProjectImage(project)}
          alt={project.projectName}
          className='h-full w-full object-cover'
          fill
          sizes='(max-width: 400px) 100vw'
          priority
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className='absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md hover:bg-gray-100'
          onClick={onClose}>
          <i className='fas fa-xmark text-gray-600'></i>
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='absolute bottom-4 left-4 rounded bg-black bg-opacity-50 px-3 py-1 text-white'>
          {project.projectStatus}
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className='space-y-6 p-6'>
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}>
          <h1 className='mb-1 text-2xl font-semibold text-gray-900'>
            {displayValue(project.projectName)}
          </h1>
          <div className='flex gap-2 text-sm text-gray-600'>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className='rounded bg-gray-100 px-2 py-1'>
              {displayValue(project.renewableTechnology)}
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className='rounded bg-gray-100 px-2 py-1'>
              NYISO: {displayValue(project.nyisoZone)}
            </motion.span>
          </div>
        </motion.div>

        {/* ESG Impact Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className='rounded-xl border border-gray-100 bg-gradient-to-br from-purple-50 via-yellow-50 to-yellow-50 p-6 shadow-sm'>
          <div className='mb-6 flex items-center justify-between'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>
                Impact Score
              </h2>
              <p className='mt-1 text-sm text-gray-500'>
                Environmental & Social Impact
              </p>
            </div>
            <div className='flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm'>
              <span
                className={`text-3xl font-bold ${getScoreColor(
                  (project.environmentalScore + project.socialScore) / 2
                )}`}>
                {Math.round(
                  (project.environmentalScore + project.socialScore) / 2
                )}
              </span>
              <div className='flex flex-col text-xs leading-tight text-gray-500'>
                <span>OVERALL</span>
                <span>SCORE</span>
              </div>
            </div>
          </div>

          <div className='mb-6 grid grid-cols-1 gap-6'>
            {/* Environmental Score */}
            <div className='space-y-2'>
              <div className='mb-1 flex items-center gap-3'>
                <i className='fas fa-leaf text-lg text-yellow-600'></i>
                <div className='flex flex-1 items-center justify-between'>
                  <span className='text-sm font-medium text-gray-600'>
                    Environmental
                  </span>
                  <span className='text-sm font-semibold text-yellow-600'>
                    {Math.round(project.environmentalScore)}
                  </span>
                </div>
              </div>
              <div className='h-2 overflow-hidden rounded-full bg-gray-200'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.environmentalScore}%` }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className='h-full rounded-full bg-yellow-500'
                />
              </div>
              <div className='flex gap-3 pl-7 text-xs text-gray-500'>
                <div className='flex items-center gap-1'>
                  <i className='fas fa-check text-yellow-500'></i>
                  <span>Carbon Reduction</span>
                </div>
                <div className='flex items-center gap-1'>
                  <i className='fas fa-check text-yellow-500'></i>
                  <span>Renewable Energy</span>
                </div>
              </div>
            </div>

            {/* Social Score */}
            <div className='space-y-2'>
              <div className='mb-1 flex items-center gap-3'>
                <i className='fas fa-users text-lg text-purple-600'></i>
                <div className='flex flex-1 items-center justify-between'>
                  <span className='text-sm font-medium text-gray-600'>
                    Social
                  </span>
                  <span className='text-sm font-semibold text-purple-600'>
                    {Math.round(project.socialScore)}
                  </span>
                </div>
              </div>
              <div className='h-2 overflow-hidden rounded-full bg-gray-200'>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${project.socialScore}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className='h-full rounded-full bg-purple-500'
                />
              </div>
              <div className='flex gap-3 pl-7 text-xs text-gray-500'>
                <div className='flex items-center gap-1'>
                  <i className='fas fa-check text-purple-500'></i>
                  <span>Community Impact</span>
                </div>
                <div className='flex items-center gap-1'>
                  <i className='fas fa-check text-purple-500'></i>
                  <span>
                    Household Income: $
                    {Math.round(project.householdIncome).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className='grid grid-cols-3 gap-4 border-t border-gray-100 pt-4'>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className='text-center'>
              <div className='mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100'>
                <i className='fas fa-cloud text-yellow-600'></i>
              </div>
              <div className='text-sm font-medium text-gray-500'>
                CO₂ Reduction
              </div>
              <div className='text-lg font-semibold text-gray-900'>
                {project.bidQuantityMwh
                  ? `${Math.round(project.bidQuantityMwh * 0.19)} metric tons`
                  : 'N/A'}
              </div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className='text-center'>
              <div className='mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100'>
                <i className='fas fa-briefcase text-purple-600'></i>
              </div>
              <div className='text-sm font-medium text-gray-500'>
                Jobs Created
              </div>
              <div className='text-lg font-semibold text-gray-900'>
                {project.newRenewableCapacityMw
                  ? `${Math.round(project.newRenewableCapacityMw * 2.5)}`
                  : 'N/A'}
              </div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className='text-center'>
              <div className='mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100'>
                <i className='fas fa-home text-yellow-600'></i>
              </div>
              <div className='text-sm font-medium text-gray-500'>
                Homes Powered
              </div>
              <div className='text-lg font-semibold text-gray-900'>
                {project.bidQuantityMwh
                  ? `${Math.round(
                      project.bidQuantityMwh * 0.12
                    ).toLocaleString()}`
                  : 'N/A'}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className='grid grid-cols-2 gap-4 rounded-xl bg-gradient-to-r from-green-50 to-blue-50 p-4'>
          <div>
            <p className='text-sm text-gray-600'>Capacity</p>
            <p className='text-xl font-bold text-gray-900'>
              {formatMW(project.newRenewableCapacityMw)}
            </p>
          </div>
          <div>
            <p className='text-sm text-gray-600'>Annual Output</p>
            <p className='text-xl font-bold text-gray-900'>
              {project.bidQuantityMwh
                ? `${project.bidQuantityMwh.toLocaleString()} MWh`
                : 'N/A'}
            </p>
          </div>
        </motion.div>

        {/* Location & Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className='space-y-4'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Location & Timeline
          </h2>
          <div className='grid grid-cols-2 gap-4'>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className='rounded-lg bg-gray-50 p-4'>
              <p className='text-sm text-gray-600'>Location</p>
              <p className='font-medium text-gray-900'>
                {displayValue(project.countyProvince)},{' '}
                {displayValue(project.stateProvince)}
              </p>
              <p className='mt-1 text-sm text-gray-600'>
                ZIP: {displayValue(project.zipCode)}
              </p>
              <p className='mt-1 text-sm text-gray-600'>
                REDC: {displayValue(project.redc)}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className='rounded-lg bg-gray-50 p-4'>
              <p className='text-sm text-gray-600'>Timeline</p>
              <p className='font-medium text-gray-900'>
                Operation: {displayValue(project.yearOfCommercialOperation)}
              </p>
              <p className='mt-1 text-sm text-gray-600'>
                Start: {displayValue(project.yearOfDeliveryStartDate)}
              </p>
              <p className='mt-1 text-sm text-gray-600'>
                Duration: {displayValue(project.contractDuration)} years
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Project Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className='space-y-4'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Project Details
          </h2>
          <div className='space-y-3 rounded-lg bg-gray-50 p-4'>
            <div>
              <p className='text-sm text-gray-600'>Developer</p>
              <p className='font-medium text-gray-900'>
                {displayValue(project.developerName)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Counterparty</p>
              <p className='font-medium text-gray-900'>
                {displayValue(project.counterparty)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Project Type</p>
              <p className='font-medium text-gray-900'>
                {displayValue(project.renewableTechnology)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Capacity & Storage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className='space-y-4'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Capacity & Storage
          </h2>
          <div className='grid grid-cols-2 gap-4'>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className='rounded-lg bg-gray-50 p-4'>
              <p className='text-sm text-gray-600'>Renewable Capacity</p>
              <p className='font-medium text-gray-900'>
                {formatMW(project.newRenewableCapacityMw)}
              </p>
              <p className='mt-2 text-sm text-gray-600'>Bid Capacity</p>
              <p className='font-medium text-gray-900'>
                {formatMW(project.bidCapacityMw)}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className='rounded-lg bg-gray-50 p-4'>
              <p className='text-sm text-gray-600'>Storage Energy</p>
              <p className='font-medium text-gray-900'>
                {project.energyStorageEnergyCapacityMwh
                  ? `${project.energyStorageEnergyCapacityMwh} MWh`
                  : 'N/A'}
              </p>
              <p className='mt-2 text-sm text-gray-600'>Storage Power</p>
              <p className='font-medium text-gray-900'>
                {project.energyStoragePowerCapacityMwac
                  ? `${project.energyStoragePowerCapacityMwac} MWac`
                  : 'N/A'}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Economic Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className='space-y-4'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Economic Benefits
          </h2>
          <div className='space-y-3 rounded-lg bg-gray-50 p-4'>
            <div>
              <p className='text-sm text-gray-600'>Benefits Threshold Met</p>
              <p className='font-medium text-gray-900'>
                {displayValue(project.projectMetEconomicBenefitsThreshold)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Incremental Benefits</p>
              <p className='font-medium text-gray-900'>
                {displayValue(project.incrementalEconomicBenefitsClaimed)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Fixed REC Price</p>
              <p className='font-medium text-gray-900'>
                {project.fixedRecPrice ? `$${project.fixedRecPrice}` : 'N/A'}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>
                Max Annual Contract Quantity
              </p>
              <p className='font-medium text-gray-900'>
                {project.maxAnnualContractQuantityMwh
                  ? `${project.maxAnnualContractQuantityMwh.toLocaleString()} MWh`
                  : 'N/A'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Permitting Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className='space-y-4'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Permitting Status
          </h2>
          <div className='space-y-3 rounded-lg bg-gray-50 p-4'>
            <div>
              <p className='text-sm text-gray-600'>Process Status</p>
              <p className='font-medium text-gray-900'>
                {displayValue(project.permitProcess)}
              </p>
            </div>
            <div>
              <p className='text-sm text-gray-600'>Regulatory Status</p>
              <p className='font-medium text-gray-900'>
                {displayValue(project.regulatoryPermitting)}
              </p>
            </div>
          </div>
        </motion.div>

        {recommendationsSection}
      </motion.div>
    </motion.div>
  );
}

const addEVStationMarkers = (
  map: mapboxgl.Map,
  setSelectedProject: (project: Project) => void
) => {
  // @ts-expect-error - TODO: fix this
  (evStations as EVStation[]).forEach((station) => {
    if (station.latitude && station.longitude) {
      const markerConfig = getMarkerConfig(station);

      const marker = new FontawesomeMarker({
        icon: markerConfig.icon,
        iconColor: markerConfig.iconColor,
        color: markerConfig.color,
      })
        .setLngLat([station.longitude, station.latitude])
        .addTo(map);

      // Add cursor pointer and set initial visibility
      const element = marker.getElement();
      element.style.cursor = 'pointer';
      element.style.display = 'none'; // Hide markers initially

      // Add click event
      element.addEventListener('click', () => {
        // @ts-expect-error - TODO: fix this
        setSelectedProject({
          dataThroughDate: new Date().toISOString(),
          eligibility: 'EV',
          projectName: station.stationName,
          projectStatus: 'Operational',
          renewableTechnology: station.typeOfCharger,
          developerName: station.agency,
          countyProvince: station.borough,
          stateProvince: 'NY',
          // Add any other required fields from the Project interface
        });
      });
    }
  });
};

function getProjectImage(project: Project) {
  const tech = project.renewableTechnology?.toLowerCase() || '';

  if (tech.includes('hydro')) {
    return '/images/hydro.jpg';
  }
  if (tech.includes('solar')) {
    return '/images/solar.jpg';
  }
  if (tech.includes('wind')) {
    return '/images/wind.jpg';
  }
  if (tech.includes('biogas')) {
    return '/images/gas.jpg';
  }
  if(tech.includes('biomass')) {
    return '/images/biomass.jpg';
  }
  if (
    tech.includes('ev') ||
    tech.includes('charger') ||
    tech.includes('fuel cell')
  ) {
    return '/images/ev.avif';
  }

  return 'https://placehold.co/600x400';
}
