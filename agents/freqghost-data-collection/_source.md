---
name: freqghost-data-collection
description: Manage CSI/RSSI data collection sessions for ML training — recording, labeling, exporting datasets, and quality validation. Use when the user asks to collect data, record CSI, build datasets, label scenes, or export training data.
---

# 🤖 freqghost-data-collection

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# FreqGhost Data Collection Skill

## When to Use

Activate this skill when the user asks to:
- Start/stop data collection sessions
- Label or annotate collected data
- Export data to `.npz` format for ML training
- Review data quality or session metadata
- Build training datasets from collected frames

## Architecture

### Data Collection Flow

```
SceneSource → stream_frames() → DataCollector → SQLite metadata + .npz files
                                      ↑
                              Admin API triggers
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/data/sessions` | GET | List all collection sessions |
| `/api/v1/data/start` | POST | Start a new recording session (label + description required) |
| `/api/v1/data/stop` | POST | Stop the active session |
| `/api/v1/data/export/{id}` | GET | Export session to `.npz` |

### Data Quality Rules

1. **Label every session** — Sessions must have a human-readable label and description
2. **Minimum 30 seconds** — Reject sessions shorter than 30 seconds
3. **Auto-export on stop** — When a session stops, automatically export to `.npz`
4. **Never overwrite** — Use timestamped filenames. Never delete `.npz` files without confirmation
5. **Source metadata** — Record which source was active during collection

### Labeling Conventions

Use descriptive, structured labels:
- `"empty_room"` — No occupants
- `"1_person_sitting"` — Single person, sedentary
- `"1_person_walking"` — Single person, in motion
- `"2_people_talking"` — Two people, moderate activity
- `"sleeping"` — Person asleep (low motion energy)

### Export Format

`.npz` files contain:
- `frames` — Array of scene frames with targets, vitals, semantics
- `timestamps` — Array of timestamps (UNIX epoch)
- `labels` — Session label string
- `source` — Source type used during collection
- `metadata` — Session ID, start/end time, frame count

### Storage

- Default path: `data/sessions/`
- Filename: `session_{id}_{label}_{timestamp}.npz`
- Metadata stored in SQLite `data_sessions` table
