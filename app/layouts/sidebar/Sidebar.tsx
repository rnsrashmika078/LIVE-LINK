"use client";
import dynamic from "next/dynamic";

const Sidebar = dynamic(() => import("./SidebarComponent"), {
    ssr: false,
});

export default Sidebar;
