import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post('http://localhost:5001/api/chat', {
        messages: [...messages, userMessage],
      });

      const gptMessage = { role: 'assistant', content: response.data.reply };
      setMessages((prev) => [...prev, gptMessage]);
    } catch (error) {
      console.error('Error:', error);
    }

    setInput('');
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div>
      {/* Chat Icon */}
      <div
        className="fixed bottom-5 right-5 bg-blue-500 p-3 rounded-full cursor-pointer text-white shadow-lg"
        onClick={toggleChat}
      >
        💬
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 rounded-lg shadow-lg p-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-bold">Chat with PawGPT</h2>
              <button
                className="text-red-500 font-bold"
                onClick={toggleChat}
              >
                ✖
              </button> 
            </div>
            <div className="h-64 overflow-y-auto p-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-2 ${
                    msg.role === 'user' ? 'text-right text-blue-600' : 'text-left text-green-600'
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              ))}
              <div ref={messagesEndRef} /> {/* Scroll to bottom */}
            </div>
            <div className="flex items-center border-t pt-2">
              <input
                className="flex-1 border rounded p-2"
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message..."
              />
              <button
                className="ml-2 bg-blue-500 text-white p-2 rounded"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
