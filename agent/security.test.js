const assert = require('node:assert/strict');
const { hasValidServiceToken, parseAllowedDiscordWebhook } = require('./security.js');

const token = 'a'.repeat(32);
assert.equal(hasValidServiceToken('', token, ''), false, 'missing configured token must fail closed');
assert.equal(hasValidServiceToken('short', 'short', ''), false, 'short configured token must fail closed');
assert.equal(hasValidServiceToken(token, token, ''), true, 'matching bearer token must pass');
assert.equal(hasValidServiceToken(token, '', token), true, 'matching X-Api-Key token must pass');
assert.equal(hasValidServiceToken(token, `${token}x`, ''), false, 'wrong-length token must fail');
assert.equal(hasValidServiceToken(token, 'b'.repeat(32), ''), false, 'incorrect token must fail');

assert.ok(parseAllowedDiscordWebhook('https://discord.com/api/webhooks/123456/token_value'));
assert.ok(parseAllowedDiscordWebhook('https://discordapp.com/api/webhooks/123456/token_value'));
assert.equal(parseAllowedDiscordWebhook('http://discord.com/api/webhooks/123456/token_value'), null);
assert.equal(parseAllowedDiscordWebhook('https://attacker.example/api/webhooks/123456/token_value'), null);
assert.equal(parseAllowedDiscordWebhook('https://127.0.0.1/api/webhooks/123456/token_value'), null);

console.log('LoLaBo security tests passed: fail-closed tokens and Discord-only webhook destinations verified.');
