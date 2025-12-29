import React, { ReactNode } from "react";
import StatusLayout from "@/app/component/client_component/status/StatusLayout";
const Layout = ({ children }: { children: ReactNode }) => {
  return <StatusLayout>{children}</StatusLayout>;
};

export default Layout;
