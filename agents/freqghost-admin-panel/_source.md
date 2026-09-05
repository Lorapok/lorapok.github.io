---
name: freqghost-admin-panel
description: Build and modify the FreqGhost admin dashboard — Cognitum-aesthetic web UI with JWT auth, role-based ACL, source switching, data collection controls, and ML model management. Use when the user asks to add admin features, modify the dashboard, add new tabs, or change the admin panel styling.
---

# 🤖 freqghost-admin-panel

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# FreqGhost Admin Panel Skill

## When to Use

Activate this skill when the user asks to:
- Add or modify admin dashboard features
- Change the admin panel styling or layout
- Add new tabs or sections to the admin UI
- Modify the authentication or ACL system
- Add new API endpoints under `/api/v1/*`

## Architecture

### Backend (`admin/` package)

| File | Purpose |
|------|---------|
| `admin/__init__.py` | Package init |
| `admin/auth.py` | JWT auth, bcrypt hashing, `UserDB` (SQLite-backed), role enforcement |
| `admin/models.py` | Pydantic request/response models for all API endpoints |
| `admin/api.py` | FastAPI `APIRouter` mounted at `/api/v1` with all admin endpoints |

### Frontend (`tools/static/`)

| File | Purpose |
|------|---------|
| `tools/static/admin.html` | Dashboard HTML — login screen + tabbed dashboard + modals |
| `tools/static/admin.css` | Cognitum aesthetic CSS — glassmorphism, animations, dark theme |
| `tools/static/admin.js` | Client-side logic — API calls, tab switching, Chart.js graphs |

### Server Integration

The admin router is mounted in `tools/live_scene.py`:
```python
from admin.api import router as admin_router
app.include_router(admin_router, prefix="/api/v1")
```

The admin dashboard is served at `/admin`:
```python
@app.get("/admin")
async def admin_panel():
    with open("tools/static/admin.html", "r") as f:
        return HTMLResponse(f.read())
```

## Design Rules

1. **Cognitum Aesthetic** — Always use these colors:
   - Background: `#0B1116`
   - Card background: `rgba(15, 22, 30, 0.85)` with `backdrop-filter: saturate(1.2) blur(16px)`
   - Cyan accent: `#00FFFF`
   - Green accent: `#00FF88`
   - Magenta accent: `#FF00AA`
   - Text: `#E0E8F0`, muted: `#7A8B9C`

2. **No build step** — The admin panel uses vanilla HTML/CSS/JS with CDN libraries only:
   - Chart.js via CDN for graphs
   - Inter + JetBrains Mono from Google Fonts
   - No webpack, no Vite, no npm

3. **Cache busting** — All static asset URLs must include a timestamp query parameter.

4. **JWT auth on all endpoints** — Every `/api/v1/*` endpoint (except `/auth/login`) requires a valid JWT Bearer token.

5. **Role enforcement** — Use `require_role("admin")` or `require_role("admin", "operator")` FastAPI dependencies.

## API Endpoint Patterns

When adding new endpoints, follow these patterns:

```python
from admin.auth import get_current_user, require_role, User

# Read-only endpoint (any authenticated user)
@router.get("/my-endpoint")
async def my_endpoint(current_user: User = Depends(get_current_user)) -> dict:
    ...

# Write endpoint (admin or operator only)
@router.post("/my-endpoint")
async def create_thing(
    req: MyRequest,
    current_user: User = Depends(require_role("admin", "operator")),
) -> dict:
    ...

# Admin-only endpoint
@router.delete("/my-endpoint/{id}")
async def delete_thing(
    id: int,
    current_user: User = Depends(require_role("admin")),
) -> dict:
    ...
```

## Adding New Tabs

1. Add a `<button class="tab" data-tab="newtab">New Tab</button>` to the tab bar in `admin.html`
2. Add a `<section id="tab-newtab" class="tab-pane">` content section
3. Add data loading logic in `admin.js`
4. The tab switching is automatic via the existing event listener

## Frontend API Helper

All API calls use the `api()` helper function in `admin.js`:

```javascript
// GET request
const data = await api('/my-endpoint');

// POST request
const result = await api('/my-endpoint', {
    method: 'POST',
    body: JSON.stringify({ key: 'value' }),
});
```

The helper automatically includes the JWT token and handles 401 (redirect to login).
