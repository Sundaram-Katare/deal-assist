import Navbar from "@/sections/Navbar";
import Hero from "@/sections/Hero";
import Features from "@/sections/Features";
import HowItWorks from "@/sections/HowItWorks";
import Footer from "@/sections/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0a] font-sans selection:bg-[#00D47E]/30">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
