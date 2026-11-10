import ChatUI from "./ChatUI";
import { getConversationMessages } from "../actions";
import { redirect } from "next/navigation";

export default async function DynamicChatPage({ params }: { params: Promise<{ chatId: string }> }) {
  const { chatId } = await params;
  let dbMessages = [];
  try {
    dbMessages = await getConversationMessages(chatId);
  } catch (error) {
    
    redirect("/dashboard/chat");
  }

  
  const initialMessages = dbMessages.map((msg) => ({
    id: msg.id,
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));

  return (
    <ChatUI chatId={chatId} initialMessages={initialMessages} />
  );
}
