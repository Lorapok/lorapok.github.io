# Lorapok Labs Office authentication

The private `/dev` Office uses Firebase Google authentication and Firestore-backed role access. Authentication and authorization remain separate: a successful Google sign-in does not grant Office access unless the corresponding user record is active and its role includes `view_office`.

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

Production values remain GitHub deployment secrets. Local values remain in ignored environment files and must be sourced from the encrypted credential vault when synchronization is required. Never commit or display decrypted values.

## Verified flow

1. Open `/dev` on an authorized origin.
2. Choose **Sign in with Google**.
3. Select an invited or protected owner identity.
4. Firebase establishes a persistent browser session.
5. The Office reads the server-controlled `users/{uid}` record.
6. Only active identities with the required permission enter the Office; pending and suspended identities receive explicit status screens.

The client translates common Firebase failures into safe, actionable messages and does not display raw provider error payloads.
