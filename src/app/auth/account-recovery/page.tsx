import { Suspense } from "react";
import AuthCard from "../AuthCard";
import { LoaderCircle } from "lucide-react";

export default function AccountRecoveryPage() {
  return (
    <Suspense fallback={<LoaderCircle className="animate-spin" />}>
      <AuthCard authType="account-recovery" />
    </Suspense>
  );
}
