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
    const formattedAnswers = answers.map((answer: Answer) => `Q: ${answer.question}\nA: ${answer.answer}`).join("\n\n");

    // Create prompt for LLM
    const prompt = `
    You are an insurance advisor helping a customer understand their risk profile and what it means for their insurance costs. The customer's risk category has already been determined and must not be re-evaluated.

    Risk Category (given): ${riskCategory}

    Assessment Responses:
    ${formattedAnswers}
    
    Using only the information above:
    1. Write one concise paragraph explaining why the customer falls into this risk category. Use plain, simple language that a customer with little or no insurance knowledge can understand. Reference specific responses from the assessment to make it clear why they are considered low, medium, or high risk. Avoid insurance jargon.
    2. Provide 2-3 specific, actionable recommendations to the customer that they can take to lower risk and potentially lower insurance costs. Focus on steps the customer can realistically control, such as safe driving habits, vehicle maintenance, household or lifestyle factors, or coverage decisions like adjusting deductibles. Avoid suggesting specific insurance carriers or products. Format each recommendation as a bullet point with a short bold title followed by a colon and a brief explanation.

    Constraints:
    - Address the customer directly using "you" rather than talking about them in third person.
    - Use plain language and short sentences.
    - Do not infer, assume, or speculate beyond provided responses.
    - Avoid generic advice; tailor recommendations to the assessment details.
    - Use bullet points for recommendations.
    - Keep the tone professional, neutral, and customer-friendly.
    - Do not include questions, invitations for follow-up, or offers of further assistance.
    - Do not include closing statements or sign-offs. End the response after the recommendations.`;

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
