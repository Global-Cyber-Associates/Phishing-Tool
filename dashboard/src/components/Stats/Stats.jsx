import React from "react";
import "./Stats.css";

export default function DashboardStats({ stats, campaigns, selectedCampaign, onCampaignChange, onClearData }) {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Monitor email campaign performance in real-time</p>
      </header>

      <div className="dashboard-actions">
        <select 
          value={selectedCampaign} 
          onChange={(e) => onCampaignChange(e.target.value)}
          className="dashboard-dropdown"
        >
          <option value="">-- Select Campaign --</option>
          {campaigns.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button onClick={onClearData} className="dashboard-btn danger" disabled>
          🗑️ Clear Data
        </button>
      </div>

      <section className="stats-cards">
        <div className="stat-card">
          <div className="stat-number">{stats.emailsSent}</div>
          <div className="stat-label">Emails Sent</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.clickedLink}</div>
          <div className="stat-label">Clicked Links</div>
        </div>
      </section>
    </div>
  );
}
