"use client";

import {
  useCallback,
  useLayoutEffect,
  useState,
  type ComponentProps,
} from "react";

import { SidebarProvider } from "@/components/ui/sidebar";
import {
  readStoredSidebarOpen,
  writeStoredSidebarOpen,
} from "@/lib/sidebar/storage";

interface PersistentSidebarProviderProps
  extends Omit<ComponentProps<typeof SidebarProvider>, "open" | "onOpenChange"> {
  initialOpen: boolean;
}

export function PersistentSidebarProvider({
  initialOpen,
  children,
  ...props
}: PersistentSidebarProviderProps) {
  const [open, setOpen] = useState(initialOpen);

  useLayoutEffect(() => {
    const storedOpen = readStoredSidebarOpen(initialOpen);

    setOpen(storedOpen);
    writeStoredSidebarOpen(storedOpen);
  }, [initialOpen]);

  const handleOpenChange = useCallback((nextOpen: boolean) => {
    setOpen(nextOpen);
    writeStoredSidebarOpen(nextOpen);
  }, []);

  return (
    <SidebarProvider open={open} onOpenChange={handleOpenChange} {...props}>
      {children}
    </SidebarProvider>
  );
}
