import { Suspense } from "react";
import AuthCard from "../AuthCard";

export default function AccountRecoveryPage() {
  return (
    <Suspense fallback={<div />}>
      <AuthCard authType="account-recovery" />
    </Suspense>
  );
}
