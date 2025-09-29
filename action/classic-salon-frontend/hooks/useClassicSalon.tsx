"use client";
import React from "react";
import { ethers } from "ethers";
import { useFhevmInstance } from "@/fhevm/useFhevm";
import { ClassicSalonABI } from "@/abi/ClassicSalonABI";
import { ClassicSalonAddresses } from "@/abi/ClassicSalonAddresses";
import type { FhevmEip712Signature } from "@/fhevm/fhevmTypes";

function useWallet() {
  const [address, setAddress] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    const eth = (window as any).ethereum as any;
    if (!eth) return;
    eth.request({ method: "eth_requestAccounts" }).then((accounts: string[]) => setAddress(accounts?.[0]));
  }, []);
  return { address };
}

function getContractAddressByChain(chainId: number | undefined): string | undefined {
  if (!chainId) return undefined;
  const record = (ClassicSalonAddresses as any)[String(chainId)];
  return record?.address as string | undefined;
}

export function useClassicSalon() {
  const { address } = useWallet();
  const { instance, status } = useFhevmInstance(true);
  const [title, setTitle] = React.useState("");
  const [synopsisHash, setSynopsisHash] = React.useState("");
  const [contentHash, setContentHash] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [genres, setGenres] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const submit = React.useCallback(async () => {
    setSubmitting(true);
    try {
      const eth = (window as any).ethereum;
      const provider = new ethers.BrowserProvider(eth);
      const signer = await provider.getSigner();
      const { chainId } = await provider.getNetwork();
      const contractAddress = getContractAddressByChain(Number(chainId));
      if (!contractAddress) throw new Error("未找到合约地址，请先部署并生成 ABI");
      const contract = new ethers.Contract(contractAddress, ClassicSalonABI.abi, signer);
      const tx = await contract.submitWork(
        title,
        synopsisHash,
        contentHash,
        tags.split(",").map((s) => s.trim()).filter(Boolean),
        genres.split(",").map((s) => s.trim()).filter(Boolean)
      );
      await tx.wait();
      setTitle(""); setSynopsisHash(""); setContentHash(""); setTags(""); setGenres("");
    } finally {
      setSubmitting(false);
    }
  }, [title, synopsisHash, contentHash, tags, genres]);

  return {
    address,
    title, setTitle,
    synopsisHash, setSynopsisHash,
    contentHash, setContentHash,
    tags, setTags,
    genres, setGenres,
    submit, submitting,
    status,
  };
}

type Work = {
  id: number;
  contributor: string;
  title: string;
  synopsisHash: string;
  contentHash: string;
  tags: string[];
  genres: string[];
  applauseHandle?: string;
};

export function useClassicSalonRead() {
  const { address } = useWallet();
  const { instance, status } = useFhevmInstance(true);
  const [allWorks, setAllWorks] = React.useState<Work[]>([]);
  const [selectedGenre, setSelectedGenre] = React.useState("");
  const [decryptedScores, setDecryptedScores] = React.useState<Record<number, number>>({});
  const [loading, setLoading] = React.useState(false);
  const [applauses, setApplauses] = React.useState<Record<number, number>>({});
  const [message, setMessage] = React.useState<string>("");

  const refresh = React.useCallback(async () => {
    try {
      const eth = (window as any).ethereum;
      const provider = new ethers.BrowserProvider(eth);
      const { chainId } = await provider.getNetwork();
      const contractAddress = getContractAddressByChain(Number(chainId));
      if (!contractAddress) return;
      const contract = new ethers.Contract(contractAddress, ClassicSalonABI.abi, provider);
      const ids: bigint[] = await contract.listAllWorks();
      const works: Work[] = [];
      for (const id of ids) {
        const r = await contract.readWork(id);
        works.push({
          id: Number(r[0]),
          contributor: r[1],
          title: r[2],
          synopsisHash: r[3],
          contentHash: r[4],
          tags: r[5],
          genres: r[6],
          applauseHandle: r[8]?.toString?.() ?? undefined,
        });
      }
      setAllWorks(works);
    } catch (e) {
      // noop
    }
  }, []);

  React.useEffect(() => { refresh(); }, [refresh]);

  const decryptAllForGenre = React.useCallback(async () => {
    if (!selectedGenre) { setMessage("Please enter a genre keyword"); return; }
    if (!instance) { setMessage("FHEVM not ready, please try again later"); return; }
    setLoading(true);
    setMessage("");
    try {
      const eth = (window as any).ethereum;
      // 主动请求连接钱包，避免 getSigner 失败
      await eth?.request?.({ method: "eth_requestAccounts" }).catch(() => {});
      const provider = new ethers.BrowserProvider(eth);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      const { chainId } = await provider.getNetwork();
      const verifyingContract = getContractAddressByChain(Number(chainId));
      if (!verifyingContract) { setMessage("Contract address not found. Please deploy and generate ABI"); return; }
      const contract = new ethers.Contract(verifyingContract, ClassicSalonABI.abi, provider);

      const { privateKey, publicKey } = await instance.generateKeypair();
      await instance.importGate({ publicKey });

      const eip712: FhevmEip712Signature = await instance.createEip712Signature({ userAddress, privateKey, verifyingContract });

      const scores: Record<number, number> = {};
      let validCount = 0;
      for (const w of allWorks) {
        const handle = await contract.readEndorsements(w.id, selectedGenre);
        const handleHex: string = (typeof handle === "string" ? handle : handle?.toString?.()) ?? "0x";
        if (handleHex === "0x" || /^0x0+$/.test(handleHex)) { scores[w.id] = 0; continue; }
        const plain = await instance.euint32.decrypt({ verifyingContract, signature: eip712, handle: handleHex });
        scores[w.id] = plain || 0;
        validCount++;
      }
      setDecryptedScores(scores);
      setMessage(validCount === 0 ? "No votes for this genre yet" : `✅ Decrypted successfully. ${validCount} encrypted counts processed`);
    } catch (e: any) {
      setMessage("❌ Decryption failed: " + (e?.message ?? String(e)));
    } finally {
      setLoading(false);
    }
  }, [instance, selectedGenre, allWorks]);

  const myWorks = React.useMemo(() => allWorks.filter((w) => w.contributor?.toLowerCase() === address?.toLowerCase()), [allWorks, address]);

  const applaud = React.useCallback(async (workId: number) => {
    const eth = (window as any).ethereum;
    const provider = new ethers.BrowserProvider(eth);
    const signer = await provider.getSigner();
    const { chainId } = await provider.getNetwork();
    const contractAddress = getContractAddressByChain(Number(chainId));
    if (!contractAddress) throw new Error("Contract address not found. Please deploy and generate ABI");
    const contract = new ethers.Contract(contractAddress, ClassicSalonABI.abi, signer);
    const tx = await contract.applaudWork(workId);
    await tx.wait();
    await refresh();
  }, [refresh]);

  const endorse = React.useCallback(async (workId: number, genre: string) => {
    const eth = (window as any).ethereum;
    const provider = new ethers.BrowserProvider(eth);
    const signer = await provider.getSigner();
    const { chainId } = await provider.getNetwork();
    const contractAddress = getContractAddressByChain(Number(chainId));
    if (!contractAddress) throw new Error("Contract address not found. Please deploy and generate ABI");
    const contract = new ethers.Contract(contractAddress, ClassicSalonABI.abi, signer);
    const tx = await contract.endorseWorkInGenre(workId, genre);
    await tx.wait();
    // 不强制刷新，用户可手动解密查看最新票数
  }, []);

  const decryptApplause = React.useCallback(async (workId: number) => {
    if (!instance) { return; }
    const work = allWorks.find((w) => w.id === workId);
    if (!work || !work.applauseHandle) return;
    const eth = (window as any).ethereum;
    const provider = new ethers.BrowserProvider(eth);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    const { chainId } = await provider.getNetwork();
    const verifyingContract = getContractAddressByChain(Number(chainId));
    if (!verifyingContract) return;

    const { privateKey, publicKey } = await instance.generateKeypair();
    await instance.importGate({ publicKey });
    const eip712: FhevmEip712Signature = await instance.createEip712Signature({ userAddress, privateKey, verifyingContract });
    const plain = await instance.euint32.decrypt({ verifyingContract, signature: eip712, handle: work.applauseHandle });
    setApplauses((m) => ({ ...m, [workId]: plain || 0 }));
  }, [instance, allWorks]);

  return { 
    myAddress: address,
    myWorks,
    allWorks,
    selectedGenre,
    setSelectedGenre,
    decryptAllForGenre,
    decryptedScores,
    decryptApplause,
    applauses,
    applaud,
    endorse,
    loading,
    fhevmStatus: status,
    message,
  };
}


