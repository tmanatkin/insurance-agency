import { generateText } from "ai";
import { Answer } from "@/types/RiskAssessment";
import { createRiskAssessment } from "@/services/risk-assessment";

export async function POST(request: Request) {
  try {
    const { answers, riskCategory } = await request.json();

    // Validate input
    if (!answers || typeof riskCategory !== "string") {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }

    // Format answers for the prompt
    const formattedAnswers = answers
      .map((answer: Answer) => `Q: ${answer.questionId}\nA: ${answer.answer}`)
      .join("\n\n");

    // Create prompt for LLM
    const prompt = `You are an insurance advisor analyzing a customer's risk profile based on their insurance assessment responses.

Risk Category: ${riskCategory}

Customer's Responses:
${formattedAnswers}

Based on this assessment, provide:
1. A brief explanation of their risk category
2. 2-3 specific, actionable recommendations to improve their insurance profile or reduce risk
3. Suggested insurance coverage priorities

Keep the response concise, professional, and customer-friendly. Format as clear paragraphs.`;

    const result = await generateText({
      model: "openai/gpt-4o-mini",
      prompt,
      temperature: 0.5,
    });

    const insight = result.text;
    const saveResult = await createRiskAssessment({ answers, riskCategory, insight });

    if (saveResult.error) {
      console.error("Failed to persist risk assessment:", saveResult.error);
    }

    return Response.json({
      category: riskCategory,
      insight,
    });
  } catch (error) {
    console.error("Error analyzing risk:", error);
    return Response.json({ error: "Failed to analyze risk" }, { status: 500 });
  }
}
