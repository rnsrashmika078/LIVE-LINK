import React from "react";
import NotificationsPanel from "../layouts/left_panels/connectionpanel";
import MainLayout from "../layouts/MainLayout";
import SidebarComponent from "../layouts/sidebar/SidebarComponent";

const page = () => {
  return (
    <MainLayout>
      <SidebarComponent />
      <NotificationsPanel />
    </MainLayout>
  );
};

export default page;
