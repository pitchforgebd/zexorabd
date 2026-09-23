const pool = require('../db/pool');

async function getAll() {
  const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
  const map = {};
  for (const row of rows) {
    map[row.setting_key] = row.setting_value;
  }
  return map;
}

async function set(key, value) {
  await pool.query(
    `INSERT INTO site_settings (setting_key, setting_value) VALUES (:key, :value)
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)`,
    { key, value: JSON.stringify(value) }
  );
}

module.exports = { getAll, set };
