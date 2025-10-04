const ChatInput = ({ inputValue, setInputValue, handleSubmit, isSending }) => {
  return (
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
  );
};

export default ChatInput;