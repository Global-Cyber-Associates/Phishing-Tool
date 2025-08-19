// routes/fetchEmails.js
import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// GET /api/fetch-emails?collectionName=CampaignName
router.get('/', async (req, res) => {
  const { collectionName } = req.query;

  if (!collectionName) {
    return res.status(400).json({ error: 'collectionName is required' });
  }

  try {
    // Define the schema (same as upload)
    const emailSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      sent: { type: Boolean, default: false },
      clicked: { type: Boolean, default: false },
      timestamp: { type: Date },
      quizMarks: { type: Number },
    });

    // Use existing model or create a new one dynamically
    const EmailModel =
      mongoose.models[collectionName] || mongoose.model(collectionName, emailSchema, collectionName);

    // Fetch all emails
    const emails = await EmailModel.find({}, { _id: 0, email: 1 }).lean();
    res.json(emails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
