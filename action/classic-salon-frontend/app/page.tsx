"use client";
import React from "react";
import Link from "next/link";
import { useClassicSalonRead } from "@/hooks/useClassicSalon";

export default function HomePage() {
  const { allWorks, applaud, endorse, decryptApplause, applauses, fhevmStatus } = useClassicSalonRead();
  return (
    <div className="space-y-10">
      <section className="card p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl">World Classics Library</h1>
          <p className="text-ink/80">
            Collect and endorse your favorite classics in a privacy-first library. FHE protects your numbers, and votes are recorded on-chain.
          </p>
          <div className="flex gap-3">
            <Link className="btn btn-primary" href="/submit">Submit a Classic</Link>
            <Link className="btn btn-ghost" href="/charts">View Charts</Link>
          </div>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/30 to-burgundy/20 rounded-xl" />
          <div className="relative h-48 md:h-full rounded-xl border border-gold/40 grid place-items-center text-burgundy/80">
            FHE · Sepolia · Classic Salon
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Encrypted Applause", desc: "Applause counts are stored as FHE-encrypted values and decrypted only with permission." },
          { title: "Genre Endorsement", desc: "Endorse only within the work's genres for fair charts." },
          { title: "Anonymous & Immutable", desc: "On-chain records are immutable while respecting creators' privacy." },
        ].map((f) => (
          <div key={f.title} className="card p-6 space-y-2">
            <div className="text-lg text-burgundy">{f.title}</div>
            <div className="text-ink/70 text-sm">{f.desc}</div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="text-xl">Latest Submissions</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {allWorks.map((w) => (
            <div key={w.id} className="card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{w.title}</div>
                  <div className="text-xs text-ink/60">#{w.id} · {w.genres.join("、")}</div>
                </div>
                <div className="pill">{applauses[w.id] ?? "🔒"}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                {w.tags.map((t) => (<span key={t} className="pill">{t}</span>))}
              </div>
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-ghost" onClick={() => applaud(w.id)}>Applaud</button>
                <button className="btn btn-ghost" onClick={() => decryptApplause(w.id)} disabled={fhevmStatus !== "ready"}>Decrypt Applause</button>
                {w.genres.slice(0, 3).map((g) => (
                  <button key={g} className="btn btn-primary" onClick={() => endorse(w.id, g)}>Endorse “{g}”</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}


