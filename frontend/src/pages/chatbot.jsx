import React, { useState } from 'react';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';
import { RiChat1Line } from 'react-icons/ri';
import axios from 'axios';
import './../styles/chatbot.css';
import tours from '../assets/data/tours';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "👋 Hello! Ask me about trips in Algeria. You can mention a city, price, or number of days." }
  ]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const lowerInput = input.toLowerCase();

    // 0. Weather Check
    if (lowerInput.includes("météo") || lowerInput.includes("weather") || lowerInput.includes("temps")) {
      let city = "Algiers";
      const words = lowerInput.split(' ');
      const cityKeywords = ["à", "at", "in", "en"];
      for (let i = 0; i < words.length; i++) {
        if (cityKeywords.includes(words[i]) && words[i+1]) {
          city = words[i+1];
          break;
        }
      }

      try {
        setMessages(prev => [...prev, userMessage, { sender: 'bot', text: `☁️ Checking weather for ${city}...` }]);
        setInput('');
        const res = await axios.get(`https://wttr.in/${city}?format=3`);
        setMessages(prev => [...prev.slice(0, -1), { sender: 'bot', text: `🌦️ Weather Report: ${res.data}` }]);
        return;
      } catch (err) {
        setMessages(prev => [...prev, { sender: 'bot', text: "❌ Sorry, I couldn't fetch the weather." }]);
        return;
      }
    }

    let foundTour = tours.find(tour =>
      lowerInput.includes(tour.city.toLowerCase()) ||
      lowerInput.includes(tour.title.toLowerCase())
    );

    if (!foundTour && lowerInput.includes("under")) {
      const priceMatch = lowerInput.match(/under\s+(\d+)/);
      if (priceMatch) {
        const maxPrice = parseInt(priceMatch[1]);
        foundTour = tours.find(tour => tour.price <= maxPrice);
      }
    }

    if (!foundTour && lowerInput.match(/(\d+)\s*(day|days)/)) {
      const days = parseInt(lowerInput.match(/(\d+)\s*(day|days)/)[1]);
      foundTour = tours.find(tour => Math.round(tour.distance / 250) === days);
    }

    let botReply = '';
    if (foundTour) {
      botReply = `✅ Here's a tour in ${foundTour.city}: 🏞️ *${foundTour.title}*.\n💵 Price: ${foundTour.price} DA\n📍 Address: ${foundTour.address}\n📝 Description: ${foundTour.desc}`;
    } else {
      const randomTour = tours[Math.floor(Math.random() * tours.length)];
      botReply = `😕 I couldn't find a perfect match. But check out this suggestion:\n🌍 *${randomTour.title}* in ${randomTour.city}\n💵 Price: ${randomTour.price} DA\n📍 ${randomTour.address}`;
    }

    setMessages(prev => [...prev, userMessage, { sender: 'bot', text: botReply }]);
    setInput('');
  };

  return (
    <div className="chatbot-wrapper">
      {!isOpen && (
        <button className="chatbot-toggle-button" onClick={() => setIsOpen(true)}>
          <RiChat1Line size={24} />
        </button>
      )}

      {isOpen && (
        <div className="chatbot">
          <div className="chatbot-header">
            <FaRobot /> Algeria Travel Assistant
            <button className="chatbot-close" onClick={() => setIsOpen(false)}>✖</button>
          </div>
          <div className="chatbot-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chatbot-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbot-input-area">
            <input
              className="chatbot-input"
              type="text"
              placeholder="e.g. trip in Algiers, under 3000, 5 days..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}><FaPaperPlane /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
