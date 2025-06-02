// src/components/ChatPanel.jsx
import { useRef, useState } from "react";

export default function ChatPanel() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const formData = new FormData();
    formData.append("input", input);
    if (image) formData.append("image", image);

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok || !data.result) {
        throw new Error(data.error || "No response received.");
      }

      setMessages((prev) => [
        ...prev,
        { role: "user", text: input },
        { role: "ai", text: data.result },
      ]);
      setInput("");
      setImage(null);
      scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    } catch (err) {
      setError(err.message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScreenshot = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const track = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(track);
      const blob = await imageCapture.takePhoto();
      setImage(blob);
      track.stop();
    } catch (err) {
      console.error("Failed to capture screenshot", err);
    }
  };

  const removeImage = () => setImage(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      setImage(droppedFiles[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="flex flex-col h-full px-4 pt-4 pb-4 rounded bg-base shadow-xl"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-secondary text-lg font-semibold">Analyze your trade:</h2>
      </div>

      {image && (
        <div className="relative mb-3 rounded overflow-hidden border border-primary">
          <img
            src={URL.createObjectURL(image)}
            alt="chart"
            className="rounded w-full"
          />
          <button
            onClick={removeImage}
            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full w-6 h-6"
          >
            ×
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2 mb-4 custom-scrollbar"
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
            <strong className="block mb-1 text-xs opacity-60">
              {m.role === "user" ? "You" : "Hypewave"}
            </strong>
            {m.text}
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

        <label
          htmlFor="file-upload"
          className="text-sm px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded cursor-pointer"
        >
          🔗
        </label>
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
