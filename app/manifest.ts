import type { MetadataRoute } from "next";

import {
  APP_DESCRIPTION,
  APP_NAME,
  APP_TAGLINE,
  MANIFEST_SHORT_NAME,
} from "@/config/app";
import {
  PWA_ICON_192,
  PWA_ICON_512,
} from "@/config/pwa";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${APP_NAME} · ${APP_TAGLINE}`,
    short_name: MANIFEST_SHORT_NAME,
    description: APP_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: PWA_ICON_192,
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: PWA_ICON_512,
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: PWA_ICON_512,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
