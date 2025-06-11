import { WalletClient } from "viem";
import { ethers } from "ethers";
import { TypedDataSigner } from "@ethersproject/abstract-signer";

export async function walletClientToEthersSigner(
  walletClient: WalletClient,
  address: string
): Promise<ethers.Signer & TypedDataSigner> {
  const eip1193Provider = {
    request: async (args: { method: any; params?: any }) =>
      walletClient.request(args),
  };

  const browserProvider = new ethers.BrowserProvider(eip1193Provider as any);
  const signer = await browserProvider.getSigner(address);

  // Confirm signer supports _signTypedData
  if (typeof (signer as any)._signTypedData !== "function") {
    throw new Error("Signer does not support _signTypedData");
  }

  return signer as unknown as ethers.Signer & TypedDataSigner;

}
