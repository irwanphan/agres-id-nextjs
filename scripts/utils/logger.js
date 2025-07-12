// utils/logger.js

const fs = require('fs');
const path = require('path');

const isDryRun = process.argv.includes('--dry-run');

function logToFile(type, message) {
  if (isDryRun && type !== 'error') return; // skip log except for errors

  const now = new Date().toISOString();
  const filePath = path.join('logs', `${type}.log`);

  fs.appendFile(filePath, `[${now}] ${message}\n`, (err) => {
    if (err) console.error('⚠️ Failed to write log:', err.message);
  });
}

module.exports = { logToFile };
