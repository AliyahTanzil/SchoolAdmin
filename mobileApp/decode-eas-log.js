const fs = require('fs');
const zlib = require('zlib');
const buf = fs.readFileSync('eas-build-log.txt');
console.log('header:', buf.slice(0,16).toString('hex'));
const printContext = (lines, matchIndex, context = 15) => {
  const start = Math.max(0, matchIndex - context);
  const end = Math.min(lines.length, matchIndex + context + 1);
  console.log('--- context around match ---');
  for (let i = start; i < end; i++) {
    const prefix = i === matchIndex ? '>> ' : '   ';
    console.log(`${prefix}${i + 1}: ${lines[i]}`);
  }
};
const tryDecompress = (name, fn) => {
  try {
    const out = fn(buf);
    const text = out.toString('utf8');
    console.log(`=== ${name} success ===`);
    fs.writeFileSync(`eas-build-log-${name}.txt`, text, 'utf8');
    console.log(`wrote eas-build-log-${name}.txt`);
    const lines = text.split(/\r?\n/);
    const relevantIndices = lines
      .map((line, index) => ({line, index}))
      .filter(({line}) => /FAILURE|error|Exception|Caused by|BUILD FAILED/i.test(line));
    if (relevantIndices.length) {
      console.log('--- matched lines ---');
      relevantIndices.slice(0, 20).forEach(({line, index}) => {
        console.log(`${index + 1}: ${line}`);
      });
      printContext(lines, relevantIndices[0].index, 25);
    } else {
      console.log('--- no relevant lines found in decompress output ---');
    }
  } catch (error) {
    console.error(`=== ${name} failed: ${error.message}`);
  }
};
tryDecompress('gunzip', (b) => zlib.gunzipSync(b));
tryDecompress('inflate', (b) => zlib.inflateSync(b));
tryDecompress('brotli', (b) => zlib.brotliDecompressSync(b));
