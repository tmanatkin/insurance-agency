import { Suspense } from "react";
import AuthCard from "../AuthCard";
import { LoaderCircle } from "lucide-react";

export default function SignupPage() {
  return (
    <Suspense fallback={<LoaderCircle className="animate-spin" />}>
      <AuthCard authType="signup" />
    </Suspense>
  );
}
