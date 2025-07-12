import fs from 'fs';
import path from 'path';

export function logToFile(type, message) {
  const now = new Date().toISOString();
  const filePath = path.join('logs', `${type}.log`);
  fs.appendFileSync(filePath, `[${now}] ${message}\n`);
}