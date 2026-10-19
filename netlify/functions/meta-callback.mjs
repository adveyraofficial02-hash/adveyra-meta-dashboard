import { createHmac, timingSafeEqual } from "node:crypto";
const env = (k) => process.env[k];
function cookies(req){const o={};for(const p of (req.headers.get("cookie")||"").split(";")){const i=p.indexOf("=");if(i>0)o[p.slice(0,i).trim()]=p.slice(i+1).trim()}return o}
function redirect(path){const h=new Headers({"Location":path,"Cache-Control":"no-store"});h.append("Set-Cookie","adveyra_state=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0");h.append("Set-Cookie","adveyra_sig=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0");return new Response(null,{status:302,headers:h})}
export default async (req) => {
 const u=new URL(req.url), q=u.searchParams, c=cookies(req);
 if(q.has("error")) return redirect("/?meta=error");
 const code=q.get("code"),state=q.get("state"),secret=env("SESSION_SECRET");
 if(!code||!state||!secret||!c.adveyra_state||!c.adveyra_sig||state!==c.adveyra_state) return new Response("OAuth state check failed. Start again from the ADVEYRA page.",{status:400});
 const expected=createHmac("sha256",secret).update(state).digest("hex"), a=Buffer.from(c.adveyra_sig), b=Buffer.from(expected);
 if(a.length!==b.length||!timingSafeEqual(a,b)) return new Response("OAuth state signature check failed.",{status:400});
 const appId=env("META_APP_ID"),appSecret=env("META_APP_SECRET"),redirectUri=env("META_REDIRECT_URI");
 if(!appId||!appSecret||!redirectUri) return new Response("OAuth configuration incomplete.",{status:500});
 const tokenUrl=new URL("https://graph.facebook.com/v23.0/oauth/access_token");
 tokenUrl.searchParams.set("client_id",appId);tokenUrl.searchParams.set("client_secret",appSecret);tokenUrl.searchParams.set("redirect_uri",redirectUri);tokenUrl.searchParams.set("code",code);
 try{
  const response=await fetch(tokenUrl);const data=await response.json();
  if(!response.ok||!data.access_token) return new Response("Meta token exchange failed. Check the callback URL, app settings, and user access.",{status:502});
  // Token intentionally discarded: no persistence or token exposure in this demo.
  return redirect("/?meta=success");
 }catch{return new Response("Could not reach Meta token endpoint. Try again later.",{status:502})}
};
