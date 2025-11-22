import React from "react";
import ChatsWrapper from "../component/component_wrappers/chatpanel_wrapper";
import Sidebar from "../layouts/sidebar/Sidebar";

const page = () => {
    return (
        <>
            <Sidebar />
            <ChatsWrapper />
        </>
    );
};

export default page;
