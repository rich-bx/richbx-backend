import { Router } from 'express';
import Plan from '../models/Plan.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/', async (req, res) => {
  const plans = await Plan.find().sort({ price: 1 });
  res.json(plans);
});

router.post('/', authRequired, async (req, res) => {
  const plan = await Plan.create(req.body);
  res.json(plan);
});

router.put('/:id', authRequired, async (req, res) => {
  const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(plan);
});

router.delete('/:id', authRequired, async (req, res) => {
  await Plan.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

export default router;
