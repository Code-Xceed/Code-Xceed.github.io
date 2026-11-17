// Raise sub-11px type to an 11px floor (10px for archival labels), preserving UTF-8.
const fs = require('fs');
const path = require('path');

const files = [
  'src/components/Hero.jsx',
  'src/components/HeroPortraitCard.jsx',
  'src/components/HeroSkillsShelf.jsx',
  'src/components/SelectedWorks.jsx',
  'src/components/InterestsExperience.jsx',
  'src/components/VideoEditingExplorePage.jsx',
  'src/components/MinecraftExplorePage.jsx',
  'src/components/Footer.jsx',
  'src/components/PostPage.jsx',
  'src/components/Nav.jsx',
];

const rules = [
  [/text-\[7px\]/g, 'text-[10px]'],
  [/text-\[7\.5px\]/g, 'text-[10px]'],
  [/text-\[8px\]/g, 'text-[10px]'],
  [/text-\[8\.5px\]/g, 'text-[10px]'],
  [/text-\[9px\]/g, 'text-[10px]'],
  [/text-\[9\.5px\]/g, 'text-[11px]'],
  [/text-\[10px\]/g, 'text-[11px]'],
  [/text-\[10\.5px\]/g, 'text-[11px]'],
];

let total = 0;
for (const rel of files) {
  const p = path.join('C:/Users/CodeX/Desktop/New-Portfolio', rel);
  let src = fs.readFileSync(p, 'utf8');
  let count = 0;
  for (const [re, to] of rules) {
    src = src.replace(re, (m) => { count += 1; return to; });
  }
  if (count) {
    fs.writeFileSync(p, src, 'utf8');
    console.log(rel, count);
    total += count;
  }
}
console.log('replacements', total);
