'use server';

import { RatSighting } from '@/app/map/page';

export const getRats = async () => {
  const token = process.env.APP_TOKEN;
  const limit = 1000;
  let allData: RatSighting[] = [];
  let offset = 0;

  if (!token) {
    throw new Error('APP_TOKEN environment variable is not set');
  }

  try {
    while (true) {
      const response = await fetch(
        `https://data.cityofnewyork.us/resource/3q43-55fe.json?$where=created_date >= '2024-01-01T00:00:00.000'&$limit=${limit}&$offset=${offset}`,
        {
          headers: {
            'X-App-Token': token,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.message || 'Unknown error'}`);
      }

      const data = await response.json();
      if (data.length === 0) break; // No more data to fetch

      // Transform the data to match our RatSighting interface
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const transformedData = data.map((item: any) => ({
        latitude: parseFloat(item.latitude),
        longitude: parseFloat(item.longitude),
        created_date: item.created_date,
        incident_address: item.incident_address,
        borough: item.borough,
      }));

      allData = [...allData, ...transformedData];
      offset += limit;
    }

    return allData;
  } catch (error) {
    console.error('Failed to fetch rat data:', error);
    throw error;
  }
};
