import React, { useState, useRef, useEffect } from 'react';
import { Send, Trash2, Loader2, Settings, Heart, ChevronDown } from 'lucide-react';
import { useChat } from '../contexts/ChatContext';
import ChatMessage from '../components/ChatMessage';
import SEOTags from '../components/SEOTags';
import AdaptiveAdBlock from '../components/AdaptiveAdBlock';
import { generateFAQSchema } from '../utils/seoHelpers';

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

  // FAQ для структурированных данных
  const faqItems = [
    {
      question: "Как искусственный интеллект помогает в маркетинге?",
      answer: "Искусственный интеллект трансформирует маркетинг через автоматизацию рутинных задач, персонализацию контента на основе поведения пользователей, анализ больших данных для выявления паттернов, оптимизацию рекламных кампаний в реальном времени и генерацию высококачественного контента для всех маркетинговых каналов."
    },
    {
      question: "Как нейросети помогают в создании контента?",
      answer: "Нейросети революционизируют создание контента через автоматическую генерацию текстов разных форматов (статьи, посты, email-рассылки), оптимизацию под SEO, анализ эффективности и предложение улучшений, создание персонализированных материалов для разных сегментов аудитории и автоматическое перепрофилирование контента для разных платформ."
    },
    {
      question: "Какие маркетинговые процессы можно автоматизировать с помощью ИИ?",
      answer: "С помощью искусственного интеллекта можно автоматизировать сбор и анализ данных о клиентах, сегментацию аудитории, персонализацию коммуникаций, A/B тестирование, оптимизацию рекламных кампаний, генерацию контента, мониторинг упоминаний бренда, квалификацию лидов и формирование аналитических отчетов."
    },
    {
      question: "Как измерить эффективность внедрения ИИ в маркетинг?",
      answer: "Эффективность внедрения ИИ в маркетинг измеряется через ключевые метрики: рост конверсии, снижение стоимости привлечения клиента (CAC), увеличение пожизненной ценности клиента (LTV), рост вовлеченности аудитории, сокращение времени на рутинные задачи, повышение точности прогнозов и улучшение персонализации, что отражается в повышении удовлетворенности клиентов."
    }
  ];

  // Структурированные данные для FAQ
  const faqSchema = generateFAQSchema(faqItems);

  return (
    <>
      <SEOTags
        title="AI для маркетинга и бизнеса | Нейросеть для генерации контента и анализа данных"
        description="Используйте искусственный интеллект для маркетинга и бизнеса! Автоматическая генерация контента, анализ данных, персонализация коммуникаций и оптимизация рекламных кампаний с помощью нейросетей."
        keywords="нейросеть для маркетинга, AI для генерации контента, искусственный интеллект в бизнесе, автоматизация маркетинга с ИИ, анализ данных нейросетью, персонализация с помощью ИИ, оптимизация рекламы с AI, маркетинговая аналитика, нейросеть для копирайтинга, AI для email-маркетинга"
        canonicalUrl="https://aimarkethub.pro/chat"
        imageUrl="https://aimarkethub.pro/images/chatgpt-screenshot.jpg"
        structuredData={[faqSchema]}
        preload={[
          {href: '/images/chatgpt-screenshot.jpg', as: 'image'},
          {href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style'}
        ]}
      >
        <meta name="application-name" content="AI чат-бот без регистрации" />
        <meta name="apple-mobile-web-app-title" content="AI чат-бот" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="apple-touch-icon" href="/images/chatgpt-icon-192.png" />
      </SEOTags>

      <div className="min-h-screen w-full">
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-7xl">
          {/* Рекламный баннер R-A-16048264-3 над диалоговым окном */}
          <AdaptiveAdBlock 
            blockId="R-A-16048264-3" 
            containerId="yandex_rtb_R-A-16048264-3_chat" 
            position="chat-top"
            className="mb-4 md:mb-6"
          />

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

              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-3 md:p-4" aria-live="polite">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-gray-400 p-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 mb-3 md:mb-4 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
                      <Send className="h-6 w-6 md:h-8 md:w-8 text-primary-600 dark:text-primary-400" />
                    </div>
                    <h3 className="text-lg md:text-xl font-medium mb-2">Начните общение с AI</h3>
                    <p className="max-w-sm text-sm md:text-base">
                      Задайте вопрос или напишите что-нибудь, чтобы начать разговор с искусственным интеллектом.
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
                    placeholder="Задайте вопрос искусственному интеллекту..."
                    className="flex-1 h-10 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:border-primary-500 dark:focus:border-primary-500 bg-white dark:bg-gray-800 outline-none resize-none text-sm md:text-base leading-normal"
                    aria-label="Введите ваш вопрос"
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
              <span>Начать использовать ИИ для бизнеса</span>
            </div>
          </div>

          {/* Рекламный баннер R-A-16048264-4 под диалоговым окном */}
          <AdaptiveAdBlock 
            blockId="R-A-16048264-4" 
            containerId="yandex_rtb_R-A-16048264-4_chat_bottom" 
            position="chat-bottom"
            className="mt-4 md:mt-6"
          />
        </div>
      </div>
    </>
  );
};

export default ChatPage;