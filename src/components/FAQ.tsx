import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: 'Что такое ChatGPT?',
    answer: 'ChatGPT - это мощная языковая модель искусственного интеллекта, способная вести диалог, отвечать на вопросы, помогать с написанием текстов, анализом данных и решением различных задач. Она использует передовые технологии машинного обучения для понимания и генерации человекоподобных ответов.'
  },
  {
    question: 'Нужно ли создавать аккаунт для использования сервиса?',
    answer: 'Нет, наш сервис предоставляет доступ к ChatGPT без необходимости регистрации или создания аккаунта. Вы можете начать общение с ИИ немедленно, просто открыв сайт.'
  },
  {
    question: 'Какие модели ИИ доступны на сайте?',
    answer: 'Мы предоставляем доступ к нескольким передовым моделям ИИ: Qwen 3 30B, Gemini 2.5 Flash и Gemini 2.0 Flash. Каждая модель имеет свои особенности и преимущества, и вы можете выбрать наиболее подходящую для ваших задач.'
  },
  {
    question: 'Как долго сохраняется история переписки?',
    answer: 'История вашей переписки сохраняется локально в браузере в течение 7 дней. После этого или при очистке данных браузера история будет удалена. Мы не храним переписку на серверах для обеспечения вашей приватности.'
  },
  {
    question: 'Есть ли ограничения на количество сообщений?',
    answer: 'Сервис использует систему честного распределения ресурсов. При достижении лимита запросов система уведомит вас, и вы сможете продолжить общение через некоторое время.'
  },
  {
    question: 'Как обеспечивается безопасность общения?',
    answer: 'Мы используем защищенное HTTPS-соединение для всех коммуникаций. Ваша переписка не сохраняется на серверах, а хранится только локально в вашем браузере. Мы не собираем личные данные пользователей.'
  },
  {
    question: 'Можно ли использовать сервис на мобильных устройствах?',
    answer: 'Да, наш сервис полностью адаптирован для мобильных устройств. Вы можете комфортно общаться с ChatGPT через браузер на смартфоне или планшете.'
  },
  {
    question: 'Какие языки поддерживает ChatGPT?',
    answer: 'ChatGPT понимает и может отвечать на многих языках, включая русский, английский и другие основные языки мира. Вы можете общаться на любом удобном для вас языке.'
  }
];

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="max-w-4xl mx-auto px-4">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-10">
        Часто задаваемые вопросы
      </h2>
      
      <div className="space-y-3 md:space-y-4">
        {faqItems.map((item, index) => (
          <div 
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => toggleItem(index)}
              className="w-full flex items-center justify-between p-4 md:p-5 text-left"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {item.question}
              </span>
              {openItems.includes(index) ? (
                <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              ) : (
                <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
              )}
            </button>
            
            {openItems.includes(index) && (
              <div className="px-4 md:px-5 pb-4 md:pb-5">
                <p className="text-gray-600 dark:text-gray-300">
                  {item.answer}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQ;