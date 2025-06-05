import { useEffect, useRef } from "react";

export default function EmbeddedTweet({ tweetUrl }) {
  const containerRef = useRef(null);
  const tweetId = tweetUrl?.split("/status/")[1];

  useEffect(() => {
    if (!tweetId || !containerRef.current) return;

    const render = () => {
      if (!window.twttr || !window.twttr.widgets) return;

      containerRef.current.innerHTML = "";

      window.twttr.widgets
        .createTweet(tweetId, containerRef.current, {
          theme: "dark",
          align: "center",
          conversation: "none"
        })
        .then(() => console.log("✅ Tweet rendered:", tweetId))
        .catch((err) => console.error("❌ Failed to render tweet:", err));
    };

    // If script is already loaded
    if (window.twttr && window.twttr.widgets) {
      render();
    } else {
      const script = document.createElement("script");
      script.src = "https://platform.twitter.com/widgets.js";
      script.async = true;
      script.onload = render;
      document.body.appendChild(script);
    }
  }, [tweetId]);

  return (
    <div
      key={tweetUrl}
      ref={containerRef}
      className="bg-panel p-2 rounded-md shadow"
    />
  );
}
