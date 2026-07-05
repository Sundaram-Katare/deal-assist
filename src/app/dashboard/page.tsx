import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { prisma } from "../../lib/prisma";
import ReviewCard from "./ReviewCard";
import LogoutButton from "./LogoutButton";  
import Link from "next/link";
import { 
  UploadCloud, 
  MessageSquare, 
  FileText, 
  Scale, 
  ClipboardList, 
  Calendar, 
  ShieldCheck, 
  AlignLeft, 
  Crosshair, 
  Send, 
  Globe, 
  ArrowRight,
  Link as LinkIcon,
  BarChart2,
  Sparkles,
  CheckCircle2,
  Users,
  Database
} from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/sign-in");
  }

  // Get user's membership
  const membership = await prisma.membership.findFirst({
    where: {
      userId: session.user.id,
    },
    include: {
      org: true,
    },
  });

  if (!membership) {
    redirect("/onboarding");
  }

  const firstName = session.user.name?.split(" ")[0] || session.user.email?.split("@")[0] || "User";

  return (
    <div className="min-h-screen bg-[#050505] font-sans text-white p-4 md:p-8 selection:bg-[#00D47E]/30">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">
              Welcome back, {firstName}! 👋
            </h1>
            <p className="text-zinc-400 mb-2">
              Here's what's happening with your sales knowledge hub.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs">
              <span className="text-zinc-500">Org ID:</span>
              <span className="font-mono text-[#00D47E]">{membership.orgId}</span>
            </div>
          </div>
          <div className="flex items-center">
            <LogoutButton />
          </div>
        </header>

        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Upload Documents Card */}
          <div className="lg:col-span-1 rounded-2xl bg-gradient-to-br from-[#004225] to-[#0a0a0a] border border-[#00D47E]/20 p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D47E]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div>
              <div className="w-12 h-12 bg-[#00D47E]/20 rounded-xl flex items-center justify-center mb-6 border border-[#00D47E]/30 text-[#00D47E]">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">Upload Documents</h2>
              <p className="text-[#00D47E]/70 text-sm mb-8 leading-relaxed max-w-[85%]">
                Upload PDFs, DOCX, FAQs, sales playbooks and more.
              </p>
            </div>
            <Link 
              href="/dashboard/document" 
              className="inline-flex items-center justify-center gap-2 bg-[#00D47E] hover:bg-[#00D47E]/90 text-black font-semibold px-6 py-3 rounded-full w-max transition-colors"
            >
              Upload Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* AI Chat Card */}
          <div className="lg:col-span-2 rounded-2xl bg-[#0a0a0a] border border-white/5 p-8 flex flex-col md:flex-row gap-8 items-center overflow-hidden relative group hover:border-white/10 transition-colors">
            {/* Stars background mock */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#00D47E]/5 via-transparent to-transparent opacity-50 pointer-events-none"></div>
            
            <div className="flex-1 z-10">
              <div className="w-12 h-12 bg-[#00D47E]/10 rounded-xl flex items-center justify-center mb-6 border border-[#00D47E]/20 text-[#00D47E]">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">AI Chat</h2>
              <p className="text-zinc-400 text-sm mb-8 leading-relaxed max-w-[85%]">
                Ask anything about your products, competitors, pricing and more.
              </p>
              <Link 
                href="/dashboard/chat" 
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-zinc-200 text-black font-semibold px-6 py-3 rounded-full w-max transition-colors"
              >
                Start Chat <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mock Chat UI UI Graphic */}
            <div className="flex-1 w-full relative z-10 hidden sm:block">
              <div className="bg-[#111] border border-white/10 rounded-xl p-4 shadow-2xl flex flex-col gap-4 max-w-sm ml-auto">
                {/* User Message */}
                <div className="bg-white/5 rounded-lg rounded-tr-none p-3 text-xs text-zinc-300 ml-8 border border-white/5">
                  <span className="text-[10px] text-zinc-500 block mb-1">You</span>
                  Compare our product with HubSpot
                </div>
                {/* AI Message */}
                <div className="flex gap-2 mr-8">
                  <div className="w-6 h-6 rounded-md bg-[#00D47E]/20 border border-[#00D47E]/30 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-3 h-3 text-[#00D47E]" />
                  </div>
                  <div className="bg-[#004225]/20 border border-[#00D47E]/20 rounded-lg rounded-tl-none p-3 text-xs text-zinc-300">
                    <span className="text-[10px] text-[#00D47E] block mb-1 font-medium">SellGenie AI</span>
                    Here's a detailed comparison with key differences...
                    <div className="mt-2 space-y-1">
                      <div className="h-1.5 bg-white/10 rounded w-full"></div>
                      <div className="h-1.5 bg-white/10 rounded w-4/5"></div>
                      <div className="h-1.5 bg-white/10 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* See Your Documents Stats */}
          <div className="lg:col-span-1 rounded-2xl bg-[#0a0a0a] border border-white/5 p-8 relative overflow-hidden group hover:border-white/10 transition-colors flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-[#00D47E]/10 rounded-lg flex items-center justify-center border border-[#00D47E]/20 text-[#00D47E]">
                <FileText className="w-4 h-4" />
              </div>
              <span className="font-semibold text-white">See Your Documents</span>
            </div>
            
            <div className="mt-auto mb-6">
              <div className="text-6xl font-bold text-white tracking-tight mb-2">128</div>
              <div className="text-zinc-400 font-medium">Documents</div>
            </div>

            <Link 
              href="/dashboard/document" 
              className="inline-flex items-center justify-center gap-2 bg-transparent border border-white/10 hover:bg-white/5 text-white text-sm font-medium px-4 py-2 rounded-full w-max transition-colors z-10 relative"
            >
              View All <ArrowRight className="w-3 h-3" />
            </Link>

            {/* Document graphic decoration */}
            <div className="absolute -bottom-6 -right-6 opacity-40 group-hover:opacity-60 transition-opacity">
              <FileText className="w-40 h-40 text-[#00D47E]/20 drop-shadow-[0_0_30px_rgba(0,212,126,0.2)]" />
            </div>
          </div>

          {/* Tools We Provide */}
          <div className="lg:col-span-2 rounded-2xl bg-[#0a0a0a] border border-white/5 p-8 flex flex-col hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#00D47E]/10 rounded-lg flex items-center justify-center border border-[#00D47E]/20 text-[#00D47E]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Tools We Provide</h3>
                  <p className="text-xs text-zinc-500">Powerful tools to help your sales team close more deals.</p>
                </div>
              </div>
              <button className="text-xs font-medium text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
                View All Tools <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 h-full">
              {[
                { icon: Scale, label: "Compare Competitor" },
                { icon: ClipboardList, label: "Generate Proposal" },
                { icon: Calendar, label: "Prepare for Meeting" },
                { icon: ShieldCheck, label: "Handle Objections" },
                { icon: AlignLeft, label: "Summarize Document" },
                { icon: Crosshair, label: "Extract Key Points" },
                { icon: Send, label: "Suggest Follow-ups" },
                { icon: Globe, label: "Translate Content" },
              ].map((tool, i) => (
                <div key={i} className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-colors text-center cursor-pointer">
                  <tool.icon className="w-5 h-5 text-zinc-400" />
                  <span className="text-[11px] font-medium text-zinc-300">{tool.label}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <ReviewCard />

          {/* Quick Links */}
          <div className="rounded-2xl bg-[#0a0a0a] border border-white/5 p-6 flex flex-col hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-6">
              <LinkIcon className="w-4 h-4 text-[#00D47E]" />
              <h3 className="font-semibold text-white text-sm">Quick Links</h3>
            </div>
            <div className="space-y-3">
              <Link href="/dashboard/pricing" className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 cursor-pointer transition-colors flex items-center justify-between group block">
                <div>
                  <div className="text-xs font-semibold text-[#00D47E] mb-1">Pricing</div>
                  <div className="text-[10px] text-zinc-500">View plans and features</div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </Link>
              <Link href="/dashboard/documentation" className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/5 cursor-pointer transition-colors flex items-center justify-between group block">
                <div>
                  <div className="text-xs font-semibold text-[#00D47E] mb-1">Documentation</div>
                  <div className="text-[10px] text-zinc-500">Learn how to get the most out of SellGenie</div>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
              </Link>
            </div>
          </div>

          {/* What's New */}
          <div className="rounded-2xl bg-[#0a0a0a] border border-white/5 p-6 flex flex-col hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-4 h-4 text-[#00D47E]" />
              <h3 className="font-semibold text-white text-sm">What's New</h3>
            </div>
            <div className="space-y-4 flex-1 relative before:absolute before:inset-y-0 before:left-2 before:w-px before:bg-white/10 ml-1">
              {[
                { title: "First version: SellGenie 1.0", time: "2 days ago" },
                // { title: "Improved chat accuracy", time: "5 days ago" },
                // { title: "Faster document processing", time: "1 week ago" },
              ].map((item, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-[7px] top-1.5 w-1.5 h-1.5 rounded-full bg-[#00D47E] ring-4 ring-[#0a0a0a] -translate-x-1/2"></div>
                  <div className="text-xs font-medium text-zinc-300 mb-0.5">{item.title}</div>
                  <div className="text-[10px] text-zinc-600">{item.time}</div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full text-xs font-medium text-zinc-300 bg-white/[0.02] hover:bg-white/5 border border-white/5 px-3 py-2 rounded-lg flex items-center justify-center gap-1 transition-colors">
              View All Updates <ArrowRight className="w-3 h-3" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
