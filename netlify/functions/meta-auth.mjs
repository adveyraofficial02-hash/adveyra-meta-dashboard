import { createHmac, randomBytes } from "node:crypto";
const env = (k) => process.env[k];
export default async () => {
  const appId=env("META_APP_ID"), redirectUri=env("META_REDIRECT_URI"), secret=env("SESSION_SECRET");
  if(!appId||!redirectUri||!secret) return new Response("OAuth configuration incomplete. Add the required environment variables in Netlify.",{status:500});
  const state=randomBytes(24).toString("hex");
  const signature=createHmac("sha256",secret).update(state).digest("hex");
  const url=new URL("https://www.facebook.com/v23.0/dialog/oauth");
  url.searchParams.set("client_id",appId);url.searchParams.set("redirect_uri",redirectUri);
  url.searchParams.set("state",state);url.searchParams.set("scope","public_profile");
  const headers=new Headers();headers.set("Location",url.toString());headers.set("Cache-Control","no-store");
  headers.append("Set-Cookie",`adveyra_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`);
  headers.append("Set-Cookie",`adveyra_sig=${signature}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=600`);
  return new Response(null,{status:302,headers});
};
