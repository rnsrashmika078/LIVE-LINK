import MainLayout from "../layouts/MainLayout";
import SideNavBar from "../layouts/sidebar/SidebarComponent";
import ChatList from "../component/client_component/chats/ChatListPanel";
import ChatArea from "../layouts/ChatArea";
import ChatInfo from "../layouts/ChatInfo";

const page = () => {
    return (
        <div>
            <MainLayout>
                <SideNavBar />
                <ChatList />
                <ChatArea />
                <ChatInfo />
            </MainLayout>
        </div>
    );
};

export default page;
