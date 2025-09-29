import fs from "fs";
import path from "path";

const ROOT = path.resolve(process.cwd(), "..");
const HARDHAT_DEPLOYMENTS_ROOT = path.resolve(ROOT, "classic-salon-hardhat", "deployments");
const FRONTEND_ABI_DIR = path.resolve(process.cwd(), "abi");

const ensureDir = (p) => { if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true }); };

function readDeployment(network) {
  const dir = path.resolve(HARDHAT_DEPLOYMENTS_ROOT, network);
  const file = path.resolve(dir, "ClassicSalon.json");
  if (!fs.existsSync(file)) return undefined;
  const data = JSON.parse(fs.readFileSync(file, "utf-8"));
  return { network, ...data };
}

function main() {
  ensureDir(FRONTEND_ABI_DIR);

  const localhost = readDeployment("localhost");
  const sepolia = readDeployment("sepolia");

  if (!localhost && !sepolia) {
    console.log("ClassicSalon not deployed on localhost or sepolia. Skip genabi.");
    return;
  }

  const gg = localhost || sepolia;
  const abiTs = `export const ClassicSalonABI = {\n  abi: ${JSON.stringify(gg.abi, null, 2)}\n};\n`;
  fs.writeFileSync(path.resolve(FRONTEND_ABI_DIR, "ClassicSalonABI.ts"), abiTs);

  const addresses = {};
  if (localhost) addresses["31337"] = { address: localhost.address, chainId: 31337, chainName: "Hardhat" };
  if (sepolia) addresses["11155111"] = { address: sepolia.address, chainId: 11155111, chainName: "Sepolia" };
  const addrTs = `export const ClassicSalonAddresses = ${JSON.stringify(addresses, null, 2)} as const;\n`;
  fs.writeFileSync(path.resolve(FRONTEND_ABI_DIR, "ClassicSalonAddresses.ts"), addrTs);

  console.log("genabi completed");
}

main();




