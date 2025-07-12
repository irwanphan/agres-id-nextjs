const { migrateProducts } = require('./services/migrateProducts.js');
const { migrateImages } = require('./services/migrateImages.js');
const dotenv = require('dotenv');
dotenv.config();

const isDryRun = process.argv.includes('--dry-run');

async function main() {
  console.log(`🚀 Starting migration ${isDryRun ? '[DRY-RUN MODE]' : ''}`);
  await migrateProducts({ isDryRun });
  await migrateImages({ isDryRun });
}

main();