import { NextResponse } from "next/server";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { project } = body;

    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
    }

    const prompt = `As a renewable energy and sustainability expert, analyze the following project and provide specific recommendations to improve its environmental and social impact scores. Consider factors like carbon reduction, community engagement, job creation, and technological efficiency.

Project Details:
${JSON.stringify(project, null, 2)}

Please provide:
1. Current strengths
2. Areas for improvement
3. Specific actionable recommendations
4. Potential score impact of each recommendation`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mixtral-8x7b-32768",
        messages: [
          {
            role: "system",
            content:
              "You are an expert in renewable energy projects and ESG scoring.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        `Groq API responded with status ${response.status}: ${
          errorData.error?.message || "Unknown error"
        }`
      );
    }

    const data = await response.json();

    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Unexpected response format from Groq API");
    }

    return NextResponse.json({ content: data.choices[0].message.content });
  } catch (error) {
    console.error("Error in Groq API route:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to process request",
      },
      { status: 500 }
    );
  }
}
