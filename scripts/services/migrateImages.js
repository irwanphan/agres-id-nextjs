const mysql = require('mysql2/promise');
const { PrismaClient } = require('@prisma/client');
const { logToFile } = require('../utils/logger.js');

const prisma = new PrismaClient();

const CLOUDINARY_PREFIX = 'https://res.cloudinary.com/dc6svbdh9/image/upload/products/';

async function migrateImages({ isDryRun = false, onLog }) {
  const mysqlDb = await mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'agres-id-legacy'
  });

  const [images] = await mysqlDb.execute(`
    SELECT i.sku, im.img_name, im.img_path, im.is_primary
    FROM items i
    JOIN item_images im ON im.item_id = i.id
    WHERE i.sku IS NOT NULL AND im.img_name IS NOT NULL
  `);

  function normalizeFileName(name) {
    return name
      .replace(/\s+/g, '_')          // Ganti spasi dengan underscore
      .replace(/[^\w.-]/g, '')       // Hilangkan karakter aneh kecuali huruf, angka, _ . -
      .trim();                       // Hilangkan spasi awal/akhir
  }

  for (const img of images) {
    try {
      const product = await prisma.product.findUnique({
        where: { sku: img.sku }
      });
  
      if (!product) {
        onLog?.({ type: 'skip', sku: img.sku });
        continue;
      }
  
      const normalizedImgName = normalizeFileName(img.img_name);
  
      await prisma.productImage.create({
        data: {
          productId: product.id,
          imgName: normalizedImgName,
          imgPath: `${CLOUDINARY_PREFIX}${normalizedImgName}`,
          isPrimary: img.is_primary === true
        }
      });
  
      if (!isDryRun) {
        console.log(`✅ Migrated image for SKU: ${img.sku}`);
        onLog?.({ type: 'success', sku: img.sku });
      } else {
        console.log(`[DRY-RUN] Simulate insert image for SKU: ${img.sku}`);
        onLog?.({ type: 'skip', sku: img.sku });
      }
    } catch (err) {
      logToFile('error', `❌ Error inserting image for SKU ${img.sku}: ${err.message}`);
      onLog?.({ type: 'error', sku: img.sku });
    }
  }

  await mysqlDb.end();
  await prisma.$disconnect();
}

module.exports = { migrateImages };