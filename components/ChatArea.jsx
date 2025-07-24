"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Share, MoreHorizontal, Sparkles, ArrowRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ChatArea({
  conversationId,
  messages,
  setMessages,
  title,
}) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const scrollRef = useRef(null);
  const router = useRouter();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const trimmed = message.trim();
    if (!trimmed) {
      setErrorMessage("Message cannot be empty.");
      return;
    }
    if (trimmed.length > 1000) {
      setErrorMessage("Message is too long (max 1000 characters).");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, conversationId }),
      });

      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Bad Request. Please check your input.");
        } else if (res.status === 500) {
          throw new Error("Internal Server Error. Try again later.");
        } else {
          throw new Error(`Unexpected error (code: ${res.status})`);
        }
      }

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { role: "user", content: trimmed, timestamp: new Date() },
        { role: "assistant", content: data.response, timestamp: new Date() },
      ]);
      setMessage("");
    } catch (err) {
      setErrorMessage(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    if (typeof window === "undefined" || !conversationId) return;

    const url = `${window.location.origin}/conversation/${conversationId}`;
    try {
      await navigator.clipboard.writeText(url);
      alert("Conversation link copied!");
    } catch (err) {
      alert("Failed to copy link. Copy it manually.");
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="px-8 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLink}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Share className="w-5 h-5 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 flex flex-col p-8 overflow-y-auto space-y-6"
      >
        {messages.map((msg, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                msg.role === "user"
                  ? "bg-blue-500"
                  : "bg-gradient-to-r from-purple-500 to-pink-500"
              }`}
            >
              {msg.role === "user" ? "H" : "AI"}
            </div>
            <div className="flex-1">
              <div
                className={`rounded-2xl px-4 py-3 max-w-6xl ${
                  msg.role === "user"
                    ? "bg-gray-100"
                    : "bg-white border border-gray-200"
                }`}
              >
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => (
                      <p className="text-gray-800 mb-2" {...props} />
                    ),
                    ul: ({ node, ...props }) => (
                      <ul
                        className="list-disc ml-6 text-gray-800 mb-2"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => (
                      <ol
                        className="list-decimal ml-6 text-gray-800 mb-2"
                        {...props}
                      />
                    ),
                    li: ({ node, ...props }) => (
                      <li className="mb-1" {...props} />
                    ),
                    strong: ({ node, ...props }) => (
                      <strong className="font-semibold" {...props} />
                    ),
                    em: ({ node, ...props }) => (
                      <em className="italic" {...props} />
                    ),
                    code: ({ node, ...props }) => (
                      <code
                        className="bg-gray-100 px-1 rounded text-sm font-mono"
                        {...props}
                      />
                    ),
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
              <span className="text-xs text-gray-500 mt-1 block">
                {new Intl.DateTimeFormat("en-US", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                }).format(new Date(msg.timestamp))}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200">
        <form onSubmit={handleSubmit} aria-describedby="char-count">
          <div className="relative">
            <textarea
              rows={3}
              placeholder={loading ? "Thinking..." : "Ask me Anything"}
              value={message}
              disabled={loading}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              aria-label="Chat message input"
              className={`w-full p-4 pr-20 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                loading ? "bg-gray-100 text-gray-400 cursor-not-allowed" : ""
              }`}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
          </div>

          <div className="flex justify-between items-center mt-3">
            <span id="char-count" className="text-sm text-gray-500">
              {message.length}/1000
            </span>

            <div className="flex items-center space-x-4">
              {errorMessage && (
                <span className="text-sm text-red-500">{errorMessage}</span>
              )}
              <button
                type="submit"
                aria-label="Send message"
                disabled={loading}
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    <span className="text-sm">Send</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
