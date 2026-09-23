const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const config = require('../config');

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

/**
 * Build a multer instance that stores images under uploads/<subdir>/ with a
 * randomized filename (never trusts the client-supplied name) and rejects
 * non-image mimetypes. Returns the *public* path (relative to /uploads) so
 * callers can store it directly in the DB.
 */
function createImageUpload(subdir) {
  const dir = path.join(config.uploadsDir, subdir);
  fs.mkdirSync(dir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${crypto.randomBytes(16).toString('hex')}${ext}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
      if (!ALLOWED_MIME.has(file.mimetype)) {
        return cb(new Error('Only JPEG, PNG, WEBP, or GIF images are allowed'));
      }
      return cb(null, true);
    },
  });
}

function publicPathFor(subdir, filename) {
  return `/uploads/${subdir}/${filename}`;
}

module.exports = { createImageUpload, publicPathFor };
