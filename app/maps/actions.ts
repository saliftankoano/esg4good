'use server';

import { ProjectsSchema } from '@/types/projects';

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
  const token = process.env.APP_TOKEN;

  if (!token) {
    throw new Error('APP_TOKEN environment variable is not set');
  }

  try {
    const response = await fetch(
      `https://data.ny.gov/resource/dprp-55ye.json?$limit=${limit}&$offset=${offset}`,
      {
        headers: {
          'X-App-Token': token,
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
