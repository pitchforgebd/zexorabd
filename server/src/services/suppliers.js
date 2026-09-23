const pool = require('../db/pool');

function mapSupplier(row) {
  return {
    id: row.id,
    url: row.image_path,
    altText: row.alt_text,
    isActive: !!row.is_active,
    sortOrder: row.sort_order,
  };
}

async function listActive() {
  const [rows] = await pool.query('SELECT * FROM suppliers WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
  return rows.map(mapSupplier);
}

async function listAll() {
  const [rows] = await pool.query('SELECT * FROM suppliers ORDER BY sort_order ASC, id ASC');
  return rows.map(mapSupplier);
}

async function nextSortOrder() {
  const [[{ maxOrder }]] = await pool.query('SELECT COALESCE(MAX(sort_order), -1) AS maxOrder FROM suppliers');
  return maxOrder + 1;
}

async function insert({ imagePath, altText, sortOrder }) {
  const [result] = await pool.query(
    'INSERT INTO suppliers (image_path, alt_text, sort_order, is_active) VALUES (:imagePath, :altText, :sortOrder, 1)',
    { imagePath, altText: altText || null, sortOrder }
  );
  return result.insertId;
}

async function updateMeta(id, { altText, isActive }) {
  await pool.query('UPDATE suppliers SET alt_text = :altText, is_active = :isActive WHERE id = :id', {
    id,
    altText: altText || null,
    isActive: isActive ? 1 : 0,
  });
}

async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM suppliers WHERE id = :id LIMIT 1', { id });
  return rows[0] ? mapSupplier(rows[0]) : null;
}

async function remove(id) {
  await pool.query('DELETE FROM suppliers WHERE id = :id', { id });
}

async function reorder(order) {
  for (const { id, sortOrder } of order) {
    await pool.query('UPDATE suppliers SET sort_order = :sortOrder WHERE id = :id', { id, sortOrder });
  }
}

module.exports = { listActive, listAll, nextSortOrder, insert, updateMeta, getById, remove, reorder };
