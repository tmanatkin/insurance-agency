import { Suspense } from "react";
import AuthCard from "../AuthCard";

export default function LoginPage() {
  return (
    <Suspense fallback={<div />}>
      <AuthCard authType="login" />
    </Suspense>
  );
}
