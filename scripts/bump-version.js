/* eslint-disable no-console */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ROOT_PKG = path.join(ROOT, 'package.json');
const PACKAGES_DIR = path.join(ROOT, 'packages');

const BUMP_TYPES = ['major', 'minor', 'patch'];

function bump(current, type) {
  const [major, minor, patch] = current.split('.').map(Number);
  if (type === 'major') {
    return `${major + 1}.0.0`;
  }
  if (type === 'minor') {
    return `${major}.${minor + 1}.0`;
  }
  return `${major}.${minor}.${patch + 1}`;
}

function isValidSemver(v) {
  return /^\d+\.\d+\.\d+$/.test(v);
}

function isGreater(a, b) {
  const [aMaj, aMin, aPat] = a.split('.').map(Number);
  const [bMaj, bMin, bPat] = b.split('.').map(Number);
  if (aMaj !== bMaj) {
    return aMaj > bMaj;
  }
  if (aMin !== bMin) {
    return aMin > bMin;
  }
  return aPat > bPat;
}

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const bumpArg = args.find((a) => !a.startsWith('-'));

if (!bumpArg) {
  console.error('Usage: node scripts/bump-version.js <major|minor|patch|x.y.z> [--dry-run]');
  process.exit(1);
}

const rootPkg = JSON.parse(fs.readFileSync(ROOT_PKG, 'utf8'));
const currentVersion = rootPkg.version;

let newVersion;
if (BUMP_TYPES.includes(bumpArg)) {
  newVersion = bump(currentVersion, bumpArg);
} else if (isValidSemver(bumpArg)) {
  newVersion = bumpArg;
  if (!isGreater(newVersion, currentVersion)) {
    console.error(`Error: ${newVersion} is not greater than current version ${currentVersion}`);
    process.exit(1);
  }
} else {
  console.error(`Error: "${bumpArg}" is not valid. Use major/minor/patch or an x.y.z version string.`);
  process.exit(1);
}

console.log(`Bumping version: ${currentVersion} → ${newVersion}${dryRun ? ' (dry run)' : ''}\n`);

// --- Update package.json files ---
const packageJsonPaths = [ROOT_PKG];
for (const entry of fs.readdirSync(PACKAGES_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory()) {
    continue;
  }
  const pkgPath = path.join(PACKAGES_DIR, entry.name, 'package.json');
  if (fs.existsSync(pkgPath)) {
    packageJsonPaths.push(pkgPath);
  }
}

for (const pkgPath of packageJsonPaths) {
  const original = fs.readFileSync(pkgPath, 'utf8');
  const updated = original.replace(`"version": "${currentVersion}"`, `"version": "${newVersion}"`);
  if (updated === original) {
    console.warn(`  Warning: version string not found in ${path.relative(ROOT, pkgPath)}`);
  } else {
    if (!dryRun) {
      fs.writeFileSync(pkgPath, updated);
    }
    console.log(`  ${dryRun ? '[dry] ' : ''}${path.relative(ROOT, pkgPath)}`);
  }
}

console.log(`\nDone!${dryRun ? ' (no files were modified)' : ` Version bumped to ${newVersion}`}`);
