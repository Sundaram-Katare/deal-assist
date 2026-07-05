"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useTransition } from "react";
import { createConversation } from "./actions";
import Link from "next/link";

type Conversation = {
  id: string;
  title: string | null;
  createdAt: Date;
};

export default function ChatSidebar({ initialConversations }: { initialConversations: Conversation[] }) {
  const router = useRouter();
  const params = useParams();
  const activeChatId = params?.chatId as string;
  
  const [isPending, startTransition] = useTransition();

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
    <div className="w-80 h-full border-r border-white/5 bg-[#0a0a0a] flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <Link href={"/dashboard"} className="text-lg font-bold text-white">AI Chat Inbox</Link>
        <button 
          onClick={handleNewChat}
          disabled={isPending}
          className="w-8 h-8 rounded-full bg-[#00D47E] hover:bg-[#00D47E]/90 flex items-center justify-center text-black transition-colors disabled:opacity-50"
        >
          {isPending ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          )}
        </button>
      </div>

      <div className="p-4">
        <div className="relative">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Find a chat..." 
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-500 outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2 mb-2 mt-2">History</div>
        {initialConversations.map((chat) => (
          <Link 
            key={chat.id} 
            href={`/dashboard/chat/${chat.id}`}
            className={`block px-3 py-3 rounded-lg transition-colors ${
              activeChatId === chat.id ? 'bg-white/10 border border-white/5' : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <div className="text-sm font-medium text-zinc-200 truncate pr-2">
                {chat.title || "New Conversation"}
              </div>
              <div className="text-[10px] text-zinc-500 whitespace-nowrap mt-0.5">
                {new Date(chat.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </div>
            </div>
            <div className="text-xs text-zinc-500 truncate flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${activeChatId === chat.id ? 'bg-[#00D47E]' : 'bg-zinc-600'}`}></span>
              {activeChatId === chat.id ? 'Active' : 'Closed'}
            </div>
          </Link>
        ))}
        {initialConversations.length === 0 && (
          <div className="text-center px-4 py-8 text-sm text-zinc-500">
            No previous conversations. Start a new chat to begin!
          </div>
        )}
      </div>
    </div>
  );
}
