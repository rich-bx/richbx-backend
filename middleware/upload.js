import { Router } from 'express';
import { uploader } from '../middleware/upload.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.post('/image', authRequired, uploader.single('image'), (req, res) => {
  const url = `${process.env.BASE_URL}/${req.file.path}`.replace(/\\/g,'/');
  res.json({ url });
});

export default router;
