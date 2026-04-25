import React, { useState } from 'react';
import { Container, Row, Col } from 'reactstrap';
import { FaRobot, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import '../styles/chatbot.css'; // Reusing some base styles

const ChatPage = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: "👋 Hello! I am your Algeria Travel Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [tours, setTours] = useState([]);
  const [knowledge, setKnowledge] = useState([]);

  const wilayaCoords = {
    "alger": { lat: 36.75, lon: 3.06 },
    "oran": { lat: 35.69, lon: -0.63 },
    "constantine": { lat: 36.36, lon: 6.61 },
    "bejaia": { lat: 36.75, lon: 5.08 },
    "annaba": { lat: 36.9, lon: 7.76 },
    "tlemcen": { lat: 34.88, lon: -1.31 },
    "ghardaia": { lat: 32.49, lon: 3.67 },
    "setif": { lat: 36.19, lon: 5.41 },
    "tamanghasset": { lat: 22.78, lon: 5.52 },
    "biskra": { lat: 34.85, lon: 5.73 }
  };

  React.useEffect(() => {
    // Fetch data from backend
    axios.get('http://localhost:3001/tours').then(res => setTours(res.data)).catch(err => console.error(err));
    axios.get('http://localhost:3001/knowledge').then(res => setKnowledge(res.data)).catch(err => console.error(err));
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    const lowerInput = input.toLowerCase();

    // 0. Advanced Weather Check (City + Date)
    if (lowerInput.includes("météo") || lowerInput.includes("weather") || lowerInput.includes("temps")) {
      let city = "alger"; // Default
      let targetDate = new Date().toISOString().split('T')[0]; // Default today

      // Extract city from wilayaCoords keys
      for (const w in wilayaCoords) {
        if (lowerInput.includes(w)) {
          city = w;
          break;
        }
      }

      // Check for "demain" or "tomorrow"
      if (lowerInput.includes("demain") || lowerInput.includes("tomorrow")) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        targetDate = tomorrow.toISOString().split('T')[0];
      }

      try {
        setMessages(prev => [...prev, userMessage, { sender: 'bot', text: `☁️ I'm checking the weather for ${city.charAt(0).toUpperCase() + city.slice(1)} on ${targetDate}...` }]);
        setInput('');

        const coords = wilayaCoords[city] || wilayaCoords["alger"];
        const res = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&daily=temperature_2m_max,weathercode&timezone=auto&start_date=${targetDate}&end_date=${targetDate}`);

        const temp = res.data.daily.temperature_2m_max[0];
        const botReply = `🌡️ Forecast for ${city.toUpperCase()} (${targetDate}): It will be around ${temp}°C. Have a nice trip! ✈️`;

        setMessages(prev => [...prev.slice(0, -1), { sender: 'bot', text: botReply }]);
        return;
      } catch (err) {
        setMessages(prev => [...prev, { sender: 'bot', text: "❌ I can only provide forecasts for the next 7 days. Please check the date!" }]);
        return;
      }
    }

    // 1. Search Knowledge Base
    let foundInfo = knowledge.find(k => lowerInput.includes(k.question.toLowerCase()));

    // 2. Search Tours
    let foundTour = tours.find(tour =>
      lowerInput.includes(tour.city.toLowerCase()) ||
      lowerInput.includes(tour.title.toLowerCase()) ||
      lowerInput.includes(tour.wilaya?.toLowerCase())
    );

    let botReply = '';

    if (foundInfo) {
      botReply = `💡 ${foundInfo.answer}`;
    } else if (foundTour) {
      botReply = `✅ I found a great trip for you! 🏞️ *${foundTour.title}* in ${foundTour.city}.\n💵 Price: ${foundTour.price} DA\n📝 ${foundTour.desc?.substring(0, 100)}...`;
    } else if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      botReply = "Hi there! Feel free to ask about our tours, best time to visit Algeria, or entry requirements!";
    } else {
      botReply = `😕 I'm not sure about that. Try asking about "visa", "best time to visit", "currency", or a specific city like "Algiers" or "Oran".`;
    }

    setMessages(prev => [...prev, userMessage, { sender: 'bot', text: botReply }]);
    setInput('');
  };

  return (
    <section>
      <Container>
        <Row>
          <Col lg="6" md="8" sm="10" className="m-auto">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden mt-5 mb-5">
              <div className="bg-primary text-white p-3 d-flex align-items-center" style={{ background: 'var(--secondary-color)' }}>
                <FaRobot size={25} className="me-3" />
                <h4 className="mb-0 text-white">Travel Assistant</h4>
              </div>
              <div className="p-3" style={{ height: '350px', overflowY: 'auto', background: '#f8f9fa' }}>
                {messages.map((msg, i) => (
                  <div key={i} className={`d-flex mb-3 ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className={`p-2 px-3 rounded-4 ${msg.sender === 'user' ? 'bg-info text-white' : 'bg-white border'}`} style={{ maxWidth: '80%', fontSize: '0.95rem', backgroundColor: msg.sender === 'user' ? 'var(--secondary-color) !important' : 'white' }}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 bg-white border-top d-flex align-items-center">
                <input
                  type="text"
                  className="form-control rounded-pill me-2 px-4 py-2"
                  placeholder="Ask me something... e.g., trip in Algiers"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button className="btn rounded-circle text-white d-flex justify-content-center align-items-center" style={{ width: '40px', height: '40px', background: 'var(--secondary-color)' }} onClick={handleSend}>
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ChatPage;
