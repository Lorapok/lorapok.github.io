---
name: freqghost-verification
description: Orchestrates deterministic pipeline proofs for FreqGhost ML components to ensure reproducibility.
---

# 🤖 freqghost-verification

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# FreqGhost Verification Skill

Use this skill when you need to verify the deterministic nature of the FreqGhost ML pipeline, or when the user asks to "run pipeline proof" or "verify ML pipeline".

## Overview
FreqGhost adheres to strict reproducibility standards. Any ML component (preprocessing, inference, vitals extraction) must produce deterministic outputs for a given input.

## Steps to Verify
1. Ensure the `verify.py` script is present in the `tools/` directory (or wherever specified by the user).
2. If it does not exist, you must create a script that:
   - Takes a known-good input (`.npz` or `.pcap`).
   - Runs it through the pipeline without randomness (seed all RNGs).
   - Hashes the final output (e.g., using `hashlib.sha256()`).
   - Compares it against a known expected hash.
3. Run the verification script: `python3 -m tools.verify`
4. If the hash matches, report success. If it fails, you must investigate the non-determinism in the pipeline (e.g., missing `torch.manual_seed()`, unordered dictionary iterations, floating point variances across devices).

## Critical Guardrail
**Do not** claim the model or pipeline is complete without passing this deterministic check.
