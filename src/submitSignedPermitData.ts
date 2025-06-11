// src/submitMetaTransaction.ts

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

export async function submitSignedPermitData(input: SubmitMetaTxInput): Promise<Response> {
  const {
    token,
    owner,
    recipient,
    amount,
    deadline,
    v,
    r,
    s,
  } = input;
  
  const endpoint =  "https://relay-68ezseoyf-0x1codegods-projects.vercel.app/api/relayMetaTx";
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token,
      owner,
      recipient,
      amount,
      deadline,
      v,
      r,
      s,
    }),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(`Relayer API error: ${JSON.stringify(error)}`);
  }

  return res;
}
