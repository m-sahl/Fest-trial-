import { useState } from "react";
import Ic from "./Ic";
import { ACCENT } from "../../styles/DesignTokens";
import { NumPinModal, TextPinModal } from "./AuthModals"; // We will create this next

const SettingsPanel = ({ dark, setDark, onClose, context, onLogout, isAdmin, verify }) => {
  const [confirming, setConfirming] = useState(false);
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
      label: "Security",
      rows: [
        {
          icon: "logout",
          label: "Logout",
          desc: "Exit from your current session",
          action: (
            <button className="btn btn-danger btn-sm" onClick={() => setConfirming(true)}>Logout</button>
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
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: row.label === "Logout" ? "rgba(239,68,68,0.12)" : "rgba(108,99,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", color: row.label === "Logout" ? "#ef4444" : ACCENT, flexShrink: 0 }}>
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
        {confirming && (
          isAdmin ? (
            <TextPinModal
              title="Confirm Logout"
              subtitle="Enter your admin password to log out"
              verify={verify || (() => true)}
              dark={dark}
              onSuccess={() => { onLogout(); onClose(); }}
              onClose={() => setConfirming(false)}
            />
          ) : (
            <NumPinModal
              title="Confirm Logout"
              subtitle="Enter your group PIN to log out"
              verify={verify || (() => true)}
              dark={dark}
              onSuccess={() => { onLogout(); onClose(); }}
              onClose={() => setConfirming(false)}
            />
          )
        )}
      </div>
    </div>
  );
};

export const Topbar = ({ left, right, dark, setDark, context, onLogout, isAdmin, verify }) => {
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
      {settings && (
        <SettingsPanel 
          dark={dark} 
          setDark={setDark} 
          onClose={() => setSettings(false)} 
          context={context} 
          onLogout={onLogout}
          isAdmin={isAdmin}
          verify={verify}
        />
      )}
    </>
  );
};
