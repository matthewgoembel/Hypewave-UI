// src/components/NewsPanel.jsx
import { useEffect, useRef, useState } from "react";

export default function NewsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/alerts/live");
      const data = await res.json();
      setAlerts(data.live_alerts || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [alerts]);

  return (
    <div className="flex flex-col h-full px-4 py-4 rounded bg-base shadow-xl">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-secondary text-lg font-semibold">News & Alpha</h2>
        <button
          onClick={fetchAlerts}
          className="text-sm px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded"
        >
          Refresh
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-primary text-sm">Loading...</div>
        ) : alerts.length === 0 ? (
          <div className="text-sm text-primary/50">No alerts found</div>
        ) : (
          alerts.map((a, idx) => (
            <div
              key={idx}
              className="bg-panel p-3 rounded-md border border-primary/20 shadow text-sm text-white"
            >
              <div className="text-xs text-primary/60 mb-1">
                {new Date(a.created_at).toLocaleString()}
              </div>
              <div>{a.output?.result}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
