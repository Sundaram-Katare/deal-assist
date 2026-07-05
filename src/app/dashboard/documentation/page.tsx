
import { BookOpen } from "lucide-react";

export default function Documentation() {
    return (
        <div className="bg-[#050505] h-full w-full flex flex-col items-center justify-center p-8">
            <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-[#00D47E]/20 blur-3xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-[#00D47E]/10 border border-[#00D47E]/20 flex items-center justify-center relative z-10 transition-transform duration-500 group-hover:scale-105">
                    <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-[#00D47E]" />
                </div>
            </div>

            <h1 className="text-white text-3xl sm:text-4xl font-bold tracking-tight mb-4 text-center">
                Documentation is <span className="text-[#00D47E]">coming soon</span>...
            </h1>
            <p className="text-zinc-400 text-center max-w-md">
                We're actively building comprehensive guides and tutorials to help you master Deal Assist. Stay tuned!
            </p>
        </div>
    )
}