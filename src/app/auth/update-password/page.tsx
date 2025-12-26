import { Suspense } from "react";
import AuthCard from "../AuthCard";

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={<div />}>
      <AuthCard authType="update-password" />
    </Suspense>
  );
}
