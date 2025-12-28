import { getStatus } from "@/app/actions/status_action";
import Skeleton from "@/app/component/ui/skeleton";
import { cookies } from "next/headers";
import React from "react";
import { Suspense } from "react";

const StatusClient = React.lazy(
  () => import("@/app/component/client_component/status/StatusClient")
);
const page = async () => {
  const cookieStore = cookies();
  const uid = (await cookieStore).get("uid")?.value;

  if (!uid) return;

  const status = await getStatus(uid);

  return (
    <Suspense fallback={<Skeleton version="sidebar" />}>
      <StatusClient status={status?.allStatus} />
    </Suspense>
  );
};

export default page;
