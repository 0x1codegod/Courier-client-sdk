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
  
  const endpoint =  "https://courier-rho.vercel.app/api/relayMetaTx";
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
