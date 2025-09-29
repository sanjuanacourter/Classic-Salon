export function isFhevmWindowType(windowObj: any): windowObj is Window & { relayerSDK?: any } {
  return typeof windowObj !== "undefined" && typeof (windowObj as any).relayerSDK !== "undefined";
}

export class RelayerSDKLoader {
  constructor(private options: { cdn?: string } = {}) {}

  private inject(url: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = url;
      script.type = "text/javascript";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load relayer sdk from ${url}`));
      document.head.appendChild(script);
    });
  }

  async load(): Promise<void> {
    if (isFhevmWindowType(window)) return;

    // 首选 Zama 官方 CDN（UMD 版本会挂载 window.relayerSDK）
    const candidates = [
      this.options.cdn,
      "https://cdn.zama.ai/relayer-sdk-js/0.2.0/relayer-sdk-js.umd.cjs",
      // 备用公共 CDN（部分环境可能不会挂载全局变量）
      "https://cdn.jsdelivr.net/npm/@zama-fhe/relayer-sdk@0.2.0/dist/index.umd.js",
      "https://unpkg.com/@zama-fhe/relayer-sdk@0.2.0/dist/index.umd.js",
    ].filter(Boolean) as string[];

    for (const url of candidates) {
      try {
        await this.inject(url);
        if (isFhevmWindowType(window)) return;
      } catch (e) {
        // try next
      }
    }
    throw new Error("Failed to load FHEVM Relayer SDK");
  }
}


