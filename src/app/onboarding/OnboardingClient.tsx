"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { joinOrganization, createOrganization } from "./actions";

export default function OnboardingClient() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"join" | "create">("join");
  const [orgCode, setOrgCode] = useState("");
  const [orgName, setOrgName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await joinOrganization(orgCode);
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Failed to join organization");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await createOrganization(orgName);
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans text-white relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />

      <div className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Almost there</h1>
          <p className="text-zinc-400 text-sm">Join an existing organization or create a new one</p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        <div className="flex bg-black/50 p-1 rounded-lg mb-6 border border-white/10">
          <button
            onClick={() => {
              setActiveTab("join");
              setError("");
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "join" ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Join Organization
          </button>
          <button
            onClick={() => {
              setActiveTab("create");
              setError("");
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
              activeTab === "create" ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Create New
          </button>
        </div>

        {activeTab === "join" ? (
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Organization Code (ID)</label>
              <input
                type="text"
                value={orgCode}
                onChange={(e) => setOrgCode(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-white placeholder:text-zinc-500"
                placeholder="Enter 25-character code"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Joining..." : "Join"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-white placeholder:text-zinc-500"
                placeholder="Acme Corp"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Organization"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
