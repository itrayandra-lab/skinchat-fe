import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';
import "./App.css";

const INITIAL_MESSAGE = {
  id: "welcome",
  role: "bot",
  content:
    "Halo! Saya Skin.Chat, asisten AI yang siap membantu Anda dengan pertanyaan seputar perawatan kulit dan produk Cosmetory. Apa yang ingin Anda tanyakan hari ini?",
};

const BOT_API_URL =
  "https://unincarnated-larissa-nonreciprocally.ngrok-free.dev/chat";
const DEFAULT_TOP_K = 3;

function App() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const TYPING_INDICATOR = {
    id: "typing-indicator",
    role: "typing",
    content: "",
  };
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed || isSending) {
      return;
    }

    const userMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage, TYPING_INDICATOR]);
    setInputValue("");
    setIsSending(true);

    try {
      const response = await fetch(BOT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: trimmed,
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

      setMessages((prev) =>
        prev.filter((msg) => msg.id !== "typing-indicator").concat(botMessage)
      );
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev.filter((msg) => msg.id !== "typing-indicator"),
        {
          id: `${Date.now()}-error`,
          role: "bot",
          content: "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto p-5 flex flex-col gap-4">
        <header className="text-center">
          <h1 className="text-2xl font-bold">Skin.Chat</h1>
          <p>Asisten AI untuk perawatan kulit Anda</p>
        </header>
        <section
          className="flex-1 min-h-[400px] max-h-[480px] overflow-y-auto border border-gray-300 p-3 bg-white rounded-lg flex flex-col gap-3"
          ref={chatContainerRef}
        >
          {messages.map((message) => {
            if (message.role === "typing") {
              return (
                <div
                  key={message.id}
                  className="p-3 rounded-lg bg-gray-200 text-gray-800 self-start typing-indicator"
                >
                  <div className="typing-dots">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              );
            } else {
              return (
                <div
                  key={message.id}
                  className={`p-3 rounded-lg text-sm leading-6 ${
                    message.role === "user"
                      ? "self-end bg-blue-600 text-white text-right"
                      : "self-start bg-gray-200 text-gray-800"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
                  {message.documents?.length ? (
                    <div className="mt-2 pl-3 border-l-2 border-gray-400 text-left">
                      <p className="font-semibold text-xs text-gray-600 mb-1">Referensi:</p>
                      <ul className="pl-4">
                        {message.documents.map((doc, index) => (
                          <li key={`${message.id}-doc-${index}`} className="text-xs text-gray-700 mb-1">
                            {doc.text}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              );
            }
          })}
        </section>
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <input
            type="text"
            name="message"
            placeholder="Ketik pertanyaan Anda di sini..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            autoComplete="off"
            disabled={isSending}
            className="flex-1 p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={isSending || !inputValue.trim()}
            className={`p-2.5 rounded-lg text-sm cursor-pointer transition-colors ${
              isSending || !inputValue.trim()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isSending ? "Mengirim..." : "Kirim"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
