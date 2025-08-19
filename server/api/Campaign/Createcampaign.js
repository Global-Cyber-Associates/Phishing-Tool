import XLSX from "xlsx";
import mongoose from "mongoose";

const uploadEmails = async (req, res) => {
  try {
    const { collectionName } = req.body;

    if (!collectionName) {
      return res.status(400).json({ error: "Collection name is required" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "File is required (.csv, .xls, .xlsx)" });
    }

    // Define schema (once per collection)
    const emailSchema = new mongoose.Schema({
      email: { type: String, required: true },
      sent: { type: Boolean, default: false },
      clicked: { type: Boolean, default: false },
      timestamp: { type: Date },
      quizMarks: { type: Number },
    });

    // Avoid OverwriteModelError
    const EmailModel =
      mongoose.models[collectionName] ||
      mongoose.model(collectionName, emailSchema);

    // Read file
    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });

    // Extract valid emails
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
    const allEmails = [];
    sheetData.forEach((row) => {
      for (let cell in row) {
        if (emailRegex.test(row[cell])) {
          allEmails.push(row[cell].toLowerCase()); // normalize
        }
      }
    });

    if (!allEmails.length) {
      return res.status(400).json({ error: "No emails found in the file" });
    }

    // Find already existing emails in DB
    const existing = await EmailModel.find({ email: { $in: allEmails } }, { email: 1 });
    const existingSet = new Set(existing.map(e => e.email.toLowerCase()));

    // Filter out duplicates
    const newEmails = allEmails
      .filter(email => !existingSet.has(email))
      .map(email => ({ email }));

    if (!newEmails.length) {
      return res.status(200).json({ message: "All emails already exist. Nothing to insert." });
    }

    // Insert only new emails
    await EmailModel.insertMany(newEmails);

    res.json({
      message: `✅ ${newEmails.length} new emails added to '${collectionName}' collection.`
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

export default uploadEmails;
