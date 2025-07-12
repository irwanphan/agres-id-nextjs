const mysql = require('mysql2/promise');
const { PrismaClient } = require('@prisma/client');
const { logToFile } = require('../utils/logger.js');

const prisma = new PrismaClient();

const CLOUDINARY_PREFIX = 'https://res.cloudinary.com/dc6svbdh9/image/upload/v1744194351/products/';

async function migrateImages({ isDryRun = false }) {
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

  for (const img of images) {
    try {
      const product = await prisma.product.findUnique({
        where: { sku: img.sku }
      });

      if (!product) {
        logToFile('skip', `SKU not found for image: ${img.sku}`);
        continue;
      }

      if (isDryRun) {
        console.log(`[DRY-RUN] Would insert image for SKU ${img.sku}`);
        continue;
      }

      await prisma.productImage.create({
        data: {
          productId: product.id,
          imgName: img.img_name,
          imgPath: `${CLOUDINARY_PREFIX}${img.img_name}`,
          isPrimary: img.is_primary === 1
        }
      });

      logToFile('success', `🖼️ Migrated image for SKU: ${img.sku}`);
    } catch (err) {
      logToFile('error', `❌ Error inserting image for SKU ${img.sku}: ${err.message}`);
    }
  }

  await mysqlDb.end();
  await prisma.$disconnect();
}

module.exports = { migrateImages };