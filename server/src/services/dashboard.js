const pool = require('../db/pool');

// COUNT(*) queries rather than fetching full rows just to read .length -
// this dashboard needs aggregates, not full datasets, and the existing
// list endpoints (GET /api/admin/divisions etc.) aren't a fit for that.
async function getCounts() {
  const [[divisions], [news], [photos], [videos], [suppliers], [contacts], [careers]] = await Promise.all([
    pool.query('SELECT COUNT(*) AS total FROM divisions'),
    pool.query('SELECT COUNT(*) AS total, SUM(is_published) AS published FROM news_posts'),
    pool.query('SELECT COUNT(*) AS total FROM photo_gallery'),
    pool.query('SELECT COUNT(*) AS total FROM video_gallery'),
    pool.query('SELECT COUNT(*) AS total FROM suppliers'),
    pool.query("SELECT COUNT(*) AS total, SUM(status = 'unread') AS unread FROM contact_messages"),
    pool.query("SELECT COUNT(*) AS total, SUM(status = 'new') AS new_count FROM career_applications"),
  ]);

  return {
    divisions: divisions[0].total,
    newsPosts: { total: news[0].total, published: Number(news[0].published) || 0, draft: news[0].total - (Number(news[0].published) || 0) },
    photoGallery: photos[0].total,
    videoGallery: videos[0].total,
    suppliers: suppliers[0].total,
    contactMessages: { total: contacts[0].total, unread: Number(contacts[0].unread) || 0 },
    careerApplications: { total: careers[0].total, new: Number(careers[0].new_count) || 0 },
  };
}

async function getRecentActivity() {
  const [[recentContacts], [recentCareers], [recentNews], [recentDivisions]] = await Promise.all([
    pool.query('SELECT id, name, subject, status, created_at FROM contact_messages ORDER BY created_at DESC LIMIT 5'),
    pool.query('SELECT id, full_name, position, status, created_at FROM career_applications ORDER BY created_at DESC LIMIT 5'),
    pool.query('SELECT id, title, slug, is_published, updated_at FROM news_posts ORDER BY updated_at DESC LIMIT 5'),
    pool.query('SELECT id, name, slug, updated_at FROM divisions ORDER BY updated_at DESC LIMIT 5'),
  ]);

  return {
    contactMessages: recentContacts.map((r) => ({ id: r.id, name: r.name, subject: r.subject, status: r.status, createdAt: r.created_at })),
    careerApplications: recentCareers.map((r) => ({ id: r.id, fullName: r.full_name, position: r.position, status: r.status, createdAt: r.created_at })),
    newsPosts: recentNews.map((r) => ({ id: r.id, title: r.title, slug: r.slug, isPublished: !!r.is_published, updatedAt: r.updated_at })),
    divisions: recentDivisions.map((r) => ({ id: r.id, name: r.name, slug: r.slug, updatedAt: r.updated_at })),
  };
}

async function getSummary() {
  const [counts, recent] = await Promise.all([getCounts(), getRecentActivity()]);
  return { counts, recent };
}

module.exports = { getSummary };
