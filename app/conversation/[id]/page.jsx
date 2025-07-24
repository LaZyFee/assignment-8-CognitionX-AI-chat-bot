"use client";

import { useState, useEffect } from "react";
import Sidebar from "../../../components/Sidebar";
import ChatArea from "../../../components/ChatArea";
import { useParams } from "next/navigation";

export default function Conversation() {
  const { id } = useParams();
  const [messages, setMessages] = useState([]);
  const [conversationTitle, setConversationTitle] = useState("");

  useEffect(() => {
    async function fetchMessages() {
      try {
        console.log("Fetching messages for conversationId:", id);
        const res = await fetch(`/api/chat?conversationId=${id}`);
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setMessages(data.messages || []);
        setConversationTitle(data.conversation?.title || "Conversation");
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
    fetchMessages();
  }, [id]);

  return (
    <div className="flex h-screen mx-auto bg-white max-h-screen">
      <Sidebar />
      <ChatArea
        conversationId={id}
        messages={messages}
        setMessages={setMessages}
        title={conversationTitle}
      />
    </div>
  );
}
