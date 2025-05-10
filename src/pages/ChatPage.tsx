import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Loader2, Settings } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useChat } from '../contexts/ChatContext';
import ChatMessage from '../components/ChatMessage';

const AdBlock = ({ position }: { position: string }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded p-4 flex items-center justify-center min-h-[80px] md:min-h-[120px]">
      <span className="text-gray-500 dark:text-gray-400 text-sm md:text-base">Рекламный блок - {position}</span>
    </div>
  </div>
);

const ChatPage: React.FC = () => {
  const { messages, loading, sendMessage, clearChat, selectedModel, availableModels, setSelectedModel } = useChat();
  const [inputMessage, setInputMessage] = useState('');
  const [showModelSelect, setShowModelSelect] = useState(false);
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
        <title>Диалог с ЧатGPT - Общайтесь с ИИ без регистрации</title>
        <meta name="description" content="Общайтесь с ЧатGPT прямо сейчас! Задавайте вопросы, получайте мгновенные ответы от искусственного интеллекта без регистрации и ограничений." />
        <meta name="keywords" content="чатгпт диалог, чат с ии, онлайн чат, искусственный интеллект чат, чатбот без регистрации" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2451745015940423" crossorigin="anonymous"></script>
        <script>{`window.yaContextCb=window.yaContextCb||[]`}</script>
        <script src="https://yandex.ru/ads/system/context.js" async></script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "ЧатGPT Диалог",
            "applicationCategory": "ChatBot",
            "operatingSystem": "Any",
            "description": "Онлайн чат с искусственным интеллектом без регистрации",
            "offers": {
              "@type": "Offer",
              "price": "0"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen w-full">
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
            <AdBlock position="Верхний 1" />
            <AdBlock position="Верхний 2" />
            <AdBlock position="Верхний 3" />
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col h-[calc(100vh-280px)] md:h-[600px] bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="flex items-center justify-between px-3 md:px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowModelSelect(!showModelSelect)}
                    className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Текущая модель: {availableModels.find(model => model.id === selectedModel)?.name}</span>
                  </button>
                </div>
              </div>
              
              {showModelSelect && (
                <div className="p-3 md:p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableModels.map(model => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setShowModelSelect(false);
                        }}
                        className={`p-2 rounded-lg text-sm text-center transition-colors duration-200 ${
                          selectedModel === model.id
                            ? 'bg-primary-600 text-white'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                      >
                        {model.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 md:p-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 p-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <Send className="h-6 w-6 md:h-8 md:w-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-lg md:text-xl font-medium mb-2">Начните общение</h3>
                    <p className="max-w-sm text-sm md:text-base">
                      Задайте вопрос или напишите что-нибудь, чтобы начать разговор с ЧатGPT.
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