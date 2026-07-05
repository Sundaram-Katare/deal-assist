import { getConversations } from "./actions";
import ChatSidebar from "./ChatSidebar";

export default async function ChatLayout({ children }: { children: React.ReactNode }) {
  const conversations = await getConversations();

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#050505] font-sans text-white">
      <ChatSidebar initialConversations={conversations} />
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#050505]">
        {children}
      </div>
    </div>
  );
}
