const { PrismaClient } = require('@prisma/client');
const mysql = require('mysql2/promise');
const { logToFile } = require('../utils/logger.js');
const { createVariant } = require('./migrateVariants.js');
const { createAdditionalInformation } = require('./migrateAddional.js');

const prisma = new PrismaClient();
const CLOUDINARY_PREFIX = 'https://res.cloudinary.com/dc6svbdh9/image/upload/v1744194351/products/';

async function migrateProducts({ isDryRun = false }) {
  const mysqlDb = await mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'agres-id-legacy'
  });

  if (!isDryRun) {
    await prisma.productVariant.deleteMany();
    await prisma.additionalInformation.deleteMany();
    await prisma.product.deleteMany();
    console.log('🧹 Old data deleted.');
  }

  const [items] = await mysqlDb.execute(`
    SELECT i.*, im.img_name
    FROM items i
    LEFT JOIN item_images im ON i.id = im.item_id AND im.is_primary = 1
    WHERE i.sku IS NOT NULL
  `);

  for (const item of items) {
    try {
      const exists = await prisma.product.findFirst({
        where: {
          OR: [
            { sku: item.sku },
            { productCode: item.spesification ?? null }
          ]
        }
      });

      if (exists) {
        logToFile('skip', `SKU already exists: ${item.sku}`);
        continue;
      }

      if (isDryRun) {
        console.log(`[DRY-RUN] Simulate insert SKU: ${item.sku}`);
        continue;
      }

      const product = await prisma.product.create({
        data: {
          price: item.price,
          discountedPrice: item.discount_price ?? undefined,
          tags: [`${item.category_id}`],
          description: item.description,
          shortDescription: item.description,
          offers: item.end_deal ? [item.end_deal.toISOString()] : [],
          slug: item.slug,
          sku: item.sku,
          body: String(item.rating ?? ''),
          productCode: item.sku,
          quantity: item.stock,
          createdAt: item.created_at ?? new Date(),
          updatedAt: item.updated_at ?? new Date(),
          title: item.name,
          categoryId: item.category_id,
        }
      });

      await createVariant({ productId: product.id, item, CLOUDINARY_PREFIX });
      await createAdditionalInformation({ productId: product.id, spesification: item.spesification, sku: item.sku });

      logToFile('success', `✅ Migrated SKU: ${item.sku}`);
    } catch (err) {
      logToFile('error', `❌ Error migrating SKU ${item.sku}: ${err.message}`);
    }
  }

  await mysqlDb.end();
  await prisma.$disconnect();
}

module.exports = { migrateProducts };