# Lorapok SSO Gateway

The gateway is the centralized authorization boundary for Lorapok Labs applications. Firebase Authentication with Identity Platform remains the identity provider; the gateway independently verifies each Firebase RS256 token, requires a completed authenticator factor, and applies the Firestore app registry and per-user grants.

## Endpoints

- `GET /health` — liveness only; returns no account information.
- `POST /v1/session?appId=registered-app-id` — accepts the same `appId` in the JSON body and `Authorization: Bearer <Firebase ID token>`.

Successful responses contain a sanitized user profile, Office permissions, and app-specific scopes. The explicit active `super-admin` role is the protected top-level authority; an email address alone never grants access. Tokens, TOTP secrets, device PIN material, API credentials, and private Firestore data are never returned.

## Configuration

- `FIREBASE_PROJECT_ID` — Firebase/Google Cloud project ID.
- `ALLOWED_ORIGINS` — comma-separated development origins. Production session preflights and requests are approved dynamically against the exact origins in the active Office app registry; `lorapok.tech` platform origins remain available for health and operational access.

Register applications and grant teammates access from **Office → People & Access → Connected applications**.
