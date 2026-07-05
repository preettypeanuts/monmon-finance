import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { AppShell } from "@/components/shared/app-shell";
import { TooltipProvider } from "@/components/ui/tooltip";
import { readServerAppearance } from "@/lib/appearance/cookies";
import { readServerSidebarOpen } from "@/lib/sidebar/cookies";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Monmon",
  description: "AI-powered finance tracking with chat input",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const appearance = readServerAppearance(cookieStore);
  const sidebarOpen = readServerSidebarOpen(cookieStore);

  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-accent={appearance.accentId}
      className={cn(
        "h-full font-sans antialiased",
        appearance.resolvedDark && "dark",
      )}
    >
      <body className="h-svh overflow-hidden bg-transparent">
        <TooltipProvider>
          <AppShell
            initialAppearance={appearance}
            initialSidebarOpen={sidebarOpen}
          >
            {children}
          </AppShell>
        </TooltipProvider>
      </body>
    </html>
  );
}
