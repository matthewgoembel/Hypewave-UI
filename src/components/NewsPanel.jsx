import { useEffect, useRef, useState } from "react";
import API_BASE_URL from "../config";

export default function NewsPanel() {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/news/latest`);
      const data = await res.json();
      setTweets(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch tweets", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
    const interval = setInterval(fetchTweets, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [tweets]);

  return (
    <div className="flex flex-col h-full px-4 py-4 rounded bg-base shadow-xl">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm text-white/90 tracking-wide">News & Alpha</h2>
        </div>
        <button
          onClick={fetchTweets}
          className="text-xs px-3 py-1 bg-primary/20 hover:bg-primary/30 text-white/80 rounded"
        >
          Refresh
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col justify-end space-y-4 pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-primary text-sm">Loading...</div>
        ) : tweets.length === 0 ? (
          <div className="text-sm text-white/50">No messages found</div>
        ) : (
          [...tweets].reverse().map((news, idx) => (
          <div key={idx} className="bg-panel p-3 rounded shadow text-white border border-primary/20">
            {/* Top Row: Channel Icon + Name + Timestamp */}
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center space-x-2">
                <img
                  src={`/${news.source}.png`} // 👈 Image based on source (must exist in /public)
                  alt={news.source}
                  className="w-6 h-6 rounded-full border border-gray-600"
                  onError={(e) => (e.target.style.display = 'none')}
                />
                <span className="text-sm text-sky-300 font-semibold">@{news.source}</span>
              </div>
              <span className="text-xs text-primary/60">
                {new Date(news.timestamp).toLocaleString()}
              </span>
            </div>

            {/* Message Text */}
            <div className="text-sm font-medium text-white/90 whitespace-pre-wrap mb-2">
              {news.text}
            </div>

            {/* Optional Image if media_url exists */}
            {news.media_url && (
            <img
              src={news.media_url}
              alt="Telegram media"
              className="rounded max-h-48 object-cover mb-2"
              onError={(e) => (e.target.style.display = "none")}
            />
          )}

            {/* Telegram link */}
            <a
              href={`tg://resolve?domain=${news.source}&post=${news.link.split("/").pop()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-sky-400 hover:underline mt-1 block"
            >
              View in Telegram
            </a>

          </div>
        ))
        )}
      </div>
    </div>
  );
}
