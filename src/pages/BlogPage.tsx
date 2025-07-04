import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight, TrendingUp, Lightbulb, Shield, Loader2, RefreshCw, Filter, Search } from 'lucide-react';
import { airtableService, AirtableArticle } from '../services/airtableService';
import AdaptiveAdBlock from '../components/AdaptiveAdBlock';

const BlogPage: React.FC = () => {
  const [articles, setArticles] = useState<AirtableArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedArticle, setSelectedArticle] = useState<AirtableArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Статические статьи как fallback
  const staticArticles: AirtableArticle[] = [
    {
      id: 'static-1',
      title: "Революция n8n: Как автоматизация меняет бизнес-процессы",
      excerpt: "Исследуем влияние n8n на оптимизацию рабочих процессов и повышение эффективности бизнеса в 2025 году.",
      publishedAt: "2025-01-25",
      author: "Команда AI Hub",
      category: "n8n",
      imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>Автоматизация рабочих процессов с помощью n8n становится ключевым фактором успеха для современных компаний. Этот мощный инструмент позволяет соединять различные сервисы и создавать эффективные рабочие процессы без необходимости глубоких технических знаний.</p>
        
        <h3>Основные преимущества n8n</h3>
        <p>Современные компании выбирают n8n по нескольким причинам:</p>
        <ul>
          <li>Открытый исходный код и возможность self-hosted установки</li>
          <li>Более 200+ интеграций с популярными сервисами</li>
          <li>Гибкая настройка рабочих процессов</li>
          <li>Возможность использования JavaScript для сложной логики</li>
          <li>Отсутствие ограничений на количество операций</li>
        </ul>
        
        <h3>Примеры успешного внедрения</h3>
        <p>Компании различных отраслей уже получают значительные преимущества от внедрения n8n:</p>
        <ul>
          <li>Автоматизация маркетинговых кампаний и сбора лидов</li>
          <li>Синхронизация данных между CRM и другими системами</li>
          <li>Автоматическое создание отчетов и аналитики</li>
          <li>Мониторинг и оповещения о критических событиях</li>
        </ul>
        
        <h3>Будущее автоматизации с n8n</h3>
        <p>В 2025 году мы наблюдаем интеграцию искусственного интеллекта в рабочие процессы n8n, что открывает новые возможности для интеллектуальной автоматизации и обработки данных.</p>
        
        <p><strong>#n8n #Автоматизация #WorkflowAutomation #БизнесПроцессы #Интеграции #NoCode #LowCode</strong></p>
      `,
      tags: ['n8n', 'Автоматизация', 'Бизнес'],
      slug: 'n8n-revolution-business-automation'
    },
    {
      id: 'static-2',
      title: "10 лучших n8n workflow для маркетологов в 2025 году",
      excerpt: "Готовые решения для автоматизации маркетинговых задач с помощью n8n: от сбора лидов до аналитики кампаний.",
      publishedAt: "2025-01-20",
      author: "Эксперт n8n",
      category: "n8n",
      imageUrl: "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>Маркетологи постоянно ищут способы оптимизировать свои процессы и повысить эффективность кампаний. n8n предлагает мощные возможности для автоматизации маркетинговых задач без необходимости глубоких технических знаний.</p>
        
        <h3>1. Автоматизация сбора лидов</h3>
        <p>Workflow для автоматического сбора лидов с веб-форм и отправки их в CRM:</p>
        <ul>
          <li>Webhook-триггер для получения данных с формы</li>
          <li>HTTP Request для проверки данных</li>
          <li>IF узел для фильтрации спама</li>
          <li>CRM узел для создания нового контакта</li>
          <li>Telegram узел для оповещения о новом лиде</li>
        </ul>
        
        <h3>2. Мониторинг упоминаний бренда</h3>
        <p>Workflow для отслеживания упоминаний бренда в социальных сетях:</p>
        <ul>
          <li>Cron узел для запуска каждый час</li>
          <li>HTTP Request для запроса к API социальных сетей</li>
          <li>Function узел для фильтрации релевантных упоминаний</li>
          <li>Slack узел для отправки уведомлений</li>
        </ul>
        
        <h3>3. Автоматическая аналитика кампаний</h3>
        <p>Workflow для сбора и анализа данных о маркетинговых кампаниях:</p>
        <ul>
          <li>Cron узел для запуска каждый день</li>
          <li>Google Analytics узел для получения данных</li>
          <li>Facebook Ads узел для получения статистики</li>
          <li>Function узел для объединения и анализа данных</li>
          <li>Google Sheets узел для сохранения отчета</li>
          <li>Email узел для отправки отчета команде</li>
        </ul>
        
        <p><strong>#n8n #Маркетинг #Автоматизация #DigitalMarketing #MarketingAutomation #Workflow #NoCode</strong></p>
      `,
      tags: ['n8n', 'Маркетинг', 'Автоматизация'],
      slug: 'top-10-n8n-workflows-for-marketers'
    },
    {
      id: 'static-3',
      title: "Интеграция ChatGPT с n8n: создание интеллектуальных автоматизаций",
      excerpt: "Пошаговое руководство по подключению ChatGPT к вашим n8n workflow для создания AI-powered автоматизаций.",
      publishedAt: "2025-01-15",
      author: "AI эксперт",
      category: "AI",
      imageUrl: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>Объединение возможностей n8n и ChatGPT открывает новые горизонты для создания интеллектуальных автоматизаций. В этой статье мы рассмотрим, как интегрировать ChatGPT в ваши рабочие процессы n8n.</p>
        
        <h3>Настройка подключения к OpenAI API</h3>
        <p>Для начала необходимо настроить доступ к API OpenAI в n8n:</p>
        <ul>
          <li>Создайте API ключ на платформе OpenAI</li>
          <li>В n8n добавьте новые учетные данные типа "OpenAI API"</li>
          <li>Введите ваш API ключ в соответствующее поле</li>
        </ul>
        
        <h3>Создание базового workflow с ChatGPT</h3>
        <p>Простой workflow для генерации контента с помощью ChatGPT:</p>
        <ul>
          <li>Webhook-триггер для получения запроса</li>
          <li>OpenAI узел с настройкой модели (например, gpt-4)</li>
          <li>Function узел для форматирования ответа</li>
          <li>Respond to Webhook узел для возврата результата</li>
        </ul>
        
        <h3>Продвинутые сценарии использования</h3>
        <p>Интеграция ChatGPT с n8n позволяет реализовать множество интересных сценариев:</p>
        <ul>
          <li>Автоматическая генерация ответов на обращения клиентов</li>
          <li>Анализ и классификация входящих сообщений</li>
          <li>Генерация контента для социальных сетей по расписанию</li>
          <li>Автоматический перевод и локализация контента</li>
          <li>Создание персонализированных email-рассылок</li>
        </ul>
        
        <p><strong>#ChatGPT #n8n #AI #Автоматизация #OpenAI #Интеграция #Workflow</strong></p>
      `,
      tags: ['ChatGPT', 'n8n', 'AI', 'Интеграция'],
      slug: 'chatgpt-n8n-integration-guide'
    },
    {
      id: 'static-4',
      title: "Gemini 2.5 Pro vs ChatGPT-4: что выбрать для автоматизации в 2025 году",
      excerpt: "Сравнительный анализ возможностей Gemini 2.5 Pro и ChatGPT-4 для использования в автоматизации бизнес-процессов.",
      publishedAt: "2025-01-10",
      author: "Эксперт AI",
      category: "AI",
      imageUrl: "https://images.pexels.com/photos/8386450/pexels-photo-8386450.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>В 2025 году выбор правильной AI модели для автоматизации бизнес-процессов становится критически важным решением. Рассмотрим особенности двух лидеров рынка: Gemini 2.5 Pro от Google и ChatGPT-4 от OpenAI.</p>
        
        <h3>Сравнение возможностей</h3>
        <p>Основные параметры для сравнения:</p>
        <ul>
          <li><strong>Понимание контекста:</strong> ChatGPT-4 немного лучше удерживает контекст в длинных диалогах</li>
          <li><strong>Мультимодальность:</strong> Gemini 2.5 Pro показывает лучшие результаты при работе с изображениями и видео</li>
          <li><strong>Скорость:</strong> Gemini 2.5 Pro обрабатывает запросы быстрее</li>
          <li><strong>Точность:</strong> ChatGPT-4 дает более точные ответы в специализированных областях</li>
          <li><strong>Интеграции:</strong> ChatGPT-4 имеет более развитую экосистему интеграций</li>
        </ul>
        
        <h3>Использование в автоматизации</h3>
        <p>Рекомендации по выбору модели для различных задач автоматизации:</p>
        <ul>
          <li><strong>Для обработки текста:</strong> ChatGPT-4 предпочтительнее</li>
          <li><strong>Для анализа визуального контента:</strong> Gemini 2.5 Pro имеет преимущество</li>
          <li><strong>Для быстрых автоматизаций:</strong> Gemini 2.5 Pro обеспечивает лучшую производительность</li>
          <li><strong>Для сложных рассуждений:</strong> ChatGPT-4 показывает более последовательные результаты</li>
        </ul>
        
        <h3>Интеграция с n8n</h3>
        <p>Обе модели можно интегрировать с n8n для создания интеллектуальных автоматизаций. ChatGPT-4 имеет готовый узел в n8n, в то время как для Gemini 2.5 Pro потребуется использовать HTTP Request узел для подключения к API.</p>
        
        <p><strong>#AI #ChatGPT #Gemini #Сравнение #Автоматизация #n8n #GoogleAI #OpenAI</strong></p>
      `,
      tags: ['AI', 'ChatGPT', 'Gemini', 'Сравнение'],
      slug: 'gemini-vs-chatgpt-automation-comparison'
    }
  ];

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      
      // Проверяем, есть ли кэшированные новости
      const cachedNews = localStorage.getItem('blogCache');
      const cacheTime = localStorage.getItem('blogCacheTime');
      
      // Используем кэш, если он есть и не старше 24 часов
      if (cachedNews && cacheTime) {
        const cacheAge = Date.now() - parseInt(cacheTime);
        if (cacheAge < 24 * 60 * 60 * 1000) { // 24 часа
          const parsedCache = JSON.parse(cachedNews);
          setArticles(parsedCache);
          setLastUpdated(new Date(parseInt(cacheTime)).toLocaleString('ru-RU'));
          setLoading(false);
          return;
        }
      }
      
      // Загружаем статьи из Airtable
      const airtableArticles = await airtableService.getArticles();
      
      // Объединяем статьи
      const allArticles = [
        ...airtableArticles, // Статьи из Airtable
        ...staticArticles // Статические статьи (fallback)
      ];
      
      // Удаляем дубликаты по заголовку
      const uniqueArticles = allArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.title === article.title)
      );
      
      // Сортируем по дате публикации
      uniqueArticles.sort((a, b) => 
        new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime()
      );
      
      // Сохраняем в кэш
      localStorage.setItem('blogCache', JSON.stringify(uniqueArticles));
      localStorage.setItem('blogCacheTime', Date.now().toString());
      setLastUpdated(new Date().toLocaleString('ru-RU'));
      
      setArticles(uniqueArticles);
    } catch (err) {
      console.warn('⚠️ Ошибка при загрузке статей:', err);
      // Используем только статические статьи при ошибке
      setArticles(staticArticles);
      setLastUpdated(new Date().toLocaleString('ru-RU'));
    } finally {
      setLoading(false);
    }
  };

  const refreshArticles = async () => {
    setIsRefreshing(true);
    localStorage.removeItem('blogCache');
    localStorage.removeItem('blogCacheTime');
    await loadArticles();
    setIsRefreshing(false);
  };

  // Получаем уникальные категории
  const categories = ["Все", ...Array.from(new Set(articles.map(article => article.category)))];

  // Фильтруем статьи по категории и поисковому запросу
  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === "Все" || article.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  // Функция для создания fallback изображения
  const createFallbackImage = (title: string, category: string) => {
    const colors = {
      'n8n': '6366f1',
      'AI': '14b8a6', 
      'Технологии': 'f59e0b',
      'Образование': 'ef4444',
      'Автоматизация': '8b5cf6',
      'No-Code': '06b6d4',
      'Продуктивность': 'f97316',
      'Маркетинг': 'ec4899',
      'Общее': '8b5cf6'
    };
    const color = colors[category as keyof typeof colors] || '6366f1';
    const encodedTitle = encodeURIComponent(title.substring(0, 30) + '...');
    return `https://via.placeholder.com/800x400/${color}/ffffff?text=${encodedTitle}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (selectedArticle) {
    return (
      <>
        <Helmet>
          <title>{selectedArticle.title} | Блог о n8n и AI</title>
          <meta name="description" content={selectedArticle.excerpt} />
          <meta name="keywords" content={selectedArticle.tags?.join(', ')} />
        </Helmet>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <button
            onClick={() => setSelectedArticle(null)}
            className="mb-6 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-2"
          >
            ← Вернуться к списку статей
          </button>

          <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div className="relative">
              <img 
                src={selectedArticle.imageUrl} 
                alt={selectedArticle.title}
                className="w-full h-64 md:h-80 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = createFallbackImage(selectedArticle.title, selectedArticle.category || 'Общее');
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {selectedArticle.category}
                </span>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(selectedArticle.publishedAt || '')}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {selectedArticle.author}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-6">{selectedArticle.title}</h1>
              
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedArticle.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
              />
            </div>
          </article>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Блог о n8n и искусственном интеллекте | Новости автоматизации</title>
        <meta name="description" content="Читайте последние новости и статьи о n8n, автоматизации рабочих процессов, искусственном интеллекте и машинном обучении. Экспертные обзоры, руководства и аналитика." />
        <meta name="keywords" content="блог n8n, новости автоматизации, искусственный интеллект статьи, машинное обучение, workflow automation" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            Блог о n8n и AI
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Последние новости, обзоры и экспертные мнения о развитии n8n, автоматизации рабочих процессов 
            и искусственном интеллекте.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Последнее обновление: {lastUpdated}
          </p>
        </div>

        {/* Рекламный баннер */}
        <AdaptiveAdBlock 
          blockId="R-A-16048264-7" 
          containerId="yandex_rtb_R-A-16048264-7_blog_top" 
          position="main-banner"
          className="mb-8"
        />

        {/* Поиск и фильтры */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск статей..."
              className="pl-10 w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Фильтр:</span>
            <div className="relative">
              <div className="flex items-center">
                <Filter className="h-4 w-4 text-gray-500 mr-1" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white appearance-none pr-8"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
            
            <button
              onClick={refreshArticles}
              disabled={isRefreshing}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-700 dark:text-gray-300"
              title="Обновить статьи"
            >
              {isRefreshing ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <RefreshCw className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Статус загрузки */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Загружаем статьи...</span>
          </div>
        )}

        {!loading && (
          <>
            {/* Статьи */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map(article => (
                <article 
                  key={article.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col"
                  onClick={() => setSelectedArticle(article)}
                >
                  <div className="relative">
                    <img 
                      src={article.imageUrl} 
                      alt={article.title}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = createFallbackImage(article.title, article.category || 'Общее');
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-600 text-white px-2 py-1 rounded text-xs font-medium">
                        {article.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(article.publishedAt || '')}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 line-clamp-2">
                      {article.title}
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3 flex-grow">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <User className="h-4 w-4" />
                        {article.author}
                      </div>
                      
                      <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium">
                        Читать далее
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredArticles.length === 0 && !loading && (
              <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                  Статьи не найдены
                </p>
                <p className="text-gray-500 dark:text-gray-500">
                  {searchQuery 
                    ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить поисковый запрос.` 
                    : `В категории "${selectedCategory}" пока нет статей.`}
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('Все');
                  }}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </>
        )}

        {/* Популярные темы */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-6 text-center">Популярные темы</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Тренды n8n</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Последние обновления и новые возможности платформы n8n
              </p>
            </div>
            <div className="text-center">
              <Lightbulb className="h-12 w-12 text-secondary-600 dark:text-secondary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Практические советы</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Как эффективно использовать n8n для автоматизации рабочих процессов
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">AI интеграции</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Интеграция искусственного интеллекта в ваши n8n workflow
              </p>
            </div>
          </div>
        </div>

        {/* Рекламный баннер */}
        <AdaptiveAdBlock 
          blockId="R-A-16048264-8" 
          containerId="yandex_rtb_R-A-16048264-8_blog_bottom" 
          position="bottom-banner"
          className="mt-8"
        />

        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Нужна помощь с n8n?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Получите персональную консультацию от нашего AI-ассистента
          </p>
          <Link 
            to="/n8n-assistant"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Открыть n8n Assistant
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default BlogPage;