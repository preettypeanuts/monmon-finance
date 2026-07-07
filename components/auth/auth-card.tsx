import Link from "next/link";

import { AppLogo } from "@/components/shared/app-logo";
import { APP_NAME, APP_TAGLINE } from "@/config/app";
import { GLASS_SURFACE } from "@/config/glass";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}

export function AuthCard({
  title,
  description,
  children,
  footer,
}: AuthCardProps) {
  return (
    <div className="flex min-h-svh items-center justify-center px-4 py-10">
      <div
        className={cn(
          "w-full max-w-sm rounded-3xl p-6 sm:p-8",
          GLASS_SURFACE,
        )}
      >
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex">
            <AppLogo className="size-14 rounded-2xl" />
          </Link>
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            {APP_NAME} · {APP_TAGLINE}
          </p>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>

        {children}

        <div className="mt-6 text-center text-sm text-muted-foreground">
          {footer}
        </div>
      </div>
    </div>
  );
}
