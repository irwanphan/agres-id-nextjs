import { migrateProducts } from './services/migrateProducts.js';
import dotenv from 'dotenv';
dotenv.config();

const isDryRun = process.argv.includes('--dry-run');

async function main() {
  console.log(`🚀 Starting migration ${isDryRun ? '[DRY-RUN MODE]' : ''}`);
  await migrateProducts({ isDryRun });
}

main();