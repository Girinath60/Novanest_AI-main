import React, { useState } from 'react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { text: input, sender: 'user' }]);
      setInput('');
      // Simulate a response from the chatbot
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: 'This is a response from the chatbot.', sender: 'bot' },
        ]);
      }, 1000);
    }
  };

  return (
    <div>
      <button
        onClick={toggleChatbot}
        className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition duration-200"
      >
        💬
      </button>
      {isOpen && (
        <div className="fixed bottom-16 right-4 bg-white w-80 h-96 shadow-lg rounded-lg flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 p-2 rounded-lg ${
                  message.sender === 'user' ? 'bg-blue-100 self-end' : 'bg-gray-100 self-start'
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSend}
              className="mt-2 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;