const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createVariant({ productId, item, CLOUDINARY_PREFIX }) {
  return prisma.productVariant.create({
    data: {
      productId: productId,
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
}

module.exports = { createVariant };