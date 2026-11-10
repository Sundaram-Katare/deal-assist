"use client";

import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { Plus, X, FileText, Mail, Presentation, Sparkles, Trash2, Loader2 } from "lucide-react";
import { deleteConversation } from "../actions";

const AVAILABLE_TOOLS = [
  { id: "generateProposal", name: "Create Proposal", icon: FileText },
  { id: "generateEmail", name: "Email Generator", icon: Mail },
  { id: "generatePitch", name: "Sales Pitch Generator", icon: Presentation },
];

export default function ChatUI({ chatId, initialMessages }: { chatId: string, initialMessages: any[] }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, append } = useChat({
    api: "/api/auth/chat",
    body: { chatId },
    initialMessages,
  });
  
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeTool, setActiveTool] = useState<{id: string, name: string} | null>(null);
  const [showTools, setShowTools] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteChat = async () => {
    setIsDeleting(true);
    try {
      await deleteConversation(chatId);
      router.push("/dashboard/chat");
      router.refresh();
    } catch (error) {
      console.error("Failed to delete conversation:", error);
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (activeTool) {
      const instruction = `\n\n[SYSTEM: The user has explicitly selected the ${activeTool.name} tool. You MUST output your response using the ${activeTool.id} tool function call.]`;
      append({
        role: "user",
        content: input + instruction
      });
      
      handleInputChange({ target: { value: "" } } as any);
      setActiveTool(null);
    } else {
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full font-sans text-white bg-[#050505]">
      <div className="flex flex-col h-full w-full mx-auto relative">
        
        {}
        <div className="px-6 py-4 border-b border-white/5 bg-[#0a0a0a] flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-xl font-bold">SellGenie AI</h1>
            <p className="text-xs text-zinc-400">Ask questions, prepare for meetings, or compare competitors.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-xs text-zinc-400">Online</span>
            </div>

            <button
              onClick={() => setShowDeleteModal(true)}
              title="Delete this chat"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-red-400 hover:bg-red-500/10 border border-white/5 hover:border-red-500/20 transition-all ml-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Delete Chat</span>
            </button>
          </div>
        </div>

        {}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              {}
              <img src="/logo.png" className="h-18" alt="" /> 
              <h2 className="text-2xl font-semibold">How can I help you today?</h2>
              <p className="text-zinc-400 max-w-md">Try asking me to generate a proposal, compare us to a competitor, or just ask a question about our products.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-left w-full max-w-lg">
                <button onClick={() => handleInputChange({ target: { value: "Can you generate a proposal for Acme Corp?" } } as any)} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-zinc-300 transition-colors">
                  Generate a proposal for Acme Corp
                </button>
                <button onClick={() => handleInputChange({ target: { value: "How do we compare against Salesforce?" } } as any)} className="p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-zinc-300 transition-colors">
                  Compare against Salesforce
                </button>
              </div>
            </div>
          ) : (
            messages.map((m: any) => (
              <div key={m.id} className={`max-w-4xl mx-auto w-full flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${
                    m.role === 'user' 
                      ? 'bg-[#00D47E] text-black rounded-br-none' 
                      : 'bg-[#004225]/20 border border-[#00D47E]/20 text-zinc-200 rounded-bl-none'
                  }`}>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                  
                  {}
                  {m.toolInvocations && m.toolInvocations.map((toolInvocation: any) => {
                    const toolCallId = toolInvocation.toolCallId;
                    const result = 'result' in toolInvocation ? toolInvocation.result : null;

                    return (
                      <div key={toolCallId} className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5">
                        <div className="flex items-center gap-2 mb-2 text-[#00D47E] font-medium text-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>{
                            toolInvocation.toolName === 'generateProposal' ? 'Sales Proposal' : 
                            toolInvocation.toolName === 'compareCompetitor' ? 'Competitor Analysis' : 
                            toolInvocation.toolName === 'prepareMeeting' ? 'Meeting Prep' : 
                            toolInvocation.toolName === 'generateEmail' ? 'Sales Email' :
                            toolInvocation.toolName === 'generatePitch' ? 'Sales Pitch' : 
                            'Tool Result'
                          }</span>
                          {!result && <span className="ml-auto text-xs animate-pulse text-[#00D47E]/70">Generating...</span>}
                        </div>
                        
                        {result && result.data && (
                          <div className="text-sm space-y-3 mt-3 border-t border-white/10 pt-3">
                            {Object.entries(result.data).map(([key, value]: any) => (
                              <div key={key}>
                                <span className="block text-zinc-400 text-xs uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                {Array.isArray(value) ? (
                                  <ul className="list-disc pl-4 space-y-1 text-zinc-300">
                                    {value.map((item, i) => <li key={i}>{item}</li>)}
                                  </ul>
                                ) : (
                                  <p className="text-zinc-300">{value}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
          {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <div className="max-w-4xl mx-auto w-full flex justify-start">
              <div className="bg-[#004225]/20 border border-[#00D47E]/20 rounded-2xl rounded-bl-none px-5 py-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00D47E] rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-[#00D47E] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-2 h-2 bg-[#00D47E] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {}
        <div className="p-4 sm:p-6 bg-[#0a0a0a] border-t border-white/5 shrink-0">
          <div className="max-w-4xl mx-auto w-full relative">
            
            {}
            {activeTool && (
              <div className="absolute -top-10 left-0 bg-[#004225] border border-[#00D47E]/40 text-[#00D47E] text-xs px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg z-10">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  {activeTool.name}
                </span>
                <button 
                  onClick={() => setActiveTool(null)}
                  className="hover:bg-[#00D47E]/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            {}
            {showTools && (
              <div className="absolute bottom-full left-0 mb-2 w-56 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-bottom-2">
                <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider border-b border-white/5 bg-black/20">
                  Select a tool
                </div>
                <div className="p-1 max-h-48 overflow-y-auto">
                  {AVAILABLE_TOOLS.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setActiveTool(tool);
                        setShowTools(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-sm text-zinc-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors group"
                    >
                      <tool.icon className="w-4 h-4 text-zinc-500 group-hover:text-[#00D47E] transition-colors" />
                      {tool.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={onFormSubmit} className="relative flex items-center">
              <button
                type="button"
                onClick={() => setShowTools(!showTools)}
                className={`absolute left-2 p-2 rounded-lg transition-colors ${showTools ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
              >
                <Plus className={`w-5 h-5 transition-transform ${showTools ? 'rotate-45' : ''}`} />
              </button>
              
              <input
                type="text"
                value={input}
                onChange={handleInputChange}
                onFocus={() => setShowTools(false)}
                placeholder={activeTool ? `Instruct the ${activeTool.name}...` : "Ask anything or request a proposal..."}
                className="w-full pl-12 pr-12 py-4 bg-[#111] border border-white/10 rounded-xl outline-none focus:border-[#00D47E] focus:ring-1 focus:ring-[#00D47E] transition-all text-white placeholder:text-zinc-500"
                disabled={isLoading}
              />
              
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-2 p-2 rounded-lg bg-[#004225] hover:bg-[#00D47E]/40 text-[#00D47E] disabled:opacity-50 disabled:hover:bg-[#004225] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
              <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Delete Conversation?</h3>
                <p className="text-sm text-zinc-400 mt-1">
                  This will permanently delete this conversation and all its messages. This action cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm text-zinc-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteChat}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
