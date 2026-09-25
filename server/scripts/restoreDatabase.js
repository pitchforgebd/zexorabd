/**
 * Restores a .sql.gz backup produced by backupDatabase.js into the
 * configured database. Destructive - existing tables with matching names
 * are overwritten by the dump's own DROP/CREATE statements.
 *
 * Usage:
 *   node scripts/restoreDatabase.js --file backups/zexora-2026-...sql.gz
 */
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { spawn } = require('child_process');
const config = require('../src/config');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i += 2) {
    out[args[i].replace(/^--/, '')] = args[i + 1];
  }
  return out;
}

function restoreFromGzip(srcPath) {
  return new Promise((resolve, reject) => {
    const restore = spawn('mysql', [
      `--host=${config.db.host}`,
      `--port=${config.db.port}`,
      `--user=${config.db.user}`,
      `--password=${config.db.password}`,
      config.db.database,
    ]);

    let stderr = '';
    restore.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    fs.createReadStream(srcPath).pipe(zlib.createGunzip()).pipe(restore.stdin);

    restore.on('error', reject);
    restore.on('close', (code) => {
      if (code !== 0) return reject(new Error(`mysql restore exited with code ${code}: ${stderr.trim()}`));
      return resolve();
    });
  });
}

async function main() {
  const { file } = parseArgs();
  if (!file) {
    console.error('Usage: node scripts/restoreDatabase.js --file backups/zexora-....sql.gz');
    process.exitCode = 1;
    return;
  }
  const srcPath = path.resolve(file);
  if (!fs.existsSync(srcPath)) {
    console.error(`Backup file not found: ${srcPath}`);
    process.exitCode = 1;
    return;
  }

  console.log(`Restoring ${srcPath} into ${config.db.database} ...`);
  await restoreFromGzip(srcPath);
  console.log('Restore complete.');
}

main().catch((err) => {
  console.error('Restore failed:', err.message);
  process.exitCode = 1;
});
