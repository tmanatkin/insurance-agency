import { generateText } from "ai";
import { Answer } from "@/types/RiskAssessment";

export async function POST(request: Request) {
  try {
    const { answers, score } = await request.json();

    // Validate input
    if (!answers || typeof score !== "number") {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // Format answers for the prompt
    const formattedAnswers = answers
      .map((answer: Answer) => `Q: ${answer.questionId}\nA: ${answer.answer}`)
      .join("\n\n");

    // Create prompt for LLM
    const prompt = `You are an insurance advisor analyzing a customer's risk profile based on their insurance assessment responses.

Risk Score: ${score} (scale 0-3, where 0 is lowest risk and 3 is highest risk)

Customer's Responses:
${formattedAnswers}

Based on this assessment, provide:
1. A brief explanation of their risk score
2. 2-3 specific, actionable recommendations to improve their insurance profile or reduce risk
3. Suggested insurance coverage priorities

Keep the response concise, professional, and customer-friendly. Format as clear paragraphs.`;

    const result = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.5,
    });

    return Response.json({
      score,
      insight: result.text,
    });
  } catch (error) {
    console.error("Error analyzing risk:", error);
    return Response.json({ error: "Failed to analyze risk" }, { status: 500 });
  }
}
