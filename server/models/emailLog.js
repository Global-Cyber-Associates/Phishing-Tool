import mongoose from 'mongoose';

const emailLogSchema = new mongoose.Schema({
  email: { type: String, required: true },
  sent: { type: Boolean, default: false },
  clicked: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
}, { versionKey: false });

export default function getEmailModel(collectionName) {
  if (!collectionName) throw new Error("collectionName required");

  // Sanitize: remove braces, trim, and lowercase
  const sanitized = collectionName.replace(/[{}]/g, '').trim().toLowerCase();

  if (mongoose.models[sanitized]) {
    return mongoose.models[sanitized];
  }

  return mongoose.model(sanitized, emailLogSchema, sanitized);
}
