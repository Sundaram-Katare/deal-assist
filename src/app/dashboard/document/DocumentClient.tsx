"use client";

import { useState } from "react";
import { uploadDocument } from "./actions";

interface DocumentClientProps {
  initialDocuments: any[];
}

export default function DocumentClient({ initialDocuments }: DocumentClientProps) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [sourceType, setSourceType] = useState("pricing");

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("sourceType", sourceType);

      
      const optimisticDoc = {
        id: "temp-" + Date.now(),
        title: file.name,
        sourceType,
        status: "processing",
        chunkCount: 0,
        createdAt: new Date(),
      };
      setDocuments([optimisticDoc, ...documents]);

      const res = await uploadDocument(formData);
      
      if (res.error) {
        setError(res.error);
        
        setDocuments(docs => docs.filter(d => d.id !== optimisticDoc.id));
      } else {
        
        
        window.location.reload(); 
      }
    } catch (err) {
      setError("Failed to upload document");
    } finally {
      setLoading(false);
      setFile(null);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8">
      {}
      <div className="md:col-span-1 p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm h-fit">
        <h2 className="text-xl font-medium mb-4">Upload New</h2>
        
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Select File</label>
            <input
              type="file"
              accept=".pdf,.docx,.txt,.md"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm text-zinc-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all cursor-pointer"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Source Type</label>
            <select
              value={sourceType}
              onChange={(e) => setSourceType(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/50 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none text-white appearance-none"
            >
              <option value="pricing">Pricing</option>
              <option value="playbook">Playbook</option>
              <option value="faq">FAQ</option>
              <option value="case_study">Case Study</option>
              <option value="battlecard">Battlecard</option>
              <option value="general">General</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={!file || loading}
            className="w-full py-3 px-4 rounded-lg bg-[#00D47E] hover:bg-[#00D47E]/50 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Upload & Ingest"}
          </button>
        </form>
      </div>

      {}
      <div className="md:col-span-2 space-y-4">
        <h2 className="text-xl font-medium mb-4">Organization Documents</h2>
        {documents.length === 0 ? (
          <div className="p-8 text-center rounded-xl border border-dashed border-white/20 text-zinc-500">
            No documents uploaded yet. Upload one to get started!
          </div>
        ) : (
          <div className="grid gap-4">
            {documents.map((doc: any) => (
              <div key={doc.id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between transition-all hover:bg-white/10">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${doc.status === 'ready' ? 'bg-green-500/20 text-green-400' : doc.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white truncate max-w-[200px] sm:max-w-xs">{doc.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-zinc-400 mt-1">
                      <span className="uppercase tracking-wider font-semibold">{doc.sourceType}</span>
                      <span>•</span>
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      {doc.chunkCount > 0 && (
                        <>
                          <span>•</span>
                          <span>{doc.chunkCount} chunks</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs px-2 py-1 rounded-full border ${doc.status === 'ready' ? 'border-green-500/30 text-green-400 bg-green-500/10' : doc.status === 'failed' ? 'border-red-500/30 text-red-400 bg-red-500/10' : 'border-blue-500/30 text-blue-400 bg-blue-500/10'}`}>
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
