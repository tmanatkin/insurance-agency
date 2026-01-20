import { Suspense } from "react";
import RiskResultCard from "./RiskResultCard";
import { LoaderCircle } from "lucide-react";
import { getLatestRiskAssessment } from "@/services/risk-assessment";

export default async function ResultsPage() {
  const { assessment } = await getLatestRiskAssessment();
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<LoaderCircle className="animate-spin" />}>
        <RiskResultCard assessment={assessment} />
      </Suspense>
    </div>
  );
}
