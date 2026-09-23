const pool = require('../db/pool');

function mapVideo(row) {
  return {
    id: row.id,
    title: row.title,
    videoUrl: row.video_url,
    thumbnail: row.thumbnail,
    isPublished: !!row.is_published,
    sortOrder: row.sort_order,
  };
}

async function listPublished() {
  const [rows] = await pool.query(
    'SELECT * FROM video_gallery WHERE is_published = 1 ORDER BY sort_order ASC, id ASC'
  );
  return rows.map(mapVideo);
}

async function listAll() {
  const [rows] = await pool.query('SELECT * FROM video_gallery ORDER BY sort_order ASC, id ASC');
  return rows.map(mapVideo);
}

async function nextSortOrder() {
  const [[{ maxOrder }]] = await pool.query('SELECT COALESCE(MAX(sort_order), -1) AS maxOrder FROM video_gallery');
  return maxOrder + 1;
}

async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM video_gallery WHERE id = :id LIMIT 1', { id });
  return rows[0] ? mapVideo(rows[0]) : null;
}

async function create({ title, videoUrl, thumbnail, isPublished, sortOrder }) {
  const [result] = await pool.query(
    `INSERT INTO video_gallery (title, video_url, thumbnail, is_published, sort_order)
     VALUES (:title, :videoUrl, :thumbnail, :isPublished, :sortOrder)`,
    { title, videoUrl, thumbnail: thumbnail || null, isPublished: isPublished ? 1 : 0, sortOrder }
  );
  return result.insertId;
}

async function update(id, { title, videoUrl, thumbnail, isPublished }) {
  await pool.query(
    `UPDATE video_gallery SET title = :title, video_url = :videoUrl, thumbnail = :thumbnail, is_published = :isPublished
     WHERE id = :id`,
    { id, title, videoUrl, thumbnail: thumbnail || null, isPublished: isPublished ? 1 : 0 }
  );
}

async function updateThumbnail(id, thumbnail) {
  await pool.query('UPDATE video_gallery SET thumbnail = :thumbnail WHERE id = :id', { id, thumbnail });
}

async function remove(id) {
  await pool.query('DELETE FROM video_gallery WHERE id = :id', { id });
}

async function reorder(order) {
  for (const { id, sortOrder } of order) {
    await pool.query('UPDATE video_gallery SET sort_order = :sortOrder WHERE id = :id', { id, sortOrder });
  }
}

module.exports = { listPublished, listAll, nextSortOrder, getById, create, update, updateThumbnail, remove, reorder };
