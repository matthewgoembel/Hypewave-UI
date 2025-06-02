// src/components/SignalsPanel.jsx
import { useEffect, useRef, useState } from "react";

export default function SignalsPanel() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchSignals = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/signals/latest");
      const data = await res.json();
      setSignals(data.latest_signals || []);
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
        <h2 className="text-secondary text-lg font-semibold">Trade Signals</h2>
        <button
          onClick={fetchSignals}
          className="text-sm px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded"
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
          signals.map((s, idx) => (
            <div
              key={idx}
              className="bg-panel p-3 rounded-md border border-primary/20 shadow text-sm text-white"
            >
              <div className="text-xs text-primary/60 mb-1">
                {new Date(s.created_at).toLocaleString()}
              </div>
              <div>
                <b>Input:</b> {s.input?.input}<br />
                <b>Output:</b> {s.output?.result}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 
