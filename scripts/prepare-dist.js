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

// 2. Clean stale dist/app directory if present
const staleAppDir = path.join(distDir, 'app');
if (fs.existsSync(staleAppDir)) {
  fs.rmSync(staleAppDir, { recursive: true, force: true });
}

// 3. Copy all files from website/ into dist/ so Vercel serves the high-end landing page at /
console.log('Copying website landing page and distribution assets into dist/...');
copyRecursiveSync(websiteDir, distDir);

console.log('Distribution bundle prepared successfully: Official website at /');
