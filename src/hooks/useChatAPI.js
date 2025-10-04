import { useState } from "react";

const BOT_API_URL = "https://unincarnated-larissa-nonreciprocally.ngrok-free.dev/chat";
const DEFAULT_TOP_K = 3;

export const useChatAPI = () => {
  const [isSending, setIsSending] = useState(false);

  const sendMessage = async (message) => {
    if (!message || isSending) {
      return null;
    }

    setIsSending(true);

    try {
      const response = await fetch(BOT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: message,
          top_k: DEFAULT_TOP_K,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        id: `${Date.now()}-bot`,
        role: "bot",
        content:
          typeof data?.answer === "string" && data.answer.trim()
            ? data.answer
            : "Maaf, saya tidak menerima jawaban dari server.",
        documents: Array.isArray(data?.retrieved_documents)
          ? data.retrieved_documents.filter(
              (doc) => typeof doc?.text === "string" && doc.text.trim()
            )
          : [],
      };

      return botMessage;
    } catch (error) {
      console.error("Error sending message:", error);
      return {
        id: `${Date.now()}-error`,
        role: "bot",
        content: "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
      };
    } finally {
      setIsSending(false);
    }
  };

  return { sendMessage, isSending };
};