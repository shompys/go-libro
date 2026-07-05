import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const contentDir = path.join(__dirname, 'src/content');

function walk(dir, files = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, files);
    else if (e.name.endsWith('.md')) files.push(full);
  }
  return files;
}

function urlOf(filePath) {
  let rel = path.relative(contentDir, filePath).replace(/\\/g, '/');
  rel = rel.replace(/\/indice\.md$/i, '').replace(/\.md$/, '');
  return '/' + rel;
}

function resolveWikilink(currentFile, target, label) {
  const curDir = path.dirname(currentFile);
  label = label || target;
  target = target.toLowerCase();

  // Relative
  if (target.startsWith('../')) {
    let resolved = curDir;
    for (const p of target.split('/')) {
      if (p === '..') resolved = path.dirname(resolved);
      else resolved = path.join(resolved, p);
    }

    // If resolved is outside contentDir, fall back to content root
    if (!resolved.startsWith(contentDir)) {
      // Try contentDir/remaining-path
      const parts = [];
      let temp = resolved;
      while (temp.length > contentDir.length && temp !== '/') {
        parts.unshift(path.basename(temp));
        temp = path.dirname(temp);
        if (temp.startsWith(contentDir)) break;
      }
      // Try indice.md at content root
      const rootIdx = path.join(contentDir, 'indice.md');
      if (fs.existsSync(rootIdx)) return { url: urlOf(rootIdx), label };
      return { url: '/indice', label };
    }

    const idx = path.join(resolved, 'indice.md');
    if (fs.existsSync(idx)) return { url: urlOf(idx), label };
    if (fs.existsSync(resolved + '.md')) return { url: urlOf(resolved + '.md'), label };
    return { url: urlOf(resolved + '.md'), label };
  }

  // Also try stripping /indice suffix for paths like "estandard/fmt/indice"
  if (target.endsWith('/indice')) {
    const baseTarget = target.replace(/\/indice$/, '');
    const baseFile = path.join(contentDir, baseTarget + '.md');
    if (fs.existsSync(baseFile)) return { url: urlOf(baseFile), label };
  }

  // 1. Local file in curDir
  const localFile = path.join(curDir, target + '.md');
  if (fs.existsSync(localFile)) return { url: urlOf(localFile), label };

  // 2. Local dir with indice.md
  const localIdx = path.join(curDir, target, 'indice.md');
  if (fs.existsSync(localIdx)) return { url: urlOf(localIdx), label };

  // 3. From content root as file
  const fromRoot = path.join(contentDir, target);
  if (fs.existsSync(fromRoot)) return { url: urlOf(fromRoot), label };
  if (fs.existsSync(fromRoot + '.md')) return { url: urlOf(fromRoot + '.md'), label };

  // 4. From content root as dir with indice.md
  const fromRootIdx = path.join(contentDir, target, 'indice.md');
  if (fs.existsSync(fromRootIdx)) return { url: urlOf(fromRootIdx), label };

  // Fallback
  return { url: '/' + target.replace(/\/indice(\.md)?$/i, '').replace(/\.md$/, ''), label };
}

const files = walk(contentDir);
let count = 0;

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  const converted = original.replace(
    /\[\[((?:(?!\]\]).)*)\]\]/gs,
    (m, inner) => {
      let target, label;

      if (inner.includes('\\|')) {
        const idx = inner.indexOf('\\|');
        target = inner.substring(0, idx).trim();
        label = inner.substring(idx + 2).trim();
      } else if (inner.includes('|')) {
        const parts = inner.split('|');
        target = parts[0].trim();
        label = parts[1]?.trim();
      } else {
        target = inner.trim();
      }

      // Handle anchor links: target#heading
      const hashIdx = target.indexOf('#');
      if (hashIdx >= 0) {
        const baseTarget = target.substring(0, hashIdx);
        const anchor = target.substring(hashIdx + 1);
        const slug = anchor.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '').replace(/\./g, '');
        if (baseTarget) {
          const r = resolveWikilink(file, baseTarget, label);
          return `[${label || anchor}](${r.url}#${slug})`;
        }
        return `[${label || anchor}](#${slug})`;
      }

      const r = resolveWikilink(file, target, label);
      return `[${r.label}](${r.url})`;
    }
  );

  if (converted !== original) {
    fs.writeFileSync(file, converted, 'utf8');
    count++;
  }
}

console.log(`Wikilinks convertidos en ${count} archivos`);
