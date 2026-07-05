"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00D47E]/20 rounded-full blur-[120px] opacity-50 pointer-events-none"></div>
      
      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 text-sm mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-[#00D47E] animate-pulse"></span>
          Deal Assist v2.0 is live
        </motion.div> */}

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold text-white tracking-tight max-w-4xl leading-tight mb-6"
        >
          Your team's AI Copilot <br className="hidden md:block" />
          for <span className="text-[#00D47E]">Smarter Sales</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed"
        >
          Upload your sales knowledge, product docs, and competitor insights. 
          Empower your sales team with instant AI-powered answers.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <Link 
            href="/sign-up" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#00D47E] hover:bg-[#00D47E]/90 text-black font-semibold transition-all flex items-center justify-center gap-2 group"
          >
            Start Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          {/* <Link 
            href="/contact" 
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold transition-all flex items-center justify-center"
          >
            Book Demo
          </Link> */}
        </motion.div>
      </div>
    </section>
  );
}