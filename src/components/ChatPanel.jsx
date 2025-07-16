import { useRef, useState, useEffect, useContext } from "react";
import html2canvas from "html2canvas";
import API_BASE_URL from "../config";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChatContext } from "../contexts/ChatContext";
import { AuthContext } from "../contexts/AuthContext";

export default function ChatPanel() {
  
  const { messages, addMessage, clearMessages } = useContext(ChatContext);
  const { token, isAuthenticated } = useContext(AuthContext);
  const historyLoaded = useRef(false);

  

  if (isAuthenticated && !token) {
    return (
      <div className="flex items-center justify-center h-full text-primary">
        Loading chat...
      </div>
    );
  }
  
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("s1");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [error, setError] = useState(null);
  const [snipping, setSnipping] = useState(false);

  const overlayRef = useRef(null);
  const scrollRef = useRef(null);

  const isInputEmpty = input.trim().length === 0;

  // Scroll to bottom on messages update
  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

// Load chat history when logged in
  useEffect(() => {
  if (!isAuthenticated || !token) return;

  if (historyLoaded.current) return; // ✅ Already loaded, skip

  let isMounted = true;

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetch(`${API_BASE_URL}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load chat history");
      const data = await res.json();

      if (isMounted) {
        clearMessages();
        data.forEach((m) => {
          addMessage({
            role: m.role,
            text: m.text,
            timestamp: m.timestamp,
          });
        });
        historyLoaded.current = true; // ✅ Mark as loaded
      }
    } catch (err) {
      console.error("Error loading chat history:", err);
    } finally {
      if (isMounted) setLoadingHistory(false);
    }
  };

  loadHistory();

  return () => {
    isMounted = false;
  };
}, [isAuthenticated, token]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    addMessage({
      role: "user",
      text: input,
      imageUrl: previewUrl,
    });
    addMessage({
      role: "ai",
      type: "loading",
    });

    setInput("");
    setImage(null);
    setPreviewUrl(null);
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("input", input);
    if (image) formData.append("image", image);

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.result) {
        throw new Error(data.error || "No response received.");
      }

      // Remove the loading message and add real response
      clearMessages();
      addMessage({
        role: "ai",
        text: data.result,
      });

      scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshot = () => setSnipping(true);
  const removeImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      setImage(droppedFiles[0]);
      const preview = URL.createObjectURL(droppedFiles[0]);
      setPreviewUrl(preview);
    }
  };
  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      className="flex flex-col h-full px-4 pt-4 pb-4 rounded bg-base shadow-xl"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {loadingHistory && (
        <p className="text-primary text-sm mb-2">Loading chat history...</p>
      )}

      {messages.length === 0 && !loadingHistory && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain opacity-80 pointer-events-none z-0 rounded-lg"
        >
          <source src="/chat_bg.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 scrollable"
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded text-sm whitespace-pre-wrap shadow-sm transition-all duration-150 ${
              m.role === "user" ? "bg-panel text-white" : "bg-chat text-primary"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <strong className="text-xs opacity-60">
                {m.role === "user" ? "You" : "Hypewave"}
              </strong>
              {m.type === "loading" && (
                <img
                  src="/transparent.gif"
                  alt="loading..."
                  className="w-10 h-10 ml-2 animate-pulse"
                />
              )}
            </div>

            {m.imageUrl && (
              <img
                src={m.imageUrl}
                alt="uploaded chart"
                className="mb-2 rounded"
              />
            )}

            {m.type !== "loading" && (
              <>
                {m.role === "user" ? (
                  <div className="text-white/90 leading-relaxed whitespace-pre-wrap">
                    {m.text}
                  </div>
                ) : (
                  <div
                    className="text-white/90 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: m.text }}
                  />
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-2">⚠️ {error}</p>}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 border-t border-primary/30 pt-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything"
          className="flex-1 bg-panel text-white p-3 rounded resize-none placeholder-primary/70 focus:outline-none min-h-[3.5rem]"
          rows={2}
        />

        <div className="flex flex-col items-center gap-2">
          <button
            type="submit"
            disabled={loading}
            className="group flex items-center justify-center w-20 h-12"
          >
            <img
              src={isInputEmpty ? "/ask.gif" : "/ask_active.png"}
              alt="Ask"
              className="w-20 h-20 transition duration-200 group-hover:brightness-110 group-hover:drop-shadow-[0_0_6px_rgba(255,255,255,0.1)]"
            />
          </button>

          <div className="flex gap-2">
            <label
              htmlFor="file-upload"
              className="w-9 h-9 bg-[#143b65] hover:bg-[#1a4a7f] rounded flex items-center justify-center cursor-pointer transition"
            >
              <img src="/link.png" alt="Attach" className="w-8 h-8" />
            </label>

            <button
              type="button"
              onClick={handleScreenshot}
              className="w-9 h-9 bg-[#143b65] hover:bg-[#1a4a7f] rounded flex items-center justify-center transition"
            >
              <img src="/screenshot.png" alt="Screenshot" className="w-9 h-9" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
