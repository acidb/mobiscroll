const fs = require('fs');
const path = require('path');
const pkg = require('../package.json');

function getFiles(dir) {
  const content = fs.readdirSync(dir);
  const files = [];
  const dirs = [];
  content.forEach((cont) => {
    const fullPath = path.join(dir, cont);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      dirs.push(fullPath);
    } else {
      files.push(fullPath);
    }
  });

  dirs.forEach((subDir) => {
    const subFiles = getFiles(subDir);
    subFiles.forEach((subFile) => {
      files.push(subFile);
    });
  });

  return files;
}

function resolveFrameworkAlias(dir, filePath, fileContent, framework) {
  const relativePath = filePath.replace(/\\/g, '/').replace(dir, '.');
  const depth = relativePath.match(/\/|\\/g);
  let p = '';
  if (depth) {
    for (let i = 0; i < depth.length - 1; i++) {
      p += '../';
    }
  }
  return fileContent.replace(/@framework/g, p + framework);
}

function convertScssImportsToLegacy(filePath) {
  const namespaces = ['colors', 'common', 'custom', 'ios-legacy', 'material-legacy', 'windows-legacy', 'material', 'ios', 'windows'];

  if (!/\.scss$/.test(filePath)) {
    return;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  let scss = original;

  // @use './x' as alias; -> @import './x';
  // Keep built-in sass modules like @use 'sass:map' as map;
  scss = scss.replace(/@use\s+(['"](?!sass:)[^'"]+['"])\s+as\s+[a-zA-Z0-9_-]+\s*;/g, (m, p1) => `@import ${p1};`);

  // Plain @use './x'; -> @import './x';
  // Keep built-in sass modules like @use 'sass:map';
  scss = scss.replace(/@use\s+(['"](?!sass:)[^'"]+['"])\s*;/g, (m, p1) => `@import ${p1};`);

  namespaces.forEach((ns) => {
    const esc = ns.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    scss = scss.replace(new RegExp(`\\b${esc}\\.\\$`, 'g'), () => '$');
    scss = scss.replace(new RegExp(`\\b${esc}\\.([a-zA-Z0-9_-]+)\\(`, 'g'), (m, p1) => `${p1}(`);
  });

  if (scss !== original) {
    fs.writeFileSync(filePath, scss, 'utf8');
  }
}

function cleanSassUseDirectives(filePath) {
  let scss = fs.readFileSync(filePath, 'utf8');

  // Move the sass built-in @use rules to the top, deduplicate them
  const lines = scss.split(/\r?\n/);
  const uses = [];
  const body = [];

  for (const line of lines) {
    const t = line.trim();

    if (t.startsWith("@use 'sass:") || t.startsWith('@use "sass:')) {
      uses.push(t.replace(/\s+/g, ' '));
    } else {
      body.push(line);
    }
  }

  const uniqUses = Array.from(new Set(uses));
  scss = [...uniqUses, '', ...body].join('\n');

  fs.writeFileSync(filePath, scss, 'utf8');
}

module.exports = {
  getFiles: getFiles,
  resolveFrameworkAlias: resolveFrameworkAlias,
  convertScssImportsToLegacy: convertScssImportsToLegacy,
  cleanSassUseDirectives: cleanSassUseDirectives,
  version: pkg.version,
};
