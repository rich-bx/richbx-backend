import multer from 'multer';
import path from 'path';
import fs from 'fs';

const dir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '_' + Math.random().toString(36).slice(2) + ext);
  }
});

export const uploader = multer({ storage });
