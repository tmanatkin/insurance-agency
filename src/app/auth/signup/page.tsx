import { Suspense } from "react";
import AuthCard from "../AuthCard";

export default function SignupPage() {
  return (
    <Suspense fallback={<div />}>
      <AuthCard authType="signup" />
    </Suspense>
  );
}
