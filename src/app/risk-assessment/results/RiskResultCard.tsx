"use client";

import { useSearchParams, useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RiskResultCard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const insight = searchParams.get("insight");
  const rawScore = searchParams.get("score");
  const score = rawScore && /^[0-3](\.\d+)?$/.test(rawScore) ? Number(rawScore) : NaN;

  // if score parameter is not a float from 0-3, show error page
  if (isNaN(score) || insight === null) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Invalid assessment results</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-red-600">Assessment score or insight not found. Please complete the assessment.</p>
          <div className="flex gap-2 pt-4">
            <Button onClick={() => router.push("/risk-assessment")} className="flex-1">
              Start Assessment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // get risk info based on final score
  const riskInfo =
    score > 2
      ? {
          level: "High Risk",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        }
      : score > 1
        ? {
            level: "Medium Risk",
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
          }
        : {
            level: "Low Risk",
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
          };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Your Risk Assessment Results</CardTitle>
        <CardDescription>Based on your responses</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className={`p-6 rounded-lg border-2 ${riskInfo.bgColor} ${riskInfo.borderColor}`}>
          <h2 className={`text-3xl font-bold ${riskInfo.color}`}>{riskInfo.level}</h2>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg prose">
          <ReactMarkdown>{insight}</ReactMarkdown>
        </div>

        <div className="flex gap-2 pt-4">
          <Button onClick={() => router.push("/")} variant="outline" className="flex-1">
            Return Home
          </Button>
          <Button onClick={() => router.push("/risk-assessment")} className="flex-1">
            Retake Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
