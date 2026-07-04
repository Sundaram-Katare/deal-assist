"use client";

import { useTransition } from "react";
import { createConversation } from "./actions";
import { useRouter } from "next/navigation";

export default function ChatRootPage() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleNewChat = () => {
    startTransition(async () => {
      try {
        const newChatId = await createConversation("New Conversation");
        router.push(`/dashboard/chat/${newChatId}`);
      } catch (error) {
        console.error("Failed to create chat", error);
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4 p-8">
      <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-2">
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </div>
      <h2 className="text-2xl font-semibold">Welcome to AI Chat Inbox</h2>
      <p className="text-zinc-400 max-w-md">Select a conversation from the sidebar or start a new one to begin chatting.</p>
      
      <button 
        onClick={handleNewChat}
        disabled={isPending}
        className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
      >
        {isPending ? (
           <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )}
        Start a New Chat
      </button>
    </div>
  );
}
