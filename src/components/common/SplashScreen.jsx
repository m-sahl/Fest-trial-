import { useState, useEffect } from "react";

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

export default SplashScreen;
