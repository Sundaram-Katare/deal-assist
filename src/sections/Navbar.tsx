"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/5"
    >
      <div className="flex items-center gap-2">
        <Image src="/logo.png" alt="SellGenie Logo" width={32} height={32} className="rounded-lg object-contain" />
        <span className="text-xl font-bold text-white tracking-tight">Sell<span className="text-[#00D47E]">Genie</span></span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
        <Link href="#features" className="hover:text-white transition-colors">Features</Link>
        <Link href="#how-it-works" className="hover:text-white transition-colors">How it works</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/sign-in" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
          Log in
        </Link>
        <Link href="/sign-up" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors">
          Start Free
        </Link>
      </div>
    </motion.nav>
  );
}
