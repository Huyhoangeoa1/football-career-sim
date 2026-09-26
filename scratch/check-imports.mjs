import fs from 'fs';

const files = ['js/main.js', 'js/ui.js', 'js/events.js', 'js/storage.js'];
const allImported = new Set();

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  const content = fs.readFileSync(f, 'utf8');
  const importMatches = content.matchAll(/import\s*\{([^}]+)\}\s*from\s*['"](?:\.\/)?engine(?:\.js)?['"]/g);
  for (const m of importMatches) {
    const names = m[1].split(',').map(s => s.trim().replace(/\s+as\s+[a-zA-Z0-9_$]+/, '')).filter(Boolean);
    console.log(`${f} imports:`, names);
    names.forEach(n => allImported.add(n));
  }
});

console.log('\nAll symbols imported from engine.js:');
console.log(Array.from(allImported).sort());
