import { useState, useEffect, useContext } from "react";
import Tabs from "./components/Tabs";
import SignalsPanel from "./components/SignalsPanel";
import ChatPanel from "./components/ChatPanel";
import NewsPanel from "./components/NewsPanel";
import HypewaveLogoToggle from "./components/HypewaveLogoToggle";
import { AnimatePresence, motion } from "framer-motion";
import { AuthContext } from "./contexts/AuthContext";
import LoginPage from "./components/LoginPage";
import ProfilePage from "./components/ProfilePage";

export default function App() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("chat");
  const [panelWidth, setPanelWidth] = useState(400);
  const [settingsHover, setSettingsHover] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [unseen, setUnseen] = useState({ signals: 0, news: 0 });

  const { user, isAuthenticated } = useContext(AuthContext);

  const minWidth = 300;
  const maxWidth = 600;

  const handleMouseDown = (e) => {
    e.preventDefault();
    const startX = e.clientX;

    const handleMouseMove = (e) => {
      const newWidth = Math.min(Math.max(e.clientX, minWidth), maxWidth);
      setPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setUnseen((prev) => ({ ...prev, [newTab]: 0 }));
  };

  // Simulate new data events
  useEffect(() => {
    const intervalSignals = setInterval(() => {
      if (tab !== "signals") {
        setUnseen((prev) => ({ ...prev, signals: prev.signals + 1 }));
      }
    }, 15000);

    const intervalNews = setInterval(() => {
      if (tab !== "news") {
        setUnseen((prev) => ({ ...prev, news: prev.news + 1 }));
      }
    }, 25000);

    return () => {
      clearInterval(intervalSignals);
      clearInterval(intervalNews);
    };
  }, [tab]);

  // 🚀 If not authenticated, show login screen full screen
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-[#061738] text-white">
        <LoginPage onClose={() => {}} />
      </div>
    );
  }

  if (!open) return <HypewaveLogoToggle onClick={() => setOpen(true)} />;

  return (
    <div
      className="fixed top-0 left-0 bottom-0 bg-gradient-to-b from-[#3dadff] to-[#011a5e] text-white flex flex-col shadow-xl overflow-hidden"
      style={{ width: `${panelWidth}px` }}
    >
      <div
        onMouseDown={handleMouseDown}
        className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-primary/50 hover:bg-primary/70 transition z-50"
      />

      <div className="flex items-center justify-between px-4 py-2 border-b border-[#0589eb] bg-[#061738]">
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition"
          onClick={() => setProfileOpen(true)}
        >
          <img
            src="https://api.dicebear.com/7.x/identicon/svg?seed=boardape"
            className="w-6 h-8 rounded-full"
          />
          <span className="text-sm font-medium">
            {isAuthenticated ? user?.email : "Hypewave_Guest"}
          </span>
        </div>

        <button
          className="hover:opacity-80 transition"
          onClick={() => setProfileOpen(true)}
          onMouseEnter={() => setSettingsHover(true)}
          onMouseLeave={() => setSettingsHover(false)}
        >
          <img
            src={settingsHover ? "/settings_hover.gif" : "/settings.png"}
            alt="Settings"
            className="w-10 h-10"
          />
        </button>
      </div>

      {/* Profile modal */}
      {profileOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-[#061738] border border-primary/20 rounded p-4 w-80 shadow-lg">
            <ProfilePage onClose={() => setProfileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 relative overflow-x-hidden">
        <AnimatePresence mode="wait">
          {tab === "signals" && (
            <motion.div
              key="signals"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <SignalsPanel />
            </motion.div>
          )}
          {tab === "chat" && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <ChatPanel />
            </motion.div>
          )}
          {tab === "news" && (
            <motion.div
              key="news"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <NewsPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Tabs active={tab} setTab={handleTabChange} unseen={unseen} />
    </div>
  );
}
