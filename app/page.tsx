import { redirect } from "next/navigation";
import Welcome from "./layouts/welcome";

const page = () => {
    // redirect("/chats");
    return <Welcome />;
};

export default page;
