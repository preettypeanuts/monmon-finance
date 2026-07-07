import { RegisterForm } from "@/components/auth/register-form";
import { isGoogleAuthConfigured } from "@/lib/auth/google";

export default function RegisterPage() {
  const googleAuthEnabled = isGoogleAuthConfigured();

  return <RegisterForm googleAuthEnabled={googleAuthEnabled} />;
}
