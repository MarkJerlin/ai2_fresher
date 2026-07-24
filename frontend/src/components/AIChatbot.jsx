import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatAPI } from '../services/api';
import { FaRobot, FaPaperPlane, FaMicrophone, FaVolumeUp, FaVolumeMute, FaTimes, FaCommentAlt, FaLightbulb } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const RobotHeadsetLogoSvg = ({ size = 28, className = "" }) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M 18 45 A 32 32 0 0 1 82 45"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    <line x1="50" y1="24" x2="50" y2="13" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="10" r="5" fill="currentColor" />
    <rect x="10" y="38" width="10" height="24" rx="5" fill="currentColor" />
    <rect x="80" y="38" width="10" height="24" rx="5" fill="currentColor" />
    <rect x="23" y="27" width="54" height="50" rx="12" fill="currentColor" />
    <polygon points="30,75 30,88 42,76" fill="currentColor" />
    <rect x="30" y="35" width="40" height="22" rx="6" fill="rgba(0,0,0,0.15)" />
    <circle cx="42" cy="46" r="4.5" fill="currentColor" />
    <circle cx="58" cy="46" r="4.5" fill="currentColor" />
    <path
      d="M 43 63 Q 50 70 57 63"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const AIChatbot = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! I am your GDG AI Assistant. Ask me anything about classes, faculty, the Freshers Party, or campus navigation!", sender: 'bot', time: new Date() }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(false);
  const messagesEndRef = useRef(null);

  // Suggestions for freshers
  const suggestions = [
    "When is the Freshers Party?",
    "Which clubs should I join?",
    "Where is the Turing Block?",
    "What are the attendance rules?",
    "How to download my timetable?"
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Load chat history if user is logged in and chat window is opened
  useEffect(() => {
    if (isOpen && isAuthenticated && messages.length <= 1) {
      const loadHistory = async () => {
        try {
          const res = await chatAPI.getHistory();
          if (res.data && res.data.length > 0) {
            const historyMsgs = [];
            res.data.forEach(item => {
              historyMsgs.push({ text: item.message, sender: 'user', time: new Date(item.created_at) });
              historyMsgs.push({ text: item.response, sender: 'bot', time: new Date(item.created_at) });
            });
            setMessages(prev => [...prev, ...historyMsgs]);
          }
        } catch (error) {
          console.error("Failed to load chat history", error);
        }
      };
      loadHistory();
    }
  }, [isOpen, isAuthenticated]);

  const handleSend = async (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    if (!isAuthenticated) {
      setMessages(prev => [...prev, 
        { text: text, sender: 'user', time: new Date() },
        { text: "⚠️ Please sign in to talk to the AI Assistant.", sender: 'bot', time: new Date() }
      ]);
      setInputText('');
      return;
    }

    // Add user message
    const newMsg = { text, sender: 'user', time: new Date() };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Prepare history structure for session memory
      const historyContext = messages.slice(-10).map(m => ({
        sender: m.sender,
        text: m.text
      }));

      const res = await chatAPI.sendMessage(text, historyContext);
      const botResponse = res.data.response;

      setMessages(prev => [...prev, { text: botResponse, sender: 'bot', time: new Date() }]);

      // Speak response if enabled
      if (isSpeechEnabled) {
        speakText(botResponse);
      }
    } catch (error) {
      console.error("Chatbot API error:", error);
      setMessages(prev => [...prev, { text: "Sorry, I am facing a connection issue. Please try again.", sender: 'bot', time: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text to Speech
  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any current speech
      // Clean markdown tags for clear voice
      const cleanText = text.replace(/[*#_`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech Recognition (Voice Input)
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Please use Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onerror = (e) => {
      console.error(e);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onresult = (event) => {
      const speechToText = event.results[0][0].transcript;
      setInputText(speechToText);
      // Optional: automatically send
      handleSend(speechToText);
    };

    recognition.start();
  };

  return (
    <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 1040 }}>
      {/* Floating Action Button */}
      <motion.button
        className="btn btn-gradient d-flex align-items-center justify-content-center border-0 shadow-lg rounded-circle text-white"
        style={{ width: '60px', height: '60px' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        title="AI Chatbot Assistant"
      >
        {isOpen ? <FaTimes size={24} className="text-white" /> : <RobotHeadsetLogoSvg size={30} className="text-white" />}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: -20, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            className="glass-card shadow-lg d-flex flex-column"
            style={{
              position: 'absolute',
              bottom: '70px',
              right: '0',
              width: '380px',
              height: '450px',
              overflow: 'hidden',
              borderRadius: '24px'
            }}
          >
            {/* Header */}
            <div className="bg-gradient-header p-3 d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-2">
                <div className="bg-white p-2 rounded-circle d-flex align-items-center justify-content-center text-primary">
                  <FaRobot size={18} />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Freshers Connect Bot</h6>
                  <span className="badge bg-success" style={{ fontSize: '0.65rem' }}>Active Gemini AI</span>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-link text-white p-0 shadow-none"
                  onClick={() => setIsSpeechEnabled(!isSpeechEnabled)}
                  title={isSpeechEnabled ? "Disable Text-To-Speech" : "Enable Text-To-Speech"}
                >
                  {isSpeechEnabled ? <FaVolumeUp size={16} /> : <FaVolumeMute size={16} />}
                </button>
                <button className="btn btn-link text-white p-0 shadow-none" onClick={() => setIsOpen(false)}>
                  <FaTimes size={16} />
                </button>
              </div>
            </div>

            {/* Suggestions Overlay if message count is 1 */}
            {messages.length === 1 && (
              <div className="p-3 bg-light border-bottom">
                <div className="d-flex align-items-center gap-1 text-secondary small mb-2">
                  <FaLightbulb className="text-warning" /> Suggested Questions
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {suggestions.map((sug, i) => (
                    <button
                      key={i}
                      className="btn btn-sm btn-white border rounded-pill text-secondary text-start"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => handleSend(sug)}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Body */}
            <div className="flex-grow-1 p-3 overflow-y-auto" style={{ backgroundColor: '#F8FAFC' }}>
              <div className="d-flex flex-column gap-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div
                      className={`p-3 rounded-4 shadow-none ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-white border text-dark'}`}
                      style={{
                        maxWidth: '85%',
                        fontSize: '0.85rem',
                        borderRadius: msg.sender === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                        whiteSpace: 'pre-line'
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="d-flex justify-content-start">
                    <div className="p-3 rounded-4 bg-white border text-secondary d-flex align-items-center gap-2" style={{ borderRadius: '20px 20px 20px 4px' }}>
                      <span className="small">Thinking</span>
                      <div className="typing-dots">
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                        <div className="typing-dot"></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Footer Input */}
            <div className="p-3 bg-white border-top">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="d-flex align-items-center gap-2"
              >
                <button
                  type="button"
                  className={`btn p-2 rounded-circle border-0 d-flex align-items-center justify-content-center ${isListening ? 'bg-danger text-white' : 'bg-light text-secondary'}`}
                  style={{ width: '40px', height: '40px' }}
                  onClick={startSpeechRecognition}
                  title="Voice Input"
                >
                  <FaMicrophone size={16} />
                </button>
                <input
                  type="text"
                  className="form-control border-0 bg-light rounded-pill px-3 py-2 text-dark shadow-none"
                  style={{ fontSize: '0.85rem' }}
                  placeholder="Ask campus details..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="btn btn-gradient p-2 rounded-circle d-flex align-items-center justify-content-center text-white"
                  style={{ width: '40px', height: '40px' }}
                  disabled={isLoading || !inputText.trim()}
                >
                  <FaPaperPlane size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIChatbot;
