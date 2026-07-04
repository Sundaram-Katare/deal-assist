import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-[#050505]">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Simple, transparent <span className="text-[#00D47E]">pricing</span>
        </h1>
        <p className="text-zinc-400 text-lg">
          Choose the plan that best fits your sales team's needs. Upgrade at any time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto w-full">
        
        {/* Free Plan */}
        <div className="rounded-3xl bg-[#0a0a0a] border border-white/10 p-8 md:p-10 flex flex-col hover:border-white/20 transition-all shadow-xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Starter</h2>
            <p className="text-zinc-400 text-sm h-10">Perfect for individuals wanting to test the waters with Deal Assist.</p>
          </div>
          
          <div className="mb-8 pb-8 border-b border-white/10">
            <div className="flex items-end gap-1">
              <span className="text-5xl font-bold text-white">Free</span>
            </div>
            <p className="text-zinc-500 mt-2 text-sm">Forever</p>
          </div>

          <div className="flex-1">
            <ul className="space-y-4 mb-10">
              {[
                "1 Organization Workspace",
                "Up to 5 Documents",
                "100 AI Chat Queries / month",
                "Basic Semantic Search",
                "Community Support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-300 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-zinc-500 shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="w-full py-4 rounded-xl font-semibold bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-colors">
            Current Plan
          </button>
        </div>

        {/* Paid Plan */}
        <div className="rounded-3xl bg-gradient-to-b from-[#002b18] to-[#0a0a0a] border border-[#00D47E]/40 p-8 md:p-10 flex flex-col hover:border-[#00D47E]/60 transition-all shadow-2xl relative overflow-hidden">
          {/* Glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-[#00D47E]/20 blur-[80px] rounded-full pointer-events-none"></div>
          
          <div className="absolute top-0 right-8 bg-[#00D47E] text-black text-xs font-bold px-3 py-1 rounded-b-lg">
            MOST POPULAR
          </div>

          <div className="mb-8 relative z-10">
            <h2 className="text-2xl font-bold text-white mb-2">Pro Team</h2>
            <p className="text-[#00D47E]/80 text-sm h-10">For high-velocity sales teams who need unlimited access.</p>
          </div>
          
          <div className="mb-8 pb-8 border-b border-white/10 relative z-10">
            <div className="flex items-end gap-1">
              <span className="text-3xl font-medium text-zinc-400 mb-1">₹</span>
              <span className="text-5xl font-bold text-white">19</span>
              <span className="text-zinc-400 mb-1">/mo</span>
            </div>
            <p className="text-[#00D47E]/60 mt-2 text-sm">Billed monthly</p>
          </div>

          <div className="flex-1 relative z-10">
            <ul className="space-y-4 mb-10">
              {[
                "Unlimited Workspaces",
                "Unlimited Documents & Storage",
                "Unlimited AI Chat Queries",
                "Advanced RAG Engine",
                "Generate Unlimited Proposals",
                "Priority 24/7 Support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-200 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-[#00D47E] shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <Link href="/dashboard/billing" className="w-full py-4 rounded-xl font-semibold bg-[#00D47E] hover:bg-[#00D47E]/90 text-black transition-colors text-center relative z-10">
            Upgrade to Pro
          </Link>
        </div>

      </div>
    </div>
  );
}
