"use client";

import { motion } from "framer-motion";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
            How it works
          </h2>
          <p className="text-zinc-400 text-lg">
            From raw documents to closed won in three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
          {}
          <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-[2px] bg-gradient-to-r from-transparent via-[#00D47E]/50 to-transparent"></div>

          {}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center relative z-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-2xl font-bold text-[#00D47E] mb-6 shadow-xl shadow-[#00D47E]/5">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Upload Knowledge</h3>
            <p className="text-zinc-400">
              Drag and drop your PDFs, playbooks, and competitor matrices into your secure organization workspace.
            </p>
          </motion.div>

          {}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center text-center relative z-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-[#00D47E]/30 flex items-center justify-center text-2xl font-bold text-[#00D47E] mb-6 shadow-[0_0_30px_rgba(0,212,126,0.2)]">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Processing</h3>
            <p className="text-zinc-400">
              Our pipeline automatically extracts, chunks, and creates vector embeddings of your text in milliseconds.
            </p>
          </motion.div>

          {}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col items-center text-center relative z-10"
          >
            <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-2xl font-bold text-[#00D47E] mb-6 shadow-xl shadow-[#00D47E]/5">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Ask & Generate</h3>
            <p className="text-zinc-400">
              Chat with the Copilot to get exact answers, generate proposals, or prepare for client meetings.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
