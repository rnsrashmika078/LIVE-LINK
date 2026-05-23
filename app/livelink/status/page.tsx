import { getStatus } from "@/app/actions/status_action";
import { cookies } from "next/headers";
import StatusClient from "@/app/component/client_component/status/StatusClient";

const page = async () => {
  const cookieStore = cookies();
  const uid = (await cookieStore).get("uid")?.value;

  if (!uid) return;

  const status = await getStatus(uid);

  return <StatusClient status={status?.allStatus} />;
};

export default page;
