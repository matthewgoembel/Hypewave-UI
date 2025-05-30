// src/components/ChatPanel.jsx
import { useState } from "react";
import FlameLoader from "./FlameLoader";

export default function ChatPanel() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [droppedImage, setDroppedImage] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setDroppedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponse("");

    // Simulate GPT response
    setTimeout(() => {
      setResponse("Analyzed chart: Long setup confirmed ✅");
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      <div className="flex-1 mb-4">
        <div className="text-sm text-gray-300 mb-2">Drop a chart or ask a question...</div>
        {droppedImage && (
          <img src={droppedImage} alt="Dropped Chart" className="mb-3 rounded border border-gray-700" />
        )}
        {loading ? (
          <FlameLoader />
        ) : (
          <p className="text-green-400 whitespace-pre-wrap">{response}</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          placeholder="Type your question..."
          className="flex-1 bg-[#1a1a1a] text-white border border-gray-600 p-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Ask
        </button>
      </form>
    </div>
  );
}