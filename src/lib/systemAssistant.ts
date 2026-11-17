export type AssistantTurn = {
  role: "user" | "assistant";
  content: string;
};

type AssistantResponse = {
  reply: string;
  model?: string;
  requestId?: string;
};

const assistantEndpoint = (import.meta.env.VITE_ASSISTANT_ENDPOINT as string | undefined)?.trim();

export function isSystemAssistantConfigured() {
  return Boolean(assistantEndpoint);
}

export async function askSystemAssistant(
  message: string,
  conversation: AssistantTurn[],
): Promise<AssistantResponse> {
  if (!assistantEndpoint) {
    throw new Error("Gemini is awaiting secure server configuration.");
  }

  const response = await fetch(assistantEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: message.slice(0, 4_000),
      conversation: conversation.slice(-12).map((turn) => ({
        role: turn.role,
        content: turn.content.slice(0, 4_000),
      })),
      surface: "lorapok-web-assistant",
    }),
  });

  if (!response.ok) {
    throw new Error(response.status === 429
      ? "The assistant is busy. Please try again shortly."
      : "The assistant service is currently unavailable.");
  }

  const payload = await response.json() as Partial<AssistantResponse>;
  if (!payload.reply || typeof payload.reply !== "string") {
    throw new Error("The assistant returned an invalid response.");
  }

  return {
    reply: payload.reply,
    model: typeof payload.model === "string" ? payload.model : undefined,
    requestId: typeof payload.requestId === "string" ? payload.requestId : undefined,
  };
}
