"use client";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("./SidebarComponent"), {
  ssr: true,
});

export default Sidebar;
