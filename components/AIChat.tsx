
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface AIChatProps {
  onClose: () => void;
}

// Lightweight Markdown Parser Component
const MarkdownRenderer: React.FC<{ content: string; role: 'user' | 'model' }> = ({ content, role }) => {
  // 1. Split by double newlines to handle paragraphs
  const paragraphs = content.split(/\n\n+/);

  const parseInline = (text: string) => {
    // Split by **bold** syntax
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        // Styling for bold text based on role
        const highlightClass = role === 'model' ? 'text-white font-bold' : 'text-accent font-bold';
        return <strong key={i} className={highlightClass}>{part.slice(2, -2)}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-3">
      {paragraphs.map((paragraph, pIdx) => {
        // 2. Check for list items (starting with - or *)
        if (paragraph.trim().match(/^[\-\*]\s/m)) {
           const lines = paragraph.split(/\n/);
           // Check if it's a block of list items
           const listItems: string[] = [];
           const otherLines: string[] = [];
           
           lines.forEach(line => {
             if (line.trim().match(/^[\-\*]\s/)) {
               listItems.push(line.replace(/^[\-\*]\s+/, ''));
             } else {
               otherLines.push(line);
             }
           });

           return (
             <React.Fragment key={pIdx}>
               {otherLines.length > 0 && (
                 <p className="mb-2">{parseInline(otherLines.join(' '))}</p>
               )}
               <ul className="list-disc list-outside ml-4 space-y-1">
                 {listItems.map((item, iIdx) => (
                   <li key={iIdx}>{parseInline(item)}</li>
                 ))}
               </ul>
             </React.Fragment>
           );
        }
        
        // Standard Paragraph
        return <p key={pIdx} className="whitespace-pre-wrap">{parseInline(paragraph)}</p>;
      })}
    </div>
  );
};

export const AIChat: React.FC<AIChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: "System online. I am the portfolio AI assistant. Ask me about Brian's projects, skills, or experience." }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (inputRef.current) inputRef.current.focus();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Create a placeholder for the model response
    const modelMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '', isLoading: true }]);

    try {
      const stream = await sendMessageToGemini(userMsg.text);
      let fullText = '';

      for await (const chunk of stream) {
        fullText += chunk;
        // Update the message in real-time
        setMessages(prev => prev.map(msg => 
          msg.id === modelMsgId 
            ? { ...msg, text: fullText, isLoading: false } 
            : msg
        ));
      }
    } catch (error) {
      const errorText = error instanceof Error ? error.message : "Error: Connection interrupted.";
      setMessages(prev => prev.map(msg => 
        msg.id === modelMsgId 
          ? { ...msg, text: errorText, isLoading: false } 
          : msg
      ));
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-surface border border-accent/20 shadow-2xl shadow-black/50 rounded-t-xl md:rounded-xl overflow-hidden backdrop-blur-md">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-base border-b border-white/5">
        <div className="flex items-center gap-2 text-accent font-mono text-sm tracking-wider">
           <Bot size={16} />
           <span>AI_INTERFACE_V1.0</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-white text-black' : 'bg-accent text-black'}`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm font-mono leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-white/10 text-white border border-white/5' 
                : 'bg-black/40 text-accent border border-accent/20'
            }`}>
              <MarkdownRenderer content={msg.text} role={msg.role} />
              {msg.isLoading && msg.text.length === 0 && (
                 <span className="animate-pulse">_</span>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-base border-t border-white/5">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query the system..."
            className="flex-1 bg-surface border border-white/10 text-white px-4 py-2 text-sm font-mono focus:outline-none focus:border-accent transition-colors placeholder:text-gray-600"
            disabled={isTyping}
          />
          <button 
            type="submit" 
            disabled={isTyping || !input.trim()}
            className="px-4 bg-accent text-base font-bold hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isTyping ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </form>
    </div>
  );
};
