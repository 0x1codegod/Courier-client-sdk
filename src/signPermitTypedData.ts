import { TOKEN_ABI } from "./erc20Permit";
import { WalletClient } from "viem";
import { createPublicClient, custom } from "viem";
import {ethers} from "ethers";

export interface SignPermitInput {
  owner: `0x${string}`;
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

  const domainSeparator = await publicClient.readContract({
    address: token,
    abi: TOKEN_ABI,
    functionName: "DOMAIN_SEPARATOR",
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

  console.log([tokenName, nonce, domainSeparator])

   const domain ={
      name: tokenName! as string,
      version: "1",
      chainId: chainId,
      verifyingContract: token
    }
    
    const types = {
      Permit: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
        { name: 'value', type: 'uint256' },
        { name: 'nonce', type: 'uint256' },
        { name: 'deadline', type: 'uint256' },
      ],
    };


  const values = {
      owner: owner,
      spender: relayer,
      value: amount,
      nonce: nonce,
      deadline: deadline,
    }

// Check domain is correct
    if (await domainSeparator != ethers.TypedDataEncoder.hashDomain(domain)) {
        throw new Error("Invalid domain");
    }
    
   const signature = await walletClient.signTypedData({
      account: owner,
      domain : domain,
      primaryType: "Permit",
      types: types,
      message: values,
    });

  // split the signature into its components
    const sig = ethers.Signature.from(signature);
    const v = sig.v;
    const r = sig.r;
    const s = sig.s;
  return { v, r, s, deadline };
}
