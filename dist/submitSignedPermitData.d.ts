export interface SubmitMetaTxInput {
    token: `0x${string}`;
    owner: `0x${string}`;
    recipient: `0x${string}`;
    amount: string;
    deadline: string;
    v: number;
    r: string;
    s: string;
}
export declare function submitSignedPermitData(input: SubmitMetaTxInput): Promise<Response>;
