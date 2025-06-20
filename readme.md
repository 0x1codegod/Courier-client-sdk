# Courier Client SDK

A lightweight TypeScript SDK for signing EIP-712 `permit` meta-transactions and sending them to a relayer backend — built for seamless gasless user experiences using WalletConnect or any EVM-compatible wallet.

[![npm version](https://img.shields.io/npm/v/courier-client-sdk)](https://www.npmjs.com/package/courier-client-sdk)
[![GitHub](https://img.shields.io/badge/source-github-blue)](https://github.com/0x1codegod/Courier-client-sdk)

---

## ✨ Features

* 🔐 Sign EIP-712 permit transaction
* 📡 Relay signed transaction onchain
* 🔁 Works with WalletConnect & other EVM-compatible wallets
* ⚡ Built with Ethers.js and TypeScript

---

## 📦 Installation

```bash
npm install courier-client-sdk
# or
yarn add courier-client-sdk
```

---

## 🚀 Usage

### 1. Sign a Permit

```ts
import { signPermitTypedData, submitSignedPermitData} from "courier-client-sdk";
import { useWalletClient } from "wagmi";


const { data: walletClient } = useWalletClient();

const result = await signPermitTypedData({
  token: "0xTokenAddress",
  owner: "0xTokenOwnerAddress",
  amount: BigInt(1000),
  deadline: BigInt(Date.now() + 3600 * 1000),
  walletClient
});

console.log(result); // { v, r, s, deadline }
```

### 2. Send to courier handler

```ts
const tx = await submitSignedPermitData({
    token: "0xTokenAddress",
    owner: "0xTokenOwnerAddress",
    recipient: "0xBeneficiaryAddresss",
    amount: BigInt(1000),
    result.deadline,
    result.v, 
    result.r, 
    result.s,
});
const {hash} = await tx.json();
console.log(hash);
```
---

## 📁 Project Structure

```bash
src/
  ├── signPermitTypedData.ts
  ├── sendPermitToBackend.ts
  └── erc20Permit.ts
dist/
  └── (generated on build)
```

---

## 💠 Development

```bash
git clone https://github.com/0x1codegod/Courier-client-sdk.git
cd Courier-client-sdk
npm install
npm run build
```

---

## 📄 License

MIT © [0x1codegod](https://github.com/0x1codegod)
Twitter/X [@ShedrackTheDev](https://x.com/ShedrackTheDev)