import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const createWelcomeMessage = (text: string): ChatMessage => ({
  id: 'welcome',
  role: 'model',
  text,
  timestamp: new Date(),
});

export const ChatWidget: React.FC = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([createWelcomeMessage(t('chat_welcome'))]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length !== 1 || prev[0].id !== 'welcome' || prev[0].text === t('chat_welcome')) {
        return prev;
      }

      return [createWelcomeMessage(t('chat_welcome'))];
    });
  }, [t]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    const history = messages
      .filter((message) => message.id !== 'welcome')
      .map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      }));

    const languageContext = {
      role: 'user',
      parts: [{ text: `Reply in ${language}. Keep answers focused on Wanjin Precision Spring products, manufacturing, and contact details.` }],
    };

    const finalHistory = [languageContext, ...history];

    const finalMessage = userMsg.text;

    try {
      const { chatWithBot } = await import('../services/geminiService');
      const response = await chatWithBot(finalHistory, finalMessage);
      let replyText = t('chat_unavailable');
      if ('text' in response) {
        replyText = response.text;
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: replyText,
        timestamp: new Date(),
        isError: response.isError,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error('Chat widget send error:', error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: t('chat_unavailable'),
          timestamp: new Date(),
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        aria-label={t('chat_close')}
        className={`fixed inset-0 z-40 bg-slate-950/28 transition duration-300 md:hidden ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? t('chat_close') : t('chat_open')}
        className={`chat-widget-trigger fixed z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 md:h-auto md:w-auto md:rounded-md md:p-4 ${isOpen ? 'bg-brand-700 rotate-90 opacity-0 pointer-events-none' : 'bg-brand-500 text-white opacity-100'
          }`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <div
        role="dialog"
        aria-modal={isOpen ? 'true' : undefined}
        aria-label={t('chat_title')}
        className={`chat-widget-panel fixed z-50 flex flex-col overflow-hidden border border-white/20 bg-white shadow-2xl transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-[20px] bg-brand-500 p-3.5 text-white md:rounded-t-2xl md:p-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/10 rounded-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">{t('chat_title')}</h3>
              <p className="text-xs text-slate-300 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> {t('chat_powered_by')}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            aria-label={t('chat_close')}
            className="rounded-full p-2 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="scrollbar-hide flex-1 space-y-4 overflow-y-auto bg-slate-50 p-3.5 md:p-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${
                msg.role === 'user' ? 'bg-slate-200' : msg.isError ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                {msg.role === 'user' ? (
                  <User className="w-4 h-4 text-slate-600" />
                ) : (
                  <Bot className={`w-4 h-4 ${msg.isError ? 'text-red-600' : 'text-brand-500'}`} />
                )}
              </div>
              <div
                className={`max-w-[84%] rounded-[14px] p-3 text-sm leading-relaxed shadow-sm md:max-w-[80%] ${
                  msg.role === 'user'
                    ? 'rounded-tr-none bg-brand-500 text-white'
                    : msg.isError
                      ? 'rounded-tl-none border border-red-200 bg-red-50 text-red-800'
                      : 'rounded-tl-none border border-white/10 bg-white text-slate-700'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
              </div>
              <div className="rounded-[14px] rounded-tl-none border border-white/10 bg-white px-4 py-2 text-xs italic text-slate-500">
                {t('chat_thinking')}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="rounded-b-[20px] border-t border-white/10 bg-white p-3.5 md:rounded-b-2xl md:p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat_placeholder')}
              className="min-h-11 flex-1 rounded-xl border border-white/20 bg-slate-50 px-4 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              aria-label={t('chat_send')}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-500 text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
