# Lorapok System Assistant Boundary

The bottom-right Ribo surface is the public system assistant. Its navigation and
experience controls work without an AI provider. Gemini answers remain visibly
unconfigured until a protected server endpoint is deployed and verified.

## Browser contract

The website reads one non-secret build variable:

```text
VITE_ASSISTANT_ENDPOINT=https://<protected-assistant-endpoint>
```

The client sends:

```json
{
  "message": "What can Lorapok help me build?",
  "conversation": [{ "role": "user", "content": "..." }],
  "surface": "lorapok-web-assistant"
}
```

The server returns:

```json
{
  "reply": "...",
  "model": "configured-model-name",
  "requestId": "trace-id"
}
```

Only `reply` is required. The client limits each turn to 4,000 characters and
sends at most the latest 12 turns.

## Server requirements

- Keep the Gemini API key only in the server/worker secret store.
- Never return, log, or expose the key to the browser bundle.
- Allow requests from `https://lorapok.tech` and the approved preview origin only.
- Apply rate limits, request-size limits, abuse controls, and timeouts.
- Validate the request shape and return JSON for success and errors.
- Ground system instructions in verified Lorapok product data; do not invent
  availability, pricing, releases, or capabilities.
- Add authentication and role checks before exposing private Office information.
- Record a non-sensitive request ID for diagnostics.

## Activation through Antigravity

1. Deploy the protected endpoint with its Gemini secret configured server-side.
2. Test the endpoint independently without printing the secret.
3. Set the GitHub Actions repository variable `VITE_ASSISTANT_ENDPOINT`.
4. Deploy the website and verify the assistant status changes from
   `Gemini setup pending` to `Secure assistant connected`.

Until all four steps pass, the live UI must continue to describe Gemini as
pending rather than connected.
