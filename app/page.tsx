"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { getProjects } from "@/app/actions/projects";
import FontawesomeMarker from "mapbox-gl-fontawesome-markers";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import powerOutages from "@/datasets/power_outage_complaints_20250118.json";
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export interface Project {
  georeference?: {
    type: string;
    coordinates: [number, number];
  };
  project_name: string;
  project_status:
    | "Operational"
    | "Under Development"
    | "Cancelled"
    | "Completed";
  project_type: string;
  redc?: string;
  zip_code?: string;
  energy_storage_energy_capacity_mwh?: number;
  energy_storage_power_capacity_mwac?: number;
  developer_name?: string;
  renewable_technology:
    | "Solar"
    | "Land Based Wind"
    | "Land-based Wind"
    | "Offshore Wind"
    | "Hydroelectric"
    | "Biomass"
    | "Biogas - LFG"
    | "Biogas - ADG"
    | "Fuel Cell"
    | "Wind/Solar"
    | "Maintenance Hydroelectric"
    | "Maintenance Biomass"
    | "Existing"
    | "New"
    | "Return to Service"
    | "Upgrade";
  project_met_economic_benefits_threshold?: "Yes" | "No";
  incremental_economic_benefits_claimed?: "Yes" | "No";
  counterparty?: string;
  fixed_rec_price?: number;
  nyiso_zone?: string;
  county_province?: string;
  state_province?: string;
  year_of_commercial_operation?: string;
  year_of_delivery_start_date?: string;
  contract_duration?: string;
  new_renewable_capacity_mw?: number;
  bid_capacity_mw?: number;
  bid_quantity_mwh?: number;
  max_annual_contract_quantity?: number;
  permit_process?: string;
  regulatory_permitting?: string;
  eligibility?: string;
  solicitation_name?: string;
  inflation_adjustment?: string;
  index_orec_strike_price?: number;
  generation_type?: string;
  type_of_existing?: string;
  ptid?: string;
  interconnection_queue_number?: string;
  article_vii?: string;
  p10_annual_orec_exceedance?: number;
  p50_generation_calculated_by_nyserda?: number;
  transmission_capacity_hvdc?: number;
}

export interface PowerOutage {
  "Unique Key": string;
  "Created Date": string;
  "Incident Address": string;
  Borough: string;
  Latitude: string;
  Longitude: string;
  Location: string;
}

type MarkerConfig = {
  icon: string;
  color: StatusColors;
  iconColor: string;
};

type StatusColors = "#22c55e" | "#3b82f6" | "#ef4444" | "#6b7280";

const statusColors: Record<Project["project_status"], StatusColors> = {
  Operational: "#22c55e",
  "Under Development": "#3b82f6",
  Cancelled: "#ef4444",
  Completed: "#22c55e",
};

function getMarkerConfig(project: Project): MarkerConfig {
  const defaultConfig: MarkerConfig = {
    icon: "fa-solid fa-question",
    color: "#6b7280",
    iconColor: "white",
  };

  if (!project.renewable_technology) {
    return defaultConfig;
  }

  const color =
    statusColors[project.project_status as keyof typeof statusColors] ||
    "#6b7280";

  const tech = project.renewable_technology.toLowerCase();

  if (tech.includes("solar")) {
    return {
      icon: "fa-solid fa-sun",
      color,
      iconColor: "white",
    };
  }
  if (tech.includes("wind")) {
    return {
      icon: "fa-solid fa-wind",
      color,
      iconColor: "white",
    };
  }
  if (tech.includes("hydro")) {
    return {
      icon: "fa-solid fa-water",
      color,
      iconColor: "white",
    };
  }
  if (tech.includes("biomass")) {
    return {
      icon: "fa-solid fa-tree",
      color,
      iconColor: "white",
    };
  }
  if (tech.includes("biogas")) {
    return {
      icon: "fa-solid fa-gas-pump",
      color,
      iconColor: "white",
    };
  }
  if (tech.includes("fuel")) {
    return {
      icon: "fa-solid fa-battery-full",
      color,
      iconColor: "white",
    };
  }

  return defaultConfig;
}

function getUniqueYears(outages: PowerOutage[]): string[] {
  const years = outages
    .map((outage) => new Date(outage["Created Date"]).getFullYear())
    .filter((year, index, self) => self.indexOf(year) === index) // Get unique years
    .sort((a, b) => b - a); // Sort descending

  return years.map((year) => year.toString());
}

export default function Home() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | undefined>(
    undefined
  );
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [availableYears] = useState<string[]>(() =>
    getUniqueYears(powerOutages as PowerOutage[])
  );

  const getPowerOutageData = async (year: string) => {
    // Transform the data into GeoJSON format
    const geojsonData: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: (powerOutages as PowerOutage[])
        .filter((outage: PowerOutage) => {
          if (!outage.Latitude || !outage.Longitude) return false;
          if (year === "all") return true;

          // Parse the date string (format: "MM/DD/YYYY HH:MM:SS AM/PM")
          const outageDate = new Date(outage["Created Date"]);
          const outageYear = outageDate.getFullYear().toString();

          return outageYear === year;
        })
        .map((outage: PowerOutage) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              parseFloat(outage.Longitude),
              parseFloat(outage.Latitude),
            ],
          },
          properties: {
            incidents: 1,
            created_date: outage["Created Date"],
            address: outage["Incident Address"],
            borough: outage.Borough,
          },
        })),
    };
    return geojsonData;
  };

  // Update the heatmap when year changes
  useEffect(() => {
    if (mapRef.current?.getSource("power-outages")) {
      getPowerOutageData(selectedYear).then((data) => {
        (
          mapRef.current?.getSource("power-outages") as mapboxgl.GeoJSONSource
        )?.setData(data);
      });
    }
  }, [selectedYear]);

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

    const initializeMap = async () => {
      if (!mapContainerRef.current) return;

      mapRef.current = new mapboxgl.Map({
        style: "mapbox://styles/tanksalif/cm1c4amlx00o301qkd5racncv",
        container: mapContainerRef.current,
        bounds: [
          [-79.7624, 40.4773],
          [-71.7517, 45.0153],
        ],
        fitBoundsOptions: {
          padding: 50,
          maxZoom: 8,
        },
      });

      // Add click handler to map to close sidebar
      mapRef.current.on("click", (e) => {
        const clickedElement = document.elementFromPoint(e.point.x, e.point.y);
        const isMarkerClick = clickedElement?.closest(".mapboxgl-marker");
        if (!isMarkerClick) {
          setSelectedProject(undefined);
        }
      });

      // Wait for map to load before adding markers and layers
      mapRef.current.on("load", async () => {
        try {
          // Add power outage heatmap layer
          const outageData = await getPowerOutageData(selectedYear);
          mapRef.current?.addSource("power-outages", {
            type: "geojson",
            data: outageData,
          });

          mapRef.current?.addLayer({
            id: "power-outage-heat",
            type: "heatmap",
            source: "power-outages",
            paint: {
              "heatmap-weight": [
                "interpolate",
                ["linear"],
                ["get", "incidents"],
                0,
                0,
                10,
                1,
              ],
              "heatmap-intensity": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                1,
                15,
                3,
              ],
              "heatmap-color": [
                "interpolate",
                ["linear"],
                ["heatmap-density"],
                0,
                "rgba(0,0,255,0)",
                0.2,
                "rgb(0,0,255)",
                0.4,
                "rgb(0,255,255)",
                0.6,
                "rgb(255,255,0)",
                0.8,
                "rgb(255,128,0)",
                1,
                "rgb(255,0,0)",
              ],
              "heatmap-radius": [
                "interpolate",
                ["linear"],
                ["zoom"],
                0,
                2,
                15,
                20,
              ],
              "heatmap-opacity": 0.6,
            },
          });

          // Add renewable projects markers
          const projects = await getProjects();
          projects
            .filter((project: Project) => project.state_province === "NY")
            .forEach((project: Project) => {
              if (project.georeference?.coordinates) {
                const [lng, lat] = project.georeference.coordinates;
                const markerConfig = getMarkerConfig(project);

                const marker = new FontawesomeMarker({
                  icon: markerConfig.icon,
                  iconColor: markerConfig.iconColor,
                  color: markerConfig.color,
                })
                  .setLngLat([lng, lat])
                  .addTo(mapRef.current!);

                marker.getElement().style.cursor = "pointer";
                marker.getElement().addEventListener("click", () => {
                  setSelectedProject(project);
                });
              }
            });
        } catch (error) {
          console.error("Error loading data:", error);
        }
      });
    };

    initializeMap();

    return () => {
      mapRef.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Add layer toggle controls
  // const [showHeatmap, setShowHeatmap] = useState(true);

  useEffect(() => {
    if (mapRef.current) {
      const visibility = showHeatmap ? "visible" : "none";
      if (mapRef.current.getLayer("power-outage-heat")) {
        mapRef.current.setLayoutProperty(
          "power-outage-heat",
          "visibility",
          visibility
        );
      }
    }
  }, [showHeatmap]);

  return (
    <div>
      <div className="absolute top-4 right-4 z-10 bg-white rounded-lg shadow-md p-2 space-y-2">
        <div className="flex items-center justify-between space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showHeatmap}
              onChange={(e) => setShowHeatmap(e.target.checked)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="text-sm font-medium text-gray-700">
              Show Power Outages
            </span>
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="form-select text-sm text-black border border-gray-300 rounded-md px-2 py-1"
            disabled={!showHeatmap}
          >
            <option value="all">All Years</option>
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="text-xs text-gray-500 italic">
          {showHeatmap &&
            `Showing outages from ${
              selectedYear === "all" ? "all years" : selectedYear
            }`}
        </div>
      </div>
      <div ref={mapContainerRef} className="w-full h-[100vh]" />
      <AnimatePresence mode="wait">
        {selectedProject && (
          <SideBar
            key="sidebar"
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
  // Helper function to display N/A for empty values
  const displayValue = (value: unknown): string => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }

    if (typeof value === "object") {
      if (value instanceof URL) {
        return value.toString();
      }
      return "N/A";
    }

    if (typeof value === "number" || typeof value === "boolean") {
      return value.toString();
    }

    return value as string;
  };

  // Helper function to format number with MW unit
  const formatMW = (value: number | undefined) => {
    return value ? `${value} MW` : "N/A";
  };

  // Add status indicator
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Operational":
      case "Completed":
        return "bg-green-500";
      case "Under Development":
        return "bg-blue-500";
      case "Cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600"; // Using emerald instead of green to be distinct
    if (score >= 60) return "text-amber-600"; // Yellow/Gold for medium scores
    return "text-orange-600"; // Orange for low scores (distinct from red status)
  };

  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -400, opacity: 0 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
      className="absolute top-0 left-0 w-[400px] h-[100vh] bg-white shadow-lg overflow-y-auto z-50"
    >
      {/* Status indicator bar */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.2 }}
        className={`absolute top-0 left-0 w-2 h-full ${getStatusColor(
          project.project_status
        )}`}
      />

      {/* Header with close button */}
      <div className="relative w-full h-48">
        <Image
          src="https://placehold.co/600x400"
          alt={project.project_name}
          className="object-cover w-full h-full"
          width={600}
          height={400}
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100"
          onClick={onClose}
        >
          <i className="fas fa-xmark text-gray-600"></i>
        </motion.button>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded"
        >
          {project.project_status}
        </motion.div>
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 space-y-6"
      >
        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">
            {displayValue(project.project_name)}
          </h1>
          <div className="flex gap-2 text-sm text-gray-600">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="px-2 py-1 bg-gray-100 rounded"
            >
              {displayValue(project.renewable_technology)}
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="px-2 py-1 bg-gray-100 rounded"
            >
              NYISO: {displayValue(project.nyiso_zone)}
            </motion.span>
          </div>
        </motion.div>

        {/* ESG Impact Score */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-purple-50 via-yellow-50 to-yellow-50 p-6 rounded-xl border border-gray-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Impact Score
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Environmental & Social Impact
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
              <span className={`text-3xl font-bold ${getScoreColor(85)}`}>
                85
              </span>
              <div className="flex flex-col text-xs text-gray-500 leading-tight">
                <span>OVERALL</span>
                <span>SCORE</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 mb-6">
            {/* Environmental Score */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-1">
                <i className="fas fa-leaf text-yellow-600 text-lg"></i>
                <div className="flex justify-between items-center flex-1">
                  <span className="text-sm font-medium text-gray-600">
                    Environmental
                  </span>
                  <span className="text-sm font-semibold text-yellow-600">
                    92
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "92%" }}
                  transition={{ duration: 1, delay: 0.7 }}
                  className="h-full bg-yellow-500 rounded-full"
                />
              </div>
              <div className="flex gap-3 text-xs text-gray-500 pl-7">
                <div className="flex items-center gap-1">
                  <i className="fas fa-check text-yellow-500"></i>
                  <span>Carbon Reduction</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="fas fa-check text-yellow-500"></i>
                  <span>Renewable Energy</span>
                </div>
              </div>
            </div>

            {/* Social Score */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-1">
                <i className="fas fa-users text-purple-600 text-lg"></i>
                <div className="flex justify-between items-center flex-1">
                  <span className="text-sm font-medium text-gray-600">
                    Social
                  </span>
                  <span className="text-sm font-semibold text-purple-600">
                    78
                  </span>
                </div>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: "78%" }}
                ></div>
              </div>
              <div className="flex gap-3 text-xs text-gray-500 pl-7">
                <div className="flex items-center gap-1">
                  <i className="fas fa-check text-purple-500"></i>
                  <span>Community Impact</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="fas fa-check text-purple-500"></i>
                  <span>Job Creation</span>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100"
          >
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-full bg-yellow-100">
                <i className="fas fa-cloud text-yellow-600"></i>
              </div>
              <div className="text-sm font-medium text-gray-500">
                CO₂ Reduction
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {project.bid_quantity_mwh
                  ? `${Math.round(project.bid_quantity_mwh * 0.19)} metric tons`
                  : "N/A"}
              </div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-full bg-purple-100">
                <i className="fas fa-briefcase text-purple-600"></i>
              </div>
              <div className="text-sm font-medium text-gray-500">
                Jobs Created
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {project.new_renewable_capacity_mw
                  ? `${Math.round(project.new_renewable_capacity_mw * 2.5)}`
                  : "N/A"}
              </div>
            </motion.div>
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="text-center"
            >
              <div className="flex items-center justify-center w-10 h-10 mx-auto mb-2 rounded-full bg-yellow-100">
                <i className="fas fa-home text-yellow-600"></i>
              </div>
              <div className="text-sm font-medium text-gray-500">
                Homes Powered
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {project.bid_quantity_mwh
                  ? `${Math.round(
                      project.bid_quantity_mwh * 0.12
                    ).toLocaleString()}`
                  : "N/A"}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="grid grid-cols-2 gap-4 bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl"
        >
          <div>
            <p className="text-sm text-gray-600">Capacity</p>
            <p className="text-xl font-bold text-gray-900">
              {formatMW(project.new_renewable_capacity_mw)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Annual Output</p>
            <p className="text-xl font-bold text-gray-900">
              {project.bid_quantity_mwh
                ? `${project.bid_quantity_mwh.toLocaleString()} MWh`
                : "N/A"}
            </p>
          </div>
        </motion.div>

        {/* Location & Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Location & Timeline
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium text-gray-900">
                {displayValue(project.county_province)},{" "}
                {displayValue(project.state_province)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                ZIP: {displayValue(project.zip_code)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                REDC: {displayValue(project.redc)}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <p className="text-sm text-gray-600">Timeline</p>
              <p className="font-medium text-gray-900">
                Operation: {displayValue(project.year_of_commercial_operation)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Start: {displayValue(project.year_of_delivery_start_date)}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                Duration: {displayValue(project.contract_duration)} years
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Project Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Project Details
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm text-gray-600">Developer</p>
              <p className="font-medium text-gray-900">
                {displayValue(project.developer_name)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Counterparty</p>
              <p className="font-medium text-gray-900">
                {displayValue(project.counterparty)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Project Type</p>
              <p className="font-medium text-gray-900">
                {displayValue(project.project_type)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Capacity & Storage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Capacity & Storage
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <p className="text-sm text-gray-600">Renewable Capacity</p>
              <p className="font-medium text-gray-900">
                {formatMW(project.new_renewable_capacity_mw)}
              </p>
              <p className="text-sm text-gray-600 mt-2">Bid Capacity</p>
              <p className="font-medium text-gray-900">
                {formatMW(project.bid_capacity_mw)}
              </p>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gray-50 p-4 rounded-lg"
            >
              <p className="text-sm text-gray-600">Storage Energy</p>
              <p className="font-medium text-gray-900">
                {project.energy_storage_energy_capacity_mwh
                  ? `${project.energy_storage_energy_capacity_mwh} MWh`
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-600 mt-2">Storage Power</p>
              <p className="font-medium text-gray-900">
                {project.energy_storage_power_capacity_mwac
                  ? `${project.energy_storage_power_capacity_mwac} MWac`
                  : "N/A"}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Economic Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Economic Benefits
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm text-gray-600">Benefits Threshold Met</p>
              <p className="font-medium text-gray-900">
                {displayValue(project.project_met_economic_benefits_threshold)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Incremental Benefits</p>
              <p className="font-medium text-gray-900">
                {displayValue(project.incremental_economic_benefits_claimed)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fixed REC Price</p>
              <p className="font-medium text-gray-900">
                {project.fixed_rec_price
                  ? `$${project.fixed_rec_price}`
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Max Annual Contract Quantity
              </p>
              <p className="font-medium text-gray-900">
                {project.max_annual_contract_quantity
                  ? `${project.max_annual_contract_quantity.toLocaleString()} MWh`
                  : "N/A"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Permitting Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-semibold text-gray-900">
            Permitting Status
          </h2>
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div>
              <p className="text-sm text-gray-600">Process Status</p>
              <p className="font-medium text-gray-900">
                {displayValue(project.permit_process)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Regulatory Status</p>
              <p className="font-medium text-gray-900">
                {displayValue(project.regulatory_permitting)}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
