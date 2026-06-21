const fs = require('fs');
const text = fs.readFileSync('eas-build-log-brotli.txt', 'utf8');
const lines = text.split(/\r?\n/);
const matches = lines
  .map((line, index) => ({line, index}))
  .filter(({line}) => /FAILURE|error|Exception|Caused by|BUILD FAILED|Compilation error/i.test(line));
const out = [];
out.push('--- matched lines ---');
matches.slice(0, 100).forEach(({line, index}) => {
  out.push(`${index + 1}: ${line}`);
});
if (matches.length) {
  const idx = matches[matches.length - 1].index;
  const start = Math.max(0, idx - 40);
  const end = Math.min(lines.length, idx + 40);
  out.push('--- last match context ---');
  for (let i = start; i < end; i++) {
    const prefix = i === idx ? '>>' : '  ';
    out.push(`${prefix} ${i + 1}: ${lines[i]}`);
  }
}
fs.writeFileSync('build-context.txt', out.join('\n'), 'utf8');
console.log('wrote build-context.txt');
