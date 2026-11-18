# Lorapok Social Publisher

Protected Meta publishing gateway for Lorapok Labs Office.

## Security model

- Verifies Firebase ID-token signatures and the active Office profile on every private request.
- Requires `super-admin`, `owner`, `admin`, or `editor` access.
- Stores Meta tokens encrypted in KV; raw tokens are never returned to the browser or written to Firestore.
- Stores prepared media in a private R2 bucket and exposes only expiring, signed read URLs for Meta ingestion.
- Restricts CORS to approved Lorapok origins.
- Records a compact per-user publishing audit trail without saving captions or tokens.
- Removes staged R2 media automatically after seven days.

## Configuration

Non-secret Worker variable:

- `META_APP_ID`

Required encrypted secrets:

- `META_APP_SECRET`
- `TOKEN_ENCRYPTION_KEY` — 32 random bytes encoded as base64
- `MEDIA_SIGNING_KEY` — a high-entropy signing value

The Meta app OAuth redirect URI must be:

`https://lorapok-social-publisher.mdshuvo40.workers.dev/oauth/callback`

Deauthorization callback:

`https://lorapok-social-publisher.mdshuvo40.workers.dev/meta/deauthorize`

Data deletion callback:

`https://lorapok-social-publisher.mdshuvo40.workers.dev/meta/data-deletion`

Required Meta permissions:

`pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `instagram_basic`, `instagram_content_publish`

The Instagram account must be a professional account linked to a Facebook Page. Facebook Page Stories are not exposed as a general Pages publishing endpoint; the workspace supports Facebook Feed/Reels and Instagram Feed/Reels/Stories.
