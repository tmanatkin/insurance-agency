import { redirect } from "next/navigation";
import RiskResultCard from "./RiskResultCard";
import { getLatestRiskAssessment } from "@/services/risk-assessment";

export default async function ResultsPage() {
  const { assessment } = await getLatestRiskAssessment();

  if (!assessment) {
    redirect("/risk-assessment");
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <RiskResultCard assessment={assessment} />
    </div>
  );
}
