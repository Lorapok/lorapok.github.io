"use strict";
// agent/imageAgent.ts
// Multi-Image Synthesizer Agent for LoLaBo
// Enriches research treatises and technical blogs with multiple distinct,
// topic-correlated visual assets across multiple public & AI image APIs:
// 1. Hero Cover Visual (1200x630)
// 2. System Architecture Blueprint / Topology Visual (Figure 1, 800x450)
// 3. Hardware / Telemetry / Benchmark Visual (Figure 2, 800x450)
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPollinationsUrl = buildPollinationsUrl;
exports.synthesizePostVisualSuite = synthesizePostVisualSuite;
exports.injectVisualsIntoMarkdown = injectVisualsIntoMarkdown;
const imageGen_1 = require("./imageGen");
/**
 * Deterministic integer hash for seed generation
 */
function hashStr(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
    }
    return Math.abs(hash);
}
/**
 * Clean and normalize a string for visual prompt synthesis
 */
function sanitizePromptText(text) {
    return text
        .replace(/[^\w\s-]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
/**
 * Builds a distinct Pollinations AI URL with customizable model and dimensions
 */
function buildPollinationsUrl(prompt, seed, width = 1200, height = 630, model = 'flux') {
    const cleanPrompt = encodeURIComponent(prompt.slice(0, 500));
    return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}&model=${model}`;
}
/**
 * Curated Unsplash technical photography banks for real-world hardware & infra
 */
const HARDWARE_PHOTO_BANK = {
    ai_neural: [
        "photo-1620712943543-bcc4688e7485", // AI neural network core
        "photo-1618005182384-a83a8bd57fbe", // Cybernetic visual field
        "photo-1635070041078-e363dbe005cb", // Neural lattice
        "photo-1507413245164-6160d8298b31" // Holographic model computation
    ],
    backend_infra: [
        "photo-1558494949-ef010cbdcc31", // Datacenter server rack blue
        "photo-1544197150-b99a580bb7a8", // Datacenter corridor
        "photo-1504384308090-c894fdcc538d", // Optical fiber network cables
        "photo-1563986768609-322da13575f3" // Server cluster
    ],
    security_crypto: [
        "photo-1563986768494-4dee2763ff3f", // Security lock
        "photo-1510511459019-5dda7724fd87", // Firewall code
        "photo-1555949963-ff9fe0c870eb", // Threat shield
        "photo-1614064641938-3bbee52942c7" // Cybersecurity scanner
    ],
    quantum_compute: [
        "photo-1635070041078-e363dbe005cb", // Quantum dilution refrigerator core
        "photo-1507413245164-6160d8298b31", // Qubit microwave resonance array
        "photo-1518770660439-4636190af475" // Cryogenic superconducting circuitry
    ],
    distributed_storage: [
        "photo-1558494949-ef010cbdcc31", // High-density NVMe drive array
        "photo-1544197150-b99a580bb7a8", // SAN fiber channel fabric
        "photo-1504384308090-c894fdcc538d" // High-throughput backplane
    ],
    compiler_memory: [
        "photo-1518770660439-4636190af475", // Silicon die cache hierarchy
        "photo-1550745165-9bc0b252726f", // SIMD vector execution register
        "photo-1531297484001-80022131f5a1" // Instruction pipeline analysis
    ],
    general_tech: [
        "photo-1518770660439-4636190af475", // Electronic circuit microchip
        "photo-1531297484001-80022131f5a1", // High performance workstation
        "photo-1488590528505-98d2b5aba04b", // Data analytics screen
        "photo-1550745165-9bc0b252726f" // Cyberpunk hardware
    ]
};
/**
 * Synthesizes a full multi-image suite for an article:
 * - 1 Cover Visual (1200x630)
 * - 1 Architecture Blueprint Visual (800x450)
 * - 1 Benchmark & Telemetry Visual (800x450)
 */
async function synthesizePostVisualSuite(title, category, tags = [], imageKeywords = [], imagePrompt, existingPosts = []) {
    const theme = (0, imageGen_1.resolveTechnicalTheme)(title, category, tags, imageKeywords);
    const cleanTitle = sanitizePromptText(title);
    const subjectTerms = (imageKeywords.length > 0 ? imageKeywords : tags.slice(0, 4)).join(', ');
    // Collect all known used URLs to prevent any duplication
    const usedUrls = new Set();
    for (const p of existingPosts) {
        if (p.coverImage)
            usedUrls.add(p.coverImage.trim());
        if (p.architectureImage)
            usedUrls.add(p.architectureImage.trim());
        if (p.benchmarkImage)
            usedUrls.add(p.benchmarkImage.trim());
        if (Array.isArray(p.figures)) {
            p.figures.forEach((f) => f.url && usedUrls.add(f.url.trim()));
        }
    }
    const baseSeed = hashStr(cleanTitle + theme);
    // ─── 1. Primary Hero Cover Image (1200x630) ───
    let coverPrompt = '';
    if (imagePrompt && imagePrompt.trim().length > 15) {
        coverPrompt = `${sanitizePromptText(imagePrompt)}, octane render, cinematic volumetric lighting, 8k resolution, photorealistic, zero text, zero watermark`;
    }
    else {
        coverPrompt = `${cleanTitle}, ${category}, ${subjectTerms}, high-tech isometric concept, glowing telemetry waveguides, dark slate chassis, octane render 8k, cinematic, zero text, zero watermark`;
    }
    let coverUrl = '';
    for (let attempt = 0; attempt < 30; attempt++) {
        const seed = (baseSeed + attempt * 104729 + 1) % 100000000;
        const candidate = buildPollinationsUrl(coverPrompt, seed, 1200, 630, 'flux');
        if (!usedUrls.has(candidate)) {
            coverUrl = candidate;
            usedUrls.add(coverUrl);
            break;
        }
    }
    if (!coverUrl) {
        coverUrl = buildPollinationsUrl(coverPrompt, (baseSeed + Date.now()) % 100000000, 1200, 630, 'flux');
    }
    // ─── 2. Architecture Blueprint Visual (800x450) ───
    const archPrompt = `Detailed technical architecture diagram, isometric system topology for ${cleanTitle}, internal data bus, memory subsystems, queue pipelines, dark blueprint schematic, cyan glowing signal lines, 3d isometric render, 8k, clean, zero text`;
    let archUrl = '';
    for (let attempt = 0; attempt < 30; attempt++) {
        const seed = (baseSeed + attempt * 7919 + 24851) % 100000000;
        const candidate = buildPollinationsUrl(archPrompt, seed, 800, 450, 'flux');
        if (!usedUrls.has(candidate)) {
            archUrl = candidate;
            usedUrls.add(archUrl);
            break;
        }
    }
    if (!archUrl) {
        archUrl = buildPollinationsUrl(archPrompt, (baseSeed + Date.now() + 777) % 100000000, 800, 450, 'flux');
    }
    // ─── 3. Hardware / Telemetry / Benchmark Visual (800x450) ───
    // Combine with Unsplash or Pollinations AI for distinct variety
    let benchUrl = '';
    const bank = HARDWARE_PHOTO_BANK[theme] || HARDWARE_PHOTO_BANK.general_tech;
    const photoId = bank[baseSeed % bank.length];
    const unsplashCandidate = `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=800&h=450&q=80`;
    if (!usedUrls.has(unsplashCandidate)) {
        benchUrl = unsplashCandidate;
        usedUrls.add(benchUrl);
    }
    else {
        // Generate AI Benchmark visualization
        const benchPrompt = `Server telemetry performance monitoring dashboard, hardware performance graphs, throughput latency histograms, oscilloscope waveform, dark glowing terminal aesthetic, octane render 8k, zero text`;
        for (let attempt = 0; attempt < 30; attempt++) {
            const seed = (baseSeed + attempt * 15485 + 982451) % 100000000;
            const candidate = buildPollinationsUrl(benchPrompt, seed, 800, 450, 'flux');
            if (!usedUrls.has(candidate)) {
                benchUrl = candidate;
                usedUrls.add(benchUrl);
                break;
            }
        }
        if (!benchUrl) {
            benchUrl = buildPollinationsUrl(benchPrompt, (baseSeed + Date.now() + 1337) % 100000000, 800, 450, 'flux');
        }
    }
    const figures = [
        {
            id: 'fig-architecture',
            caption: `Figure 1: Architectural topology, execution pipeline, and isolation boundaries for ${title}.`,
            url: archUrl,
            type: 'architecture'
        },
        {
            id: 'fig-telemetry',
            caption: `Figure 2: Empirical throughput, telemetry traces, and resource utilization invariants.`,
            url: benchUrl,
            type: 'benchmark'
        }
    ];
    return {
        coverImage: coverUrl,
        architectureImage: archUrl,
        benchmarkImage: benchUrl,
        figures
    };
}
/**
 * Injects contextual figures seamlessly into the markdown body at optimal section boundaries
 */
function injectVisualsIntoMarkdown(content, visuals) {
    if (!visuals || !visuals.architectureImage || !visuals.benchmarkImage) {
        return content;
    }
    // Prevent double-injection
    if (content.includes(visuals.architectureImage) || content.includes('fig-architecture')) {
        return content;
    }
    const sections = content.split(/\n(?=##\s+)/);
    if (sections.length < 3) {
        // Shorter article: inject at natural paragraph breaks
        const paragraphs = content.split('\n\n');
        if (paragraphs.length >= 6) {
            paragraphs.splice(2, 0, `\n\n![${visuals.figures[0].caption}](${visuals.architectureImage})\n*${visuals.figures[0].caption}*\n\n`);
            paragraphs.splice(paragraphs.length - 2, 0, `\n\n![${visuals.figures[1].caption}](${visuals.benchmarkImage})\n*${visuals.figures[1].caption}*\n\n`);
            return paragraphs.join('\n\n');
        }
        return content;
    }
    // Multi-section article: inject Figure 1 after section 2 or 3 (Architecture / Core Engine)
    const archIndex = Math.min(2, Math.floor(sections.length * 0.35));
    sections[archIndex] = sections[archIndex] + `\n\n![${visuals.figures[0].caption}](${visuals.architectureImage})\n*${visuals.figures[0].caption}*\n`;
    // Inject Figure 2 before conclusions / references (Performance / Evaluation / Trade-offs)
    const benchIndex = Math.min(sections.length - 2, Math.floor(sections.length * 0.70));
    if (benchIndex > archIndex) {
        sections[benchIndex] = sections[benchIndex] + `\n\n![${visuals.figures[1].caption}](${visuals.benchmarkImage})\n*${visuals.figures[1].caption}*\n`;
    }
    return sections.join('\n');
}
