import fs from 'fs';

const content = fs.readFileSync('js/engine.js', 'utf8');
const lines = content.split('\n');

console.log('Total lines:', lines.length);

lines.forEach((l, i) => {
  const lineNum = i + 1;
  const trimmed = l.trim();
  if (trimmed.startsWith('/* ===') || trimmed.startsWith('export function ') || trimmed.startsWith('export const ')) {
    console.log(`${lineNum}: ${trimmed.substring(0, 95)}`);
  }
});
