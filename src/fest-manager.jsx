import { useState, useEffect, useRef, createContext, useContext } from "react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const ACCENT = "#6c63ff";
const ADMIN_PIN = "admin";
const LEADER_PIN = "12345";

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
const AppContext = createContext();
const useApp = () => useContext(AppContext);

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INITIAL_GROUPS = [
  { id: "g1", name: "Group 1", color: "#6c63ff" },
  { id: "g2", name: "Group 2", color: "#22d3ee" },
  { id: "g3", name: "Group 3", color: "#f472b6" },
];

const INITIAL_PROGRAMS = [
  { id: "p1", name: "Western Music", category: "Senior", type: "Group", maxParticipants: 6, criteria: ["Rhythm", "Harmony"] },
  { id: "p2", name: "Classical Dance", category: "Junior", type: "Single", maxParticipants: 1, criteria: ["Grace", "Expression"] },
  { id: "p3", name: "Painting", category: "Sub-Junior", type: "Single", maxParticipants: 1, criteria: ["Creativity", "Technique"] },
  { id: "p4", name: "Drama", category: "Senior", type: "Group", maxParticipants: 8, criteria: ["Acting", "Direction"] },
];

const INITIAL_STUDENTS = {
  g1: [
    { id: "s1", name: "Arjun Nair", category: "Senior", chestNo: "301" },
    { id: "s2", name: "Priya Menon", category: "Junior", chestNo: "201" },
  ],
  g2: [
    { id: "s3", name: "Rohan Das", category: "Senior", chestNo: "302" },
    { id: "s4", name: "Sneha Pillai", category: "Sub-Junior", chestNo: "101" },
  ],
  g3: [
    { id: "s5", name: "Kavya Iyer", category: "Junior", chestNo: "202" },
  ],
};

const INITIAL_REGISTRATIONS = [];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const icons = {
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
  eyeOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>`,
  users: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
  logout: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
  moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  printer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>`,
};

const Ic = ({ name, size = 16 }) => (
  <span style={{ width: size, height: size, display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
    dangerouslySetInnerHTML={{ __html: icons[name]?.replace("viewBox", `width="${size}" height="${size}" viewBox`) || "" }} />
);

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = ({ dark }) => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800;900&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; background: ${dark ? "#080917" : "#f0f0fa"}; color: ${dark ? "#e4e4f0" : "#1a1a2e"}; min-height: 100vh; overflow-x: hidden; transition: background 0.4s, color 0.4s; }
    ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(108,99,255,0.25); border-radius: 3px; }
    @keyframes splashFadeIn { from { opacity:0; transform:scale(0.8) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
    @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes slideDown { from { opacity:0; transform:translateY(-12px); } to { opacity:1; transform:translateY(0); } }
    @keyframes scaleIn { from { opacity:0; transform:scale(0.93); } to { opacity:1; transform:scale(1); } }
    @keyframes modalIn { from { opacity:0; transform:scale(0.88) translateY(20px); } to { opacity:1; transform:scale(1) translateY(0); } }
    @keyframes floatY { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
    @keyframes glowPulse { 0%,100%{box-shadow:0 0 20px rgba(108,99,255,0.3);} 50%{box-shadow:0 0 40px rgba(108,99,255,0.6);} }
    @keyframes orbitSpin { from{transform:rotate(0deg) translateX(60px) rotate(0deg);} to{transform:rotate(360deg) translateX(60px) rotate(-360deg);} }
    @keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(0.7);} }
    @keyframes progressFill { from{width:0;} to{width:100%;} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
    .anim-fadeUp { animation: fadeUp 0.5s cubic-bezier(0.22,1,0.36,1) both; }
    .anim-fadeIn { animation: fadeIn 0.4s ease both; }
    .anim-scaleIn { animation: scaleIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both; }
    .anim-slideDown { animation: slideDown 0.35s cubic-bezier(0.22,1,0.36,1) both; }
    .stagger-1{animation-delay:.05s} .stagger-2{animation-delay:.1s} .stagger-3{animation-delay:.15s}
    .stagger-4{animation-delay:.2s} .stagger-5{animation-delay:.25s} .stagger-6{animation-delay:.3s}
    .card { background: ${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.88)"}; border: 1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}; border-radius: 20px; backdrop-filter: blur(12px); transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s ease, border-color 0.25s ease; }
    .card:hover { transform:translateY(-3px); box-shadow:0 16px 40px rgba(108,99,255,0.12); border-color:rgba(108,99,255,0.2); }
    .btn { display:inline-flex; align-items:center; justify-content:center; gap:7px; padding:9px 16px; border-radius:11px; font-size:13.5px; font-weight:600; cursor:pointer; border:none; font-family:'Inter',sans-serif; transition:all 0.2s cubic-bezier(0.22,1,0.36,1); position:relative; overflow:hidden; white-space:nowrap; flex-shrink:0; }
    .btn::after { content:''; position:absolute; inset:0; background:rgba(255,255,255,0.08); opacity:0; transition:opacity 0.2s; }
    .btn:hover::after { opacity:1; } .btn:active { transform:scale(0.97); }
    .btn-primary { background:linear-gradient(135deg,#6c63ff,#8b5cf6); color:white; box-shadow:0 4px 20px rgba(108,99,255,0.4); }
    .btn-primary:hover { transform:translateY(-2px); box-shadow:0 8px 28px rgba(108,99,255,0.5); }
    .btn-ghost { background:${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}; color:${dark ? "#9ca3af" : "#6b7280"}; }
    .btn-ghost:hover { background:${dark ? "rgba(108,99,255,0.12)" : "rgba(108,99,255,0.08)"}; color:#6c63ff; }
    .btn-danger { background:rgba(239,68,68,0.1); color:#ef4444; border:1px solid rgba(239,68,68,0.2); }
    .btn-danger:hover { background:rgba(239,68,68,0.18); transform:translateY(-1px); }
    .btn-sm { padding:6px 11px; font-size:12px; border-radius:9px; }
    .btn-icon { padding:7px; border-radius:9px; width:32px; height:32px; }
    .input { width:100%; padding:11px 14px; border-radius:12px; font-size:14px; background:${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"}; border:1.5px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}; color:${dark ? "#e4e4f0" : "#1a1a2e"}; font-family:'Inter',sans-serif; outline:none; transition:border-color 0.2s, box-shadow 0.2s; }
    .input:focus { border-color:#6c63ff; box-shadow:0 0 0 3px rgba(108,99,255,0.15); }
    .input::placeholder { color:${dark ? "#4b5563" : "#9ca3af"}; }
    .label { display:block; font-size:12px; font-weight:600; letter-spacing:0.5px; text-transform:uppercase; color:${dark ? "#6b7280" : "#9ca3af"}; margin-bottom:7px; }
    .select { appearance:none; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 12px center; padding-right:36px; cursor:pointer; }
    .tbl-wrap { overflow-x:auto; border-radius:14px; border:1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}; }
    .tbl { width:100%; border-collapse:collapse; font-size:13px; min-width:340px; }
    .tbl thead th { padding:10px 14px; text-align:left; font-size:10.5px; font-weight:700; letter-spacing:0.8px; text-transform:uppercase; color:${dark ? "#4b5563" : "#9ca3af"}; background:${dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)"}; white-space:nowrap; }
    .tbl tbody td { padding:11px 14px; border-top:1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}; }
    .tbl tbody tr { transition:background 0.15s; } .tbl tbody tr:hover { background:${dark ? "rgba(108,99,255,0.06)" : "rgba(108,99,255,0.04)"}; }
    .badge { display:inline-flex; align-items:center; gap:4px; padding:2px 9px; border-radius:20px; font-size:11px; font-weight:700; white-space:nowrap; }
    .badge-senior { background:rgba(108,99,255,0.15); color:#6c63ff; } .badge-junior { background:rgba(34,211,238,0.15); color:#22d3ee; }
    .badge-sj { background:rgba(244,114,182,0.15); color:#f472b6; } .badge-single { background:rgba(52,211,153,0.15); color:#34d399; } .badge-group { background:rgba(251,191,36,0.15); color:#fbbf24; }
    .modal-bg { position:fixed; inset:0; background:rgba(0,0,0,0.65); backdrop-filter:blur(6px); z-index:200; display:flex; align-items:center; justify-content:center; padding:14px; animation:fadeIn 0.2s ease; }
    .modal { background:${dark ? "#0f1024" : "#ffffff"}; border:1px solid ${dark ? "rgba(108,99,255,0.25)" : "rgba(108,99,255,0.18)"}; border-radius:22px; padding:22px; width:100%; max-width:480px; animation:modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1); box-shadow:0 24px 80px rgba(0,0,0,0.4); max-height:90vh; overflow-y:auto; }
    .modal-lg { max-width:540px; }
    .pin-dot { width:14px; height:14px; border-radius:50%; border:2px solid ${dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"}; transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1); }
    .pin-dot.filled { background:#6c63ff; border-color:#6c63ff; box-shadow:0 0 10px rgba(108,99,255,0.5); transform:scale(1.1); }
    .pin-dot.error { background:#ef4444; border-color:#ef4444; animation:shake 0.4s ease; }
    .numpad { display:grid; grid-template-columns:repeat(3,1fr); gap:9px; }
    .numpad-key { aspect-ratio:1; border-radius:13px; font-size:19px; font-weight:700; border:1.5px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}; background:${dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.9)"}; color:${dark ? "#e4e4f0" : "#1a1a2e"}; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.15s cubic-bezier(0.34,1.56,0.64,1); font-family:'Plus Jakarta Sans',sans-serif; box-shadow:0 2px 8px rgba(0,0,0,0.08); }
    .numpad-key:hover { background:rgba(108,99,255,0.12); border-color:rgba(108,99,255,0.4); color:#6c63ff; transform:scale(1.05); }
    .numpad-key:active { transform:scale(0.95); } .numpad-key.zero { grid-column:2; }
    .topbar { height:56px; display:flex; align-items:center; justify-content:space-between; padding:0 14px; position:sticky; top:0; z-index:100; background:${dark ? "rgba(8,9,23,0.9)" : "rgba(240,240,250,0.9)"}; backdrop-filter:blur(20px) saturate(180%); border-bottom:1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.06)"}; gap:8px; }
    .topbar-left { display:flex; align-items:center; gap:8px; min-width:0; flex:1; overflow:hidden; }
    .topbar-right { display:flex; align-items:center; gap:5px; flex-shrink:0; }
    .topbar-title { font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:800; line-height:1.1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .topbar-sub { font-size:10.5px; color:${dark ? "#6b7280" : "#9ca3af"}; white-space:nowrap; }
    .admin-nav { display:flex; gap:5px; }
    .live { display:inline-flex; align-items:center; gap:5px; }
    .live-dot { width:7px; height:7px; border-radius:50%; background:#22d3ee; position:relative; flex-shrink:0; }
    .live-dot::after { content:''; position:absolute; inset:-3px; border-radius:50%; border:2px solid #22d3ee; animation:dotPulse 1.5s infinite; }
    .grad-text { background:linear-gradient(135deg,#6c63ff 0%,#a78bfa 50%,#22d3ee 100%); -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
    .divider { height:1px; background:${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}; margin:12px 0; }
    .chip { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:20px; font-size:11.5px; font-weight:600; white-space:nowrap; }
    .text-muted { color:${dark ? "#6b7280" : "#9ca3af"}; } .fw-800 { font-weight:800; } .ff-display { font-family:'Plus Jakarta Sans',sans-serif; }
    .page { padding:16px; max-width:860px; margin:0 auto; }
    .grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .grid-3 { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
    .form-row { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
    .group-tabs { display:flex; gap:7px; overflow-x:auto; padding-bottom:2px; -ms-overflow-style:none; scrollbar-width:none; }
    .group-tabs::-webkit-scrollbar { display:none; }
    .overview-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:10px; }
    @media(min-width:600px) { .page { padding:22px; } .topbar { padding:0 22px; } }
    @media(max-width:520px) {
      .grid-2 { grid-template-columns:1fr; }
      .grid-3 { grid-template-columns:1fr 1fr; }
      .form-row { grid-template-columns:1fr; }
      .admin-nav .btn-sm { padding:5px 9px; font-size:11px; }
      .modal { padding:18px; border-radius:18px; }
    }
  `}</style>
);
// ─── NUMERIC PIN MODAL (for leaders) ─────────────────────────────────────────
const NumPinModal = ({ title, subtitle, onSuccess, onClose, correctPin, dark }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const addDigit = (d) => {
    if (pin.length >= 6) return;
    const next = pin + d;
    setPin(next);
    if (next.length === correctPin.length) {
      setTimeout(() => {
        if (next === correctPin) onSuccess();
        else {
          setShaking(true); setError(true);
          setTimeout(() => { setPin(""); setError(false); setShaking(false); }, 700);
        }
      }, 120);
    }
  };
  const del = () => setPin(p => p.slice(0, -1));
  const keys = [1,2,3,4,5,6,7,8,9,"del",0,"ok"];

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 340, textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#6c63ff,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Ic name="lock" size={22} />
        </div>
        <div className="ff-display fw-800" style={{ fontSize: 18, marginBottom: 5 }}>{title}</div>
        <div className="text-muted" style={{ fontSize: 13, marginBottom: 4 }}>{subtitle}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "22px 0", animation: shaking ? "shake 0.4s ease" : "none" }}>
          {Array.from({ length: correctPin.length }).map((_, i) => (
            <div key={i} className={`pin-dot ${i < pin.length ? (error ? "error" : "filled") : ""}`} />
          ))}
        </div>
        <div className="numpad" style={{ maxWidth: 260, margin: "0 auto" }}>
          {keys.map((k, i) => {
            if (k === "del") return <button key={i} className="numpad-key" onClick={del}><Ic name="x" size={18} /></button>;
            if (k === "ok") return <button key={i} className="numpad-key" style={{ background: "linear-gradient(135deg,#6c63ff,#8b5cf6)", color: "white", border: "none" }}><Ic name="check" size={18} /></button>;
            return <button key={i} className={`numpad-key ${k === 0 ? "zero" : ""}`} onClick={() => addDigit(String(k))}>{k}</button>;
          })}
        </div>
        <button className="btn btn-ghost" style={{ marginTop: 16, width: "100%" }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

// ─── TEXT PASSWORD MODAL (for admin) ─────────────────────────────────────────
const TextPinModal = ({ title, subtitle, onSuccess, onClose, correctPin, dark }) => {
  const [val, setVal] = useState("");
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 100); }, []);

  const attempt = () => {
    if (val === correctPin) { onSuccess(); }
    else {
      setError(true);
      setTimeout(() => { setError(false); setVal(""); inputRef.current?.focus(); }, 700);
    }
  };

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 360, textAlign: "center" }}>
        <div style={{ width: 52, height: 52, borderRadius: 16, background: "linear-gradient(135deg,#6c63ff,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
          <Ic name="shield" size={22} />
        </div>
        <div className="ff-display fw-800" style={{ fontSize: 18, marginBottom: 5 }}>{title}</div>
        <div className="text-muted" style={{ fontSize: 13, marginBottom: 22 }}>{subtitle}</div>
        <div style={{ position: "relative", marginBottom: 16, textAlign: "left" }}>
          <input
            ref={inputRef}
            type={show ? "text" : "password"}
            className="input"
            value={val}
            onChange={e => { setVal(e.target.value); setError(false); }}
            onKeyDown={e => e.key === "Enter" && attempt()}
            placeholder="Enter password"
            style={{
              textAlign: "center", fontSize: 16, letterSpacing: show ? 1 : 4,
              borderColor: error ? "#ef4444" : undefined,
              boxShadow: error ? "0 0 0 3px rgba(239,68,68,0.18)" : undefined,
              animation: error ? "shake 0.4s ease" : "none",
              paddingRight: 44,
            }}
          />
          <button onClick={() => setShow(s => !s)} style={{
            position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer",
            color: dark ? "#6b7280" : "#9ca3af", display: "flex", alignItems: "center",
          }}>
            <Ic name={show ? "eyeOff" : "eye"} size={16} />
          </button>
        </div>
        {error && <div style={{ color: "#ef4444", fontSize: 12, marginBottom: 12, animation: "fadeIn 0.2s ease" }}>Incorrect password. Try again.</div>}
        <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 10 }} onClick={attempt}>
          <Ic name="check" size={14} /> Unlock Admin Panel
        </button>
        <button className="btn btn-ghost" style={{ width: "100%" }} onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

// ─── SETTINGS PANEL ──────────────────────────────────────────────────────────
const SettingsPanel = ({ dark, setDark, onClose, context }) => {
  const sections = [
    {
      label: "Appearance",
      rows: [
        {
          icon: dark ? "sun" : "moon",
          label: "Theme",
          desc: dark ? "Dark mode is on" : "Light mode is on",
          action: (
            <button onClick={() => setDark(d => !d)} style={{
              width: 48, height: 26, borderRadius: 13, position: "relative", cursor: "pointer", border: "none",
              background: dark ? "linear-gradient(135deg,#6c63ff,#8b5cf6)" : "rgba(0,0,0,0.15)",
              transition: "background 0.3s", flexShrink: 0,
            }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%", background: "white",
                position: "absolute", top: 3, transition: "left 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                left: dark ? 25 : 3, boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }} />
            </button>
          ),
        },
      ],
    },
    {
      label: "About",
      rows: [
        { icon: "info", label: "FF Fest Manager", desc: "Version 1.0 · Arts & Cultural" },
        { icon: "palette", label: "Built with", desc: "React + Vite · Deployed on Vercel" },
      ],
    },
  ];

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ maxWidth: 380 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <div className="ff-display fw-800" style={{ fontSize: 17 }}>Settings</div>
            {context && <div className="text-muted" style={{ fontSize: 12, marginTop: 2 }}>{context}</div>}
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><Ic name="x" size={15} /></button>
        </div>
        {sections.map(s => (
          <div key={s.label} style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", color: dark ? "#4b5563" : "#9ca3af", marginBottom: 8 }}>{s.label}</div>
            <div style={{ borderRadius: 14, overflow: "hidden", border: `1px solid ${dark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)"}` }}>
              {s.rows.map((row, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "13px 16px",
                  borderTop: i > 0 ? `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}` : "none",
                  background: dark ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.85)",
                }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(108,99,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: ACCENT, flexShrink: 0 }}>
                    <Ic name={row.icon} size={16} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{row.label}</div>
                    <div className="text-muted" style={{ fontSize: 12 }}>{row.desc}</div>
                  </div>
                  {row.action}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── SHARED TOPBAR ────────────────────────────────────────────────────────────
const Topbar = ({ left, right, dark, setDark, context }) => {
  const [settings, setSettings] = useState(false);
  return (
    <>
      <div className="topbar">
        <div className="topbar-left">{left}</div>
        <div className="topbar-right">
          {right}
          <button className="btn btn-ghost btn-icon" onClick={() => setSettings(true)} style={{ color: dark ? "#9ca3af" : "#6b7280" }}>
            <Ic name="settings" size={16} />
          </button>
        </div>
      </div>
      {settings && <SettingsPanel dark={dark} setDark={setDark} onClose={() => setSettings(false)} context={context} />}
    </>
  );
};
// ─── SPLASH SCREEN ────────────────────────────────────────────────────────────
const SplashScreen = ({ onDone }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1200);
    const t3 = setTimeout(() => onDone(), 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #0a0b1e 0%, #0d0e2a 50%, #0a1628 100%)",
      zIndex: 999,
      transition: "opacity 0.6s ease",
      opacity: phase === 2 ? 0 : 1,
    }}>
      {/* BG orbs */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(108,99,255,0.15) 0%, transparent 70%)", top: "10%", left: "10%", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(34,211,238,0.1) 0%, transparent 70%)", bottom: "15%", right: "10%", filter: "blur(40px)" }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(244,114,182,0.08) 0%, transparent 70%)", top: "50%", right: "20%", filter: "blur(30px)" }} />
      </div>

      <div style={{
        textAlign: "center",
        animation: phase >= 1 ? "splashFadeIn 0.8s cubic-bezier(0.22,1,0.36,1) both" : "none",
        opacity: phase >= 1 ? 1 : 0,
      }}>
        {/* Logo mark */}
        <div style={{ position: "relative", width: 100, height: 100, margin: "0 auto 24px" }}>
          <div style={{
            width: 100, height: 100, borderRadius: 28,
            background: "linear-gradient(135deg, #6c63ff, #8b5cf6, #22d3ee)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "glowPulse 2s infinite",
            boxShadow: "0 0 40px rgba(108,99,255,0.5)",
          }}>
            <span style={{ fontSize: 44, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900, color: "white", letterSpacing: -2 }}>FF</span>
          </div>
          {/* Orbit dot */}
          <div style={{ position: "absolute", inset: -10, animation: "orbitSpin 3s linear infinite" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#22d3ee", boxShadow: "0 0 10px #22d3ee" }} />
          </div>
        </div>

        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: 42,
          background: "linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #22d3ee 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: -1, lineHeight: 1,
        }}>FF</div>

        <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, letterSpacing: 4, textTransform: "uppercase", marginTop: 8, fontWeight: 500 }}>
          Arts & Cultural Fest
        </div>

        {/* Loading bar */}
        <div style={{ width: 120, height: 2, background: "rgba(255,255,255,0.1)", borderRadius: 2, margin: "28px auto 0", overflow: "hidden" }}>
          <div style={{ height: "100%", background: "linear-gradient(90deg, #6c63ff, #22d3ee)", borderRadius: 2, animation: "progressFill 1.8s ease both", animationDelay: "0.4s" }} />
        </div>
      </div>
    </div>
  );
};

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
const LandingPage = ({ groups, dark, onLeaderLogin, onAdminClick }) => {
  const [hovering, setHovering] = useState(null);
  const [pinGroup, setPinGroup] = useState(null);
  const [adminPin, setAdminPin] = useState(false);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "40px 20px",
      background: dark
        ? "radial-gradient(ellipse at 30% 20%, rgba(108,99,255,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(34,211,238,0.07) 0%, transparent 60%), #080917"
        : "radial-gradient(ellipse at 30% 20%, rgba(108,99,255,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(34,211,238,0.05) 0%, transparent 60%), #f0f0fa",
    }}>
      {/* Header */}
      <div className="anim-fadeUp" style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 22,
          background: "linear-gradient(135deg, #6c63ff, #8b5cf6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 18px",
          boxShadow: "0 8px 32px rgba(108,99,255,0.4)",
          animation: "floatY 3s ease-in-out infinite",
        }}>
          <span style={{ fontSize: 28, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900, color: "white" }}>FF</span>
        </div>
        <h1 className="ff-display grad-text" style={{ fontSize: 38, fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>FF</h1>
        <p className="text-muted" style={{ fontSize: 15 }}>Arts & Cultural Fest Management</p>
      </div>

      {/* Group Cards */}
      <div className="anim-fadeUp stagger-2" style={{ width: "100%", maxWidth: 520, marginBottom: 14 }}>
        <div className="text-muted" style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", textAlign: "center", marginBottom: 16 }}>Select Your Group</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {groups.map((g, i) => (
            <div key={g.id}
              className={`card anim-fadeUp stagger-${i + 3}`}
              onMouseEnter={() => setHovering(g.id)}
              onMouseLeave={() => setHovering(null)}
              onClick={() => setPinGroup(g)}
              style={{
                padding: "18px 22px", cursor: "pointer",
                borderLeft: `4px solid ${g.color}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: hovering === g.id
                  ? (dark ? `rgba(${hexToRgb(g.color)},0.1)` : `rgba(${hexToRgb(g.color)},0.07)`)
                  : (dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.88)"),
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 14, background: `${g.color}22`, display: "flex", alignItems: "center", justifyContent: "center", border: `1.5px solid ${g.color}44` }}>
                  <Ic name="users" size={20} />
                </div>
                <div>
                  <div className="ff-display fw-800" style={{ fontSize: 16 }}>{g.name}</div>
                  <div className="text-muted" style={{ fontSize: 12, marginTop: 2 }}>Group Leader Portal</div>
                </div>
              </div>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: `${g.color}18`, border: `1.5px solid ${g.color}44`, display: "flex", alignItems: "center", justifyContent: "center", color: g.color, transition: "transform 0.2s", transform: hovering === g.id ? "translateX(4px)" : "translateX(0)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin link */}
      <div className="anim-fadeUp stagger-6" style={{ marginTop: 24 }}>
        <button onClick={() => setAdminPin(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)", fontFamily: "Inter", transition: "color 0.2s", textDecoration: "underline", textUnderlineOffset: 3 }}
          onMouseEnter={e => e.target.style.color = "#6c63ff"}
          onMouseLeave={e => e.target.style.color = dark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.25)"}>
          Admin Access
        </button>
      </div>

      {/* Leader PIN modal (numpad) */}
      {pinGroup && (
        <NumPinModal
          title={pinGroup.name}
          subtitle="Enter your group PIN to continue"
          correctPin={LEADER_PIN}
          dark={dark}
          onSuccess={() => { onLeaderLogin(pinGroup); setPinGroup(null); }}
          onClose={() => setPinGroup(null)}
        />
      )}

      {/* Admin password modal (keyboard) */}
      {adminPin && (
        <TextPinModal
          title="Admin Access"
          subtitle="Enter your admin password to continue"
          correctPin={ADMIN_PIN}
          dark={dark}
          onSuccess={() => { onAdminClick(); setAdminPin(false); }}
          onClose={() => setAdminPin(false)}
        />
      )}
    </div>
  );
};

// helper
const hexToRgb = hex => {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
};

// ─── LEADER PORTAL ────────────────────────────────────────────────────────────
const LeaderPortal = ({ group, dark, setDark, onBack }) => {
  const { programs, students, setStudents, registrations, setRegistrations } = useApp();
  const [view, setView] = useState("home"); // home | addReg | editReg
  const [editTarget, setEditTarget] = useState(null);

  const myStudents = students[group.id] || [];
  const myRegs = registrations.filter(r => r.groupId === group.id);

  // ── Registration ──
  const [regForm, setRegForm] = useState({ programId: "", participantIds: [] });

  const openAddReg = () => { setRegForm({ programId: "", participantIds: [] }); setEditTarget(null); setView("reg"); };
  const openEditReg = (r) => { setRegForm({ programId: r.programId, participantIds: [...r.participantIds] }); setEditTarget(r); setView("reg"); };
  const saveReg = () => {
    if (!regForm.programId || regForm.participantIds.length === 0) return;
    if (editTarget) {
      setRegistrations(prev => prev.map(r => r.id === editTarget.id ? { ...r, programId: regForm.programId, participantIds: regForm.participantIds } : r));
    } else {
      setRegistrations(prev => [...prev, { id: "reg" + Date.now(), groupId: group.id, programId: regForm.programId, participantIds: regForm.participantIds }]);
    }
    setView("home");
  };
  const deleteReg = (id) => setRegistrations(prev => prev.filter(r => r.id !== id));

  const togglePart = (id) => {
    const prog = programs.find(p => p.id === regForm.programId);
    setRegForm(f => {
      if (f.participantIds.includes(id)) return { ...f, participantIds: f.participantIds.filter(x => x !== id) };
      if (f.participantIds.length >= (prog?.maxParticipants || 99)) return f;
      return { ...f, participantIds: [...f.participantIds, id] };
    });
  };

  const selProg = programs.find(p => p.id === regForm.programId);
  const eligibleStudents = myStudents.filter(s => !selProg || s.category === selProg.category);

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#080917" : "#f0f0fa" }}>
      <Topbar dark={dark} setDark={setDark} context={`${group.name} · Leader Portal`}
        left={<>
          <button className="btn btn-ghost btn-icon" style={{flexShrink:0}} onClick={view === "home" ? onBack : () => setView("home")}><Ic name="back" size={15} /></button>
          <div style={{minWidth:0}}>
            <div className="topbar-title">{group.name}</div>
            <div className="topbar-sub">Leader Portal</div>
          </div>
        </>}
        right={<div className="live"><div className="live-dot" /></div>}
      />

      <div className="page" style={{maxWidth:720}}>
        {view === "home" && (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }} className="anim-fadeUp">
              {[
                { label: "Students", value: myStudents.length, color: group.color },
                { label: "Registrations", value: myRegs.length, color: "#22d3ee" },
              ].map(s => (
                <div key={s.label} className="card" style={{ padding: "18px 20px", borderTop: `3px solid ${s.color}` }}>
                  <div className="ff-display fw-800" style={{ fontSize: 28, color: s.color }}>{s.value}</div>
                  <div className="text-muted" style={{ fontSize: 12, marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Students */}
            <div className="card anim-fadeUp stagger-2" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div className="ff-display fw-800" style={{ fontSize: 15 }}>Students</div>

              </div>
              {myStudents.length === 0
                ? <div className="text-muted" style={{ textAlign: "center", padding: "24px 0", fontSize: 13 }}>No students yet. Add your first one!</div>
                : <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                    <table className="tbl">
                      <thead><tr><th>Chest #</th><th>Name</th><th>Category</th></tr></thead>
                      <tbody>
                        {myStudents.map(s => (
                          <tr key={s.id}>
                            <td><span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, color: ACCENT }}>{s.chestNo}</span></td>
                            <td style={{ fontWeight: 500 }}>{s.name}</td>
                            <td><span className={`badge badge-${s.category === "Sub-Junior" ? "sj" : s.category.toLowerCase()}`}>{s.category}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              }
            </div>

            {/* Registrations */}
            <div className="card anim-fadeUp stagger-3" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div className="ff-display fw-800" style={{ fontSize: 15 }}>Event Registrations</div>
                <button className="btn btn-primary btn-sm" onClick={openAddReg}><Ic name="plus" size={13} />Register</button>
              </div>
              {myRegs.length === 0
                ? <div className="text-muted" style={{ textAlign: "center", padding: "24px 0", fontSize: 13 }}>No registrations yet. Register students for events!</div>
                : myRegs.map((r, i) => {
                    const prog = programs.find(p => p.id === r.programId);
                    const parts = r.participantIds.map(id => myStudents.find(s => s.id === id)).filter(Boolean);
                    return (
                      <div key={r.id} className={`anim-fadeUp stagger-${i + 1}`} style={{
                        padding: "14px 16px", borderRadius: 14, marginBottom: 10,
                        background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                        border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"}`,
                        display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{prog?.name || "Unknown"}</div>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                            <span className={`badge badge-${prog?.category === "Sub-Junior" ? "sj" : prog?.category?.toLowerCase() || "senior"}`}>{prog?.category}</span>
                            <span className={`badge badge-${prog?.type?.toLowerCase()}`}>{prog?.type}</span>
                            {parts.map(p => <span key={p.id} className="chip" style={{ background: `${group.color}18`, color: group.color }}>{p.chestNo} {p.name}</span>)}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEditReg(r)}><Ic name="edit" size={13} /></button>
                          <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteReg(r.id)}><Ic name="trash" size={13} /></button>
                        </div>
                      </div>
                    );
                  })
              }
            </div>
          </>
        )}



        {view === "reg" && (
          <div className="card anim-scaleIn" style={{ padding: 24 }}>
            <div className="ff-display fw-800" style={{ fontSize: 17, marginBottom: 20 }}>{editTarget ? "Edit Registration" : "Register for Event"}</div>
            <div style={{ marginBottom: 16 }}>
              <label className="label">Program / Event</label>
              <select className="input select" value={regForm.programId} onChange={e => setRegForm(f => ({ ...f, programId: e.target.value, participantIds: [] }))}>
                <option value="">Select a program</option>
                {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.category})</option>)}
              </select>
            </div>
            {regForm.programId && (
              <div style={{ marginBottom: 24 }}>
                <label className="label">Select Participants {selProg && <span style={{ color: ACCENT }}>· max {selProg.maxParticipants}</span>}</label>
                {eligibleStudents.length === 0
                  ? <div className="text-muted" style={{ fontSize: 13, padding: "14px 0" }}>No eligible students for this category. Add {selProg?.category} students first.</div>
                  : eligibleStudents.map(s => (
                    <div key={s.id} onClick={() => togglePart(s.id)} style={{
                      display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 12, marginBottom: 8, cursor: "pointer",
                      border: `1.5px solid ${regForm.participantIds.includes(s.id) ? ACCENT : (dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.07)")}`,
                      background: regForm.participantIds.includes(s.id) ? "rgba(108,99,255,0.08)" : "transparent",
                      transition: "all 0.18s",
                    }}>
                      <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${regForm.participantIds.includes(s.id) ? ACCENT : (dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)")}`, background: regForm.participantIds.includes(s.id) ? ACCENT : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s", flexShrink: 0 }}>
                        {regForm.participantIds.includes(s.id) && <Ic name="check" size={12} />}
                      </div>
                      <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, color: ACCENT, fontSize: 13 }}>{s.chestNo}</span>
                      <span style={{ fontWeight: 500 }}>{s.name}</span>
                      <span className={`badge badge-${s.category === "Sub-Junior" ? "sj" : s.category.toLowerCase()} `} style={{ marginLeft: "auto" }}>{s.category}</span>
                    </div>
                  ))
                }
              </div>
            )}
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setView("home")}>Cancel</button>
              <button className="btn btn-primary" onClick={saveReg} disabled={!regForm.programId || regForm.participantIds.length === 0}><Ic name="check" size={14} />{editTarget ? "Update" : "Confirm"}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── ADMIN PORTAL ─────────────────────────────────────────────────────────────

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ title, onClose, children, wide }) => (
  <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className={`modal${wide ? " modal-lg" : ""}`}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:20 }}>
        <div className="ff-display fw-800" style={{ fontSize:17 }}>{title}</div>
        <button className="btn btn-ghost btn-icon" onClick={onClose}><Ic name="x" size={15}/></button>
      </div>
      {children}
    </div>
  </div>
);

// ─── PRINT SECTION ────────────────────────────────────────────────────────────
const PrintSection = ({ dark }) => {
  const { programs, students, registrations, groups } = useApp();
  const [sheet, setSheet] = useState("chest");   // chest | name | code
  const [selProg, setSelProg] = useState(programs[0]?.id || "");
  const printRef = useRef(null);

  // Build participant list for selected program
  const prog = programs.find(p => p.id === selProg);
  const getParticipants = () => {
    const regs = registrations.filter(r => r.programId === selProg);
    return regs.flatMap(r => {
      const grp = groups.find(g => g.id === r.groupId);
      const grpStudents = students[r.groupId] || [];
      return r.participantIds.map(id => {
        const s = grpStudents.find(st => st.id === id);
        return s ? { ...s, groupName: grp?.name, groupColor: grp?.color } : null;
      }).filter(Boolean);
    });
  };

  const participants = getParticipants();
  const byChest = [...participants].sort((a, b) => parseInt(a.chestNo) - parseInt(b.chestNo));
  const byName  = [...participants].sort((a, b) => a.name.localeCompare(b.name));
  const criteria = prog?.criteria?.filter(Boolean) || ["Criteria 1", "Criteria 2"];

  const handlePrint = () => {
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body > * { display: none !important; }
        #print-area { display: block !important; }
        #print-area { font-family: 'Times New Roman', serif; color: #000; background: #fff; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #333; padding: 7px 10px; font-size: 13px; }
        th { background: #f0f0f0; font-weight: bold; }
        h2 { font-size: 18px; margin-bottom: 4px; }
        p { font-size: 12px; margin-bottom: 14px; color: #555; }
        .code-col { width: 60px; text-align: center; font-weight: bold; font-size: 15px; }
        .blank-col { min-width: 80px; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    setTimeout(() => document.head.removeChild(style), 1000);
  };

  const sheetBtns = [
    { id: "chest", label: "By Chest No." },
    { id: "name",  label: "By Name" },
    { id: "code",  label: "Code Letter" },
  ];

  const cellStyle = { border: "1.5px solid", borderColor: dark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.15)", padding: "10px 14px", fontSize: 13.5 };
  const headStyle = { ...cellStyle, background: dark ? "rgba(108,99,255,0.12)" : "rgba(108,99,255,0.07)", fontWeight: 700, fontSize: 11.5, letterSpacing: 0.7, textTransform: "uppercase", color: dark ? "#a78bfa" : "#6c63ff" };
  const blankCell = { ...cellStyle, background: dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)", minWidth: 80 };

  return (
    <div className="anim-fadeUp">
      {/* Controls */}
      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>
          <div className="ff-display fw-800" style={{ fontSize: 16 }}>Print Sheets</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-ghost btn-sm" onClick={handlePrint} style={{ gap: 6 }}><Ic name="printer" size={13} />Print</button>
          </div>
        </div>

        {/* Sheet type tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 16, background: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)", borderRadius: 12, padding: 4 }}>
          {sheetBtns.map(s => (
            <button key={s.id} onClick={() => setSheet(s.id)}
              className="btn btn-sm"
              style={{ flex: 1, justifyContent: "center", background: sheet === s.id ? "linear-gradient(135deg,#6c63ff,#8b5cf6)" : "transparent", color: sheet === s.id ? "white" : (dark ? "#9ca3af" : "#6b7280"), boxShadow: sheet === s.id ? "0 4px 14px rgba(108,99,255,0.35)" : "none" }}>
              {s.label}
            </button>
          ))}
        </div>

        {/* Program selector */}
        <div>
          <label className="label">Program</label>
          <select className="input select" value={selProg} onChange={e => setSelProg(e.target.value)}>
            <option value="">— Select a program —</option>
            {programs.map(p => <option key={p.id} value={p.id}>{p.name} ({p.category} · {p.type})</option>)}
          </select>
        </div>
      </div>

      {/* Sheet preview */}
      {selProg && (
        <div id="print-area">
          {/* ── Sheet 1: By Chest Number ── */}
          {sheet === "chest" && (
            <div className="card anim-scaleIn" style={{ padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <div className="ff-display fw-800" style={{ fontSize: 18 }}>{prog?.name} — Call List</div>
                <div className="text-muted" style={{ fontSize: 13, marginTop: 3 }}>{prog?.category} · {prog?.type} · Sorted by Chest Number</div>
              </div>
              {participants.length === 0
                ? <div className="text-muted" style={{ textAlign: "center", padding: "32px 0", fontSize: 13 }}>No participants registered for this program yet.</div>
                : <div className="tbl-wrap">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={headStyle}>Chest No.</th>
                          <th style={headStyle}>Participant Name</th>
                          <th style={headStyle}>Group</th>
                          <th style={headStyle}>Category</th>
                          <th style={{ ...headStyle, textAlign: "center" }}>Attendance ✓</th>
                        </tr>
                      </thead>
                      <tbody>
                        {byChest.map((p, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? (dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)") : "transparent" }}>
                            <td style={{ ...cellStyle, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 16, color: ACCENT }}>{p.chestNo}</td>
                            <td style={{ ...cellStyle, fontWeight: 600 }}>{p.name}</td>
                            <td style={cellStyle}>
                              <span className="chip" style={{ background: `${p.groupColor}20`, color: p.groupColor }}>{p.groupName}</span>
                            </td>
                            <td style={cellStyle}><span className={`badge badge-${p.category === "Sub-Junior" ? "sj" : p.category.toLowerCase()}`}>{p.category}</span></td>
                            <td style={{ ...cellStyle, textAlign: "center" }}>
                              <div style={{ width: 22, height: 22, border: `2px solid ${dark ? "rgba(108,99,255,0.4)" : "rgba(108,99,255,0.5)"}`, borderRadius: 6, margin: "0 auto" }} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              }
              <div className="text-muted" style={{ fontSize: 11, marginTop: 14, textAlign: "right" }}>
                Total: {participants.length} participant{participants.length !== 1 ? "s" : ""} · FF Fest Management
              </div>
            </div>
          )}

          {/* ── Sheet 2: By Name ── */}
          {sheet === "name" && (
            <div className="card anim-scaleIn" style={{ padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <div className="ff-display fw-800" style={{ fontSize: 18 }}>{prog?.name} — Call List</div>
                <div className="text-muted" style={{ fontSize: 13, marginTop: 3 }}>{prog?.category} · {prog?.type} · Sorted by Name</div>
              </div>
              {participants.length === 0
                ? <div className="text-muted" style={{ textAlign: "center", padding: "32px 0", fontSize: 13 }}>No participants registered for this program yet.</div>
                : <div className="tbl-wrap">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={headStyle}>Sl.</th>
                          <th style={headStyle}>Participant Name</th>
                          <th style={headStyle}>Chest No.</th>
                          <th style={headStyle}>Group</th>
                          <th style={headStyle}>Category</th>
                          <th style={{ ...headStyle, textAlign: "center" }}>Attendance ✓</th>
                        </tr>
                      </thead>
                      <tbody>
                        {byName.map((p, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? (dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)") : "transparent" }}>
                            <td style={{ ...cellStyle, color: dark ? "#6b7280" : "#9ca3af", fontSize: 13 }}>{i + 1}</td>
                            <td style={{ ...cellStyle, fontWeight: 700 }}>{p.name}</td>
                            <td style={{ ...cellStyle, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, fontSize: 15, color: ACCENT }}>{p.chestNo}</td>
                            <td style={cellStyle}>
                              <span className="chip" style={{ background: `${p.groupColor}20`, color: p.groupColor }}>{p.groupName}</span>
                            </td>
                            <td style={cellStyle}><span className={`badge badge-${p.category === "Sub-Junior" ? "sj" : p.category.toLowerCase()}`}>{p.category}</span></td>
                            <td style={{ ...cellStyle, textAlign: "center" }}>
                              <div style={{ width: 22, height: 22, border: `2px solid ${dark ? "rgba(108,99,255,0.4)" : "rgba(108,99,255,0.5)"}`, borderRadius: 6, margin: "0 auto" }} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              }
              <div className="text-muted" style={{ fontSize: 11, marginTop: 14, textAlign: "right" }}>
                Total: {participants.length} participant{participants.length !== 1 ? "s" : ""} · FF Fest Management
              </div>
            </div>
          )}

          {/* ── Sheet 3: Code Letter (Judges) ── */}
          {sheet === "code" && (
            <div className="card anim-scaleIn" style={{ padding: 24 }}>
              <div style={{ marginBottom: 16 }}>
                <div className="ff-display fw-800" style={{ fontSize: 18 }}>{prog?.name} — Judges' Sheet</div>
                <div className="text-muted" style={{ fontSize: 13, marginTop: 3 }}>{prog?.category} · {prog?.type} · Anonymized · For Judge Use Only</div>
              </div>
              <div style={{ background: dark ? "rgba(251,191,36,0.08)" : "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)", borderRadius: 12, padding: "10px 14px", fontSize: 12.5, color: "#d97706", marginBottom: 16 }}>
                ⚠️ This sheet is confidential. Code letters are assigned randomly. Do not share participant identities with judges.
              </div>
              {participants.length === 0
                ? <div className="text-muted" style={{ textAlign: "center", padding: "32px 0", fontSize: 13 }}>No participants registered for this program yet.</div>
                : <div className="tbl-wrap">
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={{ ...headStyle, textAlign: "center", width: 60 }}>Code</th>
                          {criteria.map((c, i) => (
                            <th key={i} style={{ ...headStyle, textAlign: "center" }}>{c} <span style={{ opacity: 0.6 }}>(/ 10)</span></th>
                          ))}
                          <th style={{ ...headStyle, textAlign: "center" }}>Total <span style={{ opacity: 0.6 }}>({criteria.length * 10})</span></th>
                          <th style={{ ...headStyle }}>Remarks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {byChest.map((_, i) => (
                          <tr key={i} style={{ background: i % 2 === 0 ? (dark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)") : "transparent" }}>
                            <td style={{ ...cellStyle, textAlign: "center" }}>
                              <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 900, fontSize: 20, background: "linear-gradient(135deg,#6c63ff,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                                {String.fromCharCode(65 + i)}
                              </span>
                            </td>
                            {criteria.map((_, ci) => (
                              <td key={ci} style={{ ...blankCell, textAlign: "center" }}></td>
                            ))}
                            <td style={{ ...blankCell, textAlign: "center" }}></td>
                            <td style={{ ...blankCell, minWidth: 140 }}></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
              }
              <div className="text-muted" style={{ fontSize: 11, marginTop: 14, textAlign: "right" }}>
                {participants.length} entries · FF Fest Management · Confidential
              </div>
            </div>
          )}
        </div>
      )}

      {!selProg && (
        <div className="card" style={{ padding: 40, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>🖨️</div>
          <div className="ff-display fw-800" style={{ marginBottom: 6 }}>Select a Program</div>
          <div className="text-muted" style={{ fontSize: 13 }}>Choose a program above to preview and print sheets.</div>
        </div>
      )}
    </div>
  );
};

const AdminPortal = ({ dark, setDark, onBack }) => {
  const { groups, programs, setPrograms, students, setStudents, registrations } = useApp();
  const [view, setView] = useState("students"); // students | programs
  const [activeGroup, setActiveGroup] = useState(groups[0]?.id);
  const [progModal, setProgModal] = useState(false);
  const [editProg, setEditProg] = useState(null);
  const [progForm, setProgForm] = useState({ name: "", category: "Senior", type: "Single", maxParticipants: 1, criteria: ["", ""] });

  const [stuModal, setStuModal] = useState(false);
  const [stuForm, setStuForm] = useState({ name: "", category: "Senior" });
  const catBase = { "Sub-Junior": 100, "Junior": 200, "Senior": 300 };
  const saveStudent = () => {
    if (!stuForm.name.trim()) return;
    const allInCat = Object.values(students).flat().filter(s => s.category === stuForm.category);
    const usedNums = allInCat.map(s => parseInt(s.chestNo)).filter(n => !isNaN(n));
    let next = catBase[stuForm.category] + 1;
    while (usedNums.includes(next)) next++;
    const chest = String(next);
    const newS = { id: "s" + Date.now(), name: stuForm.name, category: stuForm.category, chestNo: chest };
    setStudents(prev => ({ ...prev, [activeGroup]: [...(prev[activeGroup] || []), newS] }));
    setStuForm({ name: "", category: "Senior" });
    setStuModal(false);
  };
  const deleteStudent = (gid, sid) => setStudents(prev => ({ ...prev, [gid]: (prev[gid] || []).filter(s => s.id !== sid) }));

    const openAddProg = () => { setProgForm({ name: "", category: "Senior", type: "Single", maxParticipants: 1, criteria: ["", ""] }); setEditProg(null); setProgModal(true); };
  const openEditProg = (p) => { setProgForm({ ...p, criteria: [...(p.criteria || ["",""])] }); setEditProg(p); setProgModal(true); };
  const deleteProg = (id) => setPrograms(prev => prev.filter(p => p.id !== id));
  const saveProg = () => {
    if (!progForm.name.trim()) return;
    if (editProg) setPrograms(prev => prev.map(p => p.id === editProg.id ? { ...p, ...progForm } : p));
    else setPrograms(prev => [...prev, { id: "p" + Date.now(), ...progForm }]);
    setProgModal(false);
  };

  const curGroup = groups.find(g => g.id === activeGroup);
  const curStudents = students[activeGroup] || [];

  return (
    <div style={{ minHeight: "100vh", background: dark ? "#080917" : "#f0f0fa" }}>
      <Topbar dark={dark} setDark={setDark} context="Admin Panel"
        left={<>
          <button className="btn btn-ghost btn-icon" style={{flexShrink:0}} onClick={onBack}><Ic name="back" size={15} /></button>
          <div style={{minWidth:0}}>
            <div className="topbar-title">Admin Panel</div>
            <div className="live" style={{marginTop:1}}><div className="live-dot" /><span className="topbar-sub">Live</span></div>
          </div>
        </>}
        right={<div className="admin-nav">
          <button className="btn btn-sm" style={{ background: view === "students" ? "linear-gradient(135deg,#6c63ff,#8b5cf6)" : (dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"), color: view === "students" ? "white" : (dark ? "#9ca3af" : "#6b7280") }} onClick={() => setView("students")}><Ic name="users" size={12} />Students</button>
          <button className="btn btn-sm" style={{ background: view === "programs" ? "linear-gradient(135deg,#6c63ff,#8b5cf6)" : (dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"), color: view === "programs" ? "white" : (dark ? "#9ca3af" : "#6b7280") }} onClick={() => setView("programs")}><Ic name="book" size={12} />Programs</button>
          <button className="btn btn-sm" style={{ background: view === "print" ? "linear-gradient(135deg,#6c63ff,#8b5cf6)" : (dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"), color: view === "print" ? "white" : (dark ? "#9ca3af" : "#6b7280") }} onClick={() => setView("print")}><Ic name="printer" size={12} />Print</button>
        </div>}
      />

      <div className="page">
        {view === "students" && (
          <>
            {/* Group tabs */}
            <div className="group-tabs anim-slideDown" style={{marginBottom:18}}>
              {groups.map(g => (
                <button key={g.id} onClick={() => setActiveGroup(g.id)}
                  className="btn btn-sm"
                  style={{
                    background: activeGroup === g.id ? `${g.color}` : (dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                    color: activeGroup === g.id ? "white" : (dark ? "#9ca3af" : "#6b7280"),
                    boxShadow: activeGroup === g.id ? `0 4px 16px ${g.color}44` : "none",
                    borderLeft: `3px solid ${g.color}`,
                  }}>
                  {g.name}
                </button>
              ))}
            </div>

            {/* Students of selected group */}
            <div className="card anim-fadeUp" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: curGroup?.color, flexShrink: 0 }} />
                <div className="ff-display fw-800" style={{ fontSize: 16 }}>{curGroup?.name} — Students</div>
                <span className="chip" style={{ background: `${curGroup?.color}18`, color: curGroup?.color }}>{curStudents.length} total</span>
                <button className="btn btn-primary btn-sm" style={{ marginLeft: "auto" }} onClick={() => { setStuForm({ name: "", category: "Senior" }); setStuModal(true); }}><Ic name="plus" size={13} />Add Student</button>
              </div>
              {curStudents.length === 0
                ? <div className="text-muted" style={{ textAlign: "center", padding: "28px 0", fontSize: 13 }}>No students in {curGroup?.name} yet. Click "Add Student" to add one.</div>
                : <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                    <table className="tbl">
                      <thead><tr><th>Chest #</th><th>Name</th><th>Category</th><th>Events</th><th></th></tr></thead>
                      <tbody>
                        {curStudents.map(s => {
                          const evts = registrations.filter(r => r.groupId === activeGroup && r.participantIds.includes(s.id));
                          return (
                            <tr key={s.id}>
                              <td><span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, color: ACCENT }}>{s.chestNo}</span></td>
                              <td style={{ fontWeight: 500 }}>{s.name}</td>
                              <td><span className={`badge badge-${s.category === "Sub-Junior" ? "sj" : s.category.toLowerCase()}`}>{s.category}</span></td>
                              <td><span className="text-muted" style={{ fontSize: 12 }}>{evts.length} event{evts.length !== 1 ? "s" : ""}</span></td>
                              <td><button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteStudent(activeGroup, s.id)}><Ic name="trash" size={12} /></button></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
              }
            </div>

            {/* All groups overview */}
            <div className="overview-grid anim-fadeUp stagger-2">
              {groups.map(g => {
                const cnt = (students[g.id] || []).length;
                const regs = registrations.filter(r => r.groupId === g.id).length;
                return (
                  <div key={g.id} className="card" style={{ padding: "16px 18px", borderTop: `3px solid ${g.color}`, cursor: "pointer" }} onClick={() => setActiveGroup(g.id)}>
                    <div style={{ fontWeight: 700, marginBottom: 8, color: g.color }}>{g.name}</div>
                    <div style={{ fontSize: 24, fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800 }}>{cnt}</div>
                    <div className="text-muted" style={{ fontSize: 11 }}>students · {regs} registrations</div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {view === "programs" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }} className="anim-slideDown">
              <div className="ff-display fw-800" style={{ fontSize: 18 }}>Programs & Events</div>
              <button className="btn btn-primary btn-sm" onClick={openAddProg}><Ic name="plus" size={13} />Add Program</button>
            </div>

            {programs.map((p, i) => {
              // Get all registrations for this program
              const progRegs = registrations.filter(r => r.programId === p.id);
              const allParts = progRegs.flatMap(r => {
                const grpStudents = students[r.groupId] || [];
                const grp = [{ id: "g1", name: "Group 1", color: "#6c63ff" }, { id: "g2", name: "Group 2", color: "#22d3ee" }, { id: "g3", name: "Group 3", color: "#f472b6" }].find(g => g.id === r.groupId);
                return r.participantIds.map(id => {
                  const s = grpStudents.find(st => st.id === id);
                  return s ? { ...s, groupName: grp?.name, groupColor: grp?.color } : null;
                }).filter(Boolean);
              });

              return (
                <div key={p.id} className={`card anim-fadeUp stagger-${i + 1}`} style={{ padding: 20, marginBottom: 14 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12, gap: 12 }}>
                    <div>
                      <div className="ff-display fw-800" style={{ fontSize: 16, marginBottom: 6 }}>{p.name}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        <span className={`badge badge-${p.category === "Sub-Junior" ? "sj" : p.category.toLowerCase()}`}>{p.category}</span>
                        <span className={`badge badge-${p.type.toLowerCase()}`}>{p.type}</span>
                        <span className="chip" style={{ background: "rgba(108,99,255,0.1)", color: ACCENT }}>Max {p.maxParticipants}</span>
                        {p.criteria?.filter(Boolean).map(c => <span key={c} className="chip" style={{ background: dark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: dark ? "#9ca3af" : "#6b7280" }}>{c}</span>)}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEditProg(p)}><Ic name="edit" size={13} /></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => deleteProg(p.id)}><Ic name="trash" size={13} /></button>
                    </div>
                  </div>

                  {/* Participants registered */}
                  {allParts.length > 0 && (
                    <>
                      <div className="divider" />
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: dark ? "#4b5563" : "#9ca3af", marginBottom: 8 }}>Registered Participants</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                        {allParts.map((s, j) => (
                          <div key={j} className="chip" style={{ background: `${s.groupColor}18`, color: s.groupColor, border: `1px solid ${s.groupColor}30` }}>
                            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 11 }}>{s.chestNo}</span>
                            <span>{s.name}</span>
                            <span style={{ opacity: 0.7, fontSize: 10 }}>· {s.groupName}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  {allParts.length === 0 && <div className="text-muted" style={{ fontSize: 12, marginTop: 8 }}>No participants registered yet.</div>}
                </div>
              );
            })}

            {programs.length === 0 && (
              <div className="card" style={{ padding: 40, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🎭</div>
                <div className="ff-display fw-800" style={{ marginBottom: 6 }}>No Programs Yet</div>
                <div className="text-muted" style={{ fontSize: 13, marginBottom: 16 }}>Add your first event to get started.</div>
                <button className="btn btn-primary" onClick={openAddProg}><Ic name="plus" size={14} />Add Program</button>
              </div>
            )}
          </>
        )}

        {view === "print" && <PrintSection dark={dark} />}
      </div>

      {stuModal && (
        <Modal title="Add Student" onClose={() => setStuModal(false)}>
          <div style={{ display: "grid", gap: 14 }}>
            <div><label className="label">Full Name</label><input className="input" value={stuForm.name} onChange={e => setStuForm(f => ({ ...f, name: e.target.value }))} onKeyDown={e => e.key === "Enter" && saveStudent()} placeholder="Student's full name" autoFocus /></div>
            <div><label className="label">Category</label>
              <select className="input select" value={stuForm.category} onChange={e => setStuForm(f => ({ ...f, category: e.target.value }))}>
                <option>Sub-Junior</option><option>Junior</option><option>Senior</option>
              </select>
            </div>
            <div style={{ background: "rgba(108,99,255,0.07)", border: "1px solid rgba(108,99,255,0.15)", borderRadius: 10, padding: "10px 14px", fontSize: 12, color: "#6c63ff" }}>
              Adding to <strong>{curGroup?.name}</strong> · Chest no. auto-assigned
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="btn btn-ghost" onClick={() => setStuModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveStudent}><Ic name="check" size={14} />Add Student</button>
            </div>
          </div>
        </Modal>
      )}

      {progModal && (
        <Modal title={editProg ? "Edit Program" : "Add Program"} onClose={() => setProgModal(false)} wide>
          <div style={{ display: "grid", gap: 14 }}>
            <div><label className="label">Program Name</label><input className="input" value={progForm.name} onChange={e => setProgForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Bharatanatyam" /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label className="label">Category</label>
                <select className="input select" value={progForm.category} onChange={e => setProgForm(f => ({ ...f, category: e.target.value }))}>
                  <option>Sub-Junior</option><option>Junior</option><option>Senior</option>
                </select>
              </div>
              <div><label className="label">Type</label>
                <select className="input select" value={progForm.type} onChange={e => setProgForm(f => ({ ...f, type: e.target.value }))}>
                  <option>Single</option><option>Group</option>
                </select>
              </div>
            </div>
            <div><label className="label">Max Participants</label><input type="number" className="input" value={progForm.maxParticipants} min={1} onChange={e => setProgForm(f => ({ ...f, maxParticipants: parseInt(e.target.value) || 1 }))} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label className="label">Criteria 1</label><input className="input" value={progForm.criteria[0]} onChange={e => setProgForm(f => { const c=[...f.criteria]; c[0]=e.target.value; return { ...f, criteria:c }; })} placeholder="e.g. Creativity" /></div>
              <div><label className="label">Criteria 2</label><input className="input" value={progForm.criteria[1]} onChange={e => setProgForm(f => { const c=[...f.criteria]; c[1]=e.target.value; return { ...f, criteria:c }; })} placeholder="e.g. Technique" /></div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
              <button className="btn btn-ghost" onClick={() => setProgModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveProg}><Ic name="check" size={14} />{editProg ? "Update" : "Add Program"}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [dark, setDark] = useState(true);
  const [splash, setSplash] = useState(true);
  const [screen, setScreen] = useState("landing"); // landing | leader | admin
  const [activeGroup, setActiveGroup] = useState(null);

  const [groups] = useState(INITIAL_GROUPS);
  const [programs, setPrograms] = useState(INITIAL_PROGRAMS);
  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [registrations, setRegistrations] = useState(INITIAL_REGISTRATIONS);

  return (
    <AppContext.Provider value={{ groups, programs, setPrograms, students, setStudents, registrations, setRegistrations }}>
      <GlobalStyles dark={dark} />
      {splash && <SplashScreen onDone={() => setSplash(false)} />}

      {!splash && screen === "landing" && (
        <LandingPage
          groups={groups}
          dark={dark}
          onLeaderLogin={g => { setActiveGroup(g); setScreen("leader"); }}
          onAdminClick={() => setScreen("admin")}
        />
      )}

      {!splash && screen === "leader" && activeGroup && (
        <LeaderPortal group={activeGroup} dark={dark} setDark={setDark} onBack={() => setScreen("landing")} />
      )}

      {!splash && screen === "admin" && (
        <AdminPortal dark={dark} setDark={setDark} onBack={() => setScreen("landing")} />
      )}
    </AppContext.Provider>
  );
}
