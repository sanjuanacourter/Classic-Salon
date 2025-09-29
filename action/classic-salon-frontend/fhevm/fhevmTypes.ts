export type Eip1193Provider = {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
};

export type FhevmEip712Signature = {
  signature: string;
  publicKey: string;
};

export type FhevmInstance = {
  generateKeypair: () => Promise<{ privateKey: string; publicKey: string }>;
  importGate: (args: { publicKey: string }) => Promise<void>;
  createEip712Signature: (args: {
    userAddress: string;
    privateKey: string;
    verifyingContract: string;
  }) => Promise<FhevmEip712Signature>;
  euint32: {
    decrypt: (args: { verifyingContract: string; signature: FhevmEip712Signature; handle: string }) => Promise<number>;
  };
};




