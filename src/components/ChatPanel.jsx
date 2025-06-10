// src/components/ChatPanel.jsx
import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import API_BASE_URL from "../config";


export default function ChatPanel() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("s1"); // default model
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snipping, setSnipping] = useState(false);
  const overlayRef = useRef(null);
  const scrollRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input, image },
      { role: "ai", type: "loading" }
    ]);
    setInput("");
    setImage(null);
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);

    const formData = new FormData();
    formData.append("input", input);
    if (image) formData.append("image", image);

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.result) {
        throw new Error(data.error || "No response received.");
      }

      setMessages((prev) => {
        const updated = [...prev];
        const loadingIndex = updated.findIndex((m) => m.type === "loading");
        if (loadingIndex !== -1) {
          updated[loadingIndex] = { role: "ai", text: data.result };
        }
        return updated;
      });

      scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshot = () => {
    setSnipping(true);
  };

  const handleSnipStart = (e) => {
    const startX = e.clientX;
    const startY = e.clientY;

    const overlay = overlayRef.current;
    const selection = document.createElement("div");
    selection.style.position = "absolute";
    selection.style.border = "2px solid #3dadff";
    selection.style.background = "rgba(61,173,255,0.2)";
    overlay.appendChild(selection);

    const handleMouseMove = (moveEvent) => {
      const width = Math.abs(moveEvent.clientX - startX);
      const height = Math.abs(moveEvent.clientY - startY);
      const left = Math.min(moveEvent.clientX, startX);
      const top = Math.min(moveEvent.clientY, startY);

      selection.style.left = `${left}px`;
      selection.style.top = `${top}px`;
      selection.style.width = `${width}px`;
      selection.style.height = `${height}px`;
    };

    const handleMouseUp = async () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      const rect = selection.getBoundingClientRect();
      overlay.removeChild(selection);
      setSnipping(false);

      setTimeout(async () => {
        const canvas = await html2canvas(document.body, {
          x: rect.left,
          y: rect.top,
          width: rect.width,
          height: rect.height,
          backgroundColor: null,
          useCORS: true,
          scrollX: -window.scrollX,
          scrollY: -window.scrollY,
          windowWidth: document.body.scrollWidth,
          windowHeight: document.body.scrollHeight,
        });
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "snip.png", { type: "image/png" });
            setImage(file);
          }
        });
      }, 100);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const removeImage = () => setImage(null);
  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      setImage(droppedFiles[0]);
    }
  };
  const handleDragOver = (e) => e.preventDefault();

  return (
    <div
      className="flex flex-col h-full px-4 pt-4 pb-4 rounded bg-base shadow-xl"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {snipping && (
        <div
          ref={overlayRef}
          onMouseDown={handleSnipStart}
          className="fixed top-0 left-0 w-full h-full bg-black/30 z-50 cursor-crosshair"
        />
      )}

      <div className="relative mb-4 px-4">
        <div className="relative inline-block w-max">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 px-4 py-1.5 bg-[#12243c] hover:bg-[#0c1a2f] rounded-xl text-sm text-sky-200 shadow-md border border-sky-500/20 hover:shadow-sky-500/20 transition-all duration-200"
          >
            <span>Hype Engine – {selectedModel}</span>
            <svg
              className={`w-4 h-4 transform transition-transform ${
                dropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-2 bg-[#0a1e3a] border border-primary/30 rounded-lg shadow-lg z-50 w-52 animate-fade-in-down">
              {[
                { key: "h3", label: "h3 (Pro)" },
                { key: "s2", label: "s2 (Plus)" },
                { key: "s1", label: "s1" },
              ].map(({ key, label }) => (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedModel(key);
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-[#143b65] text-white text-sm cursor-pointer transition-colors"
                >
                  {label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>





      {image && (
        <div className="mb-3 flex items-center gap-2 bg-panel p-2 rounded border border-primary/30">
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="w-12 h-12 rounded object-cover"
          />
          <button
            onClick={removeImage}
            className="text-red-400 text-xs hover:text-red-500"
          >
            ✖ Remove
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 scrollable"
      >
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`p-3 rounded text-sm whitespace-pre-wrap shadow-sm transition-all duration-150 ${
              m.role === "user"
                ? "bg-panel text-white"
                : "bg-chat text-primary"
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

            {m.image && (
              <img
                src={URL.createObjectURL(m.image)}
                alt="uploaded chart"
                className="mb-2 rounded"
              />
            )}

            {m.type !== "loading" && (
              <div
                dangerouslySetInnerHTML={{ __html: m.text }}
                className="text-[#bfc9dc] leading-relaxed"
              ></div>
            )}


          </div>
        ))}
      </div>

      {error && <p className="text-red-400 text-sm mb-2">⚠️ {error}</p>}

      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-center border-t border-primary/30 pt-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything"
          className="flex-1 bg-panel text-white p-3 rounded resize-none placeholder-primary/70 focus:outline-none"
          rows={2}
        />

        <div className="flex flex-col gap-1">
          <label
            htmlFor="file-upload"
            className="text-sm px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded cursor-pointer"
          >
            🔗
          </label>
          <button
            type="button"
            onClick={handleScreenshot}
            className="text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          >
            📸
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="hidden"
          id="file-upload"
        />

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm rounded bg-primary hover:bg-[#61caff] text-white font-semibold disabled:opacity-40"
        >
          {loading ? "..." : "Ask"}
        </button>
      </form>
    </div>
  );
}
