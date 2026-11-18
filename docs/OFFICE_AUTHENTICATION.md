# Lorapok Labs Office authentication

The private `/dev` Office uses Firebase Google authentication, Firebase TOTP multi-factor authentication, and Firestore-backed role access. Authentication and authorization remain separate: a successful Google sign-in does not grant Office access unless the corresponding user record is active, its role includes `view_office`, and the current session has completed the authenticator challenge.

## Authorized origins

The Firebase project currently permits the production Lorapok domains, GitHub Pages origins, `localhost`, and `127.0.0.1`. Both local hostnames are required because Firebase evaluates the browser hostname exactly; authorizing `localhost` does not authorize `127.0.0.1`.

When local development uses a different hostname, add only that exact hostname through Firebase Authentication → Settings → Authorized domains. Do not add ports, URL schemes, paths, wildcard domains, or unrelated preview hosts.

## Configuration boundary

The browser build requires these deployment values:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`
- `VITE_OFFICE_OBSERVABILITY_URL` (GitHub Actions variable; the protected Cloudflare Worker URL)

Cloudflare credentials never belong in `VITE_*` variables. The Office observability gateway keeps its read-only `CLOUDFLARE_API_TOKEN` in a Cloudflare Worker secret and independently re-checks the signed-in user's active Firestore role before returning infrastructure data.

Production values remain GitHub deployment secrets. Local values remain in ignored environment files and must be sourced from the encrypted credential vault when synchronization is required. Never commit or display decrypted values.

## Verified flow

1. Open `/dev` on an authorized origin.
2. Choose **Sign in with Google**.
3. Select an invited or protected owner identity.
4. On first use, scan the private QR code with a TOTP authenticator and confirm the rotating six-digit PIN.
5. On later sign-ins, complete the Firebase authenticator challenge with the current six-digit PIN.
6. Firebase establishes a browser-session-scoped login; closing the browser requires a fresh secure sign-in.
7. The Office reads the server-controlled `users/{uid}` record.
8. Only active identities with both the required permission and a verified second factor enter the Office; pending and suspended identities receive explicit status screens.

TOTP secrets are generated and verified by Firebase Authentication with Identity Platform. The QR payload exists only in memory during enrollment and is never written to Firestore, local storage, analytics, or application logs. The client translates common Firebase failures into safe, actionable messages and does not display raw provider error payloads.

## Shared Office operations

Editorial planning, offers, feedback, mail drafts, team chat, meeting links, and tasks are stored in `office_modules`. Every panel uses a live Firestore subscription so authorized teammates see updates without refreshing.

- Owners and administrators can manage every Office module.
- Editors can manage publishing and collaboration modules.
- Teammates can manage content, feedback, drafts, chat, meetings, and tasks, but cannot access commercial offers.
- Researchers and viewers cannot read or write collaboration records unless their role is expanded.
- Pending and suspended identities are rejected by Firestore rules.

Role and invitation changes are written to the immutable `rbac_audit` collection and displayed in the Access & Admin panel.

## Lorapok SSO for connected products

The Office is also the control plane for other Lorapok Labs products. **People & Access → Connected applications** registers each product's stable application ID and exact browser origins, then grants or revokes teammate access without copying credentials between projects.

The shared service has three deliberately separate layers:

1. Firebase Authentication with Identity Platform proves the Google identity and TOTP authenticator challenge.
2. The `lorapok-sso` Cloudflare Worker independently verifies the Firebase RS256 signature, issuer, audience, lifetime, verified email, and second-factor claim.
3. Firestore `sso_apps` and `sso_access` records decide whether that identity may enter a specific application. Owners and administrators retain emergency access; other roles require an active per-app grant.

Connected web applications use [`@lorapok/sso`](../packages/lorapok-sso/README.md) and send their short-lived Firebase ID token only to the SSO gateway. The gateway returns a sanitized session profile, role permissions, and optional app scopes. It never returns tokens, TOTP secrets, private Firestore documents, or infrastructure credentials. Browser persistence remains session-scoped on each origin; SSO means one authoritative identity and access system, not a cross-domain shared cookie.

The Worker implementation and deployment notes are in [`workers/lorapok-sso`](../workers/lorapok-sso/README.md). Production clients should use `https://sso.lorapok.tech` once their exact origin has been registered in the Office.
