import { ethers } from "ethers";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { TOKEN_ABI } from "./erc20Permit";

export interface SignPermitInput {
  owner: string;
  token: `0x${string}`;
  amount: bigint;
  deadline: bigint;
  domain: {
    name: string;
    version: string;
    chainId: number;
    verifyingContract: `0x${string}`;
  };
  signer: ethers.Signer & TypedDataSigner;
}

export async function signPermitTypedData(input: SignPermitInput): Promise<{
  v: number;
  r: string;
  s: string;
  deadline: bigint;
}> {
  const { owner, token, amount, deadline, domain, signer } = input;

  if (!signer.provider) {
    throw new Error("Signer must have an associated provider");
  }
  const relayer = "0xEECdFe9917dCC082E142A7e0fFdd7730B57A35eE";
  const provider = signer.provider;

  const contract = new ethers.Contract(token, TOKEN_ABI, provider);
  const nonce = await contract.nonces(owner);
  if (nonce === undefined || nonce === null) {
    throw new Error("Failed to fetch nonce");
  }

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
  const { v, r, s } = ethers.Signature.from(signature);
  return { v, r, s, deadline };
}
