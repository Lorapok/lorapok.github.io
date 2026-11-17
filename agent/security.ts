import { timingSafeEqual } from 'crypto';

export function hasValidServiceToken(serviceToken: string, bearerToken: string, apiKey: string): boolean {
  if (!serviceToken || serviceToken.length < 32) return false;
  const candidate = bearerToken || apiKey;
  if (!candidate) return false;
  const expected = Buffer.from(serviceToken);
  const provided = Buffer.from(candidate);
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

export function parseAllowedDiscordWebhook(value: string): URL | null {
  let parsed: URL;
  try {
    parsed = new URL(value.trim());
  } catch {
    return null;
  }
  const allowedHosts = new Set(['discord.com', 'discordapp.com']);
  if (parsed.protocol !== 'https:' || !allowedHosts.has(parsed.hostname)) return null;
  if (!/^\/api\/webhooks\/\d+\/[A-Za-z0-9._-]+$/.test(parsed.pathname)) return null;
  return parsed;
}
