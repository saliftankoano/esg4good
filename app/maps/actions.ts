'use server';

import { EVChargingStationsSchema } from '@/types/evChargingStations';
import { OutagesSchema } from '@/types/outages';
import { ProjectsSchema } from '@/types/projects';
import { RatSightingsSchema } from '@/types/ratSightings';

const SOCRATA_APP_TOKEN = process.env.SOCRATA_APP_TOKEN;

if (!SOCRATA_APP_TOKEN) {
  throw new Error('SOCRATA_APP_TOKEN is not set');
}

export async function getProjects({
  limit = 1000,
  offset = 0,
}: {
  /**
   * The number of results to return
   *
   * @default 1000
   */
  limit?: number;
  /**
   * The index of the result array where to start the returned list of results.
   *
   * @default 0
   **/
  offset?: number;
}) {
  try {
    const response = await fetch(
      `https://data.ny.gov/resource/dprp-55ye.json?$limit=${limit}&$offset=${offset}`,
      {
        headers: {
          'X-App-Token': SOCRATA_APP_TOKEN,
        },
      }
    );

    if (!response.ok) {
      throw new Error('API Error');
    }

    const data = await response.json();

    const projects = ProjectsSchema.parse(data);
    return projects;
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    throw error;
  }
}

export async function getOutages({
  limit = 1000,
  offset = 0,
}: {
  /**
   * The number of results to return
   *
   * @default 1000
   */
  limit?: number;
  /**
   * The index of the result array where to start the returned list of results.
   *
   * @default 0
   **/
  offset?: number;
}) {
  try {
    const response = await fetch(
      `https://data.cityofnewyork.us/resource/br6j-yp22.json?$limit=${limit}&$offset=${offset}`,
      {
        headers: {
          'X-App-Token': SOCRATA_APP_TOKEN,
        },
      }
    );

    if (!response.ok) {
      throw new Error('API Error');
    }

    const data = await response.json();
    const outages = OutagesSchema.parse(data);
    return outages;
  } catch (error) {
    console.error('Failed to fetch outages:', error);
    throw error;
  }
}

export async function getEVChargingStations({
  limit = 1000,
  offset = 0,
}: {
  /**
   * The number of results to return
   *
   * @default 1000
   */
  limit?: number;
  /**
   * The index of the result array where to start the returned list of results.
   *
   * @default 0
   **/
  offset?: number;
}) {
  try {
    const response = await fetch(
      `https://data.cityofnewyork.us/resource/fc53-9hrv.json?$limit=${limit}&$offset=${offset}`,
      {
        headers: {
          'X-App-Token': SOCRATA_APP_TOKEN,
        },
      }
    );

    if (!response.ok) {
      throw new Error('API Error');
    }

    const data = await response.json();
    const evChargingStations = EVChargingStationsSchema.parse(data);
    return evChargingStations;
  } catch (error) {
    console.error('Failed to fetch ev charging stations:', error);
    throw error;
  }
}

export async function getRatSightings({
  limit = 1000,
  offset = 0,
}: {
  /**
   * The number of results to return
   *
   * @default 1000
   */
  limit?: number;
  /**
   * The index of the result array where to start the returned list of results.
   *
   * @default 0
   **/
  offset?: number;
}) {
  try {
    const response = await fetch(
      `https://data.cityofnewyork.us/resource/3q43-55fe.json?$limit=${limit}&$offset=${offset}`,
      {
        headers: {
          'X-App-Token': SOCRATA_APP_TOKEN,
        },
      }
    );

    if (!response.ok) {
      throw new Error('API Error');
    }

    const data = await response.json();
    const ratSightings = RatSightingsSchema.parse(data);
    return ratSightings;
  } catch (error) {
    console.error('Failed to fetch rat sightings:', error);
    throw error;
  }
}
