import Image from "next/image";

import { PWA_LOGO_SOURCE } from "@/config/pwa";
import { cn } from "@/lib/utils";

interface AppLogoProps {
  className?: string;
  size?: number;
  alt?: string;
}

/** In-app logo — transparent W.png on app background. */
export function AppLogo({
  className,
  size = 32,
  alt = "Wang",
}: AppLogoProps) {
  return (
    <Image
      src={PWA_LOGO_SOURCE}
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0 object-cover", className)}
      priority
    />
  );
}
