# ADVEYRA Netlify Meta OAuth starter

## What it does
- Serves a small ADVEYRA dashboard.
- Includes Netlify Functions for a health endpoint and Meta OAuth test.
- Uses server-side environment variables and validates OAuth state.
- Exchanges the OAuth code server-side but intentionally discards the token.

## Important
This is an **experimental OAuth starter**, not a production Meta Ads Manager. It does not persist connected-account sessions or tokens, fetch campaign data, or create/publish ads. It requests only `public_profile`; that does not grant Marketing API access to ad accounts. Real ad features require appropriate permissions, app access/review, and secure durable token/session storage.

## Deploy
1. Upload the whole folder to a GitHub repository.
2. In Netlify, choose Add new project → Import an existing project → GitHub, then select the repository.
3. Use publish directory `.` and functions directory `netlify/functions`; no build command is needed for this starter.
4. In Netlify site environment variables add:
   - `META_APP_ID`
   - `META_APP_SECRET`
   - `META_REDIRECT_URI` = `https://YOUR-SITE.netlify.app/api/meta/callback`
   - `SESSION_SECRET` = a long random value, preferably 32+ random bytes
5. Redeploy after setting variables.
6. In Meta Developers, configure the exact valid OAuth redirect URI to match `META_REDIRECT_URI`, plus your site domain and Facebook Login settings.
7. Visit `/api/health`; expect `ok: true` and `metaConfigured: true`.
8. Test the Connect button.

Never put the app secret in HTML or share it in chat. Rotate any secret previously exposed. Do not claim production readiness based on a successful OAuth test alone.
