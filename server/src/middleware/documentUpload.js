const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const config = require('../config');
const { publicPathFor } = require('./imageUpload');

// See imageUpload.js for why this is a fixed mimetype->extension map rather
// than trusting the client-supplied filename's extension.
const MIME_TO_EXT = {
  'application/pdf': '.pdf',
  'application/msword': '.doc',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB, matches the original frontend hint

function createDocumentUpload(subdir) {
  const dir = path.join(config.uploadsDir, subdir);
  fs.mkdirSync(dir, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      cb(null, `${crypto.randomBytes(16).toString('hex')}${MIME_TO_EXT[file.mimetype]}`);
    },
  });

  return multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
      if (!MIME_TO_EXT[file.mimetype]) {
        return cb(new Error('Only PDF, DOC, or DOCX files are allowed'));
      }
      return cb(null, true);
    },
  });
}

module.exports = { createDocumentUpload, publicPathFor };
