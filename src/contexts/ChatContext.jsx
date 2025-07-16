import { createContext, useState } from "react";

// Create the context object
export const ChatContext = createContext();

/**
 * ChatProvider wraps your app and provides:
 * - messages: array of last messages
 * - addMessage(): adds a new message
 * - clearMessages(): clears the chat history
 */
export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);

  const addMessage = (message) => {
    setMessages((prev) => {
      const updated = [...prev, message];
      if (updated.length > 20) updated.shift();
      return updated;
    });
  };

  const clearMessages = () => setMessages([]);

  return (
    <ChatContext.Provider value={{ messages, addMessage, clearMessages }}>
      {children}
    </ChatContext.Provider>
  );
}
