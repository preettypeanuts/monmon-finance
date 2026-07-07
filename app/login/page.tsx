import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { isGoogleAuthConfigured } from "@/lib/auth/google";

export default function LoginPage() {
  const googleAuthEnabled = isGoogleAuthConfigured();

  return (
    <Suspense>
      <LoginForm googleAuthEnabled={googleAuthEnabled} />
    </Suspense>
  );
}
