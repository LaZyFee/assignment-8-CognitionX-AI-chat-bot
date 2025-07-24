"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export default function InitialForm() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      });
      const data = await res.json();
      router.push(`/conversation/${data.conversationId}`);
    } catch (error) {
      console.error("Error sending prompt:", error);
    }
  };

  const handleSuggestion = async (suggestion) => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: suggestion }),
      });
      const data = await res.json();
      router.push(`/conversation/${data.conversationId}`);
    } catch (error) {
      console.error("Error sending suggestion:", error);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 mb-8 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 opacity-80"></div>
        </div>
        <h1 className="text-4xl font-semibold text-gray-800 mb-2">Hi there</h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          How can I help you today?
        </h2>
        <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
          I&apos;m a professional looking for an AI assistant that helps with
          their workflows, automates routine tasks, and gives valuable insights
          based on real-time data.
        </p>
        <div className="space-y-3 w-full max-w-2xl">
          <button
            onClick={() => handleSuggestion("Help me draft an email")}
            className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer text-left"
          >
            <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <span className="text-gray-700">
              It looks like you&apos;re writing an email, would you like help
              drafting it?
            </span>
          </button>
          <button
            onClick={() =>
              handleSuggestion("Generate a report on customer feedback")
            }
            className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer text-left"
          >
            <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <span className="text-gray-700">
              Generate a report on customer feedback for the last 3 months.
            </span>
          </button>
          <button
            onClick={() => handleSuggestion("Analyze sales performance")}
            className="w-full flex items-center space-x-3 p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all cursor-pointer text-left"
          >
            <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0" />
            <span className="text-gray-700">
              Analyze this month&apos;s sales performance
            </span>
          </button>
        </div>
      </div>
      <div className="p-6 border-t border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <input
              type="text"
              placeholder="Ask me Anything"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-4 pr-20 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
            </div>
          </div>
          <div className="flex items-end justify-end mt-3">
            <div className="flex items-end space-x-4">
              <span className="text-sm text-gray-500">
                {prompt.length}/1000
              </span>
              <button
                type="submit"
                className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors cursor-pointer"
              >
                <span className="text-sm">Send</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
