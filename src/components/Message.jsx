import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm';

const Message = ({ message }) => {
  if (message.role === "typing") {
    return (
      <div
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
};

export default Message;