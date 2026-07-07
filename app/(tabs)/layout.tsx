import { PersistentTabLayout } from "@/components/shared/persistent-tab-layout";

interface TabsLayoutProps {
  children: React.ReactNode;
}

export default function TabsLayout({ children }: TabsLayoutProps) {
  return <PersistentTabLayout>{children}</PersistentTabLayout>;
}
