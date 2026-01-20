import { Suspense } from "react";
import AuthCard from "../AuthCard";
import { LoaderCircle } from "lucide-react";

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<LoaderCircle className="animate-spin" />}>
      <AuthCard authType="update-password" />
    </Suspense>
  );
}
