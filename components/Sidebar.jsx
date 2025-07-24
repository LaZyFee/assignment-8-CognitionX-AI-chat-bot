"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MessageCircle, Edit, Trash2 } from "lucide-react";

export default function Sidebar() {
  const [conversations, setConversations] = useState([]);
  const router = useRouter();

  useEffect(() => {
    async function fetchConversations() {
      try {
        const res = await fetch("/api/chat");
        const data = await res.json();
        if (data.conversations) {
          setConversations(data.conversations);
        } else {
          setConversations([]);
        }
      } catch (error) {
        console.error("Error fetching conversations:", error);
        setConversations([]);
      }
    }
    fetchConversations();
  }, []);

  const handleDelete = async (id) => {
    try {
      await fetch(`/api/chat?conversationId=${id}`, { method: "DELETE" });
      setConversations(conversations.filter((conv) => conv._id !== id));
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleEdit = async (id, newTitle) => {
    const title = prompt("Enter new title:", newTitle);
    if (title) {
      try {
        await fetch(`/api/chat`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ conversationId: id, title }),
        });
        setConversations(
          conversations.map((conv) =>
            conv._id === id ? { ...conv, title } : conv
          )
        );
      } catch (error) {
        console.error("Error editing conversation:", error);
      }
    }
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span className="font-semibold text-sm">CognitionX</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          <Link
            href="/"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Create Chat</span>
          </Link>
        </div>
        <div className="pt-4">
          <span className="text-gray-500 text-xs uppercase font-semibold mb-2">
            Conversations
          </span>
          <div className="space-y-1 mt-3">
            {Array.isArray(conversations) && conversations.length > 0 ? (
              conversations.map((conv) => (
                <div
                  key={conv._id}
                  className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Link
                    href={`/conversation/${conv._id}`}
                    className="flex-1 text-sm text-zinc-300"
                  >
                    {conv.title}
                  </Link>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(conv._id, conv.title)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(conv._id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No conversations yet</p>
            )}
          </div>
        </div>
      </nav>
      <div className="p-4 border-t border-gray-700 mt-auto">
        <div className="text-center space-y-2">
          <span className="text-xs text-gray-400">Powered by</span>
          <div className="flex items-center justify-center space-x-2">
            <Image src="/logo.svg" alt="Logo" width={120} height={120} />
          </div>
          <p className="text-xs text-gray-500">© 2025 All rights reserved</p>
        </div>
      </div>
    </div>
  );
}
