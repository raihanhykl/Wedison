/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Script untuk mengoptimasi gambar di folder public
 * Jalankan dengan: npm run optimize-images
 *
 * Prerequisite: npm install sharp --save-dev
 */

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const PUBLIC_DIR = path.join(__dirname, "../public");
const QUALITY = 100; // Kualitas gambar (0-100)
const MAX_WIDTH = 1920; // Lebar maksimum untuk gambar hero
const MAX_WIDTH_MOBILE = 768; // Lebar maksimum untuk gambar mobile

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const isMobile = filePath.includes("mobile");
  const maxWidth = isMobile ? MAX_WIDTH_MOBILE : MAX_WIDTH;

  if (![".png", ".jpg", ".jpeg", ".webp"].includes(ext)) {
    return;
  }

  try {
    const stats = fs.statSync(filePath);
    const originalSize = stats.size;

    // Skip gambar kecil (< 50KB)
    if (originalSize < 50 * 1024) {
      console.log(`Skipping (too small): ${filePath}`);
      return;
    }

    const image = sharp(filePath);
    const metadata = await image.metadata();

    // Resize jika lebih besar dari maxWidth
    let pipeline = image;
    if (metadata.width > maxWidth) {
      pipeline = pipeline.resize(maxWidth, null, {
        withoutEnlargement: true,
        fit: "inside",
      });
    }

    // Konversi ke WebP jika bukan WebP
    if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
      const newPath = filePath.replace(ext, ".webp");
      await pipeline.webp({ quality: QUALITY }).toFile(newPath);
      const newStats = fs.statSync(newPath);
      const savings = (
        ((originalSize - newStats.size) / originalSize) *
        100
      ).toFixed(1);
      console.log(`Converted: ${filePath} -> ${newPath} (saved ${savings}%)`);
    } else {
      // Optimize existing WebP
      const tempPath = filePath + ".tmp";
      await pipeline.webp({ quality: QUALITY }).toFile(tempPath);
      const newStats = fs.statSync(tempPath);

      if (newStats.size < originalSize) {
        fs.renameSync(tempPath, filePath);
        const savings = (
          ((originalSize - newStats.size) / originalSize) *
          100
        ).toFixed(1);
        console.log(`Optimized: ${filePath} (saved ${savings}%)`);
      } else {
        fs.unlinkSync(tempPath);
        console.log(`Skipping (already optimal): ${filePath}`);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

async function walkDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await walkDir(filePath);
    } else {
      await optimizeImage(filePath);
    }
  }
}

console.log("Starting image optimization...\n");
walkDir(PUBLIC_DIR)
  .then(() => {
    console.log("\nImage optimization complete!");
  })
  .catch(console.error);
