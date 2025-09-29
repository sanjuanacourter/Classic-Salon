import React from "react";
import { JsonRpcProvider } from "ethers";
import type { Eip1193Provider, FhevmInstance } from "@/fhevm/fhevmTypes";
import { RelayerSDKLoader, isFhevmWindowType } from "./RelayerSDKLoader";

export class FhevmAbortError extends Error {
  constructor(message = "FHEVM operation was cancelled") {
    super(message);
    this.name = "FhevmAbortError";
  }
}

type FhevmRelayerStatusType = "sdk-loading" | "sdk-loaded" | "sdk-initializing" | "sdk-initialized" | "creating";

async function getChainId(providerOrUrl: Eip1193Provider | string): Promise<number> {
  if (typeof providerOrUrl === "string") {
    const provider = new JsonRpcProvider(providerOrUrl);
    return Number((await provider.getNetwork()).chainId);
  }
  const chainId = await providerOrUrl.request({ method: "eth_chainId" });
  return Number.parseInt(chainId as string, 16);
}

type ResolveResult = { isMock: false; chainId: number; rpcUrl?: string };

async function resolve(providerOrUrl: Eip1193Provider | string): Promise<ResolveResult> {
  const chainId = await getChainId(providerOrUrl);
  let rpcUrl = typeof providerOrUrl === "string" ? providerOrUrl : undefined;
  return { isMock: false, chainId, rpcUrl };
}

function getSepoliaRpcUrl(): string {
  // 允许通过环境变量覆盖，默认使用公共节点
  const url = (process as any).env?.NEXT_PUBLIC_SEPOLIA_RPC_URL || "https://ethereum-sepolia-rpc.publicnode.com";
  return url as string;
}

export async function createFhevmInstance(parameters: {
  provider: Eip1193Provider | string;
  signal: AbortSignal;
  onStatusChange?: (status: FhevmRelayerStatusType) => void;
}): Promise<FhevmInstance> {
  const { provider: providerOrUrl, signal, onStatusChange } = parameters;
  const notify = (s: FhevmRelayerStatusType) => onStatusChange && onStatusChange(s);
  const throwIfAborted = () => { if (signal.aborted) throw new FhevmAbortError(); };

  const { chainId } = await resolve(providerOrUrl);

  if (!isFhevmWindowType(window)) {
    notify("sdk-loading");
    const loader = new RelayerSDKLoader({ cdn: (process as any).env?.NEXT_PUBLIC_FHEVM_SDK_CDN });
    await loader.load();
    throwIfAborted();
    notify("sdk-loaded");
  }

  notify("sdk-initializing");
  // @ts-ignore
  const ok = await window.relayerSDK.initSDK();
  if (!ok) throw new Error("FHEVM SDK init failed");
  throwIfAborted();
  notify("sdk-initialized");

  // @ts-ignore
  const relayerSDK = window.relayerSDK;
  // 使用钱包提供的 EIP-1193 Provider，避免浏览器直接访问 RPC 的 CORS/限流问题
  const config = { ...relayerSDK.SepoliaConfig, network: providerOrUrl };
  notify("creating");
  const instance = await relayerSDK.createInstance(config);
  throwIfAborted();
  return instance as FhevmInstance;
}

export type FhevmGoState = "idle" | "loading" | "ready" | "error";

export function useFhevm(parameters: {
  provider: Eip1193Provider | undefined;
  chainId: number | undefined;
  enabled?: boolean;
}): { instance: FhevmInstance | undefined; refresh: () => void; error: Error | undefined; status: FhevmGoState } {
  const { provider, chainId, enabled = true } = parameters;

  const [instance, setInstance] = React.useState<FhevmInstance | undefined>(undefined);
  const [status, setStatus] = React.useState<FhevmGoState>("idle");
  const [error, setError] = React.useState<Error | undefined>(undefined);
  const initializingRef = React.useRef<boolean>(false);

  const refresh = React.useCallback(() => {
    initializingRef.current = false;
    setInstance(undefined);
    setError(undefined);
    setStatus("idle");
  }, []);

  React.useEffect(() => {
    if (!enabled || !provider || initializingRef.current) {
      return;
    }

    initializingRef.current = true;
    setStatus("loading");
    setError(undefined);

    const initAsync = async () => {
      try {
        const abortController = new AbortController();
        const inst = await createFhevmInstance({ provider: provider!, signal: abortController.signal });
        setInstance(inst);
        setStatus("ready");
      } catch (e) {
        setError(e as Error);
        setStatus("error");
      } finally {
        initializingRef.current = false;
      }
    };

    initAsync();
  }, [enabled, provider, chainId]);

  return { instance, refresh, error, status };
}


