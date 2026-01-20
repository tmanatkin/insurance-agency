import { Suspense } from "react";
import RiskResultCard from "./RiskResultCard";
import { LoaderCircle } from "lucide-react";

export default function ResultsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<LoaderCircle className="animate-spin" />}>
        <RiskResultCard />
      </Suspense>
    </div>
  );
}
