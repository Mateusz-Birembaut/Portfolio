import fs from 'node:fs/promises';

function bySlug(arr) {
  const map = new Map();
  for (const p of arr) map.set(p.slug, p);
  return map;
}

function deepMergePreferManual(manual, auto) {
  const out = Array.isArray(manual) ? [...manual] : { ...(manual || {}) };
  for (const [k, v] of Object.entries(auto || {})) {
    if (out[k] === undefined || out[k] === null || out[k] === '') {
      out[k] = v;
    } else if (typeof out[k] === 'object' && !Array.isArray(out[k]) && typeof v === 'object' && !Array.isArray(v)) {
      out[k] = deepMergePreferManual(out[k], v);
    }
  }
  return out;
}

async function readJson(path, fallback = { projects: [] }) {
  try { return JSON.parse(await fs.readFile(path, 'utf-8')); }
  catch { return fallback; }
}

async function main() {
  const manual = await readJson('data/projects.json');
  const auto = await readJson('data/projects.auto.json');

  const manualTagged = (manual.projects || []).map(p => ({ ...p, source: p.source || 'manual' }));
  const manualMap = bySlug(manualTagged);
  const autoMap = bySlug(auto.projects || []);

  // keep manual order, then add auto-only
  const merged = [];
  for (const p of manualMap.values()) merged.push(p);
  for (const [slug, ap] of autoMap.entries()) {
    if (!manualMap.has(slug)) merged.push(ap);
    else {
      const idx = merged.findIndex(x => x.slug === slug);
      merged[idx] = deepMergePreferManual(manualMap.get(slug), ap);
    }
  }

  const out = { projects: merged };
  await fs.writeFile('data/projects.final.json', JSON.stringify(out, null, 2), 'utf-8');
  console.log(`Wrote data/projects.final.json with ${merged.length} projects`);
}

main().catch(err => { console.error(err); process.exit(1); });
