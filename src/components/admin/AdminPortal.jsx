import { useState } from "react";
import { useApp } from "../../context/AppContext";
import Ic from "../common/Ic";
import { Topbar } from "../common/Topbar";
import Modal from "../common/Modal";
import PrintSection from "./PrintSection";
import { CATS, catColor, ACCENT } from "../../styles/DesignTokens";

const AdminPortal = ({ user, dark, setDark, onBack }) => {
  const { groups, programs, setPrograms, students, setStudents, registrations, users, setUsers, activityLogs, logActivity } = useApp();
  const [view, setView] = useState("students"); // students | programs | users | logs | print
  const [activeGroup, setActiveGroup] = useState(groups[0]?.id);
  const [progModal, setProgModal] = useState(false);
  const [editProg, setEditProg] = useState(null);
  const [progForm, setProgForm] = useState({ name: "", category: "Senior", type: "Single", maxParticipants: 1, criteria: ["", ""] });
  const [progFilter, setProgFilter] = useState("All");

  const [stuModal, setStuModal] = useState(false);
  const [stuForm, setStuForm] = useState({ name: "", category: "Senior" });
  
  const [userModal, setUserModal] = useState(false);
  const [userForm, setUserForm] = useState({ name: "", role: "leader", pin: "", groupId: groups[0]?.id });

  const catBase = { "Sub-Junior": 100, "Junior": 200, "Senior": 300 };

  const saveStudent = () => {
    if (!stuForm.name.trim()) return;
    const sId = "s-" + Math.random().toString(36).substr(2, 5);
    const catStus = (students[activeGroup] || []).filter(s => s.category === stuForm.category);
    const chest = catBase[stuForm.category] + catStus.length + 1;
    const newStudent = { id: sId, ...stuForm, chestNo: chest.toString() };
    setStudents(prev => ({ ...prev, [activeGroup]: [...(prev[activeGroup] || []), newStudent] }));
    
    const grp = groups.find(g => g.id === activeGroup);
    logActivity(user.name, "Added student", `${newStudent.name} (${newStudent.chestNo}) to ${grp?.name}`);
    
    setStuModal(false); setStuForm({ name: "", category: "Senior" });
  };

  const deleteStudent = (gId, sId) => {
    const s = (students[gId] || []).find(x => x.id === sId);
    if (registrations.some(r => r.groupId === gId && r.participantIds.includes(sId))) {
      alert("Cannot delete student with active registrations!");
      return;
    }
    setStudents(prev => ({ ...prev, [gId]: prev[gId].filter(s => s.id !== sId) }));
    if (s) {
      const grp = groups.find(g => g.id === gId);
      logActivity(user.name, "Deleted student", `${s.name} (${s.chestNo}) from ${grp?.name}`);
    }
  };

  const openAddProg = () => { setEditProg(null); setProgForm({ name: "", category: "Senior", type: "Single", maxParticipants: 1, criteria: ["", ""] }); setProgModal(true); };
  const openEditProg = (p) => { setEditProg(p.id); setProgForm(p); setProgModal(true); };
  
  const saveProg = () => {
    if (!progForm.name.trim()) return;
    if (editProg) {
      setPrograms(prev => prev.map(p => p.id === editProg ? { ...p, ...progForm } : p));
      logActivity(user.name, "Updated program", progForm.name);
    } else {
      const newP = { id: "p-" + Math.random().toString(36).substr(2, 5), ...progForm };
      setPrograms(prev => [...prev, newP]);
      logActivity(user.name, "Added program", progForm.name);
    }
    setProgModal(false);
  };

  const deleteProg = (id) => {
    const p = programs.find(x => x.id === id);
    if (registrations.some(r => r.programId === id)) {
      alert("Cannot delete program with active registrations!");
      return;
    }
    if (confirm("Delete this program?")) {
      setPrograms(prev => prev.filter(p => p.id !== id));
      if (p) logActivity(user.name, "Deleted program", p.name);
    }
  };

  const saveUser = () => {
    if (!userForm.name.trim() || !userForm.pin.trim()) return;
    const newU = { id: "u-" + Math.random().toString(36).substr(2, 5), ...userForm };
    setUsers(prev => [...prev, newU]);
    logActivity(user.name, "Created user", `${newU.name} (${newU.role})`);
    setUserModal(false); setUserForm({ name: "", role: "leader", pin: "", groupId: groups[0]?.id });
  };

  const deleteUser = (id) => {
    const u = users.find(x => x.id === id);
    if (u?.id === user.id) { alert("You cannot delete yourself!"); return; }
    if (confirm(`Delete user ${u?.name}?`)) {
      setUsers(prev => prev.filter(u => u.id !== id));
      logActivity(user.name, "Deleted user", u?.name);
    }
  };

  return (
    <div className="anim-fadeIn">
      <Topbar 
        left={
          <div className="topbar-left">
            <button className="btn btn-ghost btn-icon" onClick={onBack}><Ic name="back" size={16} /></button>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(139,92,246,0.3)", color: "#8b5cf6" }}>
              <Ic name="shield" size={16} />
            </div>
            <div>
              <div className="topbar-title">Central Admin</div>
              <div className="topbar-sub">{user.name} · FF Fest Control</div>
            </div>
          </div>
        }
        right={
          <div className="admin-nav" style={{ overflowX: "auto", maxWidth: "45vw", scrollbarWidth: "none" }}>
            <button className={`btn btn-sm ${view === "students" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("students")}>Students</button>
            <button className={`btn btn-sm ${view === "programs" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("programs")}>Programs</button>
            <button className={`btn btn-sm ${view === "users" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("users")}>Users</button>
            <button className={`btn btn-sm ${view === "logs" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("logs")}>Logs</button>
            <button className={`btn btn-sm ${view === "print" ? "btn-primary" : "btn-ghost"}`} onClick={() => setView("print")}>Print</button>
          </div>
        }
        dark={dark} setDark={setDark}
        context="Admin Mode"
        onLogout={onBack}
        isAdmin
        verify={(val) => val === user.pin}
      />

      <main className="page">
        {view === "students" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }} className="anim-slideDown">
              <div className="ff-display fw-800" style={{ fontSize: 18 }}>Manage Enrollment</div>
              <button className="btn btn-primary btn-sm" onClick={() => setStuModal(true)}><Ic name="plus" size={13} />Add Student</button>
            </div>

            <div className="group-tabs anim-fadeUp" style={{ marginBottom: 24 }}>
              {groups.map(g => (
                <button key={g.id} onClick={() => setActiveGroup(g.id)} className="btn"
                  style={{
                    background: activeGroup === g.id ? g.color : (dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"),
                    color: activeGroup === g.id ? "white" : (dark ? "#9ca3af" : "#6b7280"),
                    minWidth: 100, fontWeight: 700
                  }}>{g.name}</button>
              ))}
            </div>

            <div className="tbl-wrap anim-fadeUp stagger-2">
              <table className="tbl">
                <thead><tr><th>Chest</th><th>Name</th><th>Category</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
                <tbody>
                  {(students[activeGroup] || []).map((s, i) => (
                    <tr key={s.id}>
                      <td style={{ fontWeight: 800, color: ACCENT }}>{s.chestNo}</td>
                      <td style={{ fontWeight: 600 }}>{s.name}</td>
                      <td><span className={`badge badge-${s.category === "Sub-Junior" ? "sj" : s.category.toLowerCase()}`}>{s.category}</span></td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => deleteStudent(activeGroup, s.id)}><Ic name="trash" size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {view === "programs" && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }} className="anim-slideDown">
              <div className="ff-display fw-800" style={{ fontSize: 18 }}>Programs & Events</div>
              <button className="btn btn-primary btn-sm" onClick={openAddProg}><Ic name="plus" size={13} />Add Program</button>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none" }} className="anim-fadeUp">
              {["All", ...CATS].map(cat => {
                const active = progFilter === cat;
                const col = cat === "All" ? ACCENT : catColor[cat];
                return (
                  <button key={cat} onClick={() => setProgFilter(cat)} className="btn btn-sm"
                    style={{
                      flexShrink: 0,
                      background: active ? col : (dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
                      color: active ? "white" : (dark ? "#9ca3af" : "#6b7280"),
                      boxShadow: active ? `0 4px 12px ${col}44` : "none",
                      border: active ? "none" : `1px solid ${dark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}`,
                      fontWeight: 700, padding: "7px 14px",
                    }}>
                    {cat}
                  </button>
                );
              })}
            </div>

            {programs.filter(p => progFilter === "All" || p.category === progFilter).map((p, i) => {
              const progRegs = registrations.filter(r => r.programId === p.id);
              const allParts = progRegs.flatMap(r => {
                const grpStudents = students[r.groupId] || [];
                const grp = groups.find(g => g.id === r.groupId);
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
                  {allParts.length > 0 && (
                    <>
                      <div className="divider" />
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 0.8, textTransform: "uppercase", color: dark ? "#4b5563" : "#9ca3af", marginBottom: 8 }}>Registered Participants</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                        {allParts.map((s, j) => (
                          <div key={j} className="chip" style={{ background: `${s.groupColor}18`, color: s.groupColor, border: `1px solid ${s.groupColor}30` }}>
                            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 11 }}>{s.chestNo}</span> <span>{s.name}</span> <span style={{ opacity: 0.7, fontSize: 10 }}>· {s.groupName}</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </>
        )}

        {view === "users" && (
          <div className="anim-fadeUp">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div className="ff-display fw-800" style={{ fontSize: 18 }}>System Accounts</div>
              <button className="btn btn-primary btn-sm" onClick={() => setUserModal(true)}><Ic name="plus" size={13} />Add User</button>
            </div>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead><tr><th>Name</th><th>Role</th><th>Group / Scope</th><th style={{ textAlign: "right" }}>Actions</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 700 }}>{u.name}</td>
                      <td><span className={`badge badge-${u.role === "admin" ? "senior" : "junior"}`}>{u.role}</span></td>
                      <td style={{ fontSize: 13, color: dark ? "#9ca3af" : "#6b7280" }}>
                        {u.role === "admin" ? "Full Access" : (groups.find(g => g.id === u.groupId)?.name || "No Group")}
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => deleteUser(u.id)} disabled={u.id === user.id}><Ic name="trash" size={13} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === "logs" && (
          <div className="anim-fadeUp">
            <div className="ff-display fw-800" style={{ fontSize: 18, marginBottom: 20 }}>Activity Audit Trail</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {activityLogs.map((l, i) => (
                <div key={l.id} className="card" style={{ padding: "14px 18px", borderRadius: 0, border: "none", borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"}`, background: i % 2 === 0 ? "transparent" : (dark ? "rgba(255,255,255,0.01)" : "rgba(0,0,0,0.01)") }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <div style={{ fontWeight: 800, fontSize: 14, color: ACCENT }}>{l.action}</div>
                    <div style={{ fontSize: 10, color: dark ? "#4b5563" : "#9ca3af", fontWeight: 600 }}>{new Date(l.timestamp).toLocaleString()}</div>
                  </div>
                  <div style={{ fontSize: 13, marginBottom: 4 }}>{l.details}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: dark ? "#6b7280" : "#9ca3af" }}>By: {l.userName}</div>
                </div>
              ))}
              {activityLogs.length === 0 && <div className="card" style={{ padding: 40, textAlign: "center", opacity: 0.5 }}>No logs recorded yet.</div>}
            </div>
          </div>
        )}

        {view === "print" && <PrintSection dark={dark} />}
      </main>

      {/* Modal Definitions (Add Student, Add Program, Add User) */}
      {stuModal && (
        <Modal title="Add Student (Admin)" onClose={() => setStuModal(false)}>
           <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label className="label">Group</label>
              <select className="input select" value={activeGroup} onChange={e => setActiveGroup(e.target.value)}>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Student Name</label>
              <input type="text" className="input" placeholder="Name" value={stuForm.name} onChange={e => setStuForm({ ...stuForm, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Category</label>
              <div className="grid-3">
                {CATS.map(c => (
                  <button key={c} className="btn" onClick={() => setStuForm({ ...stuForm, category: c })}
                    style={{
                      background: stuForm.category === c ? catColor[c] : (dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"),
                      color: stuForm.category === c ? "white" : (dark ? "#9ca3af" : "#6b7280"),
                      fontWeight: 700, fontSize: 11
                    }}>{c}</button>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: "100%", height: 48, marginTop: 10 }} onClick={saveStudent}>Add Student</button>
          </div>
        </Modal>
      )}

      {progModal && (
        <Modal title={editProg ? "Edit Program" : "Add Program"} onClose={() => setProgModal(false)} wide>
          <div style={{ display: "grid", gap: 18 }}>
            <div className="form-row">
              <div>
                <label className="label">Program Name</label>
                <input type="text" className="input" value={progForm.name} onChange={e => setProgForm({ ...progForm, name: e.target.value })} placeholder="e.g. Solo Song" />
              </div>
              <div>
                <label className="label">Category</label>
                <select className="input select" value={progForm.category} onChange={e => setProgForm({ ...progForm, category: e.target.value })}>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div>
                <label className="label">Type</label>
                <select className="input select" value={progForm.type} onChange={e => setProgForm({ ...progForm, type: e.target.value })}>
                  <option value="Single">Single</option>
                  <option value="Group">Group</option>
                </select>
              </div>
              <div>
                <label className="label">Max Participants</label>
                <input type="number" className="input" value={progForm.maxParticipants} onChange={e => setProgForm({ ...progForm, maxParticipants: parseInt(e.target.value) || 1 })} />
              </div>
            </div>
            <div>
              <label className="label">Valuation Criteria</label>
              <div className="grid-2">
                <input type="text" className="input" placeholder="Criteria 1" value={progForm.criteria[0]} onChange={e => setProgForm({ ...progForm, criteria: [e.target.value, progForm.criteria[1]] })} />
                <input type="text" className="input" placeholder="Criteria 2" value={progForm.criteria[1]} onChange={e => setProgForm({ ...progForm, criteria: [progForm.criteria[0], e.target.value] })} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setProgModal(false)}>Cancel</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveProg}><Ic name="check" size={14} />{editProg ? "Update" : "Add Program"}</button>
            </div>
          </div>
        </Modal>
      )}

      {userModal && (
        <Modal title="Create Account" onClose={() => setUserModal(false)}>
           <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div>
              <label className="label">User Name</label>
              <input type="text" className="input" placeholder="e.g. Rahul" value={userForm.name} onChange={e => setUserForm({ ...userForm, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input select" value={userForm.role} onChange={e => setUserForm({ ...userForm, role: e.target.value })}>
                <option value="leader">Group Leader</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            {userForm.role === "leader" && (
              <div>
                <label className="label">Assign to Group</label>
                <select className="input select" value={userForm.groupId} onChange={e => setUserForm({ ...userForm, groupId: e.target.value })}>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            )}
            <div>
              <label className="label">Login PIN / Password</label>
              <input type="text" className="input" placeholder="3+ characters" value={userForm.pin} onChange={e => setUserForm({ ...userForm, pin: e.target.value })} />
            </div>
            <button className="btn btn-primary" style={{ width: "100%", height: 48, marginTop: 10 }} onClick={saveUser}>Create User</button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminPortal;
