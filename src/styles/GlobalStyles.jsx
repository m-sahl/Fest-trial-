import { ACCENT } from "./DesignTokens";

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

export default GlobalStyles;
