import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Sidebar from './sidebar/sidebar.jsx';
import Logs from './Logs/Logs.jsx';
import EmailPreview from './EmailPreview/EmailPreview.jsx';
import DashboardStats from './Stats/Stats.jsx';
import Settings from './settings/settings.jsx';

import host from './host.js';
import './dashboard.css';

export default function Dashboard() {
  const [logs, setLogs] = useState([]);
  const [message, setMessage] = useState('');
  const [emailHtml, setEmailHtml] = useState('');
  const [campaigns, setCampaigns] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [isClearing, setIsClearing] = useState(false);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchCampaigns = async () => {
    try {
      const res = await axios.get(`${host.url}/api/campaigns`);
      setCampaigns(res.data || []);
    } catch (err) {
      console.error(err);
      showMessage('❌ Failed to load campaigns');
    }
  };

  const fetchLogs = async (campaign) => {
    if (!campaign) {
      setLogs([]);
      return;
    }
    try {
      const res = await axios.get(`${host.url}/api/emailLogs?collectionName=${encodeURIComponent(campaign)}`);
      setLogs(res.data || []);
    } catch (err) {
      console.error(err);
      setLogs([]);
      showMessage('❌ Failed to load logs');
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCampaignChange = (campaign) => {
    setSelectedCampaign(campaign);
    fetchLogs(campaign);
  };

  const handleTestEmailView = async () => {
    try {
      const res = await axios.get(`${host.url}/api/email-template`);
      setEmailHtml(res.data);
    } catch {
      showMessage('❌ Failed to load email template');
    }
  };

  // Clear logs for the selected campaign
  const handleClearData = async () => {
    if (!selectedCampaign) return showMessage('Select a campaign first');
    if (!window.confirm(`Clear logs for ${selectedCampaign}?`)) return;

    setIsClearing(true);
    try {
      // Send campaign name in POST body
      await axios.post(`${host.url}/api/cleardata`, {
        collectionName: selectedCampaign,
        campaign: selectedCampaign
      });
      showMessage('✅ Logs cleared successfully');
      fetchLogs(selectedCampaign);
    } catch (err) {
      console.error(err);
      showMessage('❌ Failed to clear logs');
    } finally {
      setIsClearing(false);
    }
  };

  const stats = {
    emailsSent: logs.filter(l => l.sent).length,
    clickedLink: logs.filter(l => l.clicked).length,
  };

  return (
    <Router>
      <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
        <Sidebar onRefreshLogs={() => fetchLogs(selectedCampaign)} />
        <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
          {message && (
            <div
              style={{
                position: 'fixed',
                top: 20,
                right: 20,
                background: '#333',
                color: '#fff',
                padding: '10px 20px',
                borderRadius: 4,
                zIndex: 1000,
              }}
            >
              {message}
            </div>
          )}

          <Routes>
            <Route
              path="/"
              element={
                <DashboardStats
                  stats={stats}
                  campaigns={campaigns}
                  selectedCampaign={selectedCampaign}
                  onCampaignChange={handleCampaignChange}
                  onClearData={handleClearData}
                  isClearing={isClearing}
                />
              }
            />
            <Route path="/logs" element={<Logs logs={logs} />} />
            <Route
              path="/email-preview"
              element={<EmailPreview emailHtml={emailHtml} onTestEmailView={handleTestEmailView} />}
            />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
