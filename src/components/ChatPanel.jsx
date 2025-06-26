import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import API_BASE_URL from "../config";

export default function ChatPanel() {
  const [input, setInput] = useState("");
  const [selectedModel, setSelectedModel] = useState("s1");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snipping, setSnipping] = useState(false);
  const overlayRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!snipping) return;

    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0,0,0,0.3)";
    overlay.style.cursor = "crosshair";
    overlay.style.zIndex = 9999;
    document.body.appendChild(overlay);
    overlayRef.current = overlay;

    const selection = document.createElement("div");
    selection.style.position = "absolute";
    selection.style.border = "2px solid #3dadff";
    selection.style.background = "rgba(61,173,255,0.2)";
    overlay.appendChild(selection);

    let startX, startY;

    const handleMouseDown = (e) => {
      startX = e.clientX;
      startY = e.clientY;
      console.log("Snip started at:", startX, startY); // <-- Add this
    };

    const handleMouseMove = (e) => {
      if (startX === undefined || startY === undefined) return;
      const width = Math.abs(e.clientX - startX);
      const height = Math.abs(e.clientY - startY);
      const left = Math.min(e.clientX, startX);
      const top = Math.min(e.clientY, startY);
      Object.assign(selection.style, {
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`
      });
    };

    const handleMouseUp = async () => {
      console.log("Snip released");

      const rect = selection.getBoundingClientRect();
      overlay.remove();
      setSnipping(false);

      // ✅ Prevent zero-size snips
      if (rect.width === 0 || rect.height === 0) {
        alert("Please drag to select a valid area.");
        return;
      }

      try {
        const fullCanvas = await html2canvas(document.body, {
          backgroundColor: null,
          useCORS: true,
          scrollX: -window.scrollX,
          scrollY: -window.scrollY,
        });

        const croppedCanvas = document.createElement("canvas");
        croppedCanvas.width = rect.width;
        croppedCanvas.height = rect.height;

        const ctx = croppedCanvas.getContext("2d");
        ctx.drawImage(
          fullCanvas,
          rect.left,
          rect.top,
          rect.width,
          rect.height,
          0,
          0,
          rect.width,
          rect.height
        );

        croppedCanvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "snip.png", { type: "image/png" });
            const preview = URL.createObjectURL(file);
            setImage(file);
            setPreviewUrl(preview);
          }
        });
      } catch (error) {
        console.error("Snip error:", error);
        alert("Something went wrong while snipping. Try again.");
      }
    };

    overlay.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [snipping]);

  useEffect(() => {
    // optional cleanup AFTER timeout, to avoid revoking too early
    const timeout = setTimeout(() => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    }, 10000); // wait 10s before cleanup

    return () => clearTimeout(timeout);
  }, [previewUrl]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input, imageUrl: previewUrl }, // ✅ store only the URL
      { role: "ai", type: "loading" }
    ]);
    setInput("");
    setImage(null);
    setPreviewUrl(null);


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
      {messages.length === 0 && (
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

      <div className="relative mb-4 px-4">
        <div className="relative inline-block w-max">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 text-sm text-white/90 hover:text-white transition-opacity"
          >
            <span>Hype Engine – {selectedModel}</span>
            <svg
              className={`w-4 h-4 transform transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 top-full mt-1 bg-[#0a1e3a]/90 border border-white/10 rounded shadow-md z-50 w-52">
              {["h3", "s2", "s1"].map((key) => (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedModel(key);
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-[#143b65] text-white text-sm cursor-pointer transition-colors"
                >
                  {key === "h3" ? "h3 (Pro)" : key === "s2" ? "s2 (Plus)" : "s1"}
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
            className={`p-3 rounded text-sm whitespace-pre-wrap shadow-sm transition-all duration-150 ${m.role === "user" ? "bg-panel text-white" : "bg-chat text-primary"}`}
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
            className="text-sm text-white bg-blue-700 hover:bg-blue-700 px-3 py-1 rounded"
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
