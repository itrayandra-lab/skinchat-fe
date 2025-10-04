import { useEffect, useRef } from "react";
import Message from "./Message";

const ChatContainer = ({ messages }) => {
 const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section
      className="flex-1 min-h-[400px] max-h-[480px] overflow-y-auto border border-gray-300 p-3 bg-white rounded-lg flex flex-col gap-3"
      ref={chatContainerRef}
    >
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </section>
 );
};

export default ChatContainer;