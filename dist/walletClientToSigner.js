"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletClientToEthersSigner = walletClientToEthersSigner;
const ethers_1 = require("ethers");
// Convert viem WalletClient to EIP-1193-compatible provider and get a signer that supports _signTypedData
async function walletClientToEthersSigner(walletClient, address) {
    const eip1193Provider = {
        request: async ({ method, params }) => walletClient.request({ method, params }),
    };
    const provider = new ethers_1.BrowserProvider(eip1193Provider);
    const signer = await provider.getSigner(address);
    // Optionally assert that _signTypedData exists (for TypeScript type safety)
    return signer;
}
