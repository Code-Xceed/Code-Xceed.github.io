const fs = require('fs');
const files = [
  'src/components/InterestsExperience.jsx',
  'src/components/VideoEditingExplorePage.jsx',
  'src/components/MinecraftExplorePage.jsx',
];
const edits = [
  [/px-1\.5 py-0\.5 rounded text-\[11px\] font-mono/g, 'px-1.5 py-1.5 rounded text-[11px] font-mono'],
  [/"hover:text-\[#161514\] transition-colors"/g, '"py-1 inline-block hover:text-[#161514] transition-colors"'],
];
let n = 0;
for (const rel of files) {
  const p = 'C:/Users/CodeX/Desktop/New-Portfolio/' + rel;
  let src = fs.readFileSync(p, 'utf8');
  for (const [re, to] of edits) {
    src = src.replace(re, (...args) => { n += 1; return typeof to === 'function' ? to(...args) : to; });
  }
  fs.writeFileSync(p, src, 'utf8');
}
console.log('target edits', n);
