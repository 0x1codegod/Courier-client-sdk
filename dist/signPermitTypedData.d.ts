import { ethers } from "ethers";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
export interface SignPermitInput {
    owner: string;
    token: `0x${string}`;
    amount: bigint;
    deadline: bigint;
    signer: ethers.Signer & TypedDataSigner;
}
export declare function signPermitTypedData(input: SignPermitInput): Promise<{
    v: number;
    r: string;
    s: string;
    deadline: bigint;
}>;
