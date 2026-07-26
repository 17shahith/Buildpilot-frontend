import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Cpu, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Hi! I am the BuildBridge Copilot. Ask me anything about building budgets, room scans, defect detection, or finding general contractors.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    "How much does structural brickwork cost?",
    "How do I use the AR room visualizer?",
    "How does AI detect wall cracks?",
    "Find me an architect like Ripon Ahmed"
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { sender: 'user', text }]);
    setInput('');
    setIsTyping(true);

    try {
      // Connect to server
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, { sender: 'ai', text: data.response }]);
      } else {
        throw new Error('API offline');
      }
    } catch (err) {
      // Offline fallback simulation
      setTimeout(() => {
        let answer = "I'm currently operating in offline mode. For full rates and estimations, please start the BuildBridge local backend server on port 5000.";
        const lower = text.toLowerCase();
        
        if (lower.includes('cost') || lower.includes('estimate') || lower.includes('budget')) {
          answer = "Building cost estimates range from $120 to $250 per sqft depending on finishes. Standard construction is around $190/sqft, while luxury specs with heavy concrete/steel structure go up to $270+/sqft.";
        } else if (lower.includes('ar') || lower.includes('visual')) {
          answer = "To run AR, open our 'AR Home Visualiser' in the top menu. Use your phone camera to scan your room boundaries, select wall colors or floor tiles, and save screenshots directly.";
        } else if (lower.includes('defect') || lower.includes('crack') || lower.includes('damage')) {
          answer = "Yes! Uploading a photo in our AI Estimator -> Defect Detector will parse the pixel layout, identify cracking patterns (hairline vs structural shear), and calculate cost estimates to repair.";
        } else if (lower.includes('ripon') || lower.includes('architect') || lower.includes('engineer')) {
          answer = "We have top-tier experts available! Ripon Ahmed is our featured Architect & UI/UX specialist, Sarah Connor covers Structural Steel Frames, and David Miller runs General Renovations.";
        }

        setMessages(prev => [...prev, { sender: 'ai', text: answer }]);
      }, 1000);
    } finally {
      setTimeout(() => setIsTyping(false), 1000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-[90vw] sm:w-[400px] h-[550px] rounded-3xl border border-brandDark-border bg-brandDark-charcoal shadow-2xl flex flex-col overflow-hidden mb-4 z-50 glass-panel"
          >
            {/* Header */}
            <div className="p-4 border-b border-brandDark-border bg-brandDark-black flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-glow">
                  <Cpu className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm tracking-wide font-display text-white">BuildBridge Copilot</h3>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">Active AI</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white shadow-glow/15 font-semibold'
                        : 'bg-brandDark-black text-gray-200 border border-brandDark-border'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-brandDark-black border border-brandDark-border rounded-2xl px-4 py-3 flex space-x-1.5 items-center">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Presets List */}
            {messages.length === 1 && (
              <div className="p-3 bg-brandDark-black/50 border-t border-brandDark-border flex gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(preset)}
                    className="inline-flex items-center space-x-1 px-3 py-1.5 bg-brandDark-charcoal text-[10px] font-semibold text-gray-300 border border-brandDark-border rounded-lg hover:border-primary hover:text-white transition-all"
                  >
                    <span>{preset}</span>
                    <ArrowUpRight className="w-3 h-3 text-primary" />
                  </button>
                ))}
              </div>
            )}

            {/* Input bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="p-3 bg-brandDark-black border-t border-brandDark-border flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Ask about materials, scan setup, costs..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-brandDark-charcoal border border-brandDark-border rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bubble Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-glow-lg transition-transform duration-300 hover:scale-105 active:scale-95 group relative"
      >
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-brandDark-black animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-brandDark-black"></span>
        <MessageSquare className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
      </button>
    </div>
  );
};

export default AIChatbot;
