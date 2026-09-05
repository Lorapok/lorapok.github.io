---
name: freqghost-deployment
description: Deploy FreqGhost via Docker, nginx, and production configuration — multi-service compose, SSL/TLS, MQTT broker, environment variables. Use when deploying, configuring Docker, setting up nginx, or managing production infrastructure.
---

# 🤖 freqghost-deployment

> [!NOTE]
> **Lorapok Labs Official Asset**
> This asset is compatible with all LLDP-supported AI IDEs.

## 📖 Overview

# FreqGhost Deployment Skill

## When to Use

Activate this skill when the user asks to:
- Deploy FreqGhost to production
- Configure Docker or docker-compose
- Set up nginx reverse proxy
- Configure SSL/TLS certificates
- Set up MQTT broker (Mosquitto)
- Manage environment variables and secrets

## Architecture

### Docker Compose Services

```yaml
services:
  freqghost:          # Main FastAPI server (port 8050)
  mosquitto:          # MQTT broker (port 1883)
  nginx:              # Reverse proxy (port 80/443)
```

### Key Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Python 3.12 image, pip install, uvicorn |
| `docker-compose.yml` | Multi-service orchestration |
| `requirements.txt` | Python dependencies |
| `run_all.sh` | Quick-start orchestration script |

### Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `FREQGHOST_SECRET_KEY` | `freqghost-super-secret-change-me` | JWT signing key |
| `FREQGHOST_TOKEN_EXPIRE` | `1440` | Token expiry in minutes |
| `PORT` | `8050` | Server port |

### Production Checklist

1. **Change the JWT secret key** — Set `FREQGHOST_SECRET_KEY` to a random 32+ character string
2. **Change default admin password** — Log in and change via admin panel
3. **Enable HTTPS** — Use nginx with Let's Encrypt certificates
4. **Restrict CORS** — Set specific allowed origins instead of `*`
5. **Set privacy mode** — Use `--privacy-mode` to strip biometrics from MQTT
6. **No secrets in image** — Use environment variables or mounted config files

### Docker Build

```bash
docker build -t freqghost .
docker run -p 8050:8050 -e FREQGHOST_SECRET_KEY=my-secret freqghost
```

### Multi-stage Build (if needed)

```dockerfile
FROM python:3.12-slim AS build
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

FROM python:3.12-slim
COPY --from=build /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY . /app
WORKDIR /app
CMD ["uvicorn", "tools.live_scene:app", "--host", "0.0.0.0", "--port", "8050"]
```

### Safety Rules

- **Never delete data files** — Always confirm before removing `.npz`, `.pth`, or config files
- **No secrets in image** — Use environment variables or mounted config files
- **Test locally first** — Run `python3 -m tools.live_scene` before building Docker image
