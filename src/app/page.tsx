"use client";

import Link from "next/link";
import { logout } from "../services/auth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { getLatestRiskAssessment } from "../services/risk-assessment";

export default function RootPage() {
  const router = useRouter();
  const [hasAssessment, setHasAssessment] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    const fetchAssessmentStatus = async () => {
      try {
        const result = await getLatestRiskAssessment();
        if (isMounted) {
          setHasAssessment(Boolean(result.assessment));
        }
      } catch (error) {
        console.error("Failed to check risk assessment status:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchAssessmentStatus();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    startTransition(async () => {
      const result = await logout();
      if (result?.success) {
        router.push("/auth/login");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button disabled={isLoading} asChild={!isLoading} className="w-full">
            {isLoading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Link href={hasAssessment ? "/risk-assessment/results" : "/risk-assessment"}>
                {hasAssessment ? "View Risk Assessment" : "Take Risk Assessment"}
              </Link>
            )}
          </Button>
          <div className="flex gap-2">
            <Button onClick={handleLogout} variant="outline" className="w-1/2" disabled={isPending}>
              {isPending ? <LoaderCircle className="h-4 w-4 animate-spin" /> : "Logout"}
            </Button>
            <Button asChild variant="outline" className="w-1/2">
              <Link href="/auth/update-password">Update Password</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
