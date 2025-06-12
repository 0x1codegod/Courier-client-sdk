"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitSignedPermitData = submitSignedPermitData;
async function submitSignedPermitData(input) {
    const { token, owner, recipient, amount, deadline, v, r, s, } = input;
    const endpoint = "https://courier-rho.vercel.app/api/relayMetaTx";
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
