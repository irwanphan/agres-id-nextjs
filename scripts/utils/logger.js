const fs = require('fs');
const path = require('path');

// Auto-create 'logs' folder if it doesn't exist
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

function logToFile(type, message) {
  const now = new Date().toISOString();
  const filePath = path.join(logsDir, `${type}.log`);
  fs.appendFileSync(filePath, `[${now}] ${message}\n`);
}

module.exports = { logToFile };