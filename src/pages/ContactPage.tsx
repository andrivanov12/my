import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail, MessageCircle, Send, MapPin, Clock, Phone } from 'lucide-react';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Имитация отправки формы
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Контакты | Связаться с экспертами AI Market Hub</title>
        <meta name="description" content="Свяжитесь с командой экспертов AI Market Hub по вопросам искусственного интеллекта, автоматизации и интеграций. Техническая поддержка, консультации и обратная связь." />
        <meta name="keywords" content="контактная информация AI платформы, обратная связь по AI сервисам, поддержка пользователей AIMarketHub, как найти AIMarketHub, контакты экспертов по искусственному интеллекту" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            Связаться с экспертами AI Market Hub
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Наша команда экспертов по искусственному интеллекту и автоматизации всегда готова помочь 
            с вашими вопросами и проектами. Выберите удобный способ связи или заполните форму.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Контактная информация */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md h-fit">
              <h2 className="text-xl font-bold mb-6">Контактная информация</h2>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3 mb-5">
                  <MessageCircle className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Telegram</h3>
                    <a 
                      href="https://t.me/solvillage" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                    >
                      @solvillage
                    </a>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Быстрая поддержка и ответы на вопросы
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-5">
                  <Mail className="h-5 w-5 text-secondary-600 dark:text-secondary-400 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <a 
                      href="mailto:support@aimarkethub.pro"
                      className="text-secondary-600 dark:text-secondary-400 hover:text-secondary-700 dark:hover:text-secondary-300"
                    >
                      support@aimarkethub.pro
                    </a>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Для подробных вопросов и предложений
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 mb-5">
                  <Clock className="h-5 w-5 text-primary-600 dark:text-primary-400 mt-1" />
                  <div>
                    <h3 className="font-medium mb-1">Время работы</h3>
                    <p className="text-gray-600 dark:text-gray-300">24/7</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      Автоматические ответы круглосуточно
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-lg">
                <h3 className="font-medium mb-2">Быстрая помощь</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Для срочных вопросов по AI инструментам и автоматизации рекомендуем Telegram - отвечаем в течение нескольких минут.
                </p>
                <a 
                  href="https://t.me/solvillage" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <MessageCircle className="h-4 w-4" />
                  Написать в Telegram
                </a>
              </div>
            </div>
          </div>

          {/* Форма обратной связи */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-md">
              <h2 className="text-xl font-bold mb-6">Форма обратной связи</h2>
              
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-green-800 dark:text-green-200">
                    Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.
                  </p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Имя *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Ваше имя"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Тема обращения *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Выберите тему</option>
                    <option value="technical">Техническая поддержка</option>
                    <option value="feature">Предложение функции</option>
                    <option value="bug">Сообщение об ошибке</option>
                    <option value="consultation">Консультация по AI</option>
                    <option value="n8n">Вопрос по n8n автоматизации</option>
                    <option value="tuya">Вопрос по Tuya API</option>
                    <option value="partnership">Партнерство</option>
                    <option value="other">Другое</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Сообщение *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none"
                    placeholder="Опишите ваш вопрос или предложение подробно..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                      Отправляем...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Отправить сообщение
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ секция */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Часто задаваемые вопросы</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2 text-primary-600 dark:text-primary-400">
                Как быстро вы отвечаете на сообщения?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                В Telegram отвечаем в течение 15-30 минут в рабочее время. 
                На email - в течение 24 часов. По срочным вопросам автоматизации и интеграции - приоритетная поддержка.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-secondary-600 dark:text-secondary-400">
                Можно ли предложить новую функцию?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Конечно! Мы всегда открыты для предложений по улучшению сервиса. 
                Опишите вашу идею в форме выше.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-primary-600 dark:text-primary-400">
                Есть ли техническая поддержка?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Да, наша команда экспертов по AI и автоматизации готова помочь с любыми техническими вопросами 
                по использованию инструментов платформы, настройке n8n workflow и интеграции с внешними сервисами.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-secondary-600 dark:text-secondary-400">
                Рассматриваете ли вы партнерство?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                Мы открыты для обсуждения партнерских предложений. 
                Свяжитесь с нами для детального обсуждения.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;