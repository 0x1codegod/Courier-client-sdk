export interface SubmitMetaTxInput {
    token: string;
    owner: string;
    recipient: string;
    amount: string;
    deadline: bigint;
    v: number;
    r: string;
    s: string;
}
export declare function submitSignedPermitData(input: SubmitMetaTxInput): Promise<Response>;
