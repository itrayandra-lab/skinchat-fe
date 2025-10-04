import { useState } from "react";
import { useChatAPI } from "./hooks/useChatAPI";
import ChatContainer from "./components/ChatContainer";
import ChatInput from "./components/ChatInput";
import "./App.css";

const INITIAL_MESSAGE = {
  id: "welcome",
  role: "bot",
  content:
    "Halo! Saya Skin.Chat, asisten AI yang siap membantu Anda dengan pertanyaan seputar perawatan kulit dan produk Cosmetory. Apa yang ingin Anda tanyakan hari ini?",
};

function App() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [inputValue, setInputValue] = useState("");
  const { sendMessage, isSending } = useChatAPI();

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

    // Add user message and typing indicator
    setMessages((prev) => [...prev, userMessage, { id: "typing-indicator", role: "typing", content: "" }]);
    setInputValue("");

    // Send message and get response
    const botMessage = await sendMessage(trimmed);

    if (botMessage) {
      // Remove typing indicator and add bot response
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== "typing-indicator").concat(botMessage)
      );
    } else {
      // If there was an issue, still remove the typing indicator
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== "typing-indicator")
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800">
      <div className="max-w-4xl mx-auto p-5 flex flex-col gap-4">
        <header className="text-center">
          <h1 className="text-2xl font-bold">Skin.Chat</h1>
          <p>Asisten AI untuk perawatan kulit Anda</p>
        </header>
        <ChatContainer messages={messages} />
        <ChatInput
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          isSending={isSending}
        />
      </div>
    </div>
  );
}

export default App;
