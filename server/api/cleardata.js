import getEmailModel from '../models/emailLog.js';

const clearData = async (req, res) => {
  const { collectionName } = req.query;
  if (!collectionName) {
    console.log('❌ collectionName missing in query');
    return res.status(400).json({ message: 'collectionName is required' });
  }

  // Optional: sanitize collection name
  const safeCollectionName = collectionName.replace(/[\0\$\.]/g, "_");

  try {
    const EmailModel = getEmailModel(safeCollectionName); 
    const result = await EmailModel.deleteMany({});
    console.log(`✅ Cleared ${result.deletedCount} logs from ${safeCollectionName}`);
    res.json({ message: `Cleared ${result.deletedCount} logs from ${safeCollectionName}` });
  } catch (err) {
    console.error('❌ Error clearing data:', err);
    res.status(500).json({ message: 'Failed to clear data.', details: err.message });
  }
};

export default clearData;
