import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, TrendingUp, Lightbulb, Shield, Loader2, RefreshCw, Filter, Search } from 'lucide-react';
import { airtableService, AirtableArticle } from '../services/airtableService';
import SEOTags from '../components/SEOTags';
import StructuredData from '../components/StructuredData';
import AdaptiveAdBlock from '../components/AdaptiveAdBlock';
import { generateBreadcrumbSchema } from '../utils/seoHelpers';

const BlogPage: React.FC = () => {
  const [articles, setArticles] = useState<AirtableArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedArticle, setSelectedArticle] = useState<AirtableArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  // Статические статьи как fallback
  const staticArticles: AirtableArticle[] = [
    {
      id: 'n8n-guide-1',
      title: "Полное руководство по n8n: от новичка до профессионала",
      excerpt: "Подробное руководство по использованию n8n для автоматизации рабочих процессов, от базовых понятий до продвинутых техник.",
      publishedAt: "2025-01-25",
      author: "Команда AI Hub",
      category: "n8n",
      imageUrl: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>n8n — это мощный инструмент для автоматизации рабочих процессов, который позволяет соединять различные сервисы и создавать сложные автоматизации без необходимости глубоких технических знаний.</p>
      `,
      tags: ['n8n', 'Автоматизация', 'Руководство'],
      slug: 'n8n-complete-guide'
    },
    {
      id: 'n8n-marketing-2',
      title: "10 готовых workflow в n8n для автоматизации маркетинга",
      excerpt: "Готовые решения для автоматизации маркетинговых задач с помощью n8n: от сбора лидов до аналитики кампаний.",
      publishedAt: "2025-01-20",
      author: "Эксперт n8n",
      category: "n8n",
      imageUrl: "https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>Маркетологи постоянно ищут способы оптимизировать свои процессы и повысить эффективность кампаний.</p>
      `,
      tags: ['n8n', 'Маркетинг', 'Автоматизация'],
      slug: 'top-10-n8n-workflows-for-marketers'
    },
    {
      id: 'n8n-ai-3',
      title: "Интеграция AI инструментов с n8n: пошаговое руководство",
      excerpt: "Как интегрировать ChatGPT, Gemini и другие AI инструменты с n8n для создания интеллектуальных автоматизаций.",
      publishedAt: "2025-01-15",
      author: "AI эксперт",
      category: "AI",
      imageUrl: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>Объединение возможностей AI и n8n открывает новые горизонты для автоматизации бизнес-процессов.</p>
      `,
      tags: ['AI', 'n8n', 'Интеграция'],
      slug: 'ai-tools-n8n-integration'
    },
    {
      id: 'csv-analysis-4',
      title: "Как анализировать данные с помощью Chat with CSV",
      excerpt: "Пошаговое руководство по использованию Chat with CSV для анализа данных с примерами и практическими советами.",
      publishedAt: "2025-01-10",
      author: "Аналитик данных",
      category: "Анализ данных",
      imageUrl: "https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>Chat with CSV — это мощный инструмент для интерактивного анализа данных с помощью естественного языка.</p>
      `,
      tags: ['Анализ данных', 'CSV', 'AI'],
      slug: 'chat-with-csv-data-analysis'
    },
    {
      id: 'automation-comparison-5',
      title: "Сравнение n8n, Zapier и Make.com: что выбрать в 2025 году",
      excerpt: "Детальное сравнение популярных инструментов автоматизации: функциональность, цены, ограничения и преимущества.",
      publishedAt: "2025-01-05",
      author: "Эксперт по автоматизации",
      category: "Обзоры",
      imageUrl: "https://images.pexels.com/photos/7376/startup-photos.jpg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>Выбор правильного инструмента автоматизации может значительно повлиять на эффективность вашего бизнеса.</p>
      `,
      tags: ['n8n', 'Zapier', 'Make.com', 'Сравнение'],
      slug: 'n8n-zapier-make-comparison-2025'
    },
    {
      id: 'gpt-content-6',
      title: "Автоматизация генерации контента с GPT",
      excerpt: "Как настроить автоматическую генерацию контента с помощью GPT и n8n для блогов, соцсетей и email-рассылок.",
      publishedAt: "2024-12-28",
      author: "Контент-маркетолог",
      category: "Маркетинг",
      imageUrl: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>Автоматизация генерации контента с помощью GPT позволяет значительно ускорить создание материалов для различных каналов.</p>
      `,
      tags: ['GPT', 'Контент', 'Автоматизация', 'Маркетинг'],
      slug: 'content-generation-automation-gpt'
    },
    {
      id: 'api-integration-7',
      title: "API интеграции в n8n: работа с REST и GraphQL",
      excerpt: "Подробное руководство по настройке интеграций с REST и GraphQL API в n8n с примерами и лучшими практиками.",
      publishedAt: "2024-12-20",
      author: "API специалист",
      category: "Разработка",
      imageUrl: "https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>API интеграции — основа большинства современных автоматизаций. n8n предоставляет мощные инструменты для работы с различными типами API.</p>
      `,
      tags: ['API', 'REST', 'GraphQL', 'n8n', 'Интеграция'],
      slug: 'api-integrations-n8n-rest-graphql'
    },
    {
      id: 'data-processing-8',
      title: "Как настроить автоматизацию обработки данных в n8n",
      excerpt: "Пошаговое руководство по созданию workflow для автоматической обработки, трансформации и анализа данных в n8n.",
      publishedAt: "2024-12-15",
      author: "Инженер данных",
      category: "Данные",
      imageUrl: "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>Автоматизация обработки данных позволяет сэкономить время и избежать ошибок при работе с большими объемами информации.</p>
      `,
      tags: ['Данные', 'ETL', 'n8n', 'Автоматизация'],
      slug: 'data-processing-automation-n8n'
    },
    {
      id: 'security-9',
      title: "Лучшие практики безопасности при работе с API и AI инструментами",
      excerpt: "Рекомендации по обеспечению безопасности при интеграции API и использовании AI инструментов в автоматизациях.",
      publishedAt: "2024-12-10",
      author: "Эксперт по безопасности",
      category: "Безопасность",
      imageUrl: "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>Безопасность — критически важный аспект при работе с API и AI инструментами, особенно когда речь идет о конфиденциальных данных.</p>
      `,
      tags: ['Безопасность', 'API', 'AI', 'Лучшие практики'],
      slug: 'security-best-practices-api-ai'
    },
    {
      id: 'case-study-10',
      title: "Кейс: как компания X сэкономила 20 часов в неделю с помощью n8n автоматизации",
      excerpt: "Реальный пример внедрения n8n для автоматизации рутинных задач, приведший к значительной экономии времени и ресурсов.",
      publishedAt: "2024-12-05",
      author: "Бизнес-аналитик",
      category: "Кейсы",
      imageUrl: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>В этом кейсе мы рассмотрим, как компания X трансформировала свои бизнес-процессы с помощью n8n и достигла впечатляющих результатов.</p>
      `,
      tags: ['Кейс', 'n8n', 'Бизнес', 'ROI', 'Автоматизация'],
      slug: 'case-study-company-x-n8n-automation'
    }
  ];

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      
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
      
      setArticles(uniqueArticles);
      setLastUpdated(new Date().toLocaleString('ru-RU'));
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

  // Хлебные крошки для структурированных данных
  const breadcrumbItems = [
    { name: 'Главная', url: 'https://aimarkethub.pro' },
    { name: 'Блог', url: 'https://aimarkethub.pro/blog' }
  ];

  // Структурированные данные для хлебных крошек
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  if (selectedArticle) {
    return (
      <>
        <PageSEO
          title={selectedArticle.title}
          description={selectedArticle.excerpt}
          keywords={selectedArticle.tags?.join(', ')}
          canonicalUrl={`https://aimarkethub.pro/blog/article/${selectedArticle.slug || selectedArticle.id}`}
          imageUrl={selectedArticle.imageUrl}
        />

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
      <SEOTags
        title="Блог о n8n и искусственном интеллекте | Новости автоматизации"
        description="Читайте последние новости и статьи о n8n, автоматизации рабочих процессов, искусственном интеллекте и машинном обучении. Экспертные обзоры, руководства и аналитика."
        keywords="блог n8n, новости автоматизации, искусственный интеллект статьи, машинное обучение, workflow automation, n8n интеграции, автоматизация процессов n8n, настройка рабочих потоков n8n, создание n8n воркфлоу, n8n для начинающих"
        canonicalUrl="https://aimarkethub.pro/blog"
        imageUrl="https://aimarkethub.pro/images/blog-placeholder.jpg"
        structuredData={[breadcrumbSchema]}
      >
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Блог о n8n и искусственном интеллекте | Новости автоматизации" />
        <meta property="og:description" content="Читайте последние новости и статьи о n8n, автоматизации рабочих процессов, искусственном интеллекте и машинном обучении. Экспертные обзоры, руководства и аналитика." />
        <meta property="og:url" content="https://aimarkethub.pro/blog" />
        <meta property="og:image" content="https://aimarkethub.pro/images/blog-placeholder.jpg" />
      </SEOTags>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="text-center mb-12">
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
          containerId="yandex_rtb_R-A-16048264-7_blog" 
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
          
          <div className="flex gap-2">
            <div className="relative">
              <button
                className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center gap-2 text-gray-700 dark:text-gray-300"
              >
                <Filter className="h-5 w-5" />
                <span className="hidden md:inline">Фильтр: {selectedCategory}</span>
                <span className="md:hidden">Фильтр</span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      selectedCategory === category
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {category}
                  </button>
                ))}
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
            {/* Категории */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                    selectedCategory === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Статьи */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map(article => (
                <article 
                  key={article.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col"
                  onClick={() => navigate(`/blog/article/${article.slug || article.id}`)}
                  aria-label={`Статья: ${article.title}`}
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
                    
                    {/* Теги статьи */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {article.tags.slice(0, 3).map((tag, tagIndex) => (
                          <span key={tagIndex} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-1.5 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {filteredArticles.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  {searchQuery 
                    ? `По запросу "${searchQuery}" ничего не найдено. Попробуйте изменить поисковый запрос.` 
                    : `В категории "${selectedCategory}" пока нет статей.`}
                </p>
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
              <h3 className="font-semibold mb-2">n8n Автоматизация</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Руководства и примеры workflow для автоматизации бизнес-процессов с n8n
              </p>
            </div>
            <div className="text-center">
              <Lightbulb className="h-12 w-12 text-secondary-600 dark:text-secondary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">AI интеграции</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Как эффективно использовать AI инструменты в автоматизации процессов
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Лучшие практики</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Советы по безопасности, оптимизации и масштабированию автоматизаций
              </p>
            </div>
          </div>
        </div>

        {/* Рекламный баннер */}
        <AdaptiveAdBlock 
          blockId="R-A-16048264-8" 
          containerId="yandex_rtb_R-A-16048264-8_blog_bottom" 
          position="bottom-banner"
          className="mt-12"
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