import { createContext, useContext, useState, useEffect } from "react";

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
export const INITIAL_GROUPS = [
  { id: "g1", name: "Group 1", color: "#6c63ff" },
  { id: "g2", name: "Group 2", color: "#22d3ee" },
  { id: "g3", name: "Group 3", color: "#f472b6" },
];

export const INITIAL_USERS = [
  { id: "u-admin", name: "System Admin", role: "admin", pin: "admin" },
  { id: "u-l1", name: "Leader 1", role: "leader", pin: "123", groupId: "g1" },
  { id: "u-l2", name: "Leader 2", role: "leader", pin: "123", groupId: "g2" },
  { id: "u-l3", name: "Leader 3", role: "leader", pin: "123", groupId: "g3" },
];

export const INITIAL_PROGRAMS = [
  { id: "p1", name: "Western Music", category: "Senior", type: "Group", maxParticipants: 6, criteria: ["Rhythm", "Harmony"] },
  { id: "p2", name: "Classical Dance", category: "Junior", type: "Single", maxParticipants: 1, criteria: ["Grace", "Expression"] },
  { id: "p3", name: "Painting", category: "Sub-Junior", type: "Single", maxParticipants: 1, criteria: ["Creativity", "Technique"] },
  { id: "p4", name: "Drama", category: "Senior", type: "Group", maxParticipants: 8, criteria: ["Acting", "Direction"] },
];

export const INITIAL_STUDENTS = {
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

export const INITIAL_REGISTRATIONS = [];

const AppContext = createContext();
export const useApp = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [programs, setPrograms] = useState(() => {
    try {
      const saved = localStorage.getItem("ff_programs");
      return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
    } catch { return INITIAL_PROGRAMS; }
  });

  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem("ff_students");
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch { return INITIAL_STUDENTS; }
  });

  const [registrations, setRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem("ff_registrations");
      return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
    } catch { return INITIAL_REGISTRATIONS; }
  });

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem("ff_users");
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch { return INITIAL_USERS; }
  });

  const [activityLogs, setActivityLogs] = useState(() => {
    try {
      const saved = localStorage.getItem("ff_logs");
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [groups] = useState(INITIAL_GROUPS);

  // ── Persistence ──
  useEffect(() => { localStorage.setItem("ff_programs", JSON.stringify(programs)); }, [programs]);
  useEffect(() => { localStorage.setItem("ff_students", JSON.stringify(students)); }, [students]);
  useEffect(() => { localStorage.setItem("ff_registrations", JSON.stringify(registrations)); }, [registrations]);
  useEffect(() => { localStorage.setItem("ff_users", JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem("ff_logs", JSON.stringify(activityLogs)); }, [activityLogs]);

  // ── Utilities ──
  const logActivity = (userName, action, details) => {
    const newLog = {
      id: "log-" + Date.now() + Math.random().toString(36).substr(2, 4),
      timestamp: new Date().toISOString(),
      userName,
      action,
      details
    };
    setActivityLogs(prev => [newLog, ...prev].slice(0, 500)); // Keep last 500
  };

  return (
    <AppContext.Provider value={{ 
      groups, 
      programs, setPrograms, 
      students, setStudents, 
      registrations, setRegistrations,
      users, setUsers,
      activityLogs, setActivityLogs,
      logActivity
    }}>
      {children}
    </AppContext.Provider>
  );
};
