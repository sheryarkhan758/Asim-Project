const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const multer = require('multer');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // UUID filename keeps stored names unique and unguessable; preserve the extension.
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

// Images only, reject anything that isn't an image/* mimetype.
function fileFilter(req, file, cb) {
  if (/^image\//.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(Object.assign(new Error('Only image uploads are allowed'), { status: 400 }));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});

module.exports = upload;
