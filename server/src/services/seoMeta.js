const pool = require('../db/pool');

function mapRow(row) {
  return {
    pageKey: row.page_key,
    title: row.title,
    metaDescription: row.meta_description,
    ogImage: row.og_image,
    canonicalUrl: row.canonical_url,
    updatedAt: row.updated_at,
  };
}

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM seo_meta ORDER BY page_key ASC');
  return rows.map(mapRow);
}

async function get(pageKey) {
  const [rows] = await pool.query('SELECT * FROM seo_meta WHERE page_key = :pageKey LIMIT 1', { pageKey });
  return rows[0] ? mapRow(rows[0]) : null;
}

async function set(pageKey, { title, metaDescription, ogImage, canonicalUrl }) {
  await pool.query(
    `INSERT INTO seo_meta (page_key, title, meta_description, og_image, canonical_url)
     VALUES (:pageKey, :title, :metaDescription, :ogImage, :canonicalUrl)
     ON DUPLICATE KEY UPDATE
       title = VALUES(title), meta_description = VALUES(meta_description),
       og_image = VALUES(og_image), canonical_url = VALUES(canonical_url)`,
    {
      pageKey,
      title: title || null,
      metaDescription: metaDescription || null,
      ogImage: ogImage || null,
      canonicalUrl: canonicalUrl || null,
    }
  );
  return get(pageKey);
}

module.exports = { getAll, get, set };
