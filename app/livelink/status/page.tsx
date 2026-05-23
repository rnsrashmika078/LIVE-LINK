import { getStatus } from "@/app/actions/status_action";
import { cookies } from "next/headers";
import dynamic from "next/dynamic";
import Spinner from "@/app/component/ui/spinner";

const StatusClient = dynamic(
  () => import("@/app/component/client_component/status/StatusClient"),
  {
    loading: () => <Spinner heading="Fetching..."></Spinner>,
  },
);
const page = async () => {
  const cookieStore = cookies();
  const uid = (await cookieStore).get("uid")?.value;

  if (!uid) return;

  const status = await getStatus(uid);

  return <StatusClient status={status?.allStatus} />;
};

export default page;
