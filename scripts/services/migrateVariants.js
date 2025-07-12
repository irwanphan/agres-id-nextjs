const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createVariant({ productId, item, image, CLOUDINARY_PREFIX }) {
  return prisma.productVariant.create({
    data: {
      productId: productId,
      color: item.variant_color ?? 'default',
      image: image ? `${CLOUDINARY_PREFIX}${image}` : '',
      size: '',
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      isDefault: true
    }
  });
}

module.exports = { createVariant };