const fs = require('fs');
const text = fs.readFileSync('eas-build-log-brotli.txt', 'utf8');
const lines = text.split(/\r?\n/);
const start = 700;
const end = 780;
const out = [];
for (let i = start; i <= end && i < lines.length; i++) {
  out.push(`${i + 1}: ${lines[i]}`);
}
fs.writeFileSync('build-log-700-780.txt', out.join('\n'), 'utf8');
console.log('wrote build-log-700-780.txt');
