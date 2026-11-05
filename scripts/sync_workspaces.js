const fs = require('fs');
const path = require('path');

const SRC = "E:/animated-portfolio";
const DEST = "C:/Users/yoges/Documents/Codex/2026-11-02/connection-interrupted-waiting-for-the-complete-3/work/portfolio-final";

const files = [
  'src/app/globals.css',
  'src/components/layout/HeaderNav.tsx',
  'src/components/studio/AaraRitual.tsx',
  'src/components/home/HeroSection.tsx',
  'src/components/home/AboutSection.tsx',
  'src/components/home/LogoFolioChapter.tsx',
  'src/components/home/BrandIdentityChapter.tsx',
  'src/components/home/UiUxChapter.tsx',
  'src/components/home/PackagingChapter.tsx',
  'src/components/home/SelectedWorkSection.tsx',
  'src/components/studio/PackagingExtensions.tsx',
  'src/components/home/SocialMediaChapter.tsx',
  'src/components/home/FlyerDesignChapter.tsx',
  'src/components/home/AiCreativesChapter.tsx',
  'public/projects/packaging/glow-bite-forest-stage.jpg',
  'public/projects/packaging/glow-bite-clean-cutout.png'
];

for (const f of files) {
  const sourcePath = path.join(SRC, f);
  const destPath = path.join(DEST, f);
  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(sourcePath, destPath);
  console.log(`Copied: ${f}`);
}
console.log("Workspace synchronization complete.");

