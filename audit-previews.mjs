#!/usr/bin/env node
/**
 * audit-previews.mjs
 *
 * Audita el sistema de previews en designs-subastop/.
 *
 * Reporta:
 *   1. Componentes: cuáles incluyen variant-filter.js y cuáles no
 *   2. Previews iframe-based: cuáles pasan ?embed=1 y cuáles no
 *   3. Previews con offsets negativos legacy (top:-N / left:-N en iframes)
 *   4. Previews "hardcodeados" (sin iframes — markup inline duplicado)
 *
 * Uso: node scripts/audit-previews.mjs
 */

import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { resolve, relative, sep } from "path";

const ROOT = resolve(process.cwd(), "designs-subastop");
const COMP_ROOT = resolve(ROOT, "components");
const PREV_ROOT = resolve(ROOT, "pages", "previews");

// ── Utilidades ──────────────────────────────────────────────────────────────
function walk(dir, predicate) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = resolve(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      out.push(...walk(full, predicate));
    } else if (predicate(full)) {
      out.push(full);
    }
  }
  return out;
}

function rel(p) { return relative(ROOT, p).split(sep).join("/"); }

function color(code, str) { return `\x1b[${code}m${str}\x1b[0m`; }
const RED = (s) => color(31, s);
const GREEN = (s) => color(32, s);
const YELLOW = (s) => color(33, s);
const CYAN = (s) => color(36, s);
const DIM = (s) => color(2, s);
const BOLD = (s) => color(1, s);

// ── Checks ──────────────────────────────────────────────────────────────────
function auditComponents() {
  const componentFiles = walk(COMP_ROOT, (f) => f.endsWith("claude.html"));
  const withFilter = [];
  const withoutFilter = [];

  for (const file of componentFiles) {
    const content = readFileSync(file, "utf8");
    if (content.includes("variant-filter.js")) {
      withFilter.push(file);
    } else {
      withoutFilter.push(file);
    }
  }
  return { componentFiles, withFilter, withoutFilter };
}

function auditPreviews() {
  // Excluye la landing pages/previews/index.html — no es una composición,
  // es la lista de enlaces a previews.
  const LANDING = resolve(PREV_ROOT, "index.html");
  const previewFiles = walk(PREV_ROOT, (f) => f.endsWith("index.html") && f !== LANDING);
  const reports = [];

  for (const file of previewFiles) {
    const content = readFileSync(file, "utf8");

    // Encontrar todos los iframes que apuntan a /components/
    const iframeRegex = /<iframe[^>]*src=["']([^"']*\/components\/[^"']+)["'][^>]*>/g;
    const iframes = [];
    let m;
    while ((m = iframeRegex.exec(content)) !== null) {
      iframes.push(m[1]);
    }

    // Detectar offsets negativos legacy en CSS de iframes
    const negativeOffsetRegex = /iframe\s*\{[^}]*?(left:\s*-\d+px|top:\s*-\d+px)/g;
    const legacyOffsets = [];
    while ((m = negativeOffsetRegex.exec(content)) !== null) {
      legacyOffsets.push(m[0].replace(/\s+/g, " "));
    }

    const withoutEmbed = iframes.filter((src) => !/[?&]embed=1\b/.test(src));

    reports.push({
      file,
      iframeCount: iframes.length,
      iframesWithoutEmbed: withoutEmbed,
      legacyOffsetCount: legacyOffsets.length,
      legacyOffsetSamples: legacyOffsets.slice(0, 3),
      isHardcoded: iframes.length === 0,
    });
  }
  return reports;
}

// ── Render ──────────────────────────────────────────────────────────────────
function render() {
  console.log(BOLD("\n═══ AUDIT — Previews & Components ═══\n"));

  // 1. Componentes
  const { componentFiles, withFilter, withoutFilter } = auditComponents();
  console.log(BOLD("1. Componentes con variant-filter.js"));
  console.log(`   Total componentes: ${componentFiles.length}`);
  console.log(`   ${GREEN("✓ Con variant-filter.js:")} ${withFilter.length}`);
  console.log(`   ${RED("✗ Sin variant-filter.js: ")} ${withoutFilter.length}`);
  if (withoutFilter.length > 0) {
    console.log(YELLOW("\n   Componentes que no embeben variant-filter.js:"));
    for (const f of withoutFilter) console.log(`     - ${rel(f)}`);
    console.log(DIM("   → estos no se pueden iframear con embed-mode hasta arreglarlos."));
  }

  // 2. Previews
  console.log(BOLD("\n2. Previews"));
  const reports = auditPreviews();

  const iframeBased = reports.filter((r) => !r.isHardcoded);
  const hardcoded = reports.filter((r) => r.isHardcoded);

  console.log(`   Total previews: ${reports.length}`);
  console.log(`   ${CYAN("Iframe-based:")} ${iframeBased.length}`);
  console.log(`   ${YELLOW("Hardcoded (markup inline):")} ${hardcoded.length}`);

  // 2a. Iframes sin embed=1
  console.log(BOLD("\n2a. Iframes sin ?embed=1 (heredan chrome del showcase)"));
  let missingEmbedTotal = 0;
  for (const r of iframeBased) {
    if (r.iframesWithoutEmbed.length === 0) continue;
    missingEmbedTotal += r.iframesWithoutEmbed.length;
    console.log(`   ${RED("✗")} ${rel(r.file)} — ${r.iframesWithoutEmbed.length} iframe(s) sin embed=1:`);
    for (const src of r.iframesWithoutEmbed.slice(0, 4)) {
      console.log(`        ${DIM(src)}`);
    }
    if (r.iframesWithoutEmbed.length > 4) {
      console.log(`        ${DIM(`...y ${r.iframesWithoutEmbed.length - 4} más`)}`);
    }
  }
  if (missingEmbedTotal === 0) {
    console.log(`   ${GREEN("✓ Todos los iframes pasan ?embed=1.")}`);
  }

  // 2b. Offsets negativos legacy
  console.log(BOLD("\n2b. Offsets negativos en CSS de iframes (legacy hack)"));
  let legacyTotal = 0;
  for (const r of iframeBased) {
    if (r.legacyOffsetCount === 0) continue;
    legacyTotal += r.legacyOffsetCount;
    console.log(`   ${YELLOW("⚠")} ${rel(r.file)} — ${r.legacyOffsetCount} regla(s) con offset negativo:`);
    for (const sample of r.legacyOffsetSamples) {
      console.log(`        ${DIM(sample.slice(0, 100))}`);
    }
  }
  if (legacyTotal === 0) {
    console.log(`   ${GREEN("✓ Sin offsets negativos.")}`);
  }

  // 2c. Hardcodeados
  console.log(BOLD("\n2c. Previews hardcodeados (sin iframes — markup inline duplicado)"));
  if (hardcoded.length === 0) {
    console.log(`   ${GREEN("✓ Ningún preview hardcodea componentes.")}`);
  } else {
    for (const r of hardcoded) {
      console.log(`   ${YELLOW("⚠")} ${rel(r.file)}`);
    }
    console.log(DIM("   → migrar a iframes con ?embed=1 para reusar el componente real."));
  }

  // ── Resumen ───────────────────────────────────────────────────────────────
  console.log(BOLD("\n═══ Resumen ═══"));
  const blockers = withoutFilter.length + missingEmbedTotal + legacyTotal;
  if (blockers === 0 && hardcoded.length === 0) {
    console.log(GREEN("✓ Todo fino. Sistema de previews 100% iframe-based con embed-mode.\n"));
  } else {
    if (withoutFilter.length > 0) console.log(`${RED("✗")} ${withoutFilter.length} componente(s) sin variant-filter.js`);
    if (missingEmbedTotal > 0)    console.log(`${RED("✗")} ${missingEmbedTotal} iframe(s) sin ?embed=1`);
    if (legacyTotal > 0)          console.log(`${YELLOW("⚠")} ${legacyTotal} regla(s) CSS con offset negativo legacy`);
    if (hardcoded.length > 0)     console.log(`${YELLOW("⚠")} ${hardcoded.length} preview(s) hardcodeado(s)`);
    console.log("");
  }

  const exitCode = (withoutFilter.length > 0 || missingEmbedTotal > 0 || legacyTotal > 0) ? 1 : 0;
  process.exit(exitCode);
}

render();
