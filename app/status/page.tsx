import React from "react";
import StatusPanel from "../layouts/left_panels/statuspanel";
import Sidebar from "../layouts/sidebar/Sidebar";

const page = () => {
    return (
        <>
            <Sidebar />
            <StatusPanel />
        </>
    );
};

export default page;
