# Loragent — Universal Multi-Agent Ecosystem

## Project
224-agent virtual software firm operating on a Hub-and-Spoke topology.
`loragent-boss` is the single intelligent entry point. It routes to one of 6 formations:
Auto Team (engineering) · Office (business) · Chela (debugging) · Freelance (specialist) · Observer (recovery) · Spidernet (DAG).

## Stack
- Runtime: Node.js 20+ · Python 3.11+ · PHP 8.2+ (Laravel)
- MCP: `port/mcp/server.js` or `src/mcp/server.js` (start before using agent tools)
- Skills: `skills/<slug>/SKILL.md` or `.agents/skills/<slug>/SKILL.md` — invoke as `/loragent:<slug>`
- Formations: `formations/*.json` squad matrices
- State: `.loragent-debug/` watchman cache + orchestration graph

## Commands
```
node port/mcp/server.js           # start native MCP server
node scripts/enrich-skills.js --compile --mirrors  # compile multi-IDE mirrors
npm test                          # run test suites across all layers
```

## Hard Rules
- NEVER emit plaintext secrets — use Machine AES-256 vault via `loragent-accounts-specialist`
- NEVER run destructive commands (`rm -rf`, DROP TABLE) without `loragent-workspace-guard` confirmation
- ALL agent-to-agent traffic routes through `loragent_steer` MCP — no direct unauthorized calls
- ALL specialist agents are summoned via `loragent_summon_agent`, dismissed after task
- Read `.loragent-debug/orchestration-graph.json` BEFORE any debugging — no heuristic guessing

## Slash Commands
`/loragent:boss auto` · `/loragent:boss chela` · `/loragent:boss office`
`/loragent-teacher clarify` · `/loragent-inspector rca` · `/loragent-watchman continue` · `/loragent autopilot [task]`

## Documentation & Catalog
Full catalog: `registry/marketplace.json` · Index: `AGENT_INDEX.md` · Template: `AGENT_TEMPLATE.md` · Spec: `docs/LORAGENT_STANDARD_v2.md`
