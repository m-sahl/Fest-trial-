import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Ic from "../common/Ic";
import { Topbar } from "../common/Topbar";
import Modal from "../common/Modal";
import { CATS, catColor, ACCENT } from "../../styles/DesignTokens";

const LeaderPortal = ({ user, group, dark, setDark, onBack }) => {
  const { programs, students, setStudents, registrations, setRegistrations, logActivity } = useApp();
  const [stuModal, setStuModal] = useState(false);
  const [stuForm, setStuForm] = useState({ name: "", category: "Senior" });
  const [regModal, setRegModal] = useState(false);
  const [regForm, setRegForm] = useState({ programId: "", participantIds: [] });
  const [editTarget, setEditTarget] = useState(null);
  const [catFilter, setCatFilter] = useState("All");
  const [delConfirm, setDelConfirm] = useState(null);

  const groupStudents = students[group.id] || [];
  const filtStudents = groupStudents.filter(s => catFilter === "All" || s.category === catFilter);
  const groupRegs = registrations.filter(r => r.groupId === group.id);
  const filtRegs = groupRegs.filter(r => {
    if (catFilter === "All") return true;
    const p = programs.find(pg => pg.id === r.programId);
    return p?.category === catFilter;
  });

  const catBase = { "Sub-Junior": 100, "Junior": 200, "Senior": 300 };

  const saveStudent = () => {
    if (!stuForm.name.trim()) return;
    const sId = "s-" + Math.random().toString(36).substr(2, 5);
    const catStus = groupStudents.filter(s => s.category === stuForm.category);
    const chest = catBase[stuForm.category] + catStus.length + 1;
    const newStudent = { id: sId, ...stuForm, chestNo: chest.toString() };

    setStudents(prev => ({ ...prev, [group.id]: [...(prev[group.id] || []), newStudent] }));
    logActivity(user.name, "Added student", `${newStudent.name} (${newStudent.chestNo}) to ${group.name}`);
    setStuModal(false); setStuForm({ name: "", category: "Senior" });
  };

  const deleteStudent = (id) => {
    const s = groupStudents.find(x => x.id === id);
    if (registrations.some(r => r.groupId === group.id && r.participantIds.includes(id))) {
      alert("Cannot delete student with active registrations!");
      return;
    }
    setStudents(prev => ({ ...prev, [group.id]: prev[group.id].filter(s => s.id !== id) }));
    if (s) logActivity(user.name, "Deleted student", `${s.name} (${s.chestNo}) from ${group.name}`);
  };

  const openReg = (existing = null) => {
    if (existing) {
      setEditTarget(existing.id);
      setRegForm({ programId: existing.programId, participantIds: existing.participantIds });
    } else {
      setEditTarget(null);
      setRegForm({ programId: "", participantIds: [] });
    }
    setRegModal(true);
  };

  const saveReg = () => {
    if (!regForm.programId || regForm.participantIds.length === 0) return;
    const p = programs.find(pg => pg.id === regForm.programId);
    if (editTarget) {
      setRegistrations(prev => prev.map(r => r.id === editTarget ? { ...r, ...regForm } : r));
      logActivity(user.name, "Updated registration", `${p?.name} for ${group.name}`);
    } else {
      const newReg = { id: "r-" + Math.random().toString(36).substr(2, 5), groupId: group.id, ...regForm };
      setRegistrations(prev => [...prev, newReg]);
      logActivity(user.name, "New registration", `${p?.name} for ${group.name}`);
    }
    setRegModal(false);
  };

  const selectedProg = programs.find(p => p.id === regForm.programId);
  const isSelected = id => regForm.participantIds.includes(id);
  const togglePart = id => {
    setRegForm(prev => {
      const ids = prev.participantIds.includes(id) 
        ? prev.participantIds.filter(x => x !== id) 
        : (selectedProg?.type === "Single" ? [id] : [...prev.participantIds, id].slice(0, selectedProg?.maxParticipants));
      return { ...prev, participantIds: ids };
    });
  };

  return (
    <div className="anim-fadeIn">
      <Topbar 
        left={
          <div className="topbar-left">
            <button className="btn btn-ghost btn-icon" onClick={onBack}><Ic name="back" size={16} /></button>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${group.color}22`, display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${group.color}44`, color: group.color }}>
              <Ic name="users" size={16} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div className="topbar-title">{group.name}</div>
              <div className="topbar-sub">Leader Dashboard · {user.name}</div>
            </div>
          </div>
        }
        dark={dark} setDark={setDark}
        context={group.name}
        onLogout={onBack}
        verify={(val) => val === user.pin}
      />

      {/* Persistent Smart Filter Bar */}
      <div style={{ background: dark ? "rgba(255,255,255,0.02)" : "white", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, position: "sticky", top: 56, zIndex: 90, padding: "10px 14px" }}>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2, scrollbarWidth: "none" }}>
          {["All", ...CATS].map(cat => {
            const active = catFilter === cat;
            const col = cat === "All" ? ACCENT : catColor[cat];
            return (
              <button key={cat} onClick={() => setCatFilter(cat)} className="btn btn-sm"
                style={{
                  flexShrink: 0,
                  background: active ? col : (dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                  color: active ? "white" : (dark ? "#9ca3af" : "#6b7280"),
                  boxShadow: active ? `0 4px 12px ${col}44` : "none",
                  border: active ? "none" : `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                  fontWeight: 700, padding: "7px 14px"
                }}>
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <main className="page" style={{ paddingTop: 20 }}>
        {/* Actions Grid */}
        <div className="grid-2 anim-fadeUp" style={{ marginBottom: 28 }}>
          <div className="card" style={{ padding: 20, textAlign: "center", cursor: "pointer", borderBottom: `4px solid ${ACCENT}` }} onClick={() => setStuModal(true)}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(108,99,255,0.12)", color: ACCENT, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Ic name="plus" size={20} />
            </div>
            <div className="ff-display fw-800" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5 }}>New Student</div>
          </div>
          <div className="card" style={{ padding: 20, textAlign: "center", cursor: "pointer", borderBottom: `4px solid #22d3ee` }} onClick={() => openReg()}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(34,211,238,0.12)", color: "#22d3ee", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Ic name="book" size={20} />
            </div>
            <div className="ff-display fw-800" style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5 }}>Register Event</div>
          </div>
        </div>

        {/* Dynamic Lists */}
        <section className="anim-fadeUp stagger-2" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div className="live-dot" />
            <h2 className="ff-display fw-800" style={{ fontSize: 18 }}>Team Members</h2>
            <span className="text-muted" style={{ fontSize: 13 }}>({filtStudents.length})</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtStudents.map((s, i) => (
              <div key={s.id} className="card" style={{ padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: catColor[s.category], opacity: 0.8, width: 34, textAlign: "center", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>{s.chestNo}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{s.name}</div>
                    <span className={`badge badge-${s.category === "Sub-Junior" ? "sj" : s.category.toLowerCase()}`} style={{ fontSize: 9, padding: "1px 7px", marginTop: 4 }}>{s.category}</span>
                  </div>
                </div>
                <button className="btn btn-ghost btn-icon btn-sm" onClick={() => deleteStudent(s.id)}><Ic name="trash" size={13} /></button>
              </div>
            ))}
            {filtStudents.length === 0 && (
              <div className="card" style={{ padding: 30, textAlign: "center", opacity: 0.6 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>👥</div>
                <div style={{ fontSize: 13 }}>No students in {catFilter} category</div>
              </div>
            )}
          </div>
        </section>

        <section className="anim-fadeUp stagger-3">
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div className="live-dot" style={{ background: "#f472b6" }} />
            <h2 className="ff-display fw-800" style={{ fontSize: 18 }}>Event Registrations</h2>
            <span className="text-muted" style={{ fontSize: 13 }}>({filtRegs.length})</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtRegs.map((r, i) => {
              const p = programs.find(pg => pg.id === r.programId);
              const parts = r.participantIds.map(id => groupStudents.find(s => s.id === id)).filter(Boolean);
              return (
                <div key={r.id} className="card" style={{ padding: 18 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                    <div>
                      <div className="ff-display fw-800" style={{ fontSize: 16, marginBottom: 4 }}>{p?.name}</div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <span className={`badge badge-${p?.category === "Sub-Junior" ? "sj" : p?.category.toLowerCase()}`} style={{ fontSize: 9 }}>{p?.category}</span>
                        <span className={`badge badge-${p?.type.toLowerCase()}`} style={{ fontSize: 9 }}>{p?.type}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openReg(r)}><Ic name="edit" size={13} /></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => setDelConfirm(r.id)}><Ic name="trash" size={13} /></button>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {parts.map(s => (
                      <div key={s.id} className="chip" style={{ background: `${catColor[s.category]}15`, color: catColor[s.category], border: `1px solid ${catColor[s.category]}25` }}>
                        <span style={{ fontSize: 10, fontWeight: 800 }}>{s.chestNo}</span> {s.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            {filtRegs.length === 0 && (
              <div className="card" style={{ padding: 30, textAlign: "center", opacity: 0.6 }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>🎭</div>
                <div style={{ fontSize: 13 }}>No registrations in {catFilter} category</div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Add Student Modal */}
      {stuModal && (
        <Modal title="Add Team Member" onClose={() => setStuModal(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label className="label">Full Name</label>
              <input type="text" className="input" placeholder="e.g. John Doe" value={stuForm.name} onChange={e => setStuForm({ ...stuForm, name: e.target.value })} autoFocus />
            </div>
            <div>
              <label className="label">Category</label>
              <div className="grid-3">
                {CATS.map(c => (
                  <button key={c} className="btn" onClick={() => setStuForm({ ...stuForm, category: c })}
                    style={{
                      background: stuForm.category === c ? catColor[c] : (dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"),
                      color: stuForm.category === c ? "white" : (dark ? "#9ca3af" : "#6b7280"),
                      fontWeight: 700, fontSize: 11,
                    }}>{c}</button>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", height: 48, marginTop: 10 }} onClick={saveStudent}>
              <Ic name="plus" size={16} />Add to Team
            </button>
          </div>
        </Modal>
      )}

      {/* Registration Modal */}
      {regModal && (
        <Modal title={editTarget ? "Edit Registration" : "Event Registration"} onClose={() => setRegModal(false)} wide>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div>
              <label className="label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span>Selected Category</span>
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div className="chip" style={{ background: catFilter === "All" ? "rgba(108,99,255,0.15)" : `${catColor[catFilter]}15`, color: catFilter === "All" ? ACCENT : catColor[catFilter], padding: "8px 16px", borderRadius: 12, fontWeight: 800, flex: 1, justifyContent: "center", border: `1px solid ${catFilter === "All" ? ACCENT : catColor[catFilter]}30` }}>
                  {catFilter === "All" ? "Select a category on home screen to filter programs" : catFilter}
                </div>
              </div>
            </div>

            <div>
              <label className="label">Select Program</label>
              <select className="input select" value={regForm.programId} onChange={e => setRegForm({ programId: e.target.value, participantIds: [] })}>
                <option value="">Choose an event...</option>
                {programs
                  .filter(p => catFilter === "All" || p.category === catFilter)
                  .map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))
                }
              </select>
              {regForm.programId && selectedProg && (
                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  <span className={`badge badge-${selectedProg.type.toLowerCase()}`}>{selectedProg.type}</span>
                  <span className="chip" style={{ background: "rgba(108,99,255,0.1)", color: ACCENT }}>Max {selectedProg.maxParticipants}</span>
                </div>
              )}
            </div>

            {regForm.programId && (
              <div className="anim-fadeIn">
                <label className="label">Select Participant(s)</label>
                <div className="tbl-wrap" style={{ maxHeight: 240 }}>
                  {groupStudents.filter(s => s.category === selectedProg?.category).map(s => {
                    const active = isSelected(s.id);
                    return (
                      <div key={s.id} onClick={() => togglePart(s.id)} style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: active ? (dark ? "rgba(108,99,255,0.15)" : "rgba(108,99,255,0.08)") : "transparent", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, transition: "all 0.2s" }}>
                        <div style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${active ? ACCENT : (dark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)")}`, background: active ? ACCENT : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          {active && <Ic name="check" size={14} color="white" />}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ color: ACCENT, fontSize: 12 }}>#{s.chestNo}</span>
                            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                          </div>
                        </div>
                        <span className={`badge badge-${s.category === "Sub-Junior" ? "sj" : s.category.toLowerCase()}`} style={{ fontSize: 9 }}>{s.category}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1, height: 46 }} onClick={() => setRegModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 2, height: 46 }} onClick={saveReg} disabled={!regForm.programId || regForm.participantIds.length === 0}>
                <Ic name="check" size={16} />{editTarget ? "Update" : "Register Now"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {delConfirm && (
        <div className="modal-bg" onClick={() => setDelConfirm(null)}>
          <div className="modal" style={{ maxWidth: 320, textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 16, background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ef4444", margin: "0 auto 16px" }}>
              <Ic name="trash" size={24} />
            </div>
            <div className="ff-display fw-800" style={{ fontSize: 18, marginBottom: 8 }}>Delete Registration?</div>
            <div className="text-muted" style={{ fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
              This will remove the registration permanentally.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setDelConfirm(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1, background: "#ef4444", color: "white" }} onClick={() => { 
                const r = registrations.find(x => x.id === delConfirm);
                const p = programs.find(pg => pg.id === r?.programId);
                setRegistrations(prev => prev.filter(r => r.id !== delConfirm)); 
                logActivity(user.name, "Deleted registration", `${p?.name} for ${group.name}`);
                setDelConfirm(null); 
              }}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderPortal;
