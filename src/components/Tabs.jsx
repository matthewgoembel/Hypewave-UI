// src/components/Tabs.jsx
import React from "react";
import FlameIcon from "./FlameIcon";

const tabs = [
  { key: "signals", label: "Signals", icon: "/Signals_tab.png" },
  { key: "chat", label: "Chat", icon: "/transparent.gif" },
  { key: "news", label: "News", icon: "/News_Tab.png" },
];

export default function Tabs({ active, setTab }) {
  return (
    <div className="flex justify-around bg-[#0d0d2a] text-xs border-t border-gray-700 py-2">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`flex flex-col items-center gap-1 transition-all ${
            active === t.key ? "text-blue-400" : "text-gray-500 hover:text-white"
          }`}
        >
          <img src={t.icon} alt={t.label} className="w-5 h-5" />
          <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}
