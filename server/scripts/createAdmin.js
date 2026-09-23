/**
 * Create or update an admin user. There is no public registration endpoint
 * by design — admin accounts are provisioned from the server/CLI only.
 *
 * Usage:
 *   node scripts/createAdmin.js --name "Jane Doe" --email jane@zexora.com.bd --password "..." [--role superadmin]
 *
 * Re-running with an existing email updates that user's name/password/role.
 */
const bcrypt = require('bcryptjs');
const pool = require('../src/db/pool');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace(/^--/, '');
    out[key] = args[i + 1];
  }
  return out;
}

async function main() {
  const { name, email, password, role = 'superadmin' } = parseArgs();

  if (!name || !email || !password) {
    console.error('Usage: node scripts/createAdmin.js --name "Jane Doe" --email jane@zexora.com.bd --password "secret" [--role superadmin|editor]');
    process.exitCode = 1;
    return;
  }
  if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exitCode = 1;
    return;
  }
  if (!['superadmin', 'editor'].includes(role)) {
    console.error('Role must be "superadmin" or "editor".');
    process.exitCode = 1;
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await pool.query(
    `INSERT INTO admin_users (name, email, password_hash, role, is_active)
     VALUES (:name, :email, :passwordHash, :role, 1)
     ON DUPLICATE KEY UPDATE name = VALUES(name), password_hash = VALUES(password_hash), role = VALUES(role), is_active = 1`,
    { name, email, passwordHash, role }
  );

  console.log(`Admin user ready: ${email} (${role})`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
