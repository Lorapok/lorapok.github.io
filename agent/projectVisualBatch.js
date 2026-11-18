#!/usr/bin/env node

/**
 * Dispatches newly generated catalog visuals through the protected Loragent
 * Discord integration. The catalog remains the source of truth, so project
 * names, links, categories, and image paths cannot drift from the website.
 */

const fs = require('fs');
const path = require('path');
const Module = require('module');
const ts = require('typescript');

function loadCatalog() {
  const filename = path.resolve(__dirname, '../src/data/lorapok.ts');
  const source = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: filename,
  }).outputText;
  const catalogModule = new Module(filename, module);
  catalogModule.filename = filename;
  catalogModule.paths = Module._nodeModulePaths(path.dirname(filename));
  catalogModule._compile(compiled, filename);
  return catalogModule.exports;
}

const { projects } = loadCatalog();
const { postProjectVisualToDiscord } = require('./distributor.js');

const DRIVE_ARCHIVE_URL =
  process.env.PROJECT_VISUAL_DRIVE_URL ||
  'https://drive.google.com/drive/folders/1QggmdxTCTKE4V8wLI8Gvn-R30gK8Zg7V';
const SITE_ORIGIN = 'https://lorapok.tech';
const SITE_REVISION = process.env.PROJECT_VISUAL_REVISION || 'e867a1b';
const DELIVERY_DELAY_MS = Number(process.env.PROJECT_VISUAL_DELAY_MS || 1200);
const MAX_ATTEMPTS = Number(process.env.PROJECT_VISUAL_MAX_ATTEMPTS || 3);

const sleep = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function selectProjectUrl(project) {
  const preferred = project.links.find((link) =>
    ['web', 'github', 'npm', 'packagist', 'firefox', 'vscode', 'openvsx'].includes(link.icon),
  );

  return preferred?.url || project.links[0]?.url || `${SITE_ORIGIN}/projects/`;
}

function selectVisualProjects() {
  return projects.filter(
    (project) =>
      typeof project.image === 'string' &&
      project.image.startsWith('/assets/projects/generated/') &&
      project.image.endsWith('-product-v2.webp'),
  );
}

async function deliverProject(project) {
  const dispatch = {
    name: project.name,
    tagline: project.tagline,
    category: project.category,
    url: selectProjectUrl(project),
    imageUrl: `${SITE_ORIGIN}${project.image}?v=${SITE_REVISION}`,
    driveFolderUrl: DRIVE_ARCHIVE_URL,
  };

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
    const result = await postProjectVisualToDiscord(dispatch);
    if (result.status === 'success') {
      return result;
    }

    if (attempt < MAX_ATTEMPTS) {
      await sleep(DELIVERY_DELAY_MS * attempt);
    } else {
      throw new Error(
        `${project.name}: ${result.status} (HTTP ${result.statusCode || 'n/a'}) ${result.error || result.reason || ''}`.trim(),
      );
    }
  }
}

async function main() {
  const selected = selectVisualProjects();
  const startAfter = process.env.PROJECT_VISUAL_START_AFTER;
  const startIndex = startAfter
    ? Math.max(0, selected.findIndex((project) => project.name === startAfter) + 1)
    : 0;
  const queue = selected.slice(startIndex);

  console.log(`Loragent project visual dispatch: ${queue.length} queued (${selected.length} total).`);

  if (process.env.PROJECT_VISUAL_DRY_RUN === '1') {
    for (const project of queue) {
      console.log(`[dry-run] ${project.name} -> ${project.image}`);
    }
    console.log(`Loragent project visual dry run complete: ${queue.length} validated.`);
    return;
  }

  if (!process.env.DISCORD_WEBHOOK_URL?.trim()) {
    throw new Error('DISCORD_WEBHOOK_URL is required for project visual dispatch.');
  }

  let delivered = 0;
  for (const project of queue) {
    await deliverProject(project);
    delivered += 1;
    console.log(`[${delivered}/${queue.length}] ${project.name}`);
    if (delivered < queue.length) {
      await sleep(DELIVERY_DELAY_MS);
    }
  }

  console.log(`Loragent project visual dispatch complete: ${delivered}/${queue.length} delivered.`);
}

main().catch((error) => {
  console.error(`Loragent project visual dispatch failed: ${error.message}`);
  process.exitCode = 1;
});
