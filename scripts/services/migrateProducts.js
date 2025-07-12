const { PrismaClient } = require('@prisma/client');
const mysql = require('mysql2/promise');
const { logToFile } = require('../utils/logger.js');
const { createVariant } = require('./migrateVariants.js');
const { createAdditionalInformation } = require('./migrateAddional.js');

const prisma = new PrismaClient();
const CLOUDINARY_PREFIX = 'https://res.cloudinary.com/dbuug9eey/image/upload/products/';

async function migrateProducts({ isDryRun = false, onLog }) {
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
    await prisma.productImage.deleteMany();
    await prisma.attributeValue.deleteMany();
    await prisma.customAttribute.deleteMany();
    await prisma.heroBanner.deleteMany();
    await prisma.heroSlider.deleteMany();
    await prisma.countdown.deleteMany();
    await prisma.review.deleteMany();
    await prisma.product.deleteMany();
    console.log('🧹 Old data deleted.');
  }

  const [items] = await mysqlDb.execute(`
    SELECT i.*, im.img_name
    FROM items i
    LEFT JOIN item_images im ON i.id = im.item_id AND im.is_primary = 1
    WHERE i.sku IS NOT NULL
  `);

  const [images] = await mysqlDb.execute(`
    SELECT 
      i.id, 
      i.sku, 
      (
        SELECT REPLACE(im.img_name, ' ', '_')
        FROM item_images im
        WHERE im.item_id = i.id AND im.img_name IS NOT NULL
        ORDER BY im.is_primary DESC, im.id ASC
        LIMIT 1
      ) AS img_name
    FROM items i
    WHERE i.sku IS NOT NULL
  `);
  
  const sanitizeFileName = (name) => {
    if (!name) return ''; // Cegah error null/undefined
  
    return name
      .toLowerCase()
      .replace(/\.[^/.]+$/, '')     // remove extension
      .replace(/\s+/g, '_')         // replace spaces with _
      .replace(/[^a-z0-9_]/g, '');  // remove symbols
  };
  
  const imageMap = {};

  for (const img of images) {
    const sanitized = sanitizeFileName(img.img_name);
    imageMap[img.sku] = sanitized;
  }

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
        onLog?.({ type: 'skip', sku: item.sku });
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
      
      await createVariant({
        productId: product.id,
        item,
        image: imageMap[item.sku],
        CLOUDINARY_PREFIX
      });
      await createAdditionalInformation({ productId: product.id, spesification: item.spesification, sku: item.sku });

      if (!isDryRun) {
        console.log(`✅ Migrated SKU: ${item.sku}`);
        onLog?.({ type: 'success', sku: item.sku });
      } else {
        console.log(`[DRY-RUN] Simulate insert SKU: ${item.sku} - image: ${imageMap[item.sku]} - variant: ${item.variant_color}`);
        onLog?.({ type: 'skip', sku: item.sku });
      }
    } catch (err) {
      logToFile('error', `❌ Error migrating SKU ${item.sku}: ${err.message}`);
      onLog?.({ type: 'error', sku: item.sku });
    }
  }

  await mysqlDb.end();
  await prisma.$disconnect();
}

module.exports = { migrateProducts };