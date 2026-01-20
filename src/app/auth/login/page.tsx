import { Suspense } from "react";
import AuthCard from "../AuthCard";
import { LoaderCircle } from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoaderCircle className="animate-spin" />}>
      <AuthCard authType="login" />
    </Suspense>
  );
}
