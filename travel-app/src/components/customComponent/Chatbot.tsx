"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
  const [messages, setMessages] = useState<{ id: number; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // modal open state

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    setLoading(true);

    setMessages((prev) => [...prev, { id: Date.now(), content: `You: ${userMessage}` }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await res.json();
      const reply = data.reply || "⚠️ Error: No reply.";

      setMessages((prev) => [...prev, { id: Date.now() + 1, content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), content: "⚠️ Error: Failed to fetch reply." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      <div className="fixed bottom-5 left-5 z-50 flex items-center space-x-2">
  {/* Label */}
  <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
    AI Assistant
  </span>

  {/* Button */}
  <button
    onClick={() => setIsOpen(true)}
    className="w-14 h-14 rounded-full bg-green-600 text-white text-xl shadow-xl flex items-center justify-center hover:bg-green-500 transition-all"
  >
    🤖
  </button>
</div>


      {/* Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
          {/* Modal content */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-11/12 max-w-md h-4/5 flex flex-col">
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              ×
            </button>

            {/* Chat messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="p-2 rounded-lg max-w-[80%] break-words bg-gray-100 text-gray-900 ml-0"
                  >
                    {msg.content}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="flex border-t p-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask me about Ethiopia..."
                className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm shadow-sm"
              />
              <button
                onClick={sendMessage}
                disabled={loading}
                className="ml-2 px-4 py-2 rounded-full bg-green-600 text-white text-sm font-semibold shadow hover:bg-green-500 transition-all disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
