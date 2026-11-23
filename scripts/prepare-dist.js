import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const websiteDir = path.join(rootDir, 'website');
const distAppDir = path.join(rootDir, 'dist-app');
const distDir = path.join(rootDir, 'dist');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// 1. Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// 2. Copy all files from website/ into dist/ so Vercel serves the high-end landing page at /
console.log('Copying website landing page and distribution assets into dist/...');
copyRecursiveSync(websiteDir, distDir);

// 3. Copy dist-app into dist/app for live web preview
if (fs.existsSync(distAppDir)) {
  console.log('Copying React desktop UI into dist/app/ for web preview...');
  const targetAppDir = path.join(distDir, 'app');
  copyRecursiveSync(distAppDir, targetAppDir);
}

console.log('Distribution bundle prepared successfully: Landing page at /, Web preview at /app/');
