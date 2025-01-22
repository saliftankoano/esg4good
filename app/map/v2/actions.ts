'use server';

import { z } from 'zod';

import { EVChargingStationsSchema } from '@/types/evChargingStations';
import { OutagesSchema } from '@/types/outages';
import { ProjectsSchema } from '@/types/projects';
import { RatSightingsSchema } from '@/types/ratSightings';

const SOCRATA_APP_TOKEN = process.env.SOCRATA_APP_TOKEN!;

if (!SOCRATA_APP_TOKEN) {
  throw new Error('SOCRATA_APP_TOKEN is not set');
}

type SocrataQueryParams = {
  /**
   * The set of columns to be returned, similar to a SELECT in SQL
   *
   * @default All columns, equivalent to $select=*
   */
  select?: string;
  /**
   * Filters the rows to be returned, similar to a WHERE in SQL
   *
   * @default No filter
   */
  where?: string;
  /**
   * Column to order results on, similar to a ORDER BY in SQL
   *
   * @default Unspecified order
   */
  order?: string;
  /**
   * Column to group results on, similar to a GROUP BY in SQL
   *
   * @default No grouping
   */
  group?: string;
  /**
   * Filters the rows that result from an aggregation, similar to HAVING
   *
   * @default No filter
   */
  having?: string;
  /**
   * Maximum number of results to return
   *
   * @default 1000
   */
  limit?: number;
  /**
   * Offset count into the results to start at, used for paging
   *
   * @default 0
   **/
  offset?: number;
  /**
   * Performs a full text search for a value.
   *
   * @default No search
   */
  q?: string;
};

async function fetchSocrataData<T>({
  endpoint,
  schema,
  params,
}: {
  endpoint: string;
  schema: z.ZodType<T>;
  params: SocrataQueryParams;
}): Promise<T> {
  const {
    limit = 1000,
    offset = 0,
    select,
    where,
    order,
    group,
    having,
    q,
  } = params;

  const queryParams = new URLSearchParams({
    ...(select && { $select: select }),
    ...(where && { $where: where }),
    ...(order && { $order: order }),
    ...(group && { $group: group }),
    ...(having && { $having: having }),
    ...(q && { $q: q }),
    $limit: limit.toString(),
    $offset: offset.toString(),
  });

  const response = await fetch(`${endpoint}?${queryParams.toString()}`, {
    headers: {
      'X-App-Token': SOCRATA_APP_TOKEN,
    },
  });

  if (!response.ok) {
    throw new Error('API Error');
  }

  const data = await response.json();
  return schema.parse(data);
}

export async function getProjects(params: SocrataQueryParams = {}) {
  try {
    return await fetchSocrataData({
      endpoint: 'https://data.ny.gov/resource/dprp-55ye.json',
      schema: ProjectsSchema,
      params,
    });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
  }
}

export async function getOutages(params: SocrataQueryParams = {}) {
  try {
    return await fetchSocrataData({
      endpoint: 'https://data.cityofnewyork.us/resource/br6j-yp22.json',
      schema: OutagesSchema,
      params,
    });
  } catch (error) {
    console.error('Failed to fetch outages:', error);
  }
}

export async function getEVChargingStations(params: SocrataQueryParams = {}) {
  try {
    return await fetchSocrataData({
      endpoint: 'https://data.cityofnewyork.us/resource/fc53-9hrv.json',
      schema: EVChargingStationsSchema,
      params,
    });
  } catch (error) {
    console.error('Failed to fetch ev charging stations:', error);
  }
}

export async function getRatSightings(params: SocrataQueryParams = {}) {
  try {
    return await fetchSocrataData({
      endpoint: 'https://data.cityofnewyork.us/resource/3q43-55fe.json',
      schema: RatSightingsSchema,
      params,
    });
  } catch (error) {
    console.error('Failed to fetch rat sightings:', error);
  }
}
