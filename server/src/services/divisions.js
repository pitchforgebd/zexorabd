const pool = require('../db/pool');

function groupBy(rows, key) {
  return rows.reduce((acc, row) => {
    (acc[row[key]] ??= []).push(row);
    return acc;
  }, {});
}

function mapSummary(row) {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    industry: row.industry,
    tagline: row.tagline,
    icon: row.icon,
    coverImage: row.cover_image,
    isActive: !!row.is_active,
    sortOrder: row.sort_order,
  };
}

function serializeDivision(division, categories, subcategories, items, galleryImages) {
  const subsByCategory = groupBy(subcategories, 'category_id');
  const itemsBySubcategory = groupBy(items, 'subcategory_id');

  const products = categories.map((cat) => ({
    id: cat.id,
    category: cat.category_name,
    description: cat.description,
    subcategories: (subsByCategory[cat.id] || []).map((sub) => ({
      id: sub.id,
      subName: sub.sub_name,
      description: sub.description,
      items: (itemsBySubcategory[sub.id] || []).map((it) => ({ id: it.id, text: it.item_text })),
    })),
  }));

  return {
    ...mapSummary(division),
    overview: division.overview,
    brandPositioning: division.brand_positioning,
    philosophy: division.philosophy || null,
    industries: division.industries || [],
    reasons: division.reasons || [],
    commitment: division.commitment || [],
    strengths: division.strengths || [],
    markets: division.markets || [],
    sourcingSteps: division.sourcing_steps || [],
    products,
    galleryImages: galleryImages.map((g) => ({ id: g.id, url: g.image_path, caption: g.caption })),
  };
}

async function listDivisions({ includeInactive = false } = {}) {
  const where = includeInactive ? '' : 'WHERE is_active = 1';
  const [rows] = await pool.query(
    `SELECT id, slug, name, industry, tagline, icon, cover_image, is_active, sort_order
     FROM divisions ${where} ORDER BY sort_order ASC, id ASC`
  );
  return rows.map(mapSummary);
}

async function getDivision({ id, slug, includeInactive = false }) {
  const conditions = [];
  const params = {};
  if (id) {
    conditions.push('id = :id');
    params.id = id;
  }
  if (slug) {
    conditions.push('slug = :slug');
    params.slug = slug;
  }
  if (!includeInactive) conditions.push('is_active = 1');
  if (conditions.length === 0) throw new Error('getDivision requires id or slug');

  const [rows] = await pool.query(`SELECT * FROM divisions WHERE ${conditions.join(' AND ')} LIMIT 1`, params);
  const division = rows[0];
  if (!division) return null;

  const [categories] = await pool.query(
    'SELECT * FROM product_categories WHERE division_id = :id ORDER BY sort_order ASC, id ASC',
    { id: division.id }
  );
  const categoryIds = categories.map((c) => c.id);
  const [subcategories] = categoryIds.length
    ? await pool.query('SELECT * FROM product_subcategories WHERE category_id IN (:ids) ORDER BY sort_order ASC, id ASC', { ids: categoryIds })
    : [[]];
  const subcategoryIds = subcategories.map((s) => s.id);
  const [items] = subcategoryIds.length
    ? await pool.query('SELECT * FROM product_items WHERE subcategory_id IN (:ids) ORDER BY sort_order ASC, id ASC', { ids: subcategoryIds })
    : [[]];
  const [galleryImages] = await pool.query(
    'SELECT * FROM division_gallery_images WHERE division_id = :id ORDER BY sort_order ASC, id ASC',
    { id: division.id }
  );

  return serializeDivision(division, categories, subcategories, items, galleryImages);
}

async function createDivision({ name, slug }) {
  const [result] = await pool.query(
    `INSERT INTO divisions (name, slug, is_active, sort_order, industries, reasons, commitment, strengths, markets, sourcing_steps)
     VALUES (:name, :slug, 1, 0, '[]', '[]', '[]', '[]', '[]', '[]')`,
    { name, slug }
  );
  return result.insertId;
}

async function updateDivisionFields(conn, id, fields) {
  await conn.query(
    `UPDATE divisions SET
       name = :name, slug = :slug, industry = :industry, tagline = :tagline, overview = :overview,
       brand_positioning = :brandPositioning, icon = :icon, is_active = :isActive, sort_order = :sortOrder,
       philosophy = :philosophy, industries = :industries, reasons = :reasons, commitment = :commitment,
       strengths = :strengths, markets = :markets, sourcing_steps = :sourcingSteps
     WHERE id = :id`,
    {
      id,
      name: fields.name,
      slug: fields.slug,
      industry: fields.industry || null,
      tagline: fields.tagline || null,
      overview: fields.overview || null,
      brandPositioning: fields.brandPositioning || null,
      icon: fields.icon || null,
      isActive: fields.isActive ? 1 : 0,
      sortOrder: fields.sortOrder || 0,
      philosophy: fields.philosophy ? JSON.stringify(fields.philosophy) : null,
      industries: JSON.stringify(fields.industries || []),
      reasons: JSON.stringify(fields.reasons || []),
      commitment: JSON.stringify(fields.commitment || []),
      strengths: JSON.stringify(fields.strengths || []),
      markets: JSON.stringify(fields.markets || []),
      sourcingSteps: JSON.stringify(fields.sourcingSteps || []),
    }
  );
}

async function replaceProductTree(conn, divisionId, products = []) {
  await conn.query('DELETE FROM product_categories WHERE division_id = :divisionId', { divisionId });

  let catOrder = 0;
  for (const cat of products) {
    if (!cat.category || !cat.category.trim()) continue;
    const [catResult] = await conn.query(
      'INSERT INTO product_categories (division_id, category_name, description, sort_order) VALUES (:divisionId, :categoryName, :description, :sortOrder)',
      { divisionId, categoryName: cat.category.trim(), description: cat.description || null, sortOrder: catOrder++ }
    );
    const categoryId = catResult.insertId;

    let subOrder = 0;
    for (const sub of cat.subcategories || []) {
      const [subResult] = await conn.query(
        'INSERT INTO product_subcategories (category_id, sub_name, description, sort_order) VALUES (:categoryId, :subName, :description, :sortOrder)',
        { categoryId, subName: sub.subName || null, description: sub.description || null, sortOrder: subOrder++ }
      );
      const subcategoryId = subResult.insertId;

      let itemOrder = 0;
      for (const raw of sub.items || []) {
        const text = (typeof raw === 'string' ? raw : raw?.text || '').trim();
        if (!text) continue;
        await conn.query(
          'INSERT INTO product_items (subcategory_id, item_text, sort_order) VALUES (:subcategoryId, :itemText, :sortOrder)',
          { subcategoryId, itemText: text, sortOrder: itemOrder++ }
        );
      }
    }
  }
}

async function deleteDivision(id) {
  await pool.query('DELETE FROM divisions WHERE id = :id', { id });
}

async function slugExists(slug, excludeId = null) {
  const params = { slug };
  let sql = 'SELECT id FROM divisions WHERE slug = :slug';
  if (excludeId) {
    sql += ' AND id != :excludeId';
    params.excludeId = excludeId;
  }
  const [rows] = await pool.query(sql, params);
  return rows.length > 0;
}

async function reorderDivisions(order) {
  for (const { id, sortOrder } of order) {
    await pool.query('UPDATE divisions SET sort_order = :sortOrder WHERE id = :id', { id, sortOrder });
  }
}

module.exports = {
  listDivisions,
  getDivision,
  createDivision,
  updateDivisionFields,
  replaceProductTree,
  deleteDivision,
  slugExists,
  reorderDivisions,
};
