/**
 * Dumps the MySQL database to a timestamped, gzip-compressed .sql.gz file
 * and deletes backups beyond the retention count. Intended to run on a
 * cPanel cron job (daily) via the Node app's own `node` binary - no shell
 * script needed, so it works the same locally and on shared hosting.
 *
 * Usage:
 *   node scripts/backupDatabase.js [--keep 14] [--dir /path/to/backups]
 *
 * Requires the `mysqldump` binary to be on PATH (present on every cPanel
 * shared-hosting box alongside MySQL, and via Laragon's bundled MySQL
 * locally).
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

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function dumpToGzip(destPath) {
  return new Promise((resolve, reject) => {
    const dump = spawn('mysqldump', [
      `--host=${config.db.host}`,
      `--port=${config.db.port}`,
      `--user=${config.db.user}`,
      `--password=${config.db.password}`,
      '--single-transaction',
      '--routines',
      '--triggers',
      config.db.database,
    ]);

    const gzip = zlib.createGzip();
    const out = fs.createWriteStream(destPath);

    let stderr = '';
    dump.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    dump.stdout.pipe(gzip).pipe(out);

    dump.on('error', reject);
    out.on('error', reject);
    out.on('finish', () => {
      // mysqldump exit code isn't known yet when 'finish' fires (stdout can
      // close before the process reports its exit), so also wait on 'close'.
    });
    dump.on('close', (code) => {
      if (code !== 0) {
        fs.unlink(destPath, () => {});
        return reject(new Error(`mysqldump exited with code ${code}: ${stderr.trim()}`));
      }
      return resolve();
    });
  });
}

function pruneOldBackups(dir, keep) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.startsWith('zexora-') && f.endsWith('.sql.gz'))
    .map((f) => ({ name: f, mtime: fs.statSync(path.join(dir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime);

  const toDelete = files.slice(keep);
  for (const file of toDelete) {
    fs.unlinkSync(path.join(dir, file.name));
    console.log(`Pruned old backup: ${file.name}`);
  }
}

async function main() {
  const { keep = '14', dir } = parseArgs();
  const backupDir = dir ? path.resolve(dir) : path.resolve(__dirname, '../backups');
  fs.mkdirSync(backupDir, { recursive: true });

  const destPath = path.join(backupDir, `zexora-${timestamp()}.sql.gz`);

  console.log(`Dumping ${config.db.database} to ${destPath} ...`);
  await dumpToGzip(destPath);

  const { size } = fs.statSync(destPath);
  console.log(`Backup complete: ${destPath} (${(size / 1024).toFixed(1)} KB)`);

  pruneOldBackups(backupDir, Number(keep));
}

main().catch((err) => {
  console.error('Backup failed:', err.message);
  process.exitCode = 1;
});
