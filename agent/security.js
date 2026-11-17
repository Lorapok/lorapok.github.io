"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasValidServiceToken = hasValidServiceToken;
exports.parseAllowedDiscordWebhook = parseAllowedDiscordWebhook;
const crypto_1 = require("crypto");
function hasValidServiceToken(serviceToken, bearerToken, apiKey) {
    if (!serviceToken || serviceToken.length < 32)
        return false;
    const candidate = bearerToken || apiKey;
    if (!candidate)
        return false;
    const expected = Buffer.from(serviceToken);
    const provided = Buffer.from(candidate);
    return expected.length === provided.length && (0, crypto_1.timingSafeEqual)(expected, provided);
}
function parseAllowedDiscordWebhook(value) {
    let parsed;
    try {
        parsed = new URL(value.trim());
    }
    catch {
        return null;
    }
    const allowedHosts = new Set(['discord.com', 'discordapp.com']);
    if (parsed.protocol !== 'https:' || !allowedHosts.has(parsed.hostname))
        return null;
    if (!/^\/api\/webhooks\/\d+\/[A-Za-z0-9._-]+$/.test(parsed.pathname))
        return null;
    return parsed;
}
