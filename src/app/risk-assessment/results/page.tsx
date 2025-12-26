import { Suspense } from "react";
import RiskResultCard from "./RiskResultCard";

export default function ResultsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <RiskResultCard />
      </Suspense>
    </div>
  );
}
