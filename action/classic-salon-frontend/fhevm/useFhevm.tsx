"use client";
import React from "react";
import type { Eip1193Provider } from "@/fhevm/fhevmTypes";
import { useFhevm as useRelayerFhevm } from "@/fhevm/internal/fhevm";

export function useFhevmProvider(): { provider: Eip1193Provider | undefined; chainId: number | undefined } {
  const [provider, setProvider] = React.useState<Eip1193Provider | undefined>(undefined);
  const [chainId, setChainId] = React.useState<number | undefined>(undefined);

  React.useEffect(() => {
    const eth = (window as any).ethereum as Eip1193Provider | undefined;
    if (!eth) return;
    setProvider(eth);
    eth.request({ method: "eth_chainId" }).then((cid) => setChainId(parseInt(cid as string, 16)));
    const handle = (cid: string) => setChainId(parseInt(cid as string, 16));
    (eth as any).on?.("chainChanged", handle);
    return () => (eth as any).removeListener?.("chainChanged", handle);
  }, []);

  return { provider, chainId };
}

export function useFhevmInstance(enabled = true) {
  const { provider, chainId } = useFhevmProvider();
  const relayer = useRelayerFhevm({ provider, chainId, enabled });
  return relayer;
}




