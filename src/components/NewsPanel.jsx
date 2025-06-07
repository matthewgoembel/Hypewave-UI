import { useEffect, useRef, useState } from "react";
import EmbeddedTweet from "./EmbeddedTweet"; // 🟢 Required
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
          <h2 className="text-sm text-primary/80 font-semibold tracking-wide">News & Alpha</h2>
        </div>
        <button
          onClick={fetchTweets}
          className="text-xs px-3 py-1 bg-primary/20 hover:bg-primary/30 text-white/80 rounded"
        >
          Refresh
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-primary text-sm">Loading...</div>
        ) : tweets.length === 0 ? (
          <div className="text-sm text-white/50">No tweets found</div>
        ) : (
          tweets.map((tweet, idx) =>
            tweet.tweet_url ? (
              <EmbeddedTweet key={idx} tweetUrl={tweet.tweet_url} />
            ) : (
              <div key={idx} className="text-red-500 text-xs">Invalid tweet</div>
            )
          )
        )}
      </div>
    </div>
  );
}
