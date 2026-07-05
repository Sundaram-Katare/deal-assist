"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function ChatUI({ chatId, initialMessages }: { chatId: string, initialMessages: any[] }) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/auth/chat",
    body: { chatId },
    initialMessages,
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full font-sans text-white bg-[#050505]">
      <div className="flex flex-col h-full w-full mx-auto relative">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-white/5 bg-[#0a0a0a] flex justify-between items-center shrink-0">
          <div>
            <h1 className="text-xl font-bold">Deal Assist Copilot</h1>
            <p className="text-xs text-zinc-400">Ask questions, prepare for meetings, or compare competitors.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs text-zinc-400">Online</span>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#00D47E]/20 flex items-center justify-center text-[#00D47E] mb-2 border border-[#00D47E]/30">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold">How can I help you close today?</h2>
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
                  
                  {/* Handle Tool Invocations Display */}
                  {m.toolInvocations && m.toolInvocations.map((toolInvocation: any) => {
                    const toolCallId = toolInvocation.toolCallId;
                    const result = 'result' in toolInvocation ? toolInvocation.result : null;

                    return (
                      <div key={toolCallId} className="mt-4 p-4 rounded-xl bg-black/40 border border-white/5">
                        <div className="flex items-center gap-2 mb-2 text-[#00D47E] font-medium text-sm">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <span>{toolInvocation.toolName === 'generateProposal' ? 'Sales Proposal' : toolInvocation.toolName === 'compareCompetitor' ? 'Competitor Analysis' : 'Meeting Prep'}</span>
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

        {/* Input Form */}
        <div className="p-4 sm:p-6 bg-[#0a0a0a] border-t border-white/5 shrink-0">
          <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto w-full">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Ask anything or request a proposal..."
              className="w-full pl-4 pr-12 py-4 bg-[#111] border border-white/10 rounded-xl outline-none focus:border-[#00D47E] focus:ring-1 focus:ring-[#00D47E] transition-all text-white placeholder:text-zinc-500"
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
    </div>
  );
}
