import { Router } from 'express';
import Admin from '../models/Admin.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/seed-admin', async (req, res) => {
  try {
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    const exists = await Admin.findOne({ email: ADMIN_EMAIL });
    if (exists) return res.json({ ok: true, seeded: false });
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await Admin.create({ email: ADMIN_EMAIL, password: hash });
    res.json({ ok: true, seeded: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await Admin.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.json({ token });
});

export default router;
