import ChatLayout from "@/app/component/client_component/chats/ChatLayout";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <ChatLayout>{children}</ChatLayout>;
}
