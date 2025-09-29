"use client";
import React from "react";
import { useClassicSalon } from "@/hooks/useClassicSalon";

export default function SubmitPage() {
  const {
    title,
    synopsisHash,
    contentHash,
    tags,
    genres,
    setTitle,
    setSynopsisHash,
    setContentHash,
    setTags,
    setGenres,
    submit,
    submitting,
  } = useClassicSalon();

  return (
    <div className="space-y-6">
      <div className="text-2xl">Submit a Classic</div>
      <div className="card p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-ink/70">Title</label>
            <input className="w-full rounded-lg border border-gold/40 px-3 py-2 bg-white/80" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-ink/70">Synopsis Hash</label>
            <input className="w-full rounded-lg border border-gold/40 px-3 py-2 bg-white/80" value={synopsisHash} onChange={(e) => setSynopsisHash(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-ink/70">Content Hash</label>
            <input className="w-full rounded-lg border border-gold/40 px-3 py-2 bg-white/80" value={contentHash} onChange={(e) => setContentHash(e.target.value)} />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-ink/70">Tags (comma separated)</label>
            <input className="w-full rounded-lg border border-gold/40 px-3 py-2 bg-white/80" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-ink/70">Genres (comma separated)</label>
          <input className="w-full rounded-lg border border-gold/40 px-3 py-2 bg-white/80" value={genres} onChange={(e) => setGenres(e.target.value)} />
        </div>
        <div>
          <button className="btn btn-primary" onClick={submit} disabled={submitting}>{submitting ? "Submitting..." : "Confirm Submit"}</button>
        </div>
      </div>
    </div>
  );
}


