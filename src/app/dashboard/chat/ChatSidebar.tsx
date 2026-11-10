"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect, useTransition } from "react";
import { createConversation, updateChatTitle, deleteConversation } from "./actions";
import Link from "next/link";
import { Edit2, Check, Trash2, X, Loader2, Search } from "lucide-react";

type Conversation = {
  id: string;
  title: string | null;
  createdAt: Date;
};

export default function ChatSidebar({ initialConversations }: { initialConversations: Conversation[] }) {
  const router = useRouter();
  const params = useParams();
  const activeChatId = params?.chatId as string;
  
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingChatId, setDeletingChatId] = useState<string | null>(null);

  useEffect(() => {
    setConversations(initialConversations);
  }, [initialConversations]);

  const handleEditSave = async (chatId: string) => {
    if (!editTitle.trim()) {
      setEditingChatId(null);
      return;
    }
    try {
      await updateChatTitle(chatId, editTitle);
      setConversations((prev) =>
        prev.map((c) => (c.id === chatId ? { ...c, title: editTitle } : c))
      );
      setEditingChatId(null);
      router.refresh();
    } catch (error) {
      console.error("Failed to update chat title", error);
    }
  };

  const handleDelete = async (chatId: string) => {
    setDeletingChatId(chatId);
    try {
      await deleteConversation(chatId);
      setConversations((prev) => prev.filter((c) => c.id !== chatId));
      setConfirmDeleteId(null);

      // If currently active chat was deleted, navigate away
      if (activeChatId === chatId) {
        router.push("/dashboard/chat");
      }
      router.refresh();
    } catch (error) {
      console.error("Failed to delete chat", error);
    } finally {
      setDeletingChatId(null);
    }
  };

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

  const filteredConversations = conversations.filter((chat) =>
    (chat.title || "New Conversation").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-80 h-full border-r border-white/5 bg-[#0a0a0a] flex flex-col">
      <div className="p-4 flex items-center justify-between border-b border-white/5">
        <Link href={"/dashboard"} className="text-lg font-bold text-white hover:text-[#00D47E] transition-colors">
          AI Chat Inbox
        </Link>
        <button 
          onClick={handleNewChat}
          disabled={isPending}
          title="Start a new conversation"
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
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Find a chat..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#00D47E] transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
        <div className="flex items-center justify-between px-2 mb-2 mt-2">
          <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            History ({filteredConversations.length})
          </span>
        </div>

        {filteredConversations.map((chat) => (
          <div 
            key={chat.id} 
            className={`block px-3 py-3 rounded-lg transition-colors group relative ${
              activeChatId === chat.id ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5 border border-transparent'
            }`}
          >
            {confirmDeleteId === chat.id ? (
              <div className="py-1 px-1 bg-red-500/10 border border-red-500/20 rounded-md flex items-center justify-between">
                <span className="text-xs text-red-300 font-medium">Delete chat?</span>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => handleDelete(chat.id)}
                    disabled={deletingChatId === chat.id}
                    className="px-2 py-0.5 text-xs bg-red-600 hover:bg-red-500 text-white rounded font-medium flex items-center gap-1 disabled:opacity-50 transition-colors"
                  >
                    {deletingChatId === chat.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </button>
                  <button 
                    onClick={() => setConfirmDeleteId(null)}
                    disabled={deletingChatId === chat.id}
                    className="px-2 py-0.5 text-xs text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start mb-1">
                  <div className="text-sm font-medium text-zinc-200 truncate pr-2 flex-1">
                    {editingChatId === chat.id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="text" 
                          autoFocus
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave(chat.id);
                            if (e.key === 'Escape') setEditingChatId(null);
                          }}
                          className="w-full bg-[#111] border border-[#00D47E]/30 rounded px-1.5 py-0.5 text-xs text-white outline-none focus:border-[#00D47E]"
                        />
                        <button onClick={() => handleEditSave(chat.id)} className="text-[#00D47E] hover:text-white">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setEditingChatId(null)} className="text-zinc-500 hover:text-white">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <Link href={`/dashboard/chat/${chat.id}`} className="hover:text-white truncate block">
                        {chat.title || "New Conversation"}
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    {editingChatId !== chat.id && (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setEditingChatId(chat.id);
                            setEditTitle(chat.title || "New Conversation");
                          }}
                          title="Rename chat"
                          className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/10 transition-colors"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            setConfirmDeleteId(chat.id);
                          }}
                          title="Delete chat"
                          className="p-1 text-zinc-400 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                    <div className="text-[10px] text-zinc-500 whitespace-nowrap mt-0.5">
                      {new Date(chat.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-zinc-500 truncate flex items-center gap-1">
                  <span className={`w-2 h-2 rounded-full ${activeChatId === chat.id ? 'bg-[#00D47E]' : 'bg-zinc-600'}`}></span>
                  {activeChatId === chat.id ? 'Active' : 'Closed'}
                </div>
              </>
            )}
          </div>
        ))}

        {filteredConversations.length === 0 && (
          <div className="text-center px-4 py-8 text-sm text-zinc-500">
            {searchQuery ? "No chats match your search." : "No previous conversations. Start a new chat to begin!"}
          </div>
        )}
      </div>
    </div>
  );
}
