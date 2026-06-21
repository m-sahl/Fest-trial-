import { useState, useEffect, createContext, useContext, useCallback } from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const ACCENT = "#6c63ff";
const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const INITIAL_GROUPS = [
  { id: "g1", name: "Group A", color: "#6c63ff" },
  { id: "g2", name: "Group B", color: "#22d3ee" },
  { id: "g3", name: "Group C", color: "#f472b6" },
];

const INITIAL_PROGRAMS = [
  { id: "p1", name: "Western Music", category: "Senior", type: "Group", maxParticipants: 6, criteria: ["Rhythm", "Harmony"] },
  { id: "p2", name: "Classical Dance", category: "Junior", type: "Single", maxParticipants: 1, criteria: ["Grace", "Expression"] },
  { id: "p3", name: "Painting", category: "Sub-Junior", type: "Single", maxParticipants: 1, criteria: ["Creativity", "Technique"] },
  { id: "p4", name: "Drama", category: "Senior", type: "Group", maxParticipants: 8, criteria: ["Acting", "Direction"] },
];

const INITIAL_PARTICIPANTS = [
  { id: "pt1", name: "Arjun Nair", groupId: "g1", category: "Senior", chestNumber: "SR-101" },
  { id: "pt2", name: "Priya Menon", groupId: "g1", category: "Junior", chestNumber: "JR-101" },
  { id: "pt3", name: "Rohan Das", groupId: "g2", category: "Senior", chestNumber: "SR-201" },
  { id: "pt4", name: "Sneha Pillai", groupId: "g2", category: "Sub-Junior", chestNumber: "SJ-201" },
  { id: "pt5", name: "Kavya Iyer", groupId: "g3", category: "Junior", chestNumber: "JR-301" },
];

const INITIAL_RESULTS = [
  { id: "r1", programId: "p1", first: { groupId: "g1", chestNumber: "SR-101", points: 10 }, second: { groupId: "g2", chestNumber: "SR-201", points: 7 }, third: null },
];

const INITIAL_REGISTRATIONS = [
  { id: "reg1", programId: "p1", groupId: "g1", participantIds: ["pt1"] },
  { id: "reg2", programId: "p2", groupId: "g2", participantIds: ["pt3"] },
];

const USERS = [
  { id: "u1", name: "Admin User", role: "admin", email: "admin@fest.in" },
  { id: "u2", name: "Leader A", role: "group_leader", groupId: "g1", email: "leader.a@fest.in" },
  { id: "u3", name: "Leader B", role: "group_leader", groupId: "g2", email: "leader.b@fest.in" },
  { id: "u4", name: "Leader C", role: "group_leader", groupId: "g3", email: "leader.c@fest.in" },
];

// ─── ICONS ───────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    sun: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
    moon: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    book: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
    printer: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
    trophy: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="8 21 12 21 16 21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M7 4H17l-1 7a5 5 0 0 1-5 5 5 5 0 0 1-5-5L7 4"/><path d="M7 4H4a2 2 0 0 0 0 4h3"/><path d="M17 4h3a2 2 0 0 1 0 4h-3"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    menu: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>,
    chevronRight: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
    download: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    award: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
    grid: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    lock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  };
  return icons[name] || null;
};

// ─── APP STATE ────────────────────────────────────────────────────────────────
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// ─── STYLES ───────────────────────────────────────────────────────────────────
const injectStyles = (dark) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: ${dark ? "#0d0e1a" : "#f4f4fb"}; color: ${dark ? "#e8e8f0" : "#1a1a2e"}; transition: background 0.3s, color 0.3s; }

  .app-shell { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 240px; min-height: 100vh; position: fixed; left: 0; top: 0; z-index: 50;
    background: ${dark ? "rgba(18,19,35,0.97)" : "rgba(255,255,255,0.97)"};
    backdrop-filter: blur(20px);
    border-right: 1px solid ${dark ? "rgba(108,99,255,0.15)" : "rgba(108,99,255,0.12)"};
    display: flex; flex-direction: column; padding: 0;
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .sidebar-logo {
    padding: 24px 20px 20px;
    border-bottom: 1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"};
  }
  .sidebar-logo h1 {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 18px; font-weight: 800; letter-spacing: -0.5px;
    background: linear-gradient(135deg, #6c63ff, #a78bfa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .sidebar-logo p { font-size: 11px; color: ${dark ? "#6b7280" : "#9ca3af"}; margin-top: 2px; }
  .sidebar-nav { flex: 1; padding: 12px 10px; overflow-y: auto; }
  .nav-section { margin-bottom: 6px; }
  .nav-label { font-size: 10px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: ${dark ? "#4b5563" : "#9ca3af"}; padding: 8px 10px 4px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px; border-radius: 10px;
    cursor: pointer; font-size: 13.5px; font-weight: 500; color: ${dark ? "#9ca3af" : "#6b7280"};
    transition: all 0.18s ease; margin-bottom: 2px; text-decoration: none;
    border: 1px solid transparent;
  }
  .nav-item:hover { background: ${dark ? "rgba(108,99,255,0.08)" : "rgba(108,99,255,0.06)"}; color: #6c63ff; }
  .nav-item.active {
    background: linear-gradient(135deg, rgba(108,99,255,0.18), rgba(167,139,250,0.12));
    color: #6c63ff; border-color: rgba(108,99,255,0.2);
    box-shadow: 0 2px 8px rgba(108,99,255,0.12);
  }
  .nav-item-icon { width: 18px; flex-shrink: 0; }
  .sidebar-footer { padding: 12px 10px; border-top: 1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}; }
  .user-card {
    display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px;
    background: ${dark ? "rgba(108,99,255,0.08)" : "rgba(108,99,255,0.06)"};
    margin-bottom: 8px;
  }
  .user-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg, #6c63ff, #a78bfa);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 700; color: white; flex-shrink: 0;
  }
  .user-name { font-size: 13px; font-weight: 600; }
  .user-role { font-size: 11px; color: ${dark ? "#6b7280" : "#9ca3af"}; text-transform: capitalize; }

  /* MAIN */
  .main-content { margin-left: 240px; flex: 1; min-height: 100vh; transition: margin 0.35s cubic-bezier(0.4,0,0.2,1); }
  .topbar {
    height: 60px; display: flex; align-items: center; justify-content: space-between;
    padding: 0 28px; position: sticky; top: 0; z-index: 40;
    background: ${dark ? "rgba(13,14,26,0.85)" : "rgba(244,244,251,0.85)"};
    backdrop-filter: blur(16px);
    border-bottom: 1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"};
  }
  .topbar-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 17px; font-weight: 700; }
  .topbar-actions { display: flex; align-items: center; gap: 10px; }
  .page { padding: 28px; animation: fadeSlideIn 0.3s cubic-bezier(0.4,0,0.2,1); }

  @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes scaleIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
  @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes pulse-ring { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(1.4); opacity: 0; } }

  /* CARDS */
  .card {
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"};
    border-radius: 16px; padding: 20px;
    transition: box-shadow 0.2s, transform 0.2s;
    backdrop-filter: blur(10px);
  }
  .card:hover { box-shadow: 0 8px 32px rgba(108,99,255,0.1); }
  .card-glass {
    background: ${dark ? "rgba(108,99,255,0.07)" : "rgba(108,99,255,0.05)"};
    border: 1px solid rgba(108,99,255,0.18);
    border-radius: 16px; padding: 20px;
  }

  /* STAT CARDS */
  .stat-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"};
    border-radius: 16px; padding: 20px; position: relative; overflow: hidden;
    animation: slideUp 0.4s cubic-bezier(0.4,0,0.2,1) both;
  }
  .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, #6c63ff, #a78bfa); }
  .stat-value { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 28px; font-weight: 800; color: #6c63ff; }
  .stat-label { font-size: 12px; color: ${dark ? "#6b7280" : "#9ca3af"}; margin-top: 4px; font-weight: 500; }
  .stat-icon { position: absolute; right: 16px; top: 16px; opacity: 0.15; }

  /* BUTTONS */
  .btn {
    display: inline-flex; align-items: center; gap: 7px; padding: 9px 16px;
    border-radius: 10px; font-size: 13.5px; font-weight: 600; cursor: pointer;
    border: none; transition: all 0.18s ease; font-family: 'Inter', sans-serif;
  }
  .btn-primary { background: linear-gradient(135deg, #6c63ff, #8b5cf6); color: white; box-shadow: 0 4px 14px rgba(108,99,255,0.35); }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(108,99,255,0.45); }
  .btn-secondary { background: ${dark ? "rgba(108,99,255,0.12)" : "rgba(108,99,255,0.08)"}; color: #6c63ff; border: 1px solid rgba(108,99,255,0.2); }
  .btn-secondary:hover { background: rgba(108,99,255,0.18); }
  .btn-danger { background: rgba(239,68,68,0.1); color: #ef4444; border: 1px solid rgba(239,68,68,0.2); }
  .btn-danger:hover { background: rgba(239,68,68,0.18); }
  .btn-ghost { background: transparent; color: ${dark ? "#9ca3af" : "#6b7280"}; }
  .btn-ghost:hover { background: ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}; }
  .btn-sm { padding: 6px 12px; font-size: 12.5px; border-radius: 8px; }
  .btn-icon { padding: 8px; border-radius: 9px; }

  /* TABLE */
  .table-wrap { overflow-x: auto; border-radius: 12px; border: 1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}; }
  table { width: 100%; border-collapse: collapse; font-size: 13.5px; }
  thead th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: ${dark ? "#6b7280" : "#9ca3af"}; background: ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"}; }
  tbody td { padding: 13px 16px; border-top: 1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}; }
  tbody tr { transition: background 0.15s; }
  tbody tr:hover { background: ${dark ? "rgba(108,99,255,0.05)" : "rgba(108,99,255,0.03)"}; }

  /* BADGES */
  .badge { display: inline-flex; align-items: center; padding: 3px 10px; border-radius: 20px; font-size: 11.5px; font-weight: 600; }
  .badge-senior { background: rgba(108,99,255,0.15); color: #6c63ff; }
  .badge-junior { background: rgba(34,211,238,0.15); color: #22d3ee; }
  .badge-subjunior { background: rgba(244,114,182,0.15); color: #f472b6; }
  .badge-single { background: rgba(52,211,153,0.15); color: #34d399; }
  .badge-group { background: rgba(251,191,36,0.15); color: #fbbf24; }
  .badge-admin { background: rgba(108,99,255,0.2); color: #6c63ff; }
  .badge-leader { background: rgba(34,211,238,0.15); color: #22d3ee; }

  /* FORM */
  .form-group { margin-bottom: 16px; }
  .form-label { display: block; font-size: 12.5px; font-weight: 600; margin-bottom: 6px; color: ${dark ? "#9ca3af" : "#6b7280"}; }
  .form-input {
    width: 100%; padding: 10px 14px; border-radius: 10px; font-size: 14px;
    background: ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"};
    border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
    color: ${dark ? "#e8e8f0" : "#1a1a2e"}; font-family: 'Inter', sans-serif;
    transition: border-color 0.18s, box-shadow 0.18s; outline: none;
  }
  .form-input:focus { border-color: #6c63ff; box-shadow: 0 0 0 3px rgba(108,99,255,0.15); }
  .form-select { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 12px center; padding-right: 36px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

  /* MODAL */
  .modal-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,0.55); backdrop-filter: blur(4px);
    z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px;
    animation: fadeIn 0.18s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal {
    background: ${dark ? "#13142a" : "#ffffff"};
    border: 1px solid ${dark ? "rgba(108,99,255,0.2)" : "rgba(108,99,255,0.15)"};
    border-radius: 20px; padding: 28px; width: 100%; max-width: 480px;
    animation: scaleIn 0.22s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow: 0 20px 60px rgba(0,0,0,0.3);
  }
  .modal-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 20px; }
  .modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px; }

  /* TABS */
  .tabs { display: flex; gap: 4px; background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"}; border-radius: 12px; padding: 4px; margin-bottom: 20px; }
  .tab { flex: 1; padding: 8px 14px; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; text-align: center; transition: all 0.18s ease; color: ${dark ? "#6b7280" : "#9ca3af"}; border: none; background: transparent; font-family: 'Inter', sans-serif; }
  .tab.active { background: ${dark ? "#1e1f3a" : "#ffffff"}; color: #6c63ff; box-shadow: 0 2px 8px rgba(0,0,0,0.12); }

  /* REALTIME DOT */
  .live-dot { width: 8px; height: 8px; border-radius: 50%; background: #22d3ee; position: relative; display: inline-block; }
  .live-dot::after { content: ''; position: absolute; inset: -3px; border-radius: 50%; border: 2px solid #22d3ee; animation: pulse-ring 1.5s infinite; }

  /* SECTION HEADER */
  .section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
  .section-title { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 16px; font-weight: 700; }

  /* TOGGLE */
  .toggle-theme {
    width: 36px; height: 36px; border-radius: 10px; border: 1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"};
    background: ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"};
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.18s;
  }
  .toggle-theme:hover { background: rgba(108,99,255,0.1); border-color: rgba(108,99,255,0.3); }

  /* CHEST NUMBER */
  .chest-num { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; font-weight: 700; background: linear-gradient(135deg, #6c63ff, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

  /* LEADERBOARD */
  .leader-row { display: flex; align-items: center; gap: 14px; padding: 14px; border-radius: 12px; background: ${dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"}; margin-bottom: 8px; transition: all 0.18s; }
  .leader-row:hover { background: ${dark ? "rgba(108,99,255,0.08)" : "rgba(108,99,255,0.05)"}; }
  .leader-rank { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; font-weight: 800; width: 36px; text-align: center; }
  .leader-rank.gold { color: #f59e0b; }
  .leader-rank.silver { color: #94a3b8; }
  .leader-rank.bronze { color: #b45309; }

  /* LOGIN */
  .login-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: ${dark ? "#0d0e1a" : "#f4f4fb"}; }
  .login-card { width: 100%; max-width: 400px; background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)"}; border: 1px solid ${dark ? "rgba(108,99,255,0.2)" : "rgba(108,99,255,0.15)"}; border-radius: 24px; padding: 36px; box-shadow: 0 24px 60px rgba(108,99,255,0.12); animation: scaleIn 0.3s cubic-bezier(0.34,1.56,0.64,1); }
  .login-logo { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 26px; font-weight: 800; background: linear-gradient(135deg, #6c63ff, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 6px; }
  .login-sub { font-size: 13px; color: ${dark ? "#6b7280" : "#9ca3af"}; margin-bottom: 28px; }

  /* GRID COLS */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .mt-1 { margin-top: 8px; } .mt-2 { margin-top: 16px; } .mt-3 { margin-top: 24px; }
  .mb-1 { margin-bottom: 8px; } .mb-2 { margin-bottom: 16px; }
  .flex { display: flex; } .flex-col { flex-direction: column; }
  .items-center { align-items: center; } .justify-between { justify-content: space-between; }
  .gap-1 { gap: 8px; } .gap-2 { gap: 12px; } .gap-3 { gap: 16px; }
  .text-muted { color: ${dark ? "#6b7280" : "#9ca3af"}; font-size: 13px; }
  .text-sm { font-size: 13px; } .text-xs { font-size: 11.5px; }
  .font-bold { font-weight: 700; } .font-semibold { font-weight: 600; }
  .w-full { width: 100%; }
  .color-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .group-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; }

  /* PRINT */
  @media print {
    .sidebar, .topbar, .no-print { display: none !important; }
    .main-content { margin-left: 0 !important; }
    .print-sheet { display: block !important; }
    body { background: white !important; color: black !important; }
    table { page-break-inside: auto; }
    thead { display: table-header-group; }
  }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${dark ? "rgba(108,99,255,0.3)" : "rgba(108,99,255,0.2)"}; border-radius: 3px; }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); }
    .main-content { margin-left: 0; }
    .form-row { grid-template-columns: 1fr; }
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .stat-grid { grid-template-columns: 1fr 1fr; }
  }
`;

// ─── MODAL COMPONENT ──────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, actions }) => (
  <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal">
      <div className="flex items-center justify-between mb-2">
        <div className="modal-title">{title}</div>
        <button className="btn btn-ghost btn-icon" onClick={onClose}><Icon name="x" size={16} /></button>
      </div>
      {children}
      {actions && <div className="modal-actions">{actions}</div>}
    </div>
  </div>
);

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
const LoginPage = ({ onLogin }) => {
  const { dark } = useTheme();
  const [selected, setSelected] = useState(null);
  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">FestFlow</div>
        <div className="login-sub">Arts & Cultural Fest Management</div>
        <div style={{ marginBottom: 20 }}>
          <div className="form-label">Sign in as</div>
          {USERS.map(u => (
            <div key={u.id}
              onClick={() => setSelected(u.id)}
              style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                borderRadius: 12, border: `1.5px solid ${selected === u.id ? ACCENT : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)")}`,
                background: selected === u.id ? "rgba(108,99,255,0.08)" : "transparent",
                cursor: "pointer", marginBottom: 8, transition: "all 0.18s"
              }}>
              <div className="user-avatar" style={{ width: 36, height: 36, fontSize: 13 }}>{u.name[0]}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{u.name}</div>
                <div style={{ fontSize: 12, color: dark ? "#6b7280" : "#9ca3af" }}>{u.email}</div>
              </div>
              <div style={{ marginLeft: "auto" }}>
                <span className={`badge badge-${u.role === "admin" ? "admin" : "leader"}`}>{u.role === "admin" ? "Admin" : "Group Leader"}</span>
              </div>
            </div>
          ))}
        </div>
        <button className="btn btn-primary w-full" style={{ justifyContent: "center" }}
          disabled={!selected}
          onClick={() => onLogin(USERS.find(u => u.id === selected))}>
          Continue
        </button>
      </div>
    </div>
  );
};

// ─── ADMIN: DASHBOARD ─────────────────────────────────────────────────────────
const AdminDashboard = () => {
  const { groups, participants, programs, registrations, results } = useApp();
  const { dark } = useTheme();
  const [tab, setTab] = useState("all");

  const totalPoints = (groupId) => {
    let pts = 0;
    results.forEach(r => {
      if (r.first?.groupId === groupId) pts += r.first.points;
      if (r.second?.groupId === groupId) pts += r.second.points;
      if (r.third?.groupId === groupId) pts += r.third.points;
    });
    return pts;
  };

  const filteredParticipants = tab === "all" ? participants : participants.filter(p => p.groupId === tab);

  return (
    <div className="page">
      <div className="stat-grid">
        {[
          { label: "Total Groups", value: groups.length, icon: "users" },
          { label: "Participants", value: participants.length, icon: "star" },
          { label: "Programs", value: programs.length, icon: "book" },
          { label: "Results Entered", value: results.length, icon: "trophy" },
        ].map((s, i) => (
          <div className="stat-card" key={s.label} style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="stat-icon"><Icon name={s.icon} size={40} color={ACCENT} /></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card mb-2" style={{ marginBottom: 16 }}>
        <div className="section-header">
          <div className="flex items-center gap-2">
            <div className="live-dot" />
            <span className="section-title">Live Registrations</span>
          </div>
          <span className="text-muted text-xs">Real-time updates</span>
        </div>
        <div className="tabs">
          <button className={`tab ${tab === "all" ? "active" : ""}`} onClick={() => setTab("all")}>All Groups</button>
          {groups.map(g => (
            <button key={g.id} className={`tab ${tab === g.id ? "active" : ""}`} onClick={() => setTab(g.id)}>{g.name}</button>
          ))}
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Chest #</th><th>Name</th><th>Group</th><th>Category</th><th>Registered Events</th></tr></thead>
            <tbody>
              {filteredParticipants.map(p => {
                const group = groups.find(g => g.id === p.groupId);
                const regs = registrations.filter(r => r.participantIds.includes(p.id));
                return (
                  <tr key={p.id}>
                    <td><span className="chest-num">{p.chestNumber}</span></td>
                    <td style={{ fontWeight: 500 }}>{p.name}</td>
                    <td>
                      <span className="group-pill" style={{ background: group?.color + "22", color: group?.color }}>
                        <span className="color-dot" style={{ background: group?.color }} />
                        {group?.name}
                      </span>
                    </td>
                    <td><span className={`badge badge-${p.category.toLowerCase().replace("-", "")}`}>{p.category}</span></td>
                    <td><span className="text-sm text-muted">{regs.length} event{regs.length !== 1 ? "s" : ""}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ─── ADMIN: GROUPS ────────────────────────────────────────────────────────────
const AdminGroups = () => {
  const { groups, setGroups } = useApp();
  const [modal, setModal] = useState(false);
  const [editGroup, setEditGroup] = useState(null);
  const [form, setForm] = useState({ name: "", color: "#6c63ff" });

  const openAdd = () => { setForm({ name: "", color: "#6c63ff" }); setEditGroup(null); setModal(true); };
  const openEdit = (g) => { setForm({ name: g.name, color: g.color }); setEditGroup(g); setModal(true); };
  const save = () => {
    if (!form.name.trim()) return;
    if (editGroup) {
      setGroups(prev => prev.map(g => g.id === editGroup.id ? { ...g, ...form } : g));
    } else {
      setGroups(prev => [...prev, { id: "g" + Date.now(), ...form }]);
    }
    setModal(false);
  };
  const del = (id) => setGroups(prev => prev.filter(g => g.id !== id));

  return (
    <div className="page">
      <div className="section-header">
        <div className="section-title">Groups</div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Icon name="plus" size={14} />Add Group</button>
      </div>
      <div className="grid-3">
        {groups.map(g => (
          <div className="card" key={g.id} style={{ borderTop: `3px solid ${g.color}` }}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div style={{ width: 14, height: 14, borderRadius: "50%", background: g.color }} />
                <span style={{ fontWeight: 700, fontSize: 16 }}>{g.name}</span>
              </div>
              <div className="flex gap-1">
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(g)}><Icon name="edit" size={14} /></button>
                <button className="btn btn-danger btn-icon btn-sm" onClick={() => del(g.id)}><Icon name="trash" size={14} /></button>
              </div>
            </div>
            <div className="text-muted text-xs mt-1">Group ID: {g.id}</div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal title={editGroup ? "Edit Group" : "Add Group"} onClose={() => setModal(false)}
          actions={<><button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>Save</button></>}>
          <div className="form-group"><label className="form-label">Group Name</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Group D" /></div>
          <div className="form-group"><label className="form-label">Color</label><input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: "100%", height: 42, border: "none", borderRadius: 10, cursor: "pointer", background: "none" }} /></div>
        </Modal>
      )}
    </div>
  );
};

// ─── ADMIN: PROGRAMS ──────────────────────────────────────────────────────────
const AdminPrograms = () => {
  const { programs, setPrograms } = useApp();
  const [modal, setModal] = useState(false);
  const [editProg, setEditProg] = useState(null);
  const [form, setForm] = useState({ name: "", category: "Senior", type: "Single", maxParticipants: 1, criteria: ["", ""] });

  const openAdd = () => { setForm({ name: "", category: "Senior", type: "Single", maxParticipants: 1, criteria: ["", ""] }); setEditProg(null); setModal(true); };
  const openEdit = (p) => { setForm({ ...p }); setEditProg(p); setModal(true); };
  const save = () => {
    if (!form.name.trim()) return;
    if (editProg) setPrograms(prev => prev.map(p => p.id === editProg.id ? { ...p, ...form } : p));
    else setPrograms(prev => [...prev, { id: "p" + Date.now(), ...form }]);
    setModal(false);
  };
  const del = (id) => setPrograms(prev => prev.filter(p => p.id !== id));
  const setCriteria = (i, val) => setForm(f => { const c = [...f.criteria]; c[i] = val; return { ...f, criteria: c }; });

  return (
    <div className="page">
      <div className="section-header">
        <div className="section-title">Programs & Events</div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Icon name="plus" size={14} />Add Program</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Program</th><th>Category</th><th>Type</th><th>Max Participants</th><th>Criteria</th><th>Actions</th></tr></thead>
          <tbody>
            {programs.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td><span className={`badge badge-${p.category.toLowerCase().replace("-","")}`}>{p.category}</span></td>
                <td><span className={`badge badge-${p.type.toLowerCase()}`}>{p.type}</span></td>
                <td>{p.maxParticipants}</td>
                <td><span className="text-muted text-xs">{p.criteria?.filter(Boolean).join(", ")}</span></td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(p)}><Icon name="edit" size={13} /></button>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => del(p.id)}><Icon name="trash" size={13} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal title={editProg ? "Edit Program" : "Add Program"} onClose={() => setModal(false)}
          actions={<><button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>Save Program</button></>}>
          <div className="form-group"><label className="form-label">Program Name</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Bharatanatyam" /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Category</label>
              <select className="form-input form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option>Sub-Junior</option><option>Junior</option><option>Senior</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Type</label>
              <select className="form-input form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option>Single</option><option>Group</option>
              </select>
            </div>
          </div>
          <div className="form-group"><label className="form-label">Max Participants</label><input type="number" className="form-input" value={form.maxParticipants} min={1} onChange={e => setForm(f => ({ ...f, maxParticipants: parseInt(e.target.value) || 1 }))} /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Criteria 1</label><input className="form-input" value={form.criteria[0]} onChange={e => setCriteria(0, e.target.value)} placeholder="e.g. Creativity" /></div>
            <div className="form-group"><label className="form-label">Criteria 2</label><input className="form-input" value={form.criteria[1]} onChange={e => setCriteria(1, e.target.value)} placeholder="e.g. Technique" /></div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── ADMIN: RESULTS ───────────────────────────────────────────────────────────
const AdminResults = () => {
  const { programs, groups, participants, results, setResults } = useApp();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ programId: "", first: "", second: "", third: "" });
  const POINTS = { first: 10, second: 7, third: 4 };

  const save = () => {
    if (!form.programId || !form.first) return;
    const makePlace = (chestNum, pts) => {
      if (!chestNum) return null;
      const p = participants.find(p => p.chestNumber === chestNum);
      if (!p) return null;
      return { groupId: p.groupId, chestNumber: p.chestNumber, points: pts };
    };
    const existing = results.find(r => r.programId === form.programId);
    const newResult = {
      id: existing?.id || "r" + Date.now(),
      programId: form.programId,
      first: makePlace(form.first, POINTS.first),
      second: makePlace(form.second, POINTS.second),
      third: makePlace(form.third, POINTS.third),
    };
    if (existing) setResults(prev => prev.map(r => r.id === existing.id ? newResult : r));
    else setResults(prev => [...prev, newResult]);
    setModal(false);
  };

  return (
    <div className="page">
      <div className="section-header">
        <div className="section-title">Results Entry</div>
        <button className="btn btn-primary btn-sm" onClick={() => { setForm({ programId: "", first: "", second: "", third: "" }); setModal(true); }}><Icon name="plus" size={14} />Enter Result</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Program</th><th>1st Place</th><th>2nd Place</th><th>3rd Place</th></tr></thead>
          <tbody>
            {results.map(r => {
              const prog = programs.find(p => p.id === r.programId);
              const g1 = groups.find(g => g.id === r.first?.groupId);
              const g2 = groups.find(g => g.id === r.second?.groupId);
              const g3 = groups.find(g => g.id === r.third?.groupId);
              return (
                <tr key={r.id}>
                  <td style={{ fontWeight: 600 }}>{prog?.name}</td>
                  <td><span className="chest-num">{r.first?.chestNumber}</span> <span className="text-muted text-xs">({g1?.name})</span></td>
                  <td><span className="chest-num">{r.second?.chestNumber}</span> <span className="text-muted text-xs">{g2 && `(${g2.name})`}</span></td>
                  <td><span className="chest-num">{r.third?.chestNumber}</span> <span className="text-muted text-xs">{g3 && `(${g3.name})`}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal title="Enter Result" onClose={() => setModal(false)}
          actions={<><button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>Save Result</button></>}>
          <div className="form-group"><label className="form-label">Program</label>
            <select className="form-input form-select" value={form.programId} onChange={e => setForm(f => ({ ...f, programId: e.target.value }))}>
              <option value="">Select program</option>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.category})</option>)}
            </select>
          </div>
          {["first", "second", "third"].map((place, i) => (
            <div className="form-group" key={place}>
              <label className="form-label">{["🥇 1st", "🥈 2nd", "🥉 3rd"][i]} — Chest Number <span style={{ color: ACCENT }}>+{[10,7,4][i]} pts</span></label>
              <input className="form-input" value={form[place]} onChange={e => setForm(f => ({ ...f, [place]: e.target.value }))} placeholder={`e.g. SR-101`} />
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
};

// ─── ADMIN: LEADERBOARD ───────────────────────────────────────────────────────
const AdminLeaderboard = () => {
  const { groups, results } = useApp();
  const totalPoints = (gid) => {
    let pts = 0;
    results.forEach(r => {
      if (r.first?.groupId === gid) pts += r.first.points;
      if (r.second?.groupId === gid) pts += r.second.points;
      if (r.third?.groupId === gid) pts += (r.third?.points || 0);
    });
    return pts;
  };
  const ranked = [...groups].map(g => ({ ...g, points: totalPoints(g.id) })).sort((a, b) => b.points - a.points);
  const rankSymbols = ["🥇", "🥈", "🥉"];
  const rankClasses = ["gold", "silver", "bronze"];

  return (
    <div className="page">
      <div className="section-header"><div className="section-title">Championship Leaderboard</div></div>
      <div className="card">
        {ranked.map((g, i) => (
          <div className="leader-row" key={g.id}>
            <div className={`leader-rank ${rankClasses[i] || ""}`}>{rankSymbols[i] || i + 1}</div>
            <div style={{ width: 14, height: 14, borderRadius: "50%", background: g.color }} />
            <div style={{ flex: 1, fontWeight: 600, fontSize: 15 }}>{g.name}</div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: g.color }}>{g.points}</div>
            <div className="text-muted text-xs">pts</div>
          </div>
        ))}
        {results.length === 0 && <div className="text-muted text-sm" style={{ textAlign: "center", padding: "24px 0" }}>No results entered yet. Add results to see the leaderboard.</div>}
      </div>
    </div>
  );
};

// ─── ADMIN: PRINT ─────────────────────────────────────────────────────────────
const AdminPrint = () => {
  const { participants, groups, programs, results } = useApp();
  const [sheet, setSheet] = useState("registration");
  const [selectedProg, setSelectedProg] = useState(programs[0]?.id || "");

  const printSheet = () => window.print();

  const prog = programs.find(p => p.id === selectedProg);
  const progParticipants = participants.filter(p => prog?.category === p.category);

  return (
    <div className="page">
      <div className="section-header no-print">
        <div className="section-title">Print & Export Sheets</div>
        <div className="flex gap-2">
          <button className="btn btn-secondary btn-sm" onClick={printSheet}><Icon name="printer" size={14} />Print</button>
          <button className="btn btn-primary btn-sm"><Icon name="download" size={14} />Export PDF</button>
        </div>
      </div>
      <div className="tabs no-print">
        <button className={`tab ${sheet === "registration" ? "active" : ""}`} onClick={() => setSheet("registration")}>Registration Desk Sheet</button>
        <button className={`tab ${sheet === "judges" ? "active" : ""}`} onClick={() => setSheet("judges")}>Judges' Evaluation Sheet</button>
      </div>

      {sheet === "registration" && (
        <div className="card">
          <div className="section-header">
            <div className="section-title">Registration Desk Sheet</div>
            <span className="text-muted text-xs no-print">All Participants</span>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Chest #</th><th>Name</th><th>Group</th><th>Category</th><th>Attendance ✓</th></tr></thead>
              <tbody>
                {participants.map(p => {
                  const g = groups.find(g => g.id === p.groupId);
                  return (
                    <tr key={p.id}>
                      <td><span className="chest-num">{p.chestNumber}</span></td>
                      <td style={{ fontWeight: 500 }}>{p.name}</td>
                      <td>{g?.name}</td>
                      <td><span className={`badge badge-${p.category.toLowerCase().replace("-","")}`}>{p.category}</span></td>
                      <td><div style={{ width: 20, height: 20, border: "1.5px solid #6c63ff", borderRadius: 4 }} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {sheet === "judges" && (
        <div className="card">
          <div className="section-header">
            <div className="section-title">Judges' Evaluation Sheet</div>
          </div>
          <div className="form-group no-print">
            <label className="form-label">Select Program</label>
            <select className="form-input form-select" style={{ maxWidth: 280 }} value={selectedProg} onChange={e => setSelectedProg(e.target.value)}>
              {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.category})</option>)}
            </select>
          </div>
          {prog && (
            <>
              <div className="mb-2 text-sm"><strong>{prog.name}</strong> · {prog.category} · {prog.type}</div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Chest #</th>
                      <th>{prog.criteria?.[0] || "Criteria 1"} (10)</th>
                      <th>{prog.criteria?.[1] || "Criteria 2"} (10)</th>
                      <th>Total (20)</th>
                      <th>Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progParticipants.map((p, i) => (
                      <tr key={p.id}>
                        <td style={{ fontWeight: 700, color: ACCENT }}>{String.fromCharCode(65 + i)}</td>
                        <td><span className="chest-num">{p.chestNumber}</span></td>
                        <td><div style={{ width: 50, height: 22, border: "1px solid #d1d5db", borderRadius: 4 }} /></td>
                        <td><div style={{ width: 50, height: 22, border: "1px solid #d1d5db", borderRadius: 4 }} /></td>
                        <td><div style={{ width: 50, height: 22, border: "1px solid #d1d5db", borderRadius: 4 }} /></td>
                        <td><div style={{ width: 120, height: 22, border: "1px solid #d1d5db", borderRadius: 4 }} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ─── LEADER: ROSTER ───────────────────────────────────────────────────────────
const LeaderRoster = ({ user }) => {
  const { participants, setParticipants, groups } = useApp();
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Senior" });

  const myGroup = groups.find(g => g.id === user.groupId);
  const myParticipants = participants.filter(p => p.groupId === user.groupId);

  const chestPrefix = { "Sub-Junior": "SJ", "Junior": "JR", "Senior": "SR" };
  const chestCount = (cat) => participants.filter(p => p.groupId === user.groupId && p.category === cat).length + 1;

  const getGroupNum = () => {
    const grpIdx = groups.findIndex(g => g.id === user.groupId);
    return (grpIdx + 1) * 100;
  };

  const save = () => {
    if (!form.name.trim()) return;
    const base = getGroupNum();
    const cnt = chestCount(form.category);
    const chestNumber = `${chestPrefix[form.category]}-${base + cnt}`;
    setParticipants(prev => [...prev, { id: "pt" + Date.now(), name: form.name, groupId: user.groupId, category: form.category, chestNumber, locked: false }]);
    setModal(false);
    setForm({ name: "", category: "Senior" });
  };

  return (
    <div className="page">
      <div className="section-header">
        <div className="flex items-center gap-2">
          <div style={{ width: 14, height: 14, borderRadius: "50%", background: myGroup?.color }} />
          <div className="section-title">{myGroup?.name} — Roster</div>
        </div>
        <button className="btn btn-primary btn-sm" onClick={() => setModal(true)}><Icon name="plus" size={14} />Add Participant</button>
      </div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Chest #</th><th>Name</th><th>Category</th><th>Status</th></tr></thead>
          <tbody>
            {myParticipants.map(p => (
              <tr key={p.id}>
                <td><span className="chest-num">{p.chestNumber}</span></td>
                <td style={{ fontWeight: 500 }}>{p.name}</td>
                <td><span className={`badge badge-${p.category.toLowerCase().replace("-","")}`}>{p.category}</span></td>
                <td>
                  <div className="flex items-center gap-1">
                    <Icon name="lock" size={12} color="#6b7280" />
                    <span className="text-xs text-muted">Locked</span>
                  </div>
                </td>
              </tr>
            ))}
            {myParticipants.length === 0 && <tr><td colSpan={4} style={{ textAlign: "center", padding: "24px 0" }} className="text-muted">No participants yet. Add your first one!</td></tr>}
          </tbody>
        </table>
      </div>
      {modal && (
        <Modal title="Add Participant" onClose={() => setModal(false)}
          actions={<><button className="btn btn-ghost" onClick={() => setModal(false)}>Cancel</button><button className="btn btn-primary" onClick={save}>Add & Lock</button></>}>
          <div style={{ background: "rgba(108,99,255,0.07)", border: "1px solid rgba(108,99,255,0.15)", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#6c63ff" }}>
            <Icon name="lock" size={13} /> Once saved, participant details are locked. Contact admin to make changes.
          </div>
          <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Student name" /></div>
          <div className="form-group"><label className="form-label">Category</label>
            <select className="form-input form-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option>Sub-Junior</option><option>Junior</option><option>Senior</option>
            </select>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── LEADER: BOOKING ──────────────────────────────────────────────────────────
const LeaderBooking = ({ user }) => {
  const { programs, participants, registrations, setRegistrations } = useApp();
  const [step, setStep] = useState(1);
  const [cat, setCat] = useState("Senior");
  const [progId, setProgId] = useState("");
  const [selected, setSelected] = useState([]);
  const [done, setDone] = useState(false);

  const myParticipants = participants.filter(p => p.groupId === user.groupId && p.category === cat);
  const filteredProgs = programs.filter(p => p.category === cat);
  const prog = programs.find(p => p.id === progId);
  const alreadyBooked = registrations.find(r => r.programId === progId && r.groupId === user.groupId);

  const confirm = () => {
    if (!progId || selected.length === 0 || alreadyBooked) return;
    setRegistrations(prev => [...prev, { id: "reg" + Date.now(), programId: progId, groupId: user.groupId, participantIds: selected }]);
    setDone(true);
  };
  const reset = () => { setStep(1); setCat("Senior"); setProgId(""); setSelected([]); setDone(false); };

  if (done) return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400 }}>
      <div className="card" style={{ textAlign: "center", maxWidth: 380, animation: "scaleIn 0.3s ease" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Booking Confirmed!</div>
        <div className="text-muted text-sm mb-2">Your participants are registered for <strong>{prog?.name}</strong>.</div>
        <button className="btn btn-primary mt-2" style={{ justifyContent: "center", width: "100%" }} onClick={reset}>Book Another Event</button>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="section-header"><div className="section-title">Book Event Slot</div></div>
      <div className="flex gap-2 mb-2" style={{ marginBottom: 20 }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? ACCENT : (document.documentElement.style.getPropertyValue("--bg") || "#e5e7eb"), transition: "background 0.3s" }} />
        ))}
      </div>

      {step === 1 && (
        <div className="card" style={{ animation: "fadeSlideIn 0.3s ease" }}>
          <div className="section-title mb-2">Step 1: Choose Category</div>
          <div className="grid-3 mt-2">
            {["Sub-Junior", "Junior", "Senior"].map(c => (
              <div key={c} onClick={() => setCat(c)}
                style={{ padding: "20px 16px", borderRadius: 14, border: `2px solid ${cat === c ? ACCENT : "transparent"}`, background: cat === c ? "rgba(108,99,255,0.08)" : "rgba(108,99,255,0.03)", cursor: "pointer", textAlign: "center", transition: "all 0.18s", fontWeight: 700, color: cat === c ? ACCENT : "inherit" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>{c === "Sub-Junior" ? "🌱" : c === "Junior" ? "🌿" : "🌳"}</div>
                {c}
              </div>
            ))}
          </div>
          <div className="flex" style={{ justifyContent: "flex-end", marginTop: 20 }}>
            <button className="btn btn-primary" onClick={() => setStep(2)}>Next <Icon name="chevronRight" size={14} /></button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="card" style={{ animation: "fadeSlideIn 0.3s ease" }}>
          <div className="section-title mb-2">Step 2: Select Program</div>
          {filteredProgs.map(p => {
            const booked = registrations.find(r => r.programId === p.id && r.groupId === user.groupId);
            return (
              <div key={p.id} onClick={() => !booked && setProgId(p.id)}
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderRadius: 12, border: `1.5px solid ${progId === p.id ? ACCENT : "transparent"}`, background: progId === p.id ? "rgba(108,99,255,0.08)" : booked ? "rgba(0,0,0,0.03)" : "rgba(108,99,255,0.03)", cursor: booked ? "not-allowed" : "pointer", marginBottom: 8, opacity: booked ? 0.6 : 1, transition: "all 0.18s" }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{p.name}</div>
                  <div className="text-muted text-xs">Max {p.maxParticipants} · {p.type}</div>
                </div>
                {booked ? <span className="badge" style={{ background: "rgba(52,211,153,0.15)", color: "#34d399" }}><Icon name="check" size={12} /> Booked</span> : <span className={`badge badge-${p.category.toLowerCase().replace("-","")}`}>{p.category}</span>}
              </div>
            );
          })}
          <div className="flex gap-2" style={{ justifyContent: "flex-end", marginTop: 20 }}>
            <button className="btn btn-ghost" onClick={() => setStep(1)}>Back</button>
            <button className="btn btn-primary" onClick={() => setStep(3)} disabled={!progId}>Next <Icon name="chevronRight" size={14} /></button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="card" style={{ animation: "fadeSlideIn 0.3s ease" }}>
          <div className="section-title mb-2">Step 3: Assign Participants</div>
          <div className="text-muted text-sm mb-2">Program: <strong>{prog?.name}</strong> · Max {prog?.maxParticipants}</div>
          {myParticipants.map(p => (
            <div key={p.id} onClick={() => {
              if (selected.includes(p.id)) setSelected(s => s.filter(x => x !== p.id));
              else if (selected.length < (prog?.maxParticipants || 1)) setSelected(s => [...s, p.id]);
            }}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, border: `1.5px solid ${selected.includes(p.id) ? ACCENT : "transparent"}`, background: selected.includes(p.id) ? "rgba(108,99,255,0.08)" : "rgba(108,99,255,0.03)", cursor: "pointer", marginBottom: 8, transition: "all 0.18s" }}>
              <div style={{ width: 22, height: 22, border: `2px solid ${selected.includes(p.id) ? ACCENT : "#6b7280"}`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: selected.includes(p.id) ? ACCENT : "transparent", flexShrink: 0, transition: "all 0.15s" }}>
                {selected.includes(p.id) && <Icon name="check" size={12} color="white" />}
              </div>
              <span className="chest-num">{p.chestNumber}</span>
              <span style={{ fontWeight: 500 }}>{p.name}</span>
            </div>
          ))}
          {myParticipants.length === 0 && <div className="text-muted text-sm" style={{ textAlign: "center", padding: "20px 0" }}>No {cat} participants in your group yet.</div>}
          <div className="flex gap-2" style={{ justifyContent: "flex-end", marginTop: 20 }}>
            <button className="btn btn-ghost" onClick={() => setStep(2)}>Back</button>
            <button className="btn btn-primary" onClick={confirm} disabled={selected.length === 0}><Icon name="check" size={14} />Confirm Booking</button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── LEADER: MY BOOKINGS ──────────────────────────────────────────────────────
const LeaderMyBookings = ({ user }) => {
  const { registrations, programs, participants } = useApp();
  const myRegs = registrations.filter(r => r.groupId === user.groupId);
  return (
    <div className="page">
      <div className="section-header"><div className="section-title">My Bookings</div></div>
      {myRegs.length === 0 && <div className="card text-muted text-sm" style={{ textAlign: "center", padding: "32px 0" }}>No bookings yet. Use "Book Event" to register!</div>}
      <div className="grid-2">
        {myRegs.map(r => {
          const prog = programs.find(p => p.id === r.programId);
          const pts = r.participantIds.map(id => participants.find(p => p.id === id)).filter(Boolean);
          return (
            <div className="card" key={r.id} style={{ borderLeft: `3px solid ${ACCENT}` }}>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{prog?.name}</div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`badge badge-${prog?.category.toLowerCase().replace("-","")}`}>{prog?.category}</span>
                <span className={`badge badge-${prog?.type.toLowerCase()}`}>{prog?.type}</span>
              </div>
              <div className="text-muted text-xs mt-1">{pts.length} participant{pts.length !== 1 ? "s" : ""}: {pts.map(p => p?.name).join(", ")}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const Sidebar = ({ user, page, setPage, onLogout, sidebarOpen }) => {
  const adminNav = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "groups", label: "Groups", icon: "users" },
    { id: "programs", label: "Programs", icon: "book" },
    { id: "results", label: "Results Entry", icon: "star" },
    { id: "leaderboard", label: "Leaderboard", icon: "trophy" },
    { id: "print", label: "Print & Export", icon: "printer" },
  ];
  const leaderNav = [
    { id: "roster", label: "My Roster", icon: "users" },
    { id: "booking", label: "Book Event", icon: "calendar" },
    { id: "mybookings", label: "My Bookings", icon: "book" },
  ];
  const nav = user.role === "admin" ? adminNav : leaderNav;

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <div className="sidebar-logo">
        <h1>FestFlow</h1>
        <p>Arts & Cultural Management</p>
      </div>
      <div className="sidebar-nav">
        <div className="nav-section">
          <div className="nav-label">{user.role === "admin" ? "Admin Controls" : "Leader Panel"}</div>
          {nav.map(n => (
            <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
              <span className="nav-item-icon"><Icon name={n.icon} size={16} /></span>
              {n.label}
            </div>
          ))}
        </div>
      </div>
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-avatar">{user.name[0]}</div>
          <div>
            <div className="user-name">{user.name}</div>
            <div className="user-role">{user.role === "admin" ? "Administrator" : "Group Leader"}</div>
          </div>
        </div>
        <button className="btn btn-ghost w-full" style={{ justifyContent: "center", fontSize: 13 }} onClick={onLogout}>
          <Icon name="logout" size={14} />Sign Out
        </button>
      </div>
    </div>
  );
};

// ─── PAGE TITLES ──────────────────────────────────────────────────────────────
const pageTitles = {
  dashboard: "Dashboard", groups: "Groups", programs: "Programs & Events",
  results: "Results Entry", leaderboard: "Leaderboard", print: "Print & Export",
  roster: "My Roster", booking: "Book Event Slot", mybookings: "My Bookings",
};

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [groups, setGroups] = useState(INITIAL_GROUPS);
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);
  const [participants, setParticipants] = useState(INITIAL_PARTICIPANTS);
  const [registrations, setRegistrations] = useState(INITIAL_REGISTRATIONS);
  const [results, setResults] = useState(INITIAL_RESULTS);

  const handleLogin = (u) => {
    setUser(u);
    setPage(u.role === "admin" ? "dashboard" : "roster");
  };

  const renderPage = () => {
    if (user.role === "admin") {
      if (page === "dashboard") return <AdminDashboard />;
      if (page === "groups") return <AdminGroups />;
      if (page === "programs") return <AdminPrograms />;
      if (page === "results") return <AdminResults />;
      if (page === "leaderboard") return <AdminLeaderboard />;
      if (page === "print") return <AdminPrint />;
    } else {
      if (page === "roster") return <LeaderRoster user={user} />;
      if (page === "booking") return <LeaderBooking user={user} />;
      if (page === "mybookings") return <LeaderMyBookings user={user} />;
    }
  };

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <AppContext.Provider value={{ groups, setGroups, programs, setPrograms, participants, setParticipants, registrations, setRegistrations, results, setResults }}>
        <style>{injectStyles(dark)}</style>
        {!user ? (
          <LoginPage onLogin={handleLogin} />
        ) : (
          <div className="app-shell">
            <Sidebar user={user} page={page} setPage={p => { setPage(p); setSidebarOpen(false); }} onLogout={() => setUser(null)} sidebarOpen={sidebarOpen} />
            <div className="main-content">
              <div className="topbar">
                <div className="flex items-center gap-2">
                  <button className="btn btn-ghost btn-icon" style={{ display: "none" }} onClick={() => setSidebarOpen(v => !v)}>
                    <Icon name="menu" size={18} />
                  </button>
                  <div className="topbar-title">{pageTitles[page]}</div>
                </div>
                <div className="topbar-actions">
                  <div className="flex items-center gap-2">
                    <div className="live-dot" />
                    <span className="text-xs text-muted">Live</span>
                  </div>
                  <button className="toggle-theme" onClick={() => setDark(d => !d)}>
                    <Icon name={dark ? "sun" : "moon"} size={16} />
                  </button>
                </div>
              </div>
              {renderPage()}
            </div>
          </div>
        )}
      </AppContext.Provider>
    </ThemeContext.Provider>
  );
}
