import mongoose from 'mongoose';

const PlanSchema = new mongoose.Schema({
  title: String,
  price: Number,
  currency: { type: String, default: 'USD' },
  features: [String],
  isPopular: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Plan', PlanSchema);
