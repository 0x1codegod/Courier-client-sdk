import { BrowserProvider } from "ethers";
import type { WalletClient } from "viem";

// Convert viem WalletClient to EIP-1193-compatible provider and get a signer that supports _signTypedData
export async function walletClientToEthersSigner(
  walletClient: WalletClient,
  address: string
) {
  const eip1193Provider = {
    request: async ({ method, params }: { method: any; params?: any }) =>
      walletClient.request({ method, params }),
  };

  const provider = new BrowserProvider(eip1193Provider as any);
  const signer = await provider.getSigner(address);

  // Optionally assert that _signTypedData exists (for TypeScript type safety)
  return signer as typeof signer & {
    _signTypedData: (
      domain: any,
      types: Record<string, any[]>,
      value: Record<string, any>
    ) => Promise<string>;
  };
}
