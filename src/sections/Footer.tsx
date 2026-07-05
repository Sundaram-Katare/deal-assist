import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#050505] py-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="SellGenie Logo" width={24} height={24} className="rounded-md object-contain" />
            <span className="text-lg font-bold text-white tracking-tight">SellGenie</span>
          </div>

          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
        <div className="mt-8 text-center text-zinc-600 text-xs">
          &copy; {new Date().getFullYear()} SellGenie. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
