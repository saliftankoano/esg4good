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

    const prompt = `As a renewable energy and sustainability expert, analyze the following project and provide a comprehensive evaluation. For each category, provide AT LEAST 3 points.

Project Details:
${JSON.stringify(project, null, 2)}

Please structure your response exactly as follows:

Current strengths:
- [List at least 3 specific strengths of the project]
- [Focus on existing positive aspects]
- [Include quantifiable metrics where possible]

Areas for improvement:
- [List at least 3 specific areas that need improvement]
- [Focus on concrete aspects that can be enhanced]
- [Include specific gaps or limitations]

Specific actionable recommendations:
- [Provide at least 3 detailed, actionable steps]
- [Include implementation timeframes where relevant]
- [Focus on practical, achievable improvements]

Potential score impact:
- [List at least 3 specific score improvements]
- [Quantify the potential impact of each recommendation]
- [Include estimated timeframes for improvements]

Remember:
- Each section MUST have at least 3 bullet points
- Be specific and detailed in each point
- Focus on practical, achievable improvements
- Include quantifiable metrics where possible
- Maintain a professional, constructive tone`;

    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are an expert in renewable energy projects and ESG scoring. Always provide comprehensive, structured responses with at least 3 points per category. Be specific and actionable in your recommendations. Focus on quantifiable metrics and practical implementation details.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.5,
        max_tokens: 4096,
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

    // Validate that all sections have content
    const content = data.choices[0].message.content;
    const sections = {
      strengths: content.includes("Current strengths:"),
      improvements: content.includes("Areas for improvement:"),
      recommendations: content.includes("Specific actionable recommendations:"),
      impacts: content.includes("Potential score impact:"),
    };

    if (!Object.values(sections).every(Boolean)) {
      throw new Error("Incomplete response: Missing required sections");
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
