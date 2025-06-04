// src/components/Tabs.jsx
import React from "react";

const tabs = [
  { key: "signals", label: "Signals", icon: "/Signals_Tab.png" },
  { key: "chat", label: "Assistant", icon: "/transparent.gif" },
  { key: "news", label: "News", icon: "/News_Tab.png" },
];

export default function Tabs({ active, setTab }) {
  return (
    <div className="relative w-full h-24 bg-panel border-t border-primary/30 flex items-end justify-around px-4">
      {/* TRACK / STRIP */}
      <div className="absolute top-1/2 left-4 right-4 h-12 -translate-y-1/2 bg-blue-500/10 border border-blue-500/20 rounded-xl z-0" />

      {tabs.map((t) => {
        const isActive = active === t.key;
        const isCenter = t.key === "chat";

        const iconClass =
              (isCenter
                ? "w-32 h-32 -mb-[30px]" // flame pushed downward
                : "w-16 h-16 -mt-8") + // others lifted upward
              " object-contain transition-transform duration-200 " +
              (isActive ? "opacity-100 scale-110" : "opacity-80") +
              " z-10";



        return (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="flex flex-col items-center justify-end z-10"
          >
            <img src={t.icon} alt={t.label} className={iconClass} />
            <span className="text-xs mt-1 text-white">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
