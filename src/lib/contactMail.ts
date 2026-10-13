export type ContactMailPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  route: string;
};

export type ContactMailResult = {
  ok: boolean;
  via: "proxy" | "mailto";
  error?: string;
};

const mailProxyUrl = import.meta.env.VITE_MAIL_PROXY_URL as string | undefined;

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function getMailProxyUrl(): string | undefined {
  return mailProxyUrl?.trim() || undefined;
}

export async function sendContactMail(payload: ContactMailPayload): Promise<ContactMailResult> {
  const name = payload.name.trim() || "Visitor";
  const email = payload.email.trim();
  const subject = payload.subject.trim();
  const message = payload.message.trim();

  if (!isValidEmail(email)) {
    return { ok: false, via: "proxy", error: "Enter a valid email address." };
  }
  if (!message) {
    return { ok: false, via: "proxy", error: "Write a message before sending." };
  }

  const proxy = getMailProxyUrl();
  if (proxy) {
    const response = await fetch(proxy, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        subject,
        message,
        route: payload.route,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({} as { message?: string }));
      throw new Error(errorData.message || "Transmission failed. Please try again later.");
    }

    const result = (await response.json().catch(() => ({}))) as {
      message?: string;
      success?: boolean;
      id?: string;
    };
    if (result.success === false) {
      throw new Error(result.message || "Message could not be sent.");
    }
    return { ok: true, via: "proxy" };
  }

  const recipient = payload.route.toLowerCase().includes("founder")
    ? "mdshvo40@gmail.com"
    : "lorapokdev@gmail.com";
  const body = [
    `From: ${name} <${email}>`,
    `Route: ${payload.route}`,
    "",
    message,
  ].join("\n");
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject || "Lorapok Labs inquiry")}&body=${encodeURIComponent(body)}`;
  const opened = window.open(mailto, "_blank");
  if (!opened) {
    const link = document.createElement("a");
    link.href = mailto;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  return { ok: true, via: "mailto" };
}
