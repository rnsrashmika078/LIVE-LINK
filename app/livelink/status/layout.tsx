import Skeleton from "@/app/component/ui/skeleton";
import React, { ReactNode, Suspense } from "react";
const StatusLayout = React.lazy(
  () => import("@/app/component/client_component/status/StatusLayout")
);
const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Suspense fallback={<Skeleton version="chats"/>}>
      <StatusLayout>{children}</StatusLayout>
    </Suspense>
  );
};

export default Layout;
