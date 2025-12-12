import React from "react";
const ConnectionPanel = React.lazy(
  () => import("@/app/layouts/left_panels/connectionpanel")
);
const ConnectionLayout = () => {
  return <ConnectionPanel />;
};

export default ConnectionLayout;
