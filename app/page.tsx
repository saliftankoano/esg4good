"use client";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getProjects } from "@/app/actions/projects";
import FontawesomeMarker from "mapbox-gl-fontawesome-markers";
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

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const initializeMap = async () => {
      if (!mapContainerRef.current) return;

      mapRef.current = new mapboxgl.Map({
        style: "mapbox://styles/tanksalif/cm1c4amlx00o301qkd5racncv",
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
      mapRef.current.on("load", async () => {
        try {
          const projects = await getProjects();

          projects
            .filter((project: Project) => project.state_province === "NY")
            .forEach((project: Project) => {
              // Check if project has georeference data
              if (project.georeference?.coordinates) {
                const [lng, lat] = project.georeference.coordinates;

                // Create popup with available information
                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div class="flex flex-col gap-2 bg-green-500">
                <h3 class="font-bold">${project.project_name}</h3>
                <p>Status: ${project.project_status}</p>
                <p>Technology: ${project.renewable_technology}</p>
                ${
                  project.developer_name
                    ? `<p>Developer: ${project.developer_name}</p>`
                    : ""
                }
                ${
                  project.new_renewable_capacity_mw
                    ? `<p>Capacity: ${project.new_renewable_capacity_mw} MW</p>`
                    : ""
                }
                </div>
              `);
                new FontawesomeMarker({
                  icon: "fa-solid fa-pizza-slice",
                  iconColor: "steelblue",
                  color: "#fa7132",
                })
                  .setLngLat([lng, lat])
                  .setPopup(popup)
                  .addTo(mapRef.current!);
              }
            });
        } catch (error) {
          console.error("Error loading projects:", error);
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
      <h1>Hello World</h1>
      <div ref={mapContainerRef} className="w-full h-[100vh]" />
    </div>
  );
}
