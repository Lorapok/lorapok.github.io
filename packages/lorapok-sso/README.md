# `@lorapok/sso`

Shared sign-in client for Lorapok Labs web applications. It combines Firebase Google sign-in, TOTP enrollment/challenge, and the Lorapok SSO gateway's app-specific authorization check.

```js
import { createLorapokSso } from "@lorapok/sso";
import { auth } from "./firebase";

const sso = createLorapokSso({
  auth,
  appId: "my-lorapok-app",
  gatewayUrl: "https://sso.lorapok.tech",
});

const result = await sso.signIn();
if (result.status === "totp-required") {
  // Ask for the six-digit authenticator PIN, then call sso.verifyTotp(pin).
}
```

Applications must be registered and access must be granted in the Lorapok Labs Office. Render enrollment QR data locally; never send a TOTP secret to application logs or analytics.
