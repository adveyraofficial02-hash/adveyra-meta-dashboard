const env = (k) => process.env[k];
export default async () => Response.json({
  ok: true,
  service: "adveyra-meta-starter",
  metaConfigured: Boolean(env("META_APP_ID") && env("META_APP_SECRET") && env("META_REDIRECT_URI") && env("SESSION_SECRET"))
});
