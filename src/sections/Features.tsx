"use client";

import { motion } from "framer-motion";
import { Database, Zap, Shield, FileText, Search, Users } from "lucide-react";

const features = [
  {
    title: "Instant Document Parsing",
    description: "Upload PDFs, playbooks, and battlecards. We instantly chunk and vectorize them for rapid retrieval.",
    icon: <FileText className="w-6 h-6 text-[#00D47E]" />
  },
  {
    title: "Semantic AI Search",
    description: "Ask questions naturally. Our RAG engine finds the exact paragraphs needed to answer your query.",
    icon: <Search className="w-6 h-6 text-[#00D47E]" />
  },
  {
    title: "Multi-Tenant Architecture",
    description: "Your data is strictly isolated by organization. Nobody else can access your competitive insights.",
    icon: <Shield className="w-6 h-6 text-[#00D47E]" />
  },
  {
    title: "Sales Workflows",
    description: "Generate structured proposals, handle objections, and prepare for meetings with a single click.",
    icon: <Zap className="w-6 h-6 text-[#00D47E]" />
  },
  {
    title: "Persistent Chat History",
    description: "Never lose context. Your conversations are securely saved and can be resumed at any time.",
    icon: <Database className="w-6 h-6 text-[#00D47E]" />
  },
  {
    title: "Team Collaboration",
    description: "Invite your entire sales org. Share the same knowledge base and close deals faster, together.",
    icon: <Users className="w-6 h-6 text-[#00D47E]" />
  }
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-[#0a0a0a] relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Everything you need to <span className="text-[#00D47E]">win</span>
          </h2>
          <p className="text-zinc-400 text-lg">
            A complete platform designed specifically for high-velocity sales teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all group"
            >
              <div className="w-12 h-12 bg-[#00D47E]/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
