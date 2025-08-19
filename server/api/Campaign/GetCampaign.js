import mongoose from "mongoose";
import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {

    const collections = await mongoose.connection.db.listCollections().toArray();
    const campaignNames = collections.map((c) => c.name);

    res.json(campaignNames);
  } catch (err) {
    console.error("❌ Failed to fetch campaigns:", err);
    res.status(500).json({ error: "Failed to fetch campaigns." });
  }
});

export default router;
