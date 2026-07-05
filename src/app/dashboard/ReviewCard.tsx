"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { submitFeedback } from "./actions";

export default function ReviewCard() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    setIsSubmitting(true);
    try {
      await submitFeedback(rating, text);
      setSubmitted(true);
      setTimeout(() => {
        setIsOpen(false);
        // Reset state after animation
        setTimeout(() => {
          setSubmitted(false);
          setRating(0);
          setText("");
        }, 300);
      }, 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsOpen(true)}
        className="lg:col-span-2 rounded-2xl bg-[#0a0a0a] border border-white/5 p-6 flex flex-col hover:border-[#00D47E]/30 hover:bg-[#00D47E]/5 transition-all cursor-pointer group relative overflow-hidden"
      >
        <div className="absolute -right-6 -top-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <Star className="w-32 h-32 text-[#00D47E]" />
        </div>
        
        <div className="flex items-center gap-2 mb-4 relative z-10">
          <Star className="w-5 h-5 text-[#00D47E]" />
          <h3 className="font-semibold text-white text-lg">Rate Your Experience</h3>
        </div>
        <p className="text-sm text-zinc-400 mb-6 relative z-10 max-w-sm">
          We are constantly improving SellGenie. Let us know how we're doing and what features you'd love to see next.
        </p>
        
        <div className="mt-auto flex items-center justify-between relative z-10">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 text-zinc-600 group-hover:text-[#00D47E]/40 transition-colors" />
            ))}
          </div>
          <span className="text-xs font-medium text-[#00D47E] bg-[#00D47E]/10 px-3 py-1.5 rounded-full">
            Leave a Review
          </span>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 relative">
            <button 
              onClick={() => !isSubmitting && setIsOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
            >
              ✕
            </button>
            
            <div className="p-6 text-center border-b border-white/5">
              <h2 className="text-xl font-bold text-white mb-2">How are we doing?</h2>
              <p className="text-sm text-zinc-400">Your feedback helps us build a better product.</p>
            </div>
            
            {submitted ? (
              <div className="p-12 flex flex-col items-center justify-center text-center animate-in zoom-in">
                <div className="w-16 h-16 bg-[#00D47E]/20 rounded-full flex items-center justify-center text-[#00D47E] mb-4">
                  ✓
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">Thank You!</h3>
                <p className="text-sm text-zinc-400">Your feedback has been received.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      className="transition-transform hover:scale-110 focus:outline-none"
                      onMouseEnter={() => setHoverRating(i)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(i)}
                    >
                      <Star 
                        className={`w-10 h-10 transition-colors ${
                          i <= (hoverRating || rating) 
                            ? "text-[#00D47E] fill-[#00D47E]" 
                            : "text-zinc-700"
                        }`} 
                      />
                    </button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-medium text-zinc-400">Additional Feedback (Optional)</label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="What do you like? What could be better?"
                    className="w-full bg-[#111] border border-white/10 rounded-xl p-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-[#00D47E] focus:ring-1 focus:ring-[#00D47E] transition-all resize-none h-24"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={rating === 0 || isSubmitting}
                  className="w-full bg-[#00D47E] hover:bg-[#00D47E]/90 text-black font-semibold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
