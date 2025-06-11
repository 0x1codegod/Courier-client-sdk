import { WalletClient } from "viem";
import { ethers } from "ethers";
import { TypedDataSigner } from "@ethersproject/abstract-signer";
export declare function walletClientToEthersSigner(walletClient: WalletClient, address: string): Promise<ethers.Signer & TypedDataSigner>;
