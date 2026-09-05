// agent/distributor.ts
// Social Media Distribution Module for LoLaBo
// Posts eye-catching snippets to Discord, X, LinkedIn, etc.

export async function distributeSocially(post: any, enabledSocials: string[]) {
  console.log(`📢 Distributing post socially: ${enabledSocials.join(', ')}`);

  const results = [];

  if (enabledSocials.includes('discord')) {
    results.push(await postToDiscord(post));
  }
  
  if (enabledSocials.includes('twitter')) {
    results.push(await postToTwitter(post));
  }

  if (enabledSocials.includes('linkedin')) {
    results.push(await postToLinkedIn(post));
  }

  return results;
}

async function postToDiscord(post: any) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return { platform: 'discord', status: 'skipped', reason: 'No webhook URL' };

  console.log("Posting to Discord...");
  
  const payload = {
    username: "LoLaBo Agent",
    avatar_url: "https://lorapok.github.io/assets/lorapok-badge.png",
    embeds: [{
      title: post.title,
      description: post.excerpt,
      url: `https://lorapok.github.io/blog#/post/${post.slug}`,
      color: 0x00ff88,
      author: {
        name: `${post.author.name} (${post.author.designation})`,
        icon_url: "https://lorapok.github.io/assets/lorapok-dev-logo.png"
      },
      image: { url: post.coverImage },
      footer: { text: "🐛 Written by the LoLaBo Autonomous Agent" },
      timestamp: new Date().toISOString()
    }]
  };

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return { platform: 'discord', status: res.ok ? 'success' : 'failed' };
  } catch (e) {
    return { platform: 'discord', status: 'error', error: (e as Error).message };
  }
}

async function postToTwitter(post: any) {
  // Twitter API v2 implementation placeholder
  console.log("Twitter distribution requested (Requires API keys)");
  return { platform: 'twitter', status: 'pending_setup' };
}

async function postToLinkedIn(post: any) {
  // LinkedIn API implementation placeholder
  console.log("LinkedIn distribution requested (Requires OAuth)");
  return { platform: 'linkedin', status: 'pending_setup' };
}
