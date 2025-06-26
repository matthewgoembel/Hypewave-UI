import { useEffect, useRef, useState } from "react";
import API_BASE_URL from "../config";

export default function SignalsPanel() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUTC, setShowUTC] = useState(false);
  const scrollRef = useRef(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/alerts/live?limit=50`);
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
        <h2 className="text-white/90 text-sm">Trade Signals</h2>
        <div className="flex space-x-2">
          <button
            onClick={fetchAlerts}
            className="text-sm px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowUTC(!showUTC)}
            className="text-sm px-2 py-1 bg-primary/20 hover:bg-primary/30 text-primary rounded"
          >
            {showUTC ? "UTC" : "Local"}
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-primary text-sm">Loading...</div>
        ) : alerts.length === 0 ? (
          <div className="text-sm text-primary/50">No alerts found</div>
        ) : (
          [...alerts].reverse().map((a, idx) => {
            const output = a.output || {};
            const rawTime = new Date(a.created_at);
            const adjustedTime = new Date(rawTime.getTime() - 4 * 60 * 60 * 1000); // EST offset

            const formattedTime = showUTC
              ? adjustedTime.toLocaleString('en-US', {
                  timeZone: 'UTC',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })
              : adjustedTime.toLocaleString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                });

            const resultText = output.result || "";

            let symbol = "Unknown";

            // fallback always triggered from .result string
            const match = output.result?.match(/\$([A-Z]+)/);
            if (match && match[1]) {
              symbol = match[1].toUpperCase();
            }

            const isBullish = /long|bullish/.test(resultText.toLowerCase());
            const isBearish = /short|bearish/.test(resultText.toLowerCase());
            console.log("FINAL SYMBOL:", symbol);

            return (
              <div
                key={idx}
                className="bg-panel p-3 rounded-md border border-primary/20 shadow text-sm text-white"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <img
                      src={`/${symbol}.png`}
                      alt={symbol}
                      className="w-6 h-6 rounded-full border border-gray-500"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                    <span className="font-bold text-sky-300">${symbol}</span>
                  </div>
                  <div className="text-xs text-primary/60">{formattedTime}</div>
                </div>

                <div className="text-white font-normal text-sm flex items-center space-x-2">
                  {isBullish && (
                    <img src="/bullish.png" alt="bullish" className="w-4 h-4" />
                  )}
                  {isBearish && (
                    <img src="/bearish.png" alt="bearish" className="w-4 h-4" />
                  )}
                  <span>{resultText}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
