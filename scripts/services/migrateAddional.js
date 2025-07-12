const { PrismaClient } = require('@prisma/client');
const { logToFile } = require('../utils/logger.js');
const prisma = new PrismaClient();

async function createAdditionalInformation({ productId, spesification, sku }) {
  if (!spesification) return;

  try {
    const specObj = JSON.parse(spesification);
    for (const [key, value] of Object.entries(specObj)) {
      await prisma.additionalInformation.create({
        data: {
          name: key,
          description: value,
          productId: productId
        }
      });
    }
  } catch (e) {
    logToFile('error', `❌ SKU ${sku} failed to parse spec: ${e.message}`);
  }
}

module.exports = { createAdditionalInformation };