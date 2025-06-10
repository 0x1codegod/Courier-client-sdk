"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signPermitTypedData = signPermitTypedData;
const ethers_1 = require("ethers");
const erc20Permit_1 = require("./erc20Permit");
async function signPermitTypedData(input) {
    const { owner, token, amount, deadline, signer } = input;
    if (!signer.provider) {
        throw new Error("Signer must have an associated provider");
    }
    const relayer = "0xbbA56A5173E8cA4CBF0bfc6f5e9DeDb00bb6F4F2";
    const provider = signer.provider;
    const network = await signer.provider.getNetwork();
    const chainId = network.chainId;
    const contract = new ethers_1.ethers.Contract(token, erc20Permit_1.TOKEN_ABI, provider);
    const tokenName = await contract.name();
    const nonce = await contract.nonces(owner);
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
    const values = {
        owner,
        spender: relayer,
        value: amount,
        nonce,
        deadline,
    };
    const signature = await signer._signTypedData(domain, types, values);
    const { v, r, s } = ethers_1.ethers.Signature.from(signature);
    return { v, r, s, deadline };
}
