import { TOKEN_ABI } from "./erc20Permit";
import { WalletClient } from "viem";
import { createPublicClient, custom } from "viem";
import { signTypedData } from "viem/actions";

export interface SignPermitInput {
  owner: string;
  token: `0x${string}`;
  amount: bigint;
  deadline: bigint;
  walletClient: WalletClient;
}

export async function signPermitTypedData(input: SignPermitInput): Promise<{
  v: number;
  r: string;
  s: string;
  deadline: bigint;
}> {
  const { owner, token, amount, deadline, walletClient } = input;

  if (!walletClient) {
    throw new Error("Signer must have an associated provider");
  }

  const relayer = "0x20b5264f32AFc9B4ef5BF05AE51fdCF85F8244c6";

  const chainId = await walletClient.getChainId();
  const publicClient = createPublicClient({
    chain: walletClient.chain,
    transport: custom(walletClient.transport),
  });

const tokenName = await publicClient.readContract({
    address: token,
    abi: TOKEN_ABI,
    functionName: "name",
  });

  const nonce = await publicClient.readContract({
    address: token,
    abi: TOKEN_ABI,
    functionName: "nonces",
    args: [owner],
  });

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

  const message = {
    owner,
    spender: relayer,
    value: amount,
    nonce,
    deadline,
  };

  const signature = await signTypedData(walletClient, {
    account: owner as `0x${string}`,
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
