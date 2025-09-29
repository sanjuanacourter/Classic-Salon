"use client";
import React from "react";
import { useClassicSalonRead } from "@/hooks/useClassicSalon";

export default function ChartsPage() {
  const { allWorks, selectedGenre, setSelectedGenre, decryptAllForGenre, decryptedScores, loading, fhevmStatus, message } = useClassicSalonRead();

  return (
    <div className="space-y-6">
      <div className="text-2xl">Classics Genre Chart</div>
      <div className="card p-6 space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <input className="rounded-lg border border-gold/40 px-3 py-2 bg-white/80" placeholder="Enter genre, e.g. Realism" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} />
          <button className="btn btn-ghost" onClick={decryptAllForGenre} disabled={!selectedGenre || loading || fhevmStatus !== "ready"}>{loading ? "Decrypting..." : "Decrypt votes for genre"}</button>
        </div>
        <div className="text-xs text-ink/60">FHEVM status: {fhevmStatus}</div>
        {message && (
          <div className="text-sm">
            {message}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allWorks.map((w) => (
            <div key={w.id} className="card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{w.title}</div>
                  <div className="text-xs text-ink/60">#{w.id}</div>
                </div>
                <div className="pill">{decryptedScores[w.id] === undefined ? "🔒" : `${decryptedScores[w.id]} votes`}</div>
              </div>
              <div className="mt-3 text-xs text-ink/60">Genres: {w.genres.join(", ")}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


