# ClassicSalon – 世界名著鉴赏（FHE 版）

基于 FHEVM 的隐私保护名著鉴赏 DApp。与“艺术品上链展览”相同技术路线，但合约方法与前端 UI 全面更名重构，主题切换为世界名著。

## 目录

- `classic-salon-hardhat`：Solidity 合约（SepoliaConfig），Hardhat 部署脚本
- `classic-salon-frontend`：Next.js 前端（全新 UI），Relayer SDK 集成

## 快速开始（Sepolia）

1) 在 `classic-salon-hardhat/.env` 写入（请使用你自己的密钥与 API Key，切勿提交到仓库）：

```
PRIVATE_KEY=
SEPOLIA_RPC_URL=
ETHERSCAN_API_KEY=
```

2) 部署合约到 Sepolia：

```bash
cd classic-salon-hardhat
npm install
npx hardhat compile
npm run deploy:sepolia
```

部署完成后，地址与 ABI 会写入 `classic-salon-hardhat/deployments/sepolia/ClassicSalon.json`。

3) 生成前端 ABI 与地址映射：

```bash
cd ../classic-salon-frontend
npm install
npm run genabi
```

生成文件：`abi/ClassicSalonABI.ts` 与 `abi/ClassicSalonAddresses.ts`。

4) 启动前端（Relayer SDK 模式）：

```bash
npm run dev:sepolia
```

浏览器使用 MetaMask 切换到 Sepolia 网络即可。

## 合约方法（已改名）
- `submitWork(title, synopsisHash, contentHash, string[] tags, string[] genres)`：提交名著
- `applaudWork(workId)`：鼓掌（点赞计数 +1）
- `endorseWorkInGenre(workId, genre)`：按题材背书（投票 +1）
- `readWork(workId)`：读取作品与鼓掌句柄
- `listAllWorks()`：列出全部作品 ID
- `readEndorsements(workId, genre)`：读取题材背书计数句柄

## 前端页面
- `/`：书房首页（全新视觉）
- `/submit`：收录名著
- `/charts`：题材榜单（支持一键解密该题材票数）
- `/me`：我的书架

## 常见问题
- 如果前端提示“未找到合约地址”，请确认已完成部署并执行 `npm run genabi`。
- 若 FHEVM SDK 初始化失败，刷新后重试；或检查浏览器是否屏蔽了第三方脚本加载。




