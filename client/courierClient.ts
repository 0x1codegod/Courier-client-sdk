import { ethers } from "ethers";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
import { TOKEN_ABI } from "./erc20Permit";

export interface SignPermitInput {
  owner: string;
  token: `0x${string}`;
  amount: bigint;
  deadline: bigint;
  signer: ethers.Signer & TypedDataSigner;
}

export async function signPermitTypedData(input: SignPermitInput): Promise<{
  v: number;
  r: string;
  s: string;
  deadline: bigint;
}> {
  const { owner, token, amount, deadline, signer } = input;

  if (!signer.provider) {
    throw new Error("Signer must have an associated provider");
  }

  const relayer = "0xbbA56A5173E8cA4CBF0bfc6f5e9DeDb00bb6F4F2";
  const provider = signer.provider;
  const network = await signer.provider.getNetwork(); 
  const chainId = network.chainId;

  const contract = new ethers.Contract(token, TOKEN_ABI, provider);
  const tokenName = await contract.name();
  const nonce = await contract.nonces(owner);

  if (nonce === undefined || nonce === null) {
    throw new Error("Failed to fetch nonce");
  }

   const domain ={
      name: tokenName! as string,
      version: "1",
      chainId: chainId,
      verifyingContract: token
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
