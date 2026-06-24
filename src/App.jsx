import { useState, useEffect, useCallback } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import GlobalStyles from "./styles/GlobalStyles";
import SplashScreen from "./components/common/SplashScreen";
import LandingPage from "./components/landing/LandingPage";
import LeaderPortal from "./components/leader/LeaderPortal";
import AdminPortal from "./components/admin/AdminPortal";

const AppContent = () => {
  const { groups } = useApp();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // { id, name, role, groupId? }
  const [dark, setDark] = useState(() => localStorage.getItem("ff_dark") === "true");

  useEffect(() => {
    localStorage.setItem("ff_dark", dark);
  }, [dark]);

  const handleSplashDone = useCallback(() => setLoading(false), []);
  const handleLogin = useCallback((u) => setUser(u), []);
  const handleLogout = useCallback(() => setUser(null), []);

  if (loading) return <SplashScreen onDone={handleSplashDone} />;

  return (
    <>
      <GlobalStyles dark={dark} />
      {!user ? (
        <LandingPage 
          groups={groups} 
          dark={dark} 
          onLeaderLogin={handleLogin}
          onAdminClick={handleLogin}
        />
      ) : user.role === "leader" ? (
        <LeaderPortal 
          user={user}
          group={groups.find(g => g.id === user.groupId)} 
          dark={dark} 
          setDark={setDark} 
          onBack={handleLogout} 
        />
      ) : (
        <AdminPortal 
          user={user}
          dark={dark} 
          setDark={setDark} 
          onBack={handleLogout} 
        />
      )}
    </>
  );
};

const App = () => (
  <AppProvider>
    <AppContent />
  </AppProvider>
);

export default App;
