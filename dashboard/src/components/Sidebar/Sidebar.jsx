import React, { useState } from "react";
import { BarChart2, FileText, Settings, Mail, RefreshCw } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import "./sidebar.css";
import logo from "./logo.png";

export default function Sidebar({ onRefreshLogs }) {
  const [expanded, setExpanded] = useState(true);
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Stats", icon: <BarChart2 size={20} /> },
    { path: "/logs", label: "Logs", icon: <FileText size={20} /> },
    { path: "/settings", label: "Configs", icon: <Settings size={20} /> },
    { path: "/email-preview", label: "Email Preview", icon: <Mail size={20} /> },
  ];

  return (
    <div className={`sidebar ${expanded ? "expanded" : "collapsed"}`}>
      <div className="sidebar-header">
        <div className="sidebar-top">
          <button
            className="sidebar-toggle"
            onClick={() => setExpanded(!expanded)}
            title={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? "«" : "»"}
          </button>
          {expanded && (
            <span className="sidebar-title">
              <img className="logo" src={logo} alt="" />
              GlobalCyberAssociates
              </span>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`nav-item ${location.pathname === item.path ? "active" : ""}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {expanded && <span className="nav-label">{item.label}</span>}
          </Link>
        ))}

        {expanded && (
          <button
            onClick={onRefreshLogs}
            className="nav-item refresh-btn"
          >
            <RefreshCw size={16} /> Refresh Logs
          </button>
        )}
      </nav>
    </div>
  );
}
