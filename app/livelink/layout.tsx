import { ReactNode, Suspense } from "react";
import React from "react";
import Skeleton from "../component/ui/skeleton";
import MainLayout from "../component/client_component/MainLayout";
import { AgentProvider } from "../context/AgentContext";
const Sidebar = React.lazy(() => import("../layouts/sidebar/Sidebar"));

export default function LiveLinkLayout({ children }: { children: ReactNode }) {
  return (
    <AgentProvider>
      <div className="flex bg-[var(--pattern_1)] w-full h-screen relative">
        <Suspense fallback={<Skeleton version="Sidebar" />}>
          <Sidebar />
        </Suspense>
        {children}
        <MainLayout />
      </div>
    </AgentProvider>
  );
}
