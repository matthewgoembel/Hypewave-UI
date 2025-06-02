// src/components/Tabs.jsx
import React from "react";

const tabs = [
  { key: "signals", label: "Signals", icon: "/Signals_Tab.png", iconSize: "w-32 h-32" },
  { key: "chat",    label: "Assistant", icon: "/transparent.gif", iconSize: "w-54 h-54", bareIcon: true },
  { key: "news",    label: "News",    icon: "/News_Tab.png",   iconSize: "w-32 h-32" },
];

export default function Tabs({ active, setTab }) {
  return (
    <div className="flex justify-center items-end gap-0 bg-panel border-t border-primary/30 py-4 px-14 h-32 overflow-visible">
      {tabs.map((t) => {
        const isActive = active === t.key;
        // Apply Tailwind's scale utility to enlarge non-chat icons by 10%
        const iconClass = `${t.iconSize} object-contain block z-10 transform ${t.key !== 'chat' ? 'scale-150' : ''} ${t.key === 'chat' ? '-mb-16' : '-mb-8'}`;

        // Push the Signals/News wrapper down by 2rem (mt-8). Chat stays at default.
        const wrapperClass = `flex flex-col items-center justify-end relative ${
          t.key !== 'chat' ? 'mt-8' : ''
        }`;

        return (
          <div key={t.key} className={wrapperClass}>
            <button
              onClick={() => setTab(t.key)}
              className="relative flex items-center justify-center transition-all duration-200"
            >
              {!t.bareIcon && (
                <div
                  className={`absolute w-10 h-12 rounded-full ${
                    isActive ? "bg- ring-2 ring-transparent" : "bg-[#032d4d]/20"
                  }`}
                ></div>
              )}
              <div className="flex items-end justify-center overflow-none">
                <img src={t.icon} alt={t.label} className={iconClass} />
              </div>
            </button>
            <span className="text-[0.95rem] mt-4 text-white">{t.label}</span>
          </div>
        );
      })}
    </div>
  );
}
