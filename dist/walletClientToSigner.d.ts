import type { WalletClient } from "viem";
export declare function walletClientToEthersSigner(walletClient: WalletClient, address: string): Promise<import("ethers").JsonRpcSigner & {
    _signTypedData: (domain: any, types: Record<string, any[]>, value: Record<string, any>) => Promise<string>;
}>;
