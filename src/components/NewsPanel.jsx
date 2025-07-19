import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import API_BASE_URL from "../config";
import buttonAnimation from "../assets/hbutton.webm";
import { useNavigate } from "react-router-dom";


export default function NewsPanel() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUTC, setShowUTC] = useState(false);
  const [showTruthSocial, setShowTruthSocial] = useState(true);
  const scrollRef = useRef(null);
  const [dailyEvents, setDailyEvents] = useState([]);
  const [showDailyNews, setShowDailyNews] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const navigate = useNavigate();
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/news/latest`);
      const data = await res.json();
      setPosts(data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch posts", err);
      setLoading(false);
    }
  };

  const fetchDailyEvents = async () => {
    try {
      setLoadingEvents(true);
      const res = await fetch(`${API_BASE_URL}/forex/calendar/today`);
      const data = await res.json();
      setDailyEvents(data.events || []);
      setLoadingEvents(false);
    } catch (err) {
      console.error("Failed to fetch daily events", err);
      setLoadingEvents(false);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    fetchPosts();
    const interval = setInterval(fetchPosts, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [posts]);

  function linkifyText(text) {
    return text
      .replace(/(^|\s)(#[a-zA-Z0-9_]+)/g, "$1[$2](https://twitter.com/search?q=$2)")
      .replace(/(^|\s)(\$[a-zA-Z0-9_]+)/g, "$1[$2](https://twitter.com/search?q=$2)");
  }

  const postsToRender = showTruthSocial ? posts : posts.filter((p) => p.source !== "realDonaldTrump");
  const sortedPosts = [...postsToRender].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  const groupedPosts = [];
  for (const post of sortedPosts) {
    const last = groupedPosts[groupedPosts.length - 1];
    const ts = new Date(post.timestamp).toISOString().slice(0, 16);
    const lastTs = last ? new Date(last.timestamp).toISOString().slice(0, 16) : null;

    if (last && last.text === post.text && last.source === post.source && lastTs === ts) {
      if (
        post.media_url &&
        typeof post.media_url === "string" &&
        !last.media_urls.includes(post.media_url)
      ) {
        last.media_urls.push(post.media_url);
      }
    } else {
      groupedPosts.push({
        ...post,
        media_urls: post.media_url ? [post.media_url] : [],
      });
    }
  }

  return (
    <div className="flex flex-col h-full px-4 py-4 rounded bg-panel shadow-xl">
      <div className="flex justify-between items-center mb-3 px-3 py-2">
        <h2 className="text-medium text-white/90 font-semibold tracking-wide">News Alerts</h2>
        <div className="flex space-x-2 items-center">
          <div
            onClick={() => {
              navigate("/calendar");
            }}
            className="group relative cursor-pointer rounded-full"
            title="Open Economic Calendar"
          >
            <video
              src={buttonAnimation}
              autoPlay
              loop
              muted
              playsInline
              className="w-12 h-12 object-cover"
            />
          </div>
          <button onClick={() => setShowTruthSocial(!showTruthSocial)} className="p-0" title="Toggle Truth Social">
            <img
              src="/truth_social.png"
              alt="Truth Social"
              className={`w-8 h-8 transition-opacity ${showTruthSocial ? "opacity-100" : "opacity-50"}`}
            />
          </button>
          <button
            onClick={fetchPosts}
            className="text-xs px-3 py-1 bg-primary/20 hover:bg-primary/30 text-white/80 rounded"
          >
            Refresh
          </button>
          <button
            onClick={() => setShowUTC(!showUTC)}
            className="text-xs px-3 py-1 bg-primary/20 hover:bg-primary/30 text-white/80 rounded"
          >
            {showUTC ? "UTC" : "Local"}
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto flex flex-col space-y-0 pr-2 custom-scrollbar">
        {loading ? (
          <div className="text-primary text-sm">Loading...</div>
        ) : groupedPosts.length === 0 ? (
          <div className="text-sm text-white/50">No messages found</div>
        ) : (
          groupedPosts.map((news) => {
            const timestamp = new Date(news.timestamp.endsWith("Z") ? news.timestamp : news.timestamp + "Z");
            const formattedTime = showUTC
              ? timestamp.toLocaleString("en-US", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", hour12: true })
              : timestamp.toLocaleString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

            return (
              <div
                key={`${news.link}-${news.timestamp}-${news.media_urls?.length || 0}`}
                onClick={() => {
                  window.open(
                    news.source === "realDonaldTrump"
                      ? news.link
                      : `tg://resolve?domain=${news.source}&post=${news.link.split("/").pop()}`,
                    "_blank"
                  );
                }}
                className="cursor-pointer block px-4 pr-2 py-2 hover:bg-black/10 transition duration-150 ease-in-out"
              >
                <div className="flex space-x-3">
                  <img
                    src={`/${news.source}.png`}
                    alt={news.source}
                    className="w-8 h-8 rounded-full border border-gray-600 flex-shrink-0"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-white">{news.display_name}</span>
                      <span className="text-xs text-white/50">@{news.source}</span>
                      <span className="text-xs text-primary/60">{formattedTime}</span>
                    </div>
                    <div className="text-sm text-white/90 mt-0.5 prose prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => (
                            <a {...props} style={{ color: "#00a2ff" }} className="hover:underline" target="_blank" rel="noopener noreferrer" />
                          ),
                        }}
                      >
                        {linkifyText(news.text)}
                      </ReactMarkdown>
                    </div>
                    {Array.isArray(news.media_urls) && news.media_urls.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {news.media_urls
                          .filter((url) => typeof url === "string" && url.trim().length > 0)
                          .map((url, idx) => (
                            url.endsWith(".mp4") ? (
                              <video
                                key={idx}
                                src={url.startsWith("http") ? url : `${API_BASE_URL}${url}`}
                                controls
                                autoPlay
                                muted
                                loop
                                playsInline
                                className="rounded max-h-60 object-cover w-full"
                              />
                            ) : (
                              <img
                                key={idx}
                                src={url.startsWith("http") ? url : `${API_BASE_URL}${url}`}
                                alt="Media"
                                className="rounded max-h-60 object-cover"
                                onError={(e) => {
                                  console.log("Broken image:", url);
                                  e.target.style.display = "none";
                                }}
                              />
                            )
                          ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="-ml-3.5 -mr-2 border-b border-white/10 mt-2 -mb-2.5"></div>
              </div>
            );
          })
        )}
      </div>

      {showDailyNews && (
        <div className="absolute top-16 left-4 right-6 z-40 bg-panel border border-black rounded shadow-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-semibold">Today's Economic Events</h2>
            <button onClick={() => setShowDailyNews(false)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
          {loadingEvents ? (
            <div className="text-primary text-sm">Loading...</div>
          ) : dailyEvents.length === 0 ? (
            <div className="text-sm text-white/50">No events found.</div>
          ) : (
            <table className="w-full text-xs border-collapse">
              <thead className="border-b border-gray-600">
                <tr>
                  <th className="text-left py-1">Date</th>
                  <th className="text-left py-1">Time</th>
                  <th className="text-left py-1">Currency</th>
                  <th className="text-left py-1">Impact</th>
                  <th className="text-left py-1">Detail</th>
                  <th className="text-left py-1">Actual</th>
                  <th className="text-left py-1">Forecast</th>
                  <th className="text-left py-1">Previous</th>
                </tr>
              </thead>
              <tbody>
                {dailyEvents.map((e, idx) => (
                  <tr key={idx} className="border-b border-gray-700">
                    <td className="py-1">{e.date}</td>
                    <td className="py-1">{e.time}</td>
                    <td className="py-1">{e.currency}</td>
                    <td className="py-1">{e.impact}</td>
                    <td className="py-1">{e.detail}</td>
                    <td className="py-1">{e.actual}</td>
                    <td className="py-1">{e.forecast}</td>
                    <td className="py-1">{e.previous}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
