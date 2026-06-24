import { useState } from "react";
import Ic from "../common/Ic";
import { NumPinModal, TextPinModal } from "../common/AuthModals";
import { useApp } from "../../context/AppContext";

const hexToRgb = hex => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
};

const LandingPage = ({ groups, dark, onLeaderLogin, onAdminClick }) => {
  const { users } = useApp();
  const [hovering, setHovering] = useState(null);
  const [pinGroup, setPinGroup] = useState(null);
  const [adminPin, setAdminPin] = useState(false);

  // Authenticate as a leader for a specific group
  const verifyLeaderPin = (pin) => {
    const user = users.find(u => u.role === "leader" && u.groupId === pinGroup.id && u.pin === pin);
    return user;
  };

  // Authenticate as an admin
  const verifyAdminPin = (pin) => {
    const user = users.find(u => u.role === "admin" && u.pin === pin);
    return user;
  };

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
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6" /></svg>
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
          dark={dark}
          verify={verifyLeaderPin}
          onSuccess={(user) => { 
            // We need to return the user from verify if we want to track who logged in
            // I'll adjust verify to return the user object
            const u = users.find(u => u.role === "leader" && u.groupId === pinGroup.id);
            onLeaderLogin(u, pinGroup); 
            setPinGroup(null); 
          }}
          onClose={() => setPinGroup(null)}
        />
      )}

      {/* Admin password modal (keyboard) */}
      {adminPin && (
        <TextPinModal
          title="Admin Access"
          subtitle="Enter your admin password to continue"
          dark={dark}
          verify={verifyAdminPin}
          onSuccess={() => { 
            const u = users.find(u => u.role === "admin");
            onAdminClick(u); 
            setAdminPin(false); 
          }}
          onClose={() => setAdminPin(false)}
        />
      )}
    </div>
  );
};

export default LandingPage;
