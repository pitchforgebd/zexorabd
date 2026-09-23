const pool = require('../db/pool');

function mapImage(row) {
  return {
    id: row.id,
    url: row.image_path,
    caption: row.caption,
    isPublished: !!row.is_published,
    sortOrder: row.sort_order,
  };
}

async function listPublished() {
  const [rows] = await pool.query(
    'SELECT * FROM photo_gallery WHERE is_published = 1 ORDER BY sort_order ASC, id ASC'
  );
  return rows.map(mapImage);
}

async function listAll() {
  const [rows] = await pool.query('SELECT * FROM photo_gallery ORDER BY sort_order ASC, id ASC');
  return rows.map(mapImage);
}

async function nextSortOrder() {
  const [[{ maxOrder }]] = await pool.query('SELECT COALESCE(MAX(sort_order), -1) AS maxOrder FROM photo_gallery');
  return maxOrder + 1;
}

async function insert({ imagePath, caption, sortOrder }) {
  const [result] = await pool.query(
    'INSERT INTO photo_gallery (image_path, caption, sort_order, is_published) VALUES (:imagePath, :caption, :sortOrder, 1)',
    { imagePath, caption: caption || null, sortOrder }
  );
  return result.insertId;
}

async function updateMeta(id, { caption, isPublished }) {
  await pool.query('UPDATE photo_gallery SET caption = :caption, is_published = :isPublished WHERE id = :id', {
    id,
    caption: caption || null,
    isPublished: isPublished ? 1 : 0,
  });
}

async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM photo_gallery WHERE id = :id LIMIT 1', { id });
  return rows[0] ? mapImage(rows[0]) : null;
}

async function remove(id) {
  await pool.query('DELETE FROM photo_gallery WHERE id = :id', { id });
}

async function reorder(order) {
  for (const { id, sortOrder } of order) {
    await pool.query('UPDATE photo_gallery SET sort_order = :sortOrder WHERE id = :id', { id, sortOrder });
  }
}

module.exports = { listPublished, listAll, nextSortOrder, insert, updateMeta, getById, remove, reorder };
