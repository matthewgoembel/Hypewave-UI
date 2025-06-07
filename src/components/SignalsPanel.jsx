// src/components/SignalsPanel.jsx
import { useEffect, useRef, useState } from "react";
import API_BASE_URL from "../config";

export default function SignalsPanel() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchSignals = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/signals/latest`);
      const data = await res.json();
      setSignals(data.live_alerts || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch signals", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
    const interval = setInterval(fetchSignals, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [signals]);

  return (
    <div className="flex flex-col h-full px-4 py-4 rounded bg-base shadow-xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-primary/80 text-med font-semibold">Trade Signals</h2>
        <button
          onClick={fetchSignals}
          className="text-sm px-1 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded"
        >
          Refresh
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-primary text-sm">Loading...</div>
        ) : signals.length === 0 ? (
          <div className="text-sm text-primary/50">No signals found</div>
        ) : (
          signals.map((s, idx) => {
            const output = s.output || {};
            return (
              <div
                key={idx}
                className="bg-panel p-3 rounded-md border border-primary/20 shadow text-sm text-white"
              >
                <div className="text-xs text-primary/60 mb-1">
                  {new Date(s.created_at).toLocaleString()}
                </div>
                <div className="text-white">{output.result}</div>
                <div className="text-xs text-gray-400">
                  {output.source || "Unknown Source"} · {output.timeframe || "N/A"}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
