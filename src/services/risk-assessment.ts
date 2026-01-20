"use server";

import { Answer } from "@/types/RiskAssessment";
import { createServersideClient } from "@/lib/supabase/server";

type LatestRiskAssessment = {
  id: string;
  risk_category: string;
  insight: string | null;
  created_at: string;
};

export async function getLatestRiskAssessment(): Promise<{ assessment: LatestRiskAssessment | null }> {
  const supabase = await createServersideClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { assessment: null };
  }

  const { data: latestAssessment, error } = await supabase
    .from("risk_assessments")
    .select("id, risk_category, insight, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching latest risk assessment:", error);
    return { assessment: null };
  }

  return { assessment: latestAssessment ?? null };
}

export async function createRiskAssessment(input: {
  answers: Answer[];
  riskCategory: string;
  insight: string | null;
}): Promise<{ id?: string; error?: string }> {
  const supabase = await createServersideClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "User not authenticated" };
  }

  const { data, error } = await supabase
    .from("risk_assessments")
    .insert({
      user_id: user.id,
      risk_category: input.riskCategory,
      answers: input.answers,
      insight: input.insight ?? "",
    })
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Error creating risk assessment:", error);
    return { error: "Failed to save risk assessment" };
  }

  return { id: data?.id };
}
