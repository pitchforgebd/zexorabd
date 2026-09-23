const pool = require('../db/pool');

function mapSection(row) {
  return {
    sectionKey: row.section_key,
    isVisible: !!row.is_visible,
    sortOrder: row.sort_order,
    layoutVariant: row.layout_variant,
    config: row.config || {},
  };
}

async function listForPage(pageKey, { includeHidden = false } = {}) {
  const where = includeHidden ? 'page_key = :pageKey' : 'page_key = :pageKey AND is_visible = 1';
  const [rows] = await pool.query(
    `SELECT * FROM page_sections WHERE ${where} ORDER BY sort_order ASC, id ASC`,
    { pageKey }
  );
  return rows.map(mapSection);
}

async function replaceForPage(pageKey, sections) {
  for (const s of sections) {
    await pool.query(
      `INSERT INTO page_sections (page_key, section_key, is_visible, sort_order, layout_variant, config)
       VALUES (:pageKey, :sectionKey, :isVisible, :sortOrder, :layoutVariant, :config)
       ON DUPLICATE KEY UPDATE
         is_visible = VALUES(is_visible), sort_order = VALUES(sort_order),
         layout_variant = VALUES(layout_variant), config = VALUES(config)`,
      {
        pageKey,
        sectionKey: s.sectionKey,
        isVisible: s.isVisible ? 1 : 0,
        sortOrder: s.sortOrder,
        layoutVariant: s.layoutVariant || 'default',
        config: JSON.stringify(s.config || {}),
      }
    );
  }
}

module.exports = { listForPage, replaceForPage };
