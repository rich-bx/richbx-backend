import { Router } from 'express';
import Content from '../models/Content.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/:page/:lang', async (req, res) => {
  const { page, lang } = req.params;
  const found = await Content.findOne({ page, lang });
  res.json(found || { page, lang, data: {} });
});

router.post('/upsert', authRequired, async (req, res) => {
  const { page, lang, data } = req.body;
  const doc = await Content.findOneAndUpdate(
    { page, lang },
    { $set: { data } },
    { upsert: true, new: true }
  );
  res.json(doc);
});

router.post('/seed', async (req, res) => {
  const base = {
    heroTitle: { en: 'Fuel your trading journey', ar: 'موّل رحلتك في التداول', fr: 'Alimentez votre parcours de trading', es: 'Impulsa tu camino de trading', tr: 'Alım-satım yolculuğunu güçlendir' },
    heroSubtitle: { en: 'Flexible funding, fair rules, instant dashboard insights.', ar: 'تمويل مرن، قواعد عادلة، ولوحة تحكم فورية.', fr: 'Financement flexible, règles équitables, tableau de bord instantané.', es: 'Financiación flexible, reglas justas y panel instantáneo.', tr: 'Esnek fonlama, adil kurallar, anlık kontrol paneli.' },
    cta: { en: 'Get Funded', ar: 'ابدأ التمويل', fr: 'Obtenir un financement', es: 'Obtén financiación', tr: 'Fonlama al' },
    features: { en: ['No hidden fees', 'Real-time metrics', 'Fast payouts'], ar: ['بدون رسوم مخفية', 'إحصاءات لحظية', 'سحوبات سريعة'], fr: ['Pas de frais cachés', 'Statistiques en temps réel', 'Paiements rapides'], es: ['Sin tarifas ocultas', 'Métricas en tiempo real', 'Retiros rápidos'], tr: ['Gizli ücret yok', 'Gerçek zamanlı metrikler', 'Hızlı ödemeler'] }
  };

  const pages = ['Home','About','Services','Pricing','Blog','Contact'];
  const langs = ['en','ar','fr','es','tr'];

  const bulk = [];
  for (const page of pages) {
    for (const lang of langs) {
      const data = {
        logoUrl: '/uploads/logo.png',
        hero: {
          title: base.heroTitle[lang],
          subtitle: base.heroSubtitle[lang],
          cta: base.cta[lang]
        },
        sections: [
          { heading: { en: 'Why choose us', ar: 'لماذا نحن', fr: 'Pourquoi nous choisir', es: 'Por qué elegirnos', tr: 'Neden bizi seçmelisiniz' }[lang], bullets: base.features[lang] },
        ]
      };
      bulk.push({ updateOne: { filter: { page, lang }, update: { $set: { data } }, upsert: true } });
    }
  }
  await Content.bulkWrite(bulk);
  res.json({ ok: true, seeded: true });
});

export default router;
