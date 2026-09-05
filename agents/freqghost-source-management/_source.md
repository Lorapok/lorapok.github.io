---
name: freqghost-source-management
description: Add, configure, and manage SceneSource implementations — the central abstraction for all data flow in FreqGhost. Use when adding new sources, switching active source, configuring router credentials, or debugging source connectivity.
---

# 🤖 freqghost-source-management

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# FreqGhost Source Management Skill

## When to Use

Activate this skill when the user asks to:
- Add a new data source (SceneSource implementation)
- Switch the active data source
- Configure router credentials for CSI extraction
- Debug source connectivity issues
- Modify the SceneSource ABC or frame format

## Architecture

### SceneSource ABC (`tools/scene_source.py`)

All data sources must implement this abstract base class:

```python
class SceneSource(abc.ABC):
    @abc.abstractmethod
    async def frame_stream(self) -> AsyncIterator[SceneFrame]:
        raise NotImplementedError
```

### SceneFrame Format

Every frame yielded by `frame_stream()` must conform to:

```python
{
    "frame": int,          # Frame counter
    "targets": [           # List of detected entities
        {
            "id": str,           # Unique target ID
            "device_type": str,  # "human", "router", "mobile", etc.
            "hostname": str,     # Display name
            "distance_m": float, # Distance from sensor
            "x": float,         # X position (meters)
            "y": float,         # Y position (meters)
            "motion": float,    # Motion energy (0.0-1.0+)
        }
    ],
    "vitals": {            # Optional vital signs
        "hr": float,       # Heart rate (BPM)
        "br": float,       # Breathing rate (breaths/min)
        "motion": float,   # Overall motion energy
    },
    "semantics": {         # Optional semantic states
        "room_active": {"active": bool, "reason": str},
        "someone_sleeping": {"active": bool, "reason": str},
        ...
    }
}
```

### Available Sources

| Source ID | Class | File | Hardware? |
|-----------|-------|------|-----------|
| `network` | `NetworkSceneSource` | `tools/network_source.py` | No |
| `hardware` | `HardwareSceneSource` | `tools/hardware_source.py` | Yes |
| `synthetic` | `SyntheticSceneSource` | `tools/scene_source.py` | No |
| `rssi` | `RSSISceneSource` | `tools/rssi_source.py` | No |
| `replay` | `ReplaySceneSource` | `tools/scene_source.py` | No |
| `router_csi` | `RouterCSISource` | `tools/router_csi_source.py` | Yes |

### Adding a New Source

1. Create a new file in `tools/` (e.g., `tools/my_source.py`)
2. Import and extend `SceneSource` from `tools.scene_source`
3. Implement `async frame_stream() -> AsyncIterator[SceneFrame]`
4. Register in `tools/live_scene.py::get_scene_source()`
5. Add to the sources list in `admin/api.py::list_sources()`
6. Add to `SourceSwitchRequest.source` pattern in `admin/models.py`

### Source Switching Rules

- **Graceful fallback** — If a source fails, fall back to synthetic without crashing
- **Hot-swap** — Cancel the current stream task and start the new one atomically
- **Router credentials** — When switching to `router_csi`, if no credentials stored, return 401 with `needs_credentials: true` so the frontend shows the login popup

### Router Credential Handling

Router credentials are stored in-memory via the admin API:

```
POST /api/v1/router/login
{
    "host": "192.168.1.1",
    "username": "admin",
    "password": "password",
    "port": 22,
    "protocol": "ssh"
}
```

Credentials are NOT persisted to disk for security — they must be re-entered after server restart.
