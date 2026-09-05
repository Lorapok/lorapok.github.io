---
name: freqghost-model-training
description: Standardized instructions for training the FreqGhost contrastive CSI encoder and vital signs models.
---

# 🤖 freqghost-model-training

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# FreqGhost Model Training Skill

Use this skill when the user asks to "train the model", "train the CSI encoder", or update the ML pipeline for FreqGhost.

## Overview
The FreqGhost ML pipeline is based on self-supervised contrastive learning of CSI (Channel State Information) data.

## Training Guardrails
1. **Model Size**: The target for edge deployment is small. Quantize models to 4-bit (int4) if possible to fit in ~8 KB.
2. **Data**: Always use the provided synthetic or hardware CSI datasets in `testdata/`. Do not assume datasets are available without verifying.
3. **Execution**: Run the training harness using `python3 -m test.train_harness` (or as specified by the user).
4. **Reproducibility**: Set seeds before any training loop.
   ```python
   torch.manual_seed(42)
   np.random.seed(42)
   ```
5. **Output**: Training must output a `.pth` checkpoint file. Verify this file is created before concluding the task.

## Verification
After training, remind the user to trigger the `freqghost-verification` skill to ensure the new model output remains deterministic.
