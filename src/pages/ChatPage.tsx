import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Loader2, Settings, Heart, ChevronDown } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useChat } from '../contexts/ChatContext';
import ChatMessage from '../components/ChatMessage';

interface AdBlockProps {
  position: string;
}

const RegRuBanner: React.FC = () => (
  <div className="h-[160px] bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
    <a 
      href="https://www.reg.ru/?rlink=reflink-29832781"
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full overflow-hidden rounded-lg transform transition-all duration-300 hover:scale-105"
    >
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 p-4 relative h-full">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-10 -translate-x-6"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="bg-white/20 rounded-lg p-1.5">
              <div className="text-white font-bold text-lg">.RU</div>
            </div>
            <h3 className="text-xl font-bold text-white">
              REG.RU
            </h3>
          </div>
          
          <div className="space-y-2">
            <p className="text-white/90 text-base">
              Домены от 149₽/год
            </p>
            <div className="space-y-0.5">
              <p className="text-white/80 text-sm">• SSL-сертификаты</p>
              <p className="text-white/80 text-sm">• Быстрый хостинг</p>
              <p className="text-white/80 text-sm">• Конструктор сайтов</p>
            </div>
          </div>
        </div>
      </div>
    </a>
  </div>
);

const BinanceBanner: React.FC = () => (
  <div className="h-[160px] bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
    <a 
      href="https://accounts.binance.com/register?ref=35897353&utm_medium=web_share_copy"
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full overflow-hidden rounded-lg transform transition-all duration-300 hover:scale-105"
    >
      <img 
        src="https://i.ibb.co/7tNX3Bmq/photo-2025-05-18-10-25-23.jpg" 
        alt="Binance Crypto Trading"
        className="w-full h-full object-cover rounded-lg"
      />
    </a>
  </div>
);

const CustomBanner: React.FC = () => (
  <div className="h-[160px] bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
    <a 
      href="#"
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full overflow-hidden rounded-lg transform transition-all duration-300 hover:scale-105"
    >
      <img 
        src="https://i.ibb.co/JRwNsjzc/photo-2025-05-18-11-00-47.jpg" 
        alt="Advertisement"
        className="w-full h-full object-cover rounded-lg"
      />
    </a>
  </div>
);

const AdBlock: React.FC<AdBlockProps> = ({ position }) => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (position === "Верхний 2" && adRef.current) {
      const script = document.createElement('script');
      script.text = 'window.yaContextCb=window.yaContextCb||[]';
      adRef.current.appendChild(script);

      const rtbScript = document.createElement('script');
      rtbScript.src = 'https://yandex.ru/ads/system/context.js';
      rtbScript.async = true;
      adRef.current.appendChild(rtbScript);
    }
  }, [position]);

  if (position === "Верхний 1") {
    return <RegRuBanner />;
  }

  if (position === "Верхний 2") {
    return <BinanceBanner />;
  }

  if (position === "Верхний 3") {
    return <CustomBanner />;
  }

  return (
    <div className="h-[160px] bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
      <div 
        ref={adRef}
        className="h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded p-3 flex items-center justify-center"
      >
        <span className="text-gray-500 dark:text-gray-400 text-sm">
          Рекламный блок - {position}
        </span>
      </div>
    </div>
  );
};

const ModelSelector = () => {
  const { selectedModel, availableModels, setSelectedModel } = useChat();
  const [isOpen, setIsOpen] = useState(false);

  const currentModel = availableModels.find(model => model.id === selectedModel);

  return (
    <div className="relative">
      <div className="mb-2 text-xs text-gray-500 dark:text-gray-400 font-medium">
        Текущая версия:
      </div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentModel?.name || 'Выберите модель'}
          </span>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
          {availableModels.map(model => (
            <button
              key={model.id}
              onClick={() => {
                setSelectedModel(model.id);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors duration-200
                ${selectedModel === model.id 
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              {model.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const ChatPage: React.FC = () => {
  const { messages, loading, sendMessage, clearChat } = useChat();
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      const { scrollHeight, clientHeight } = chatContainerRef.current;
      chatContainerRef.current.scrollTop = scrollHeight - clientHeight;
    }
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() && !loading) {
      const messageToSend = inputMessage;
      setInputMessage('');
      await sendMessage(messageToSend);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <>
      <Helmet>
        <title>Диалог с ChatGPT - Общайтесь с ИИ без регистрации</title>
        <meta name="description" content="Общайтесь с ChatGPT прямо сейчас! Задавайте вопросы, получайте мгновенные ответы от искусственного интеллекта без регистрации и ограничений." />
        <meta name="keywords" content="чатgpt диалог, чат с ии, онлайн чат, искусственный интеллект чат, чатбот без регистрации" />
      </Helmet>

      <div className="min-h-screen w-full">
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
            <AdBlock position="Верхний 1" />
            <AdBlock position="Верхний 2" />
            <AdBlock position="Верхний 3" />
          </div>

          <div className="max-w-3xl mx-auto relative">
            {/* Desktop donation button */}
            <a
              href="https://pay.cloudtips.ru/p/0196436e"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed left-4 top-1/2 transform -translate-y-1/2 hidden lg:flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105"
            >
              <Heart className="h-5 w-5 group-hover:text-red-200 transition-colors duration-300" />
              <span className="font-medium whitespace-nowrap">Донат на развитие сайта</span>
            </a>

            {/* Mobile/Tablet donation button */}
            <a
              href="https://pay.cloudtips.ru/p/0196436e"
              target="_blank"
              rel="noopener noreferrer"
              className="fixed bottom-20 right-4 lg:hidden flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-3 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group z-50"
            >
              <Heart className="h-5 w-5 group-hover:text-red-200 transition-colors duration-300 animate-pulse" />
              <span className="font-medium text-sm sm:text-base">Поддержать проект</span>
            </a>

            <div className="flex flex-col h-[calc(100vh-280px)] md:h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="p-3 md:p-4 border-b border-gray-200 dark:border-gray-700">
                <ModelSelector />
              </div>

              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 md:p-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 p-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <Send className="h-6 w-6 md:h-8 md:w-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-lg md:text-xl font-medium mb-2">Начните общение</h3>
                    <p className="max-w-sm text-sm md:text-base">
                      Задайте вопрос или напишите что-нибудь, чтобы начать разговор с ChatGPT.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 p-3 md:p-4 bg-gray-50 dark:bg-gray-900">
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Напишите сообщение..."
                    className="flex-1 h-10 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-500 bg-white dark:bg-gray-800 outline-none resize-none text-sm md:text-base leading-normal"
                    style={{ minHeight: '40px', maxHeight: '40px' }}
                    rows={1}
                    disabled={loading}
                  />
                  
                  {messages.length > 0 && (
                    <button
                      type="button"
                      onClick={clearChat}
                      className="h-10 w-10 flex items-center justify-center text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 transition-colors duration-200"
                      title="Очистить чат"
                      disabled={loading}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    className={`h-10 w-10 flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors duration-200 ${
                      loading || !inputMessage.trim() ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                    disabled={loading || !inputMessage.trim()}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Send className="h-5 w-5" />
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mt-4 md:mt-6">
            <AdBlock position="Нижний 1" />
            <AdBlock position="Нижний 2" />
            <AdBlock position="Нижний 3" />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatPage;