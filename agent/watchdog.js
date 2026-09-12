"use strict";
// agent/watchdog.ts
// LoLaBo Watchdog & High-Availability Supervisor Agent
// 1. Monitors backend microservice health on port 8080 with automatic restart
// 2. Detects missed publication windows (e.g. from previous day downtime) and triggers catch-up dispatches
// 3. Persists orchestration state to .loragent-debug/orchestration-graph.json
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.runWatchdog = runWatchdog;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const http = __importStar(require("http"));
const child_process_1 = require("child_process");
const PORT = parseInt(process.env.PORT || '8080', 10);
const HOST = process.env.HOST || '127.0.0.1';
const HEALTH_URL = `http://${HOST}:${PORT}/health`;
const DISPATCH_URL = `http://${HOST}:${PORT}/api/dispatch`;
const POSTS_JSON_PATH = path.resolve(__dirname, '../public/blog/posts.json');
const ORCHESTRATION_STATE_PATH = path.resolve(__dirname, '../.loragent-debug/orchestration-graph.json');
const state = {
    supervisor: 'lolabo-watchdog-agent',
    version: '1.0.0',
    serverPid: null,
    serverStatus: 'unknown',
    lastHealthcheckAt: null,
    lastDispatchAt: null,
    postsInCatalog: 0,
    totalRestarts: 0,
    lastCatchupAt: null,
    cadenceHours: 1
};
let serverProcess = null;
let isCatchingUp = false;
function saveOrchestrationState() {
    try {
        const dir = path.dirname(ORCHESTRATION_STATE_PATH);
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(ORCHESTRATION_STATE_PATH, JSON.stringify(state, null, 2), 'utf8');
    }
    catch (err) {
        console.warn("⚠️ [Watchdog] Could not persist orchestration graph:", err);
    }
}
function probeHealth() {
    return new Promise((resolve) => {
        const req = http.get(HEALTH_URL, { timeout: 3000 }, (res) => {
            let raw = '';
            res.on('data', chunk => raw += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try {
                        resolve({ ok: true, data: JSON.parse(raw) });
                    }
                    catch {
                        resolve({ ok: true });
                    }
                }
                else {
                    resolve({ ok: false });
                }
            });
        });
        req.on('error', () => resolve({ ok: false }));
        req.on('timeout', () => {
            req.destroy();
            resolve({ ok: false });
        });
    });
}
function triggerDispatch() {
    return new Promise((resolve) => {
        const postData = JSON.stringify({ force: false });
        const req = http.request(DISPATCH_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            },
            timeout: 120000 // 2 minutes for full online synthesis & multi-image generation
        }, (res) => {
            let raw = '';
            res.on('data', chunk => raw += chunk);
            res.on('end', () => {
                console.log(`📡 [Watchdog Dispatch Result] HTTP ${res.statusCode}:`, raw.slice(0, 160));
                resolve(res.statusCode === 200);
            });
        });
        req.on('error', (err) => {
            console.error("❌ [Watchdog] Dispatch trigger error:", err.message);
            resolve(false);
        });
        req.write(postData);
        req.end();
    });
}
function startBackendServer() {
    if (serverProcess) {
        try {
            serverProcess.kill('SIGTERM');
        }
        catch { }
    }
    console.log("🚀 [Watchdog Agent] Spawning backend microservice (server.js --daemon)...");
    const serverPath = path.resolve(__dirname, 'server.js');
    serverProcess = (0, child_process_1.spawn)(process.execPath, [serverPath, '--daemon'], {
        cwd: path.resolve(__dirname),
        stdio: 'inherit',
        env: { ...process.env, PORT: String(PORT), HOST }
    });
    state.serverPid = serverProcess.pid || null;
    state.serverStatus = 'running';
    state.totalRestarts++;
    saveOrchestrationState();
    serverProcess.on('exit', (code, signal) => {
        console.warn(`⚠️ [Watchdog Agent] Backend server exited with code ${code}, signal ${signal}.`);
        state.serverStatus = 'down';
        state.serverPid = null;
        saveOrchestrationState();
    });
}
/**
 * Checks if posts were missed (e.g. from previous day when server was down).
 * If the latest post is older than cadence, triggers catch-up.
 */
async function auditCadenceAndCatchUp() {
    if (isCatchingUp)
        return;
    isCatchingUp = true;
    try {
        if (!fs.existsSync(POSTS_JSON_PATH))
            return;
        const posts = JSON.parse(fs.readFileSync(POSTS_JSON_PATH, 'utf8'));
        state.postsInCatalog = posts.length;
        if (posts.length === 0)
            return;
        const latest = posts[0];
        const latestDate = new Date(latest.publishedAt || 0).getTime();
        const now = Date.now();
        const elapsedHours = (now - latestDate) / (1000 * 60 * 60);
        state.lastDispatchAt = latest.publishedAt;
        saveOrchestrationState();
        if (elapsedHours >= state.cadenceHours) {
            console.log(`⏰ [Watchdog Cadence Alert] Latest post was published ${elapsedHours.toFixed(1)}h ago (threshold: ${state.cadenceHours}h). Triggering autonomous catch-up dispatch...`);
            const success = await triggerDispatch();
            if (success) {
                state.lastCatchupAt = new Date().toISOString();
                console.log("✅ [Watchdog Agent] Catch-up dispatch executed successfully.");
            }
        }
    }
    catch (err) {
        console.warn("⚠️ [Watchdog Agent] Cadence audit notice:", err.message);
    }
    finally {
        isCatchingUp = false;
    }
}
async function runWatchdog(loop = true) {
    console.log("=================================================================");
    console.log("🛡️  LoLaBo Autonomous Watchdog & Recovery Supervisor Agent Active");
    console.log(`🎯  Target: http://${HOST}:${PORT} | Check interval: 30s`);
    console.log("=================================================================\n");
    const checkCycle = async () => {
        state.lastHealthcheckAt = new Date().toISOString();
        const health = await probeHealth();
        if (health.ok) {
            state.serverStatus = 'running';
            console.log(`💓 [Watchdog Heartbeat] Microservice healthy (uptime: ${health.data?.uptimeSeconds || 0}s).`);
            // Microservice is healthy -> verify cadence and perform catch-up if needed
            await auditCadenceAndCatchUp();
        }
        else {
            console.warn("🚨 [Watchdog Alert] Microservice probe failed! Initiating auto-recovery...");
            state.serverStatus = 'restarting';
            startBackendServer();
        }
        saveOrchestrationState();
    };
    // Initial check
    await checkCycle();
    if (loop) {
        setInterval(checkCycle, 30000); // Probe every 30 seconds
    }
}
if (require.main === module) {
    runWatchdog(true);
}
