// src/components/Tabs.jsx
import React, { useEffect, useState } from "react";

const tabs = [
  {
    key: "signals",
    label: "Signals",
    gif: "/signals_tab.gif",
    png: "/signals_tab_static.png",
  },
  {
    key: "chat",
    label: "Assistant",
    gif: "/chat_tab.gif",
    png: "/chat_tab_static.png",
  },
  {
    key: "news",
    label: "News",
    gif: "/news_tab.gif",
    png: "/news_tab_static.png",
  },
];

export default function Tabs({ active, setTab, unseen }) {
  const [hovered, setHovered] = useState(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative w-full h-24 bg-panel border-t border-primary/30 flex items-end justify-around px-4">
      <div className="absolute top-1/2 left-4 right-4 h-12 -translate-y-1/2 bg-blue-500/10 border border-blue-500/20 rounded-xl z-0" />

      {tabs.map((t) => {
        const isActive = active === t.key;
        const isCenter = t.key === "chat";
        const iconSrc = isActive || hovered === t.key ? t.gif : t.png;

        return (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className="flex flex-col items-center justify-end z-10"
          onMouseEnter={() => setHovered(t.key)}
          onMouseLeave={() => setHovered(null)}
        >
          <img
            src={iconSrc}
            alt={t.label}
            className={`
              ${isCenter ? "w-32 h-32 -mb-[34px]" : "w-32 h-32 -mb-9"}
              object-contain z-10
              transition-transform duration-200
              ${isActive ? "scale-110" : "scale-100"}
            `}
          />
          
          {/* Label with badge inline */}
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-white">{t.label}</span>
            {unseen?.[t.key] > 0 && (
              <div className="w-3 h-3 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {unseen[t.key]}
              </div>
            )}
          </div>
        </button>
      );

      })}
    </div>
  );
}
