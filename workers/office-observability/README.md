# Lorapok Office observability gateway

This Cloudflare Worker is the server-side boundary for the private Office infrastructure dashboard.

- Firebase ID tokens are checked through Firestore Security Rules.
- Only active `owner`, `admin`, and `researcher` profiles can read monitoring data.
- The Cloudflare API token is a Worker secret and is never shipped in the website bundle.
- DNS record values and other sensitive configuration are omitted from the response.
- Successful Cloudflare responses are cached at the edge for 60 seconds.

## Required secret

Set `CLOUDFLARE_API_TOKEN` as a Worker secret. Its scope should be read-only and limited to the Lorapok Facility account and `lorapok.tech` zone:

- Account: Workers Scripts Read
- Zone: Zone Read
- Zone: DNS Read
- Zone: Analytics Read
- Zone: Firewall Services Read (optional; enables security totals)

The frontend reads the gateway URL from `VITE_OFFICE_OBSERVABILITY_URL`.
