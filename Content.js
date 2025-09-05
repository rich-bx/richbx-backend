import mongoose from 'mongoose';

const ContentSchema = new mongoose.Schema({
  page: { type: String, index: true },
  lang: { type: String, index: true },
  data: { type: Object, default: {} }
}, { timestamps: true });

ContentSchema.index({ page: 1, lang: 1 }, { unique: true });

export default mongoose.model('Content', ContentSchema);
