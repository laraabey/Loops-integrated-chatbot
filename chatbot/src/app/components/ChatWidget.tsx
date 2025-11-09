'use client';
import { useState, useRef, useEffect } from 'react';
import '../styles/ChatWidget.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  language?: string;
  showContactButton?: boolean;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<'auto' | 'en' | 'si'>('auto');
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const detectLanguage = (text: string): 'en' | 'si' => {
    const hasSinhala = /[\u0D80-\u0DFF]/.test(text);
    return hasSinhala ? 'si' : 'en';
  };

  const getCurrentLanguage = (userMessage: string): 'en' | 'si' => {
    if (currentLanguage === 'auto') {
      return detectLanguage(userMessage);
    }
    return currentLanguage;
  };

  const toggleLanguage = () => {
    if (currentLanguage === 'auto') {
      setCurrentLanguage('en');
    } else if (currentLanguage === 'en') {
      setCurrentLanguage('si');
    } else {
      setCurrentLanguage('auto');
    }
  };

  const getLanguageDisplay = () => {
    switch (currentLanguage) {
      case 'auto': return '🌐 Auto';
      case 'en': return '🇺🇸 English';
      case 'si': return '🇱🇰 Sinhala';
      default: return '🌐 Auto';
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const finalMessage = currentLanguage === 'auto' 
        ? inputMessage 
        : `[Respond in ${currentLanguage === 'en' ? 'English' : 'Sinhala'}] ${inputMessage}`;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: finalMessage,
          conversationHistory: messages,
          forceLanguage: currentLanguage !== 'auto' ? currentLanguage : undefined
        }),
      });

      const data = await response.json();

      if (data.response) {
        const botMessage: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          language: getCurrentLanguage(inputMessage),
          // Check if this is a redirect response that should show contact button
          showContactButton: shouldShowContactButton(data.response)
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  // Check if bot response suggests contact form
  const shouldShowContactButton = (response: string): boolean => {
    const contactTriggers = [
      'contact', 'get in touch', 'reach out', 'connect you', 
      'human representative', 'team will contact', 'provide your details'
    ];
    return contactTriggers.some(trigger => 
      response.toLowerCase().includes(trigger)
    );
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contactForm),
      });

      const data = await response.json();
      
      if (data.success) {
        const successMessage: Message = {
          role: 'assistant',
          content: '✅ ' + data.message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, successMessage]);
        setShowContactForm(false);
        setContactForm({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Failed to submit form. Please try again.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setShowContactForm(false);
    setContactForm({ name: '', email: '', message: '' });
    setCurrentLanguage('auto');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <div className="chat-bubble" onClick={() => setIsOpen(!isOpen)}>
        💬
      </div>

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-panel">
          {/* Header */}
          <div className="chat-header">
            <h3>Loops Integrated</h3>
            <div className="header-actions">
              <button 
                className="language-toggle"
                onClick={toggleLanguage}
                title={`Current: ${getLanguageDisplay()}`}
              >
                {getLanguageDisplay()}
              </button>
              <button className="reset-btn" onClick={resetChat} title="Reset Chat">
                Reset
              </button>
              <button className="close-btn" onClick={() => setIsOpen(false)} title="Close">
                ×
              </button>
            </div>
          </div>

          {/* Language Indicator */}
          <div className="language-indicator">
            {currentLanguage === 'auto' ? (
              <span>🌐 Auto-detecting language</span>
            ) : (
              <span>
                {currentLanguage === 'en' ? '🇺🇸' : '🇱🇰'} 
                Responding in {currentLanguage === 'en' ? 'English' : 'Sinhala'}
              </span>
            )}
          </div>

          {/* Messages */}
          <div className="messages-container">
            {messages.length === 0 && (
              <div className="welcome-message">
                <p>Hello! I'm Loops Integrated's digital assistant.</p>
                <small>Ask me about our services, working hours, or location!</small>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.role}`}>
                <div className="message-content">
                  {msg.content}
                  {msg.showContactButton && (
                    <div className="contact-button-container">
                      <button 
                        className="contact-cta-button"
                        onClick={() => setShowContactForm(true)}
                      >
                        📞 Provide Contact Details
                      </button>
                    </div>
                  )}
                </div>
                <div className="message-time">
                  {msg.timestamp}
                  {msg.language && (
                    <span className="message-language">
                      {msg.language === 'si' ? ' 🇱🇰' : ' 🇺🇸'}
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="message assistant">
                <div className="loading-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contact Form - Only shown when user clicks the button */}
          {showContactForm && (
            <div className="contact-form-overlay">
              <div className="contact-form-panel">
                <div className="contact-form-header">
                  <h4>📞 Contact Our Team</h4>
                  <button 
                    className="close-contact-form"
                    onClick={() => setShowContactForm(false)}
                  >
                    ×
                  </button>
                </div>
                <form onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Your Name *"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({...prev, name: e.target.value}))}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Your Email *"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({...prev, email: e.target.value}))}
                      required
                      disabled={loading}
                    />
                  </div>
                  
                  <div className="form-group">
                    <textarea
                      placeholder="How can we help you? *"
                      value={contactForm.message}
                      onChange={(e) => setContactForm(prev => ({...prev, message: e.target.value}))}
                      required
                      disabled={loading}
                      rows={3}
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" disabled={loading} className="submit-btn">
                      {loading ? 'Sending...' : 'Submit'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowContactForm(false)}
                      disabled={loading}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Input Area */}
          {!showContactForm && (
            <div className="input-area">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={
                  currentLanguage === 'auto' 
                    ? "Type your message in English or Sinhala..." 
                    : currentLanguage === 'en'
                    ? "Type your message in English..."
                    : "සිංහලෙන් ඔබේ පණිවිඩය ටයිප් කරන්න..."
                }
                rows={1}
                disabled={loading}
              />
              <button 
                onClick={sendMessage} 
                disabled={loading || !inputMessage.trim()}
                title="Send message"
              >
                {loading ? '⏳' : '📤'}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}