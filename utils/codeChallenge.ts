import crypto from "crypto";
import { hexToDecimal } from "./feltService";

function base64URLEncode(str: any) {
  return str
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sha256(buffer: any) {
  return crypto.createHash("sha256").update(buffer).digest();
}

export function generateCodeVerifier(): string {
  return base64URLEncode(crypto.randomBytes(32));
}

export function generateCodeChallenge(codeVerifier: string): string {
  return base64URLEncode(sha256(codeVerifier));
}

export const getExtraTicket = (address: string) => {
  const codeChallenge = generateCodeChallenge(
    process.env.NEXT_PUBLIC_TWITTER_CODE_VERIFIER as string
  );
  const rootUrl = "https://twitter.com/i/oauth2/authorize";
  const options = {
    redirect_uri: `${
      process.env.NEXT_PUBLIC_ETH_BUTTON_API as string
    }/claim_x_ticket?addr=${hexToDecimal(address)}`,
    client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID as string,
    state: "state",
    response_type: "code",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
    scope: ["follows.read", "tweet.read", "users.read"].join(" "),
  };
  const qs = new URLSearchParams(options).toString();
  window.open(`${rootUrl}?${qs}`);
};
