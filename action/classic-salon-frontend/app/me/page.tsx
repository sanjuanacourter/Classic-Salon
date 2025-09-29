"use client";
import React from "react";
import { useClassicSalonRead } from "@/hooks/useClassicSalon";
import { ConnectNote } from "./ConnectNote";

export default function MePage() {
  const { myAddress, myWorks } = useClassicSalonRead();

  return (
    <div className="space-y-6">
      <div className="text-2xl">My Shelf</div>
      <ConnectNote />
      <div className="card p-6">
        <div className="text-sm text-ink/70">Address: {myAddress || "Not connected"}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {myWorks.map((w) => (
          <div key={w.id} className="card p-4">
            <div className="font-medium">{w.title}</div>
            <div className="text-xs text-ink/60">Genres: {w.genres.join(", ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


