# LoLaBo automation backup

The public blog on lorapok.tech is manual repository notes only. The LoLaBo agent is kept, not deleted.

## Where the backup lives

| What | Where |
| --- | --- |
| Full pre-repair git history (107 generated posts + old auto-publish) | branch `backup/lolabo-automation` |
| Generated drafts on this branch | `public/blog/archive/ai-posts.json` |
| Dev library | `/dev` Blog panel loads public notes plus the archive |
| Agent code | `agent/` (`index.ts`, `writer.ts`, `server.ts`, `catchup.ts`, `exportData.ts`) |

## How the pipeline works now

1. The 15-minute GitHub Action still runs `agent/index.js`. Draft-only archive commits do not trigger `deploy.yml` and are not broadcast to Discord.
2. New AI posts are written as `source: "ai-agent"` and `status: "draft"`.
3. Drafts go only into `public/blog/archive/ai-posts.json`.
4. `public/blog/posts.json`, the sitemap, and RSS stay limited to `source: "manual"` and `status: "published"`.
5. The public site and AdSense index do not list drafts.

To publish a draft, open it in `/dev`, set `source` to `manual` and `status` to `published`, then export.

## Restore the old auto-publish behavior

```sh
git checkout backup/lolabo-automation
```

That branch is a snapshot of origin/main before this repair. Do not merge it back into `main` unless you intend to republish the generated corpus.
