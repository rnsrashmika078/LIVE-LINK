import { ReactNode, Suspense } from "react";
import React from "react";
import Skeleton from "../component/ui/skeleton";
import MainLayout from "../component/client_component/MainLayout";
import { StatusProvider } from "../context/StatusContext";
const Sidebar = React.lazy(() => import("../layouts/sidebar/Sidebar"));

export default function LiveLinkLayout({ children }: { children: ReactNode }) {
  return (
    <StatusProvider>
      <div className="flex bg-[var(--pattern_1)] w-full h-screen relative">
        <Suspense fallback={<Skeleton version="Sidebar" />}>
          <Sidebar />
        </Suspense>
        {children}
        <MainLayout />
      </div>
    </StatusProvider>
  );
}
