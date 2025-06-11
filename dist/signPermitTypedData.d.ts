import { WalletClient } from "viem";
export interface SignPermitInput {
    owner: string;
    token: `0x${string}`;
    amount: bigint;
    deadline: bigint;
    walletClient: WalletClient;
}
export declare function signPermitTypedData(input: SignPermitInput): Promise<{
    v: number;
    r: string;
    s: string;
    deadline: bigint;
}>;
