import mongoose from 'mongoose';

// Base schema for email logs
const emailLogSchema = new mongoose.Schema({
  email: { type: String, required: true },
  sent: { type: Boolean, default: false },
  clicked: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now },
}, { versionKey: false });

// Helper: get or create dynamic model safely
function getEmailModel(collectionName) {
  if (!collectionName) throw new Error('collectionName is required');
  const safeName = collectionName.replace(/[\0\$\.]/g, "_");
  return mongoose.models[safeName] || mongoose.model(safeName, emailLogSchema, safeName);
}

// GET all logs
async function getEmailLogs(req, res) {
  const { collectionName } = req.query;
  if (!collectionName) return res.status(400).json({ error: 'collectionName is required' });

  try {
    const EmailModel = getEmailModel(collectionName);
    const logs = await EmailModel.find().sort({ timestamp: -1 }).lean();
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

// POST a new log
async function postEmailLog(req, res) {
  const { collectionName } = req.query;
  const { email, sent, clicked, timestamp } = req.body;

  if (!collectionName) return res.status(400).json({ error: 'collectionName is required' });
  if (!email || sent === undefined || clicked === undefined)
    return res.status(400).json({ error: 'Missing required fields' });

  try {
    const EmailModel = getEmailModel(collectionName);
    const newLog = new EmailModel({
      email,
      sent,
      clicked,
      timestamp: timestamp ? new Date(timestamp) : undefined,
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
}

export default { getEmailLogs, postEmailLog };
