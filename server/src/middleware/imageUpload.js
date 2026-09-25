const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const { Jimp } = require('jimp');
const config = require('../config');

// Maps validated mimetypes to a fixed, code-controlled extension. The saved
// filename NEVER derives from the client-supplied originalname/extension -
// a file named e.g. "shell.php" with a spoofed "image/jpeg" Content-Type
// would otherwise pass this filter (mimetype is client-claimed, not content-
// verified) and get saved as "<random>.php", which is a real path to RCE if
// that directory is ever reachable by a PHP-enabled webserver ahead of Node.
const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};
const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8MB

/**
 * Build a multer instance that stores images under uploads/<subdir>/ with a
 * randomized filename and an extension derived only from the validated
 * mimetype (never the client-supplied name). Returns the *public* path
 * (relative to /uploads) so callers can store it directly in the DB.
 */
function createImageUpload(subdir) {
  const dir = path.join(config.uploadsDir, subdir);
  fs.mkdirSync(dir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      // fileFilter (below) runs before this and already rejects anything
      // not in MIME_TO_EXT, so the lookup here is always a hit.
      cb(null, `${crypto.randomBytes(16).toString('hex')}${MIME_TO_EXT[file.mimetype]}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
      if (!MIME_TO_EXT[file.mimetype]) {
        return cb(new Error('Only JPEG, PNG, WEBP, or GIF images are allowed'));
      }
      return cb(null, true);
    },
  });
}

function publicPathFor(subdir, filename) {
  return `/uploads/${subdir}/${filename}`;
}

const MAX_WIDTH = 1920;
const JPEG_QUALITY = 82;

/**
 * Resize (if wider than MAX_WIDTH) and re-compress an uploaded image in
 * place. Best-effort: a failure here (corrupt file, unsupported variant)
 * logs a warning and leaves the original upload untouched rather than
 * failing the admin's save. GIFs are skipped outright - Jimp doesn't
 * reliably round-trip animated GIFs, and a broken logo/banner is worse
 * than a slightly larger file.
 */
async function optimizeImage(filePath) {
  if (path.extname(filePath).toLowerCase() === '.gif') return;
  try {
    const img = await Jimp.read(filePath);
    if (img.bitmap.width > MAX_WIDTH) {
      img.resize({ w: MAX_WIDTH });
    }
    await img.write(filePath, { quality: JPEG_QUALITY });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`[imageUpload] optimization skipped for ${filePath}:`, err.message);
  }
}

module.exports = { createImageUpload, publicPathFor, optimizeImage };
