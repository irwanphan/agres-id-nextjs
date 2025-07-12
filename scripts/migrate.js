// scripts/migrate.js

// const { migrateProducts } = require('./services/migrateProducts.js');
const { migrateImages } = require('./services/migrateImages.js');
const dotenv = require('dotenv');
dotenv.config();

const chalk = require('chalk');

const isDryRun = process.argv.includes('--dry-run');

async function main() {
  console.log(chalk.cyanBright(`🚀 Starting migration ${isDryRun ? '[DRY-RUN MODE]' : ''}`));

  try {
    // await migrateProducts({ isDryRun });
    await migrateImages({ isDryRun });
    console.log(chalk.greenBright(`✅ Migration completed ${isDryRun ? '[SIMULATION]' : ''}`));
  } catch (err) {
    console.error(chalk.redBright('❌ Migration failed:'), err);
  }
}

main();
