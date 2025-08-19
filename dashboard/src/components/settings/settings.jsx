import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./settings.css";

export default function UploadAndSendEmails() {
  const [file, setFile] = useState(null);
  const [collectionName, setCollectionName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [emailsPreview, setEmailsPreview] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState("");
  const [campaignEmails, setCampaignEmails] = useState([]);

  // Fetch existing campaigns
  const fetchCampaigns = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/campaigns");
      setCampaigns(res.data || []);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch campaigns.");
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  // Extract emails from uploaded file
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setEmailsPreview([]);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { raw: false });

        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
        const extracted = [];
        sheetData.forEach((row) => {
          for (let cell in row) {
            if (emailRegex.test(row[cell])) extracted.push(row[cell]);
          }
        });
        setEmailsPreview(extracted);
      };
      reader.readAsBinaryString(selectedFile);
    }
  };

  // Upload file and create campaign
  const handleUpload = async () => {
    if (!file || !collectionName) {
      setMessage("⚠️ Please select a file and enter a campaign name.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("collectionName", collectionName);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/upload-emails", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setMessage(res.data.message || "✅ Emails uploaded successfully.");
      setFile(null);
      setEmailsPreview([]);
      setCollectionName("");
      await fetchCampaigns();
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "❌ Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  // Send emails from selected campaign
  const handleSend = async () => {
    if (!selectedCampaign) {
      setMessage("⚠️ Select a campaign to send emails.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/sendEmails", {
        collectionName: selectedCampaign,
        campaign: selectedCampaign, // dynamic campaign name
      });
      setMessage(res.data.message || `✅ Emails sent for campaign "${selectedCampaign}"`);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to send emails.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch emails for selected campaign
  const fetchCampaignEmails = async (campaign) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/getEmails?collectionName=${campaign}`);
      setCampaignEmails(res.data || []);
    } catch (err) {
      console.error(err);
      setCampaignEmails([]);
    }
  };

  const handleCampaignSelect = (campaign) => {
    setSelectedCampaign(campaign);
    fetchCampaignEmails(campaign);
  };

  return (
    <div className="upload-send-wrapper">
      {/* Left panel */}
      <div className="left-panel">
        <h2>Create Campaign</h2>
        <input
          type="text"
          placeholder="Enter campaign name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
          className="input-field"
        />
        <input type="file" accept=".csv,.xls,.xlsx" onChange={handleFileChange} className="input-field" />

        {emailsPreview.length > 0 && (
          <div className="preview-box">
            <h4>Emails in file:</h4>
            <ul className="preview-list">{emailsPreview.map((email, idx) => <li key={idx}>{email}</li>)}</ul>
          </div>
        )}

        <button onClick={handleUpload} disabled={loading} className="btn-primary">
          {loading ? "Uploading..." : "Upload & Create Campaign"}
        </button>

        <hr />

        <h2>Send Emails</h2>
        <select
          value={selectedCampaign}
          onChange={(e) => handleCampaignSelect(e.target.value)}
          className="input-field"
        >
          <option value="">-- Select Campaign --</option>
          {campaigns.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <button onClick={handleSend} disabled={loading || !selectedCampaign} className="btn-primary">
          {loading ? "Sending..." : "Send Emails"}
        </button>

        {message && <p className="status-msg">{message}</p>}
      </div>

      {/* Right panel */}
      <div className="right-panel">
        <h2>{selectedCampaign ? `Emails in ${selectedCampaign}` : "Select a campaign to view emails"}</h2>
        <div className="emails-list">
          {campaignEmails.length > 0 ? (
            <ul>{campaignEmails.map((e, idx) => <li key={idx}>{e.email}</li>)}</ul>
          ) : (
            <p>No emails to display</p>
          )}
        </div>
      </div>
    </div>
  );
}
