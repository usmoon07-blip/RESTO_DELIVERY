import path from 'node:path';
import fs from 'node:fs';
import crypto from 'node:crypto';
import multer from 'multer';

/** Suratlar shu papkada saqlanadi va /uploads orqali beriladi */
export const UPLOAD_DIR = path.resolve(process.cwd(), 'uploads');

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = (path.extname(file.originalname) || '.jpg').toLowerCase();
    const safeExt = /^\.(jpe?g|png|webp|avif)$/.test(ext) ? ext : '.jpg';
    cb(null, `${Date.now()}-${crypto.randomBytes(5).toString('hex')}${safeExt}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8 MB
  fileFilter: (req, file, cb) => {
    if (!ALLOWED.has(file.mimetype)) {
      return cb(new Error('Faqat JPG, PNG, WEBP yoki AVIF surat yuklash mumkin'));
    }
    cb(null, true);
  },
}).single('image');

/** Multer xatolarini toza javobga aylantiradi */
export function handleUpload(req, res, next) {
  uploadImage(req, res, (error) => {
    if (!error) return next();

    const message =
      error.code === 'LIMIT_FILE_SIZE'
        ? "Surat hajmi 8 MB dan oshmasligi kerak"
        : error.message;

    res.status(400).json({ ok: false, error: message });
  });
}

export default handleUpload;
