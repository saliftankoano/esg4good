"use server";

export const getProjects = async () => {
  const token = process.env.APP_TOKEN;

  if (!token) {
    throw new Error("APP_TOKEN environment variable is not set");
  }

  try {
    const response = await fetch(
      `https://data.ny.gov/resource/dprp-55ye.json`,
      {
        headers: {
          "X-App-Token": token,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.message || "Unknown error"}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch rat data:", error);
    throw error;
  }
};
