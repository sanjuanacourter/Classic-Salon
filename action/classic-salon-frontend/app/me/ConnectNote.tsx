"use client";
import React from "react";

export function ConnectNote() {
  const [connected, setConnected] = React.useState(false);
  React.useEffect(() => {
    const eth = (window as any).ethereum as any;
    if (!eth) return;
    eth.request({ method: "eth_accounts" }).then((accs: string[]) => setConnected(!!accs?.[0]));
  }, []);
  if (connected) return null;
  return (
    <div className="card p-4 text-sm text-ink/80">
      Wallet not connected. Some actions require MetaMask.
    </div>
  );
}


