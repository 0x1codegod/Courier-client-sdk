"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletClientToEthersSigner = walletClientToEthersSigner;
const ethers_1 = require("ethers");
async function walletClientToEthersSigner(walletClient, address) {
    const eip1193Provider = {
        request: async (args) => walletClient.request(args),
    };
    const browserProvider = new ethers_1.ethers.BrowserProvider(eip1193Provider);
    const signer = await browserProvider.getSigner(address);
    // Confirm signer supports _signTypedData
    if (typeof signer._signTypedData !== "function") {
        throw new Error("Signer does not support _signTypedData");
    }
    return signer;
}
