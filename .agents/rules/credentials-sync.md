# Credential Synchronization Rule

## Context
All AI agents operating within Lorapok Labs and across IDE environments (Antigravity, Cursor, Claude Code, etc.) must adhere to the single source of truth for secrets and credentials.

## Policy: Continuous Credential Synchronization

1. **Canonical Vault as Single Source of Truth**:
   - Master encrypted vault: `/mnt/NewVolume/Personal_Projects/cred/credentials.json.gpg`.
   - Tooling: `cred` CLI (`/home/maizied/.local/bin/cred`) or `titi` with the master clearance PIN / passphrase.
   - Skill documentation: `/home/maizied/.gemini/config/skills/secure-cred-vault/SKILL.md`.

2. **Zero Plaintext Secrets**:
   - Never commit `.env` or raw secrets to git repositories.
   - Never print decrypted credentials into LLM chat logs, terminal stdout, or file artifacts.
   - Never pass secrets via command-line arguments (`argv`).

3. **Mandatory Deployment & CI/CD Synchronization**:
   - When any secret or token is created, rotated, or needed by CI/CD workflows, agents must stream the credentials directly from the vault to the deployment target in memory (e.g. `gh secret set <NAME>` or `wrangler pages secret put <NAME>`).
   - Before diagnosing or running CI/CD workflows, verify that all necessary repository secrets exist and match the vault.

4. **Multi-IDE Mirror Synchronization**:
   - Run `node /mnt/NewVolume/Personal_Projects/cred/sync-all.mjs` whenever the credential vault skill or global configs are modified to keep all local workspaces synchronized.
