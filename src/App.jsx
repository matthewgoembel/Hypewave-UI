import { useState } from "react";
import Tabs from "./components/Tabs";
import SignalsPanel from "./components/SignalsPanel";
import ChatPanel from "./components/ChatPanel";
import NewsPanel from "./components/NewsPanel";
import HypewaveLogoToggle from "./components/HypewaveLogoToggle";

export default function App() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("signals");

  if (!open) return <HypewaveLogoToggle onClick={() => setOpen(true)} />;

  return (
    <div className="w-[400px] h-screen bg-gradient-to-b from-[#0a0a1a] to-[#0d0d2a] text-white flex flex-col shadow-xl">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-[#101020]">
        <div className="flex items-center gap-2">
          <img src="https://api.dicebear.com/7.x/identicon/svg?seed=trader" className="w-6 h-6 rounded-full" />
          <span className="text-sm font-medium">Trader123</span>
        </div>
        <button className="text-gray-400 hover:text-white">⚙️</button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {tab === "signals" && <SignalsPanel />}
        {tab === "chat" && <ChatPanel />}
        {tab === "news" && <NewsPanel />}
      </div>
      <Tabs active={tab} setTab={setTab} />
    </div>
  );
}