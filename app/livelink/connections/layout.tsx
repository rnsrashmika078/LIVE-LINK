import Spinner from "@/app/component/ui/spinner";
import React, { Suspense } from "react";
const ConnectionPanel = React.lazy(
  () => import("@/app/layouts/left_panels/connectionpanel")
);
const ConnectionLayout = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <ConnectionPanel />
    </Suspense>
  );
};

export default ConnectionLayout;
