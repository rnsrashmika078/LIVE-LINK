import React from "react";
import CallsPanel from "../layouts/left_panels/callspanel";
import Sidebar from "../layouts/sidebar/Sidebar";

const page = () => {
    return (
        <>
            <Sidebar />
            <CallsPanel />
        </>
    );
};

export default page;
