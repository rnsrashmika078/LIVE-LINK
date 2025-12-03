import React from "react";
import CallsPanel from "../layouts/left_panels/callspanel";
import Sidebar from "../layouts/sidebar/Sidebar";
import MainLayout from "../layouts/MainLayout";

const page = () => {
  return (
    <MainLayout>
      <Sidebar />
      <CallsPanel />
    </MainLayout>
  );
};

export default page;
