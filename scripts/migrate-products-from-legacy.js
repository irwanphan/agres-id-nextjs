const mysql = require('mysql2/promise');
const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();

const CLOUDINARY_PREFIX = 'https://res.cloudinary.com/dc6svbdh9/image/upload/v1744194351/products/';

async function migrate() {
  const mysqlDb = await mysql.createConnection({
    host: 'localhost',
    port: 8889,
    user: 'root',
    password: 'root',
    database: 'agres-id-legacy'
  });

  const [items] = await mysqlDb.execute(`
    SELECT i.*, im.img_name
    FROM items i
    LEFT JOIN item_images im ON i.id = im.item_id AND im.is_primary = 1
    WHERE i.sku IS NOT NULL
  `);

  for (const item of items) {
    try {
      // INSERT Product
      const existingProduct = await prisma.product.findFirst({
        where: {
          OR: [
            { sku: item.sku },
            // { productCode: item.spesification ?? null }
          ]
        }
      });
      
      if (existingProduct) {
        console.log(`⚠️  SKU ${item.sku} sudah ada. Lewati...`);
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

      // INSERT ProductVariant
      await prisma.productVariant.create({
        data: {
          productId: product.id,
          color: item.variant_color ?? '',
          image: item.img_name ? `${CLOUDINARY_PREFIX}${item.img_name}` : '',
          size: '',
          weight: 0,
          length: 0,
          width: 0,
          height: 0,
          isDefault: true
        }
      });

      // INSERT AdditionalInformation
      if (item.spesification) {
        try {
          const specObj = JSON.parse(item.spesification);
          for (const [key, value] of Object.entries(specObj)) {
            await prisma.additionalInformation.create({
              data: {
                name: key,
                description: value,
                productId: product.id
              }
            });
          }
        } catch (e) {
          console.error(`Gagal parse spesification untuk SKU ${item.sku}:`, e.message);
        }
      }

      console.log(`✅ Migrated SKU: ${item.sku}`);
    } catch (err) {
      console.error(`❌ Error migrating SKU: ${item.sku}`, err.message);
    }
  }

  await mysqlDb.end();
  await prisma.$disconnect();
}

migrate();
