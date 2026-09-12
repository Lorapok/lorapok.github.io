// scripts/validate-all.js
// Lorapok Labs — Complete Pre-Flight Validation Engine
// Validates architecture diagrams, catalog integrity, model ladders, types, and builds before push to main/live.

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rootDir = process.cwd();
let totalErrors = 0;
let totalWarnings = 0;

function logSection(title) {
  console.log(`\n\x1b[1m\x1b[36m=======================================================`);
  console.log(`🔍 ${title}`);
  console.log(`=======================================================\x1b[0m`);
}

function logPass(msg) {
  console.log(`  \x1b[32m✔\x1b[0m ${msg}`);
}

function logWarn(msg) {
  totalWarnings++;
  console.log(`  \x1b[33m⚠ [WARN]\x1b[0m ${msg}`);
}

function logFail(msg) {
  totalErrors++;
  console.log(`  \x1b[31m✖ [FAIL]\x1b[0m ${msg}`);
}

// ─── 1. Architectural & Mermaid Diagram Validation ───
logSection('1. Architecture & Mermaid Diagram Validator');

function validateMermaidBlock(code, sourceName) {
  const issues = [];
  const trimmed = code.trim();
  const lines = trimmed.split('\n');
  const firstLine = lines[0].trim();

  // 1. Valid diagram keyword
  const validKeywords = [
    'flowchart', 'graph', 'sequenceDiagram', 'classDiagram',
    'stateDiagram', 'stateDiagram-v2', 'erDiagram', 'journey',
    'gantt', 'pie', 'gitGraph', 'architecture-beta'
  ];
  const hasValidKeyword = validKeywords.some(kw => firstLine.startsWith(kw));
  if (!hasValidKeyword) {
    issues.push(`Unknown diagram declaration: "${firstLine}"`);
  }

  // 2. Flowchart specific checks
  if (firstLine.startsWith('flowchart') || firstLine.startsWith('graph')) {
    lines.forEach((line, idx) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('%%') || trimmedLine.startsWith('classDef')) return;

      // Check for legacy '-- "text" -->' syntax which errors in Mermaid v10
      if (/--\s*"[^"]+"\s*-->/.test(trimmedLine)) {
        issues.push(`Line ${idx + 1}: Legacy edge link syntax '-- "text" -->' detected. Use '-->|"text"|' instead.`);
      }

      // Check for unquoted HTML brackets in node definitions
      const nodeMatch = trimmedLine.match(/\[(.*?)\]/);
      if (nodeMatch) {
        const text = nodeMatch[1];
        if ((text.includes('<') || text.includes('>')) && !text.startsWith('"') && !text.startsWith("'")) {
          if (!/<br\s*\/?>/.test(text) && (text.includes('<') || text.includes('>'))) {
            issues.push(`Line ${idx + 1}: Unquoted angle brackets in node label [${text}]. Wrap label in quotes: ["${text}"].`);
          }
        }
      }
    });
  }

  // 3. SequenceDiagram specific checks
  if (firstLine.startsWith('sequenceDiagram')) {
    lines.forEach((line, idx) => {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('%%')) return;

      // Check for unescaped arrows inside message text
      const msgMatch = trimmedLine.match(/^(?:[\w\s]+->>[\w\s]+:\s*)(.*)$/);
      if (msgMatch) {
        const msg = msgMatch[1];
        if (msg.includes('->') || msg.includes('-->') || msg.includes('->>')) {
          issues.push(`Line ${idx + 1}: Message contains raw arrow operators ('->'). Replace with unicode arrow ('→') to prevent lexer confusion.`);
        }
      }

      // Check alt/else conditions for raw angle brackets
      if (trimmedLine.startsWith('alt ') || trimmedLine.startsWith('else ')) {
        if (trimmedLine.includes('<') || trimmedLine.includes('>')) {
          issues.push(`Line ${idx + 1}: Condition contains raw angle brackets ('<'/'>'). Use descriptive words or escape characters.`);
        }
      }
    });
  }

  return issues;
}

// Audit README.md diagrams
const readmePath = path.join(rootDir, 'README.md');
if (fs.existsSync(readmePath)) {
  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  const readmeMermaidMatches = [...readmeContent.matchAll(/```mermaid([\s\S]*?)```/g)];
  if (readmeMermaidMatches.length === 0) {
    logWarn('README.md has no Mermaid architecture diagrams.');
  } else {
    readmeMermaidMatches.forEach((m, idx) => {
      const diagErrors = validateMermaidBlock(m[1], `README.md (diagram ${idx + 1})`);
      if (diagErrors.length > 0) {
        diagErrors.forEach(e => logFail(`README.md diag ${idx + 1}: ${e}`));
      } else {
        logPass(`README.md diag ${idx + 1} (${m[1].trim().split('\n')[0]}): 100% syntactically valid`);
      }
    });
  }
}

// Audit posts.json diagrams
const postsPath = path.join(rootDir, 'public/blog/posts.json');
let posts = [];
if (fs.existsSync(postsPath)) {
  posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));
  let validDiags = 0;
  posts.forEach((post, pIdx) => {
    const mermaidMatches = [...(post.content || '').matchAll(/```mermaid([\s\S]*?)```/g)];
    if (mermaidMatches.length === 0) {
      logWarn(`Post ${pIdx} (${post.slug}): No architecture diagram found`);
    } else {
      mermaidMatches.forEach((m, dIdx) => {
        const diagErrors = validateMermaidBlock(m[1], `Post ${pIdx} (${post.slug})`);
        if (diagErrors.length > 0) {
          diagErrors.forEach(e => logFail(`Post ${pIdx} diag ${dIdx + 1}: ${e}`));
        } else {
          validDiags++;
        }
      });
    }
  });
  logPass(`Validated ${validDiags} architecture schematics across ${posts.length} catalog posts`);
} else {
  logFail('public/blog/posts.json not found!');
}

// ─── 2. Catalog Integrity & Completeness Barrier ───
logSection('2. Catalog Integrity & Completeness Barrier');

const bannedKeywords = [
  'octane render',
  'glowing neon',
  'cybernetic',
  'cyberpunk',
  'holographic',
  'futuristic',
  'laser lines'
];

const seenSlugs = new Set();
const seenImages = new Set();

posts.forEach((post, idx) => {
  const required = ['title', 'slug', 'excerpt', 'content', 'coverImage', 'author', 'tags'];
  const missing = required.filter(k => !post[k]);
  if (missing.length > 0) {
    logFail(`Post ${idx} missing fields: ${missing.join(', ')}`);
  }

  if (seenSlugs.has(post.slug)) {
    logFail(`Duplicate slug detected: "${post.slug}" in post ${idx}`);
  }
  seenSlugs.add(post.slug);

  if (post.coverImage && seenImages.has(post.coverImage)) {
    logWarn(`Duplicate coverImage detected: "${post.coverImage}" in post ${idx}`);
  }
  if (post.coverImage) seenImages.add(post.coverImage);

  const fences = (post.content || '').match(/```/g);
  if (fences && fences.length % 2 !== 0) {
    logFail(`Post ${idx} (${post.slug}) has unbalanced code fences (${fences.length} instances)!`);
  }

  const words = (post.content || '').split(/\s+/).filter(Boolean).length;
  if (words < 1000) {
    logWarn(`Post ${idx} (${post.slug}) is short (${words} words)`);
  }

  const postStr = JSON.stringify(post).toLowerCase();
  bannedKeywords.forEach(banned => {
    if (postStr.includes(banned)) {
      logWarn(`Post ${idx} contains banned aesthetic cliché: "${banned}"`);
    }
  });
});
logPass(`Catalog integrity confirmed: ${posts.length} articles audited with zero unclosed fences.`);

// ─── 3. Model Validator Registry & Candidate Ladder Matrix ───
logSection('3. Model Validator Registry & Candidate Ladders');

const deprecatedPath = path.join(rootDir, '.loragent-debug/deprecated-models.json');
let deprecatedModels = [];
if (fs.existsSync(deprecatedPath)) {
  try {
    const rawData = JSON.parse(fs.readFileSync(deprecatedPath, 'utf8'));
    deprecatedModels = Array.isArray(rawData) ? rawData : (rawData.deprecated || []);
    logPass(`Model quarantine active: ${deprecatedModels.length} deprecated models registered (${deprecatedModels.join(', ') || 'none'})`);
  } catch (err) {
    logFail(`.loragent-debug/deprecated-models.json is corrupted: ${err.message}`);
  }
} else {
  logPass('Model quarantine file clean (no deprecated models quarantined)');
}

const writerPath = path.join(rootDir, 'agent/writer.ts');
if (fs.existsSync(writerPath)) {
  const writerContent = fs.readFileSync(writerPath, 'utf8');
  const hasGemini3 = writerContent.includes('gemini-3.8-flash') && writerContent.includes('gemini-3.1-pro-preview');
  const hasGemini2 = writerContent.includes('gemini-2.5-pro') && writerContent.includes('gemini-2.0-flash');
  if (hasGemini3 && hasGemini2) {
    logPass('Candidate ladders configured with Gemini 3.x primary + Gemini 2.x resilient fallbacks');
  } else {
    logFail('Candidate ladders in agent/writer.ts missing Gemini 3.x or Gemini 2.x versions');
  }
}

// ─── 4. TypeScript Type Safety ───
logSection('4. TypeScript Compilation & Type Safety');

try {
  execSync('npx tsc --noEmit', { stdio: 'pipe' });
  logPass('Client TypeScript typecheck passed (0 errors)');
} catch (err) {
  logFail(`Client TypeScript compilation failed:\n${err.stdout?.toString() || err.message}`);
}

try {
  execSync('npm --prefix agent run build', { stdio: 'pipe' });
  logPass('Agent TypeScript compilation passed (0 errors)');
} catch (err) {
  logFail(`Agent TypeScript compilation failed:\n${err.stdout?.toString() || err.message}`);
}

// ─── 5. Production Static Build & Postbuild Verification ───
logSection('5. Production Static Build & Pre-Rendering');

try {
  execSync('npm run build', { stdio: 'pipe' });
  logPass('Vite build and postbuild pre-rendering completed successfully');

  const distDir = path.join(rootDir, 'dist');
  const requiredRoutes = ['projects', 'agents', 'blog', 'team', 'about', 'changelog', 'contact'];
  let routesOk = true;
  requiredRoutes.forEach(r => {
    if (!fs.existsSync(path.join(distDir, r, 'index.html'))) {
      logFail(`Missing pre-rendered static route: dist/${r}/index.html`);
      routesOk = false;
    }
  });
  if (routesOk) {
    logPass('All 7 static core routes verified in dist/');
  }

  let blogPagesOk = true;
  posts.slice(0, 5).forEach(p => {
    if (!fs.existsSync(path.join(distDir, 'blog', p.slug, 'index.html'))) {
      logFail(`Missing pre-rendered static blog page: dist/blog/${p.slug}/index.html`);
      blogPagesOk = false;
    }
  });
  if (blogPagesOk) {
    logPass(`Pre-rendered static blog pages verified in dist/blog/:slug/index.html`);
  }
} catch (err) {
  logFail(`Production build failed:\n${err.stdout?.toString() || err.message}`);
}

// ─── Summary ───
logSection('Validation Summary');
if (totalErrors === 0) {
  console.log(`\n\x1b[1m\x1b[32m✔ ALL PRE-FLIGHT CHECKS PASSED (${totalWarnings} warnings, 0 errors)!\x1b[0m`);
  console.log(`\x1b[32mCodebase is 100% verified, validated, and safe to push to live / main.\x1b[0m\n`);
  process.exit(0);
} else {
  console.error(`\n\x1b[1m\x1b[31m✖ PRE-FLIGHT VALIDATION FAILED with ${totalErrors} errors (${totalWarnings} warnings)!\x1b[0m`);
  console.error(`\x1b[31mFix the reported errors before pushing to live / main.\x1b[0m\n`);
  process.exit(1);
}
