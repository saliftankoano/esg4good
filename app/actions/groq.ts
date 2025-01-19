"use server";

import { Project } from "@/app/page";

export async function getProjectRecommendations(project: Project) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/groq`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ project }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch recommendations");
    }

    const data = await response.json();

    if (!data.content) {
      throw new Error("Invalid response format");
    }

    return data.content;
  } catch (error) {
    console.error("Error getting recommendations:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to get recommendations"
    );
  }
}
