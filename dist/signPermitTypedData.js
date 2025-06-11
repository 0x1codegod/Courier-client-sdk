"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signPermitTypedData = signPermitTypedData;
const erc20Permit_1 = require("./erc20Permit");
const viem_1 = require("viem");
const actions_1 = require("viem/actions");
async function signPermitTypedData(input) {
    const { owner, token, amount, deadline, walletClient } = input;
    if (!walletClient) {
        throw new Error("Signer must have an associated provider");
    }
    const relayer = "0xbbA56A5173E8cA4CBF0bfc6f5e9DeDb00bb6F4F2";
    const chainId = await walletClient.getChainId();
    const publicClient = (0, viem_1.createPublicClient)({
        chain: walletClient.chain,
        transport: (0, viem_1.custom)(walletClient.transport),
    });
    const tokenName = await publicClient.readContract({
        address: token,
        abi: erc20Permit_1.TOKEN_ABI,
        functionName: "name",
    });
    const nonce = await publicClient.readContract({
        address: token,
        abi: erc20Permit_1.TOKEN_ABI,
        functionName: "nonces",
        args: [owner],
    });
    if (nonce === undefined || nonce === null) {
        throw new Error("Failed to fetch nonce");
    }
    const domain = {
        name: tokenName,
        version: "1",
        chainId: chainId,
        verifyingContract: token
    };
    const types = {
        Permit: [
            { name: "owner", type: "address" },
            { name: "spender", type: "address" },
            { name: "value", type: "uint256" },
            { name: "nonce", type: "uint256" },
            { name: "deadline", type: "uint256" },
        ],
    };
    const message = {
        owner,
        spender: relayer,
        value: amount,
        nonce,
        deadline,
    };
    const signature = await (0, actions_1.signTypedData)(walletClient, {
        account: owner,
        domain,
        types,
        primaryType: "Permit",
        message,
    });
    const r = '0x' + signature.slice(2, 66);
    const s = '0x' + signature.slice(66, 130);
    const vHex = signature.slice(130, 132);
    const v = parseInt(vHex, 16);
    return { v, r, s, deadline };
}
