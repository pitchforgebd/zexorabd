const pool = require('../db/pool');

function mapPost(row) {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    coverImage: row.cover_image,
    isPublished: !!row.is_published,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function listPublished({ page = 1, limit = 9 } = {}) {
  const offset = (page - 1) * limit;
  const [rows] = await pool.query(
    `SELECT * FROM news_posts WHERE is_published = 1
     ORDER BY published_at DESC, id DESC LIMIT :limit OFFSET :offset`,
    { limit, offset }
  );
  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM news_posts WHERE is_published = 1');
  return { items: rows.map(mapPost), total, page, limit };
}

async function listAll() {
  const [rows] = await pool.query('SELECT * FROM news_posts ORDER BY created_at DESC, id DESC');
  return rows.map(mapPost);
}

async function getBySlug(slug, { publishedOnly = true } = {}) {
  const where = publishedOnly ? 'slug = :slug AND is_published = 1' : 'slug = :slug';
  const [rows] = await pool.query(`SELECT * FROM news_posts WHERE ${where} LIMIT 1`, { slug });
  return rows[0] ? mapPost(rows[0]) : null;
}

async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM news_posts WHERE id = :id LIMIT 1', { id });
  return rows[0] ? mapPost(rows[0]) : null;
}

async function slugExists(slug, excludeId = null) {
  const params = { slug };
  let sql = 'SELECT id FROM news_posts WHERE slug = :slug';
  if (excludeId) {
    sql += ' AND id != :excludeId';
    params.excludeId = excludeId;
  }
  const [rows] = await pool.query(sql, params);
  return rows.length > 0;
}

async function create(fields) {
  const [result] = await pool.query(
    `INSERT INTO news_posts (slug, title, excerpt, body, is_published, published_at)
     VALUES (:slug, :title, :excerpt, :body, :isPublished, :publishedAt)`,
    {
      slug: fields.slug,
      title: fields.title,
      excerpt: fields.excerpt || null,
      body: fields.body || null,
      isPublished: fields.isPublished ? 1 : 0,
      publishedAt: fields.isPublished ? fields.publishedAt || new Date() : fields.publishedAt || null,
    }
  );
  return result.insertId;
}

async function update(id, fields) {
  await pool.query(
    `UPDATE news_posts SET
       slug = :slug, title = :title, excerpt = :excerpt, body = :body,
       is_published = :isPublished, published_at = :publishedAt
     WHERE id = :id`,
    {
      id,
      slug: fields.slug,
      title: fields.title,
      excerpt: fields.excerpt || null,
      body: fields.body || null,
      isPublished: fields.isPublished ? 1 : 0,
      publishedAt: fields.publishedAt || null,
    }
  );
}

async function updateCoverImage(id, coverImage) {
  await pool.query('UPDATE news_posts SET cover_image = :coverImage WHERE id = :id', { id, coverImage });
}

async function remove(id) {
  await pool.query('DELETE FROM news_posts WHERE id = :id', { id });
}

module.exports = { listPublished, listAll, getBySlug, getById, slugExists, create, update, updateCoverImage, remove };
