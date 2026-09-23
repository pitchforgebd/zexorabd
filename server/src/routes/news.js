const { Router } = require('express');
const newsService = require('../services/news');
const { ok, fail } = require('../utils/response');

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 9));
    const result = await newsService.listPublished({ page, limit });
    return ok(res, result);
  } catch (err) {
    return next(err);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const post = await newsService.getBySlug(req.params.slug);
    if (!post) return fail(res, 'News post not found', 404, 'NOT_FOUND');
    return ok(res, post);
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
