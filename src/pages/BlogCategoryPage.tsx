import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight, Loader2, Search, Filter, RefreshCw } from 'lucide-react';
import { airtableService, AirtableArticle } from '../services/airtableService';
import AdaptiveAdBlock from '../components/AdaptiveAdBlock';

interface CategoryInfo {
  [key: string]: {
    title: string;
    description: string;
    metaTitle: string;
    metaDescription: string;
    keywords: string;
  };
}

const BlogCategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [articles, setArticles] = useState<AirtableArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Информация о категориях
  const categoryInfo: CategoryInfo = {
    'n8n': {
      title: 'Статьи о n8n автоматизации',
      description: 'Здесь вы найдете подробные руководства, советы и лучшие практики по использованию n8n для автоматизации бизнес-процессов, интеграции сервисов и оптимизации рабочих процессов.',
      metaTitle: 'n8n автоматизация | Руководства, советы и лучшие практики',
      metaDescription: 'Подробные руководства, советы и лучшие практики по использованию n8n для автоматизации бизнес-процессов. Узнайте, как эффективно настраивать workflow и интегрировать различные сервисы.',
      keywords: 'n8n, автоматизация, workflow, интеграция, бизнес-процессы, n8n руководство, n8n tutorial'
    },
    'ai-tools': {
      title: 'Статьи про AI инструменты',
      description: 'Обзоры, руководства и практические советы по использованию инструментов искусственного интеллекта для автоматизации задач, генерации контента и анализа данных.',
      metaTitle: 'AI инструменты | Обзоры, руководства и практическое применение',
      metaDescription: 'Обзоры, руководства и практические советы по использованию инструментов искусственного интеллекта для автоматизации задач, генерации контента и анализа данных.',
      keywords: 'AI инструменты, искусственный интеллект, ChatGPT, Gemini, Llama, генерация контента, анализ данных, машинное обучение'
    },
    'data-analysis': {
      title: 'Статьи про анализ данных',
      description: 'Методики, инструменты и практики для эффективного анализа данных. Узнайте, как извлекать ценные инсайты из ваших данных и принимать обоснованные решения.',
      metaTitle: 'Анализ данных | Методики, инструменты и практики',
      metaDescription: 'Методики, инструменты и практики для эффективного анализа данных. Узнайте, как извлекать ценные инсайты из ваших данных и принимать обоснованные решения.',
      keywords: 'анализ данных, data analysis, визуализация данных, бизнес-аналитика, BI, big data, машинное обучение, статистика'
    },
    'case-studies': {
      title: 'Кейсы использования',
      description: 'Реальные примеры успешного внедрения автоматизации и AI инструментов в бизнес-процессы. Узнайте, как другие компании решали свои задачи и какие результаты получили.',
      metaTitle: 'Кейсы использования автоматизации и AI | Реальные примеры',
      metaDescription: 'Реальные примеры успешного внедрения автоматизации и AI инструментов в бизнес-процессы. Узнайте, как другие компании решали свои задачи и какие результаты получили.',
      keywords: 'кейсы, case studies, примеры использования, автоматизация бизнеса, внедрение AI, успешные проекты, ROI автоматизации'
    }
  };

  // Проверка валидности категории
  useEffect(() => {
    if (category && !Object.keys(categoryInfo).includes(category)) {
      navigate('/blog');
    }
  }, [category, navigate]);

  useEffect(() => {
    loadArticles();
  }, [category]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      
      // Проверяем, есть ли кэшированные новости
      const cachedNews = localStorage.getItem(`blogCache_${category || 'all'}`);
      const cacheTime = localStorage.getItem(`blogCacheTime_${category || 'all'}`);
      
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
      
      // Статические статьи для категорий
      const staticArticlesByCategory = {
        'n8n': staticArticles.filter(article => 
          article.category === 'n8n' || 
          article.tags?.includes('n8n') || 
          article.tags?.includes('Workflow') || 
          article.tags?.includes('Автоматизация')
        ),
        'ai-tools': staticArticles.filter(article => 
          article.category === 'AI' || 
          article.tags?.includes('AI') || 
          article.tags?.includes('ChatGPT') || 
          article.tags?.includes('Gemini')
        ),
        'data-analysis': staticArticles.filter(article => 
          article.tags?.includes('Анализ данных') || 
          article.tags?.includes('CSV') || 
          article.title.toLowerCase().includes('анализ') || 
          article.title.toLowerCase().includes('данных')
        ),
        'case-studies': staticArticles.filter(article => 
          article.tags?.includes('Кейс') || 
          article.title.toLowerCase().includes('кейс') || 
          article.title.toLowerCase().includes('case study')
        )
      };
      
      // Выбираем статьи для текущей категории или все статьи
      const relevantStaticArticles = category 
        ? staticArticlesByCategory[category] || []
        : staticArticles;
      
      // Фильтруем статьи из Airtable по категории
      const relevantAirtableArticles = category
        ? airtableArticles.filter(article => {
            const lowerCategory = category.toLowerCase();
            const articleCategory = article.category?.toLowerCase() || '';
            const articleTags = article.tags?.map(tag => tag.toLowerCase()) || [];
            const articleTitle = article.title.toLowerCase();
            
            return articleCategory.includes(lowerCategory) || 
                   articleTags.some(tag => tag.includes(lowerCategory)) ||
                   articleTitle.includes(lowerCategory);
          })
        : airtableArticles;
      
      // Объединяем статьи
      const allArticles = [
        ...relevantAirtableArticles,
        ...relevantStaticArticles
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
      localStorage.setItem(`blogCache_${category || 'all'}`, JSON.stringify(uniqueArticles));
      localStorage.setItem(`blogCacheTime_${category || 'all'}`, Date.now().toString());
      setLastUpdated(new Date().toLocaleString('ru-RU'));
      
      setArticles(uniqueArticles);
    } catch (err) {
      console.warn('⚠️ Ошибка при загрузке статей:', err);
      // Используем только статические статьи при ошибке
      const fallbackArticles = category 
        ? staticArticles.filter(article => {
            const lowerCategory = category.toLowerCase();
            const articleCategory = article.category?.toLowerCase() || '';
            const articleTags = article.tags?.map(tag => tag.toLowerCase()) || [];
            
            return articleCategory.includes(lowerCategory) || 
                   articleTags.some(tag => tag.includes(lowerCategory));
          })
        : staticArticles;
      
      setArticles(fallbackArticles);
      setLastUpdated(new Date().toLocaleString('ru-RU'));
    } finally {
      setLoading(false);
    }
  };

  const refreshArticles = async () => {
    setIsRefreshing(true);
    localStorage.removeItem(`blogCache_${category || 'all'}`);
    localStorage.removeItem(`blogCacheTime_${category || 'all'}`);
    await loadArticles();
    setIsRefreshing(false);
  };

  // Фильтруем статьи по поисковому запросу
  const filteredArticles = articles.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
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

  // Получаем информацию о текущей категории
  const currentCategory = category ? categoryInfo[category] : null;

  return (
    <>
      <Helmet>
        <title>{currentCategory?.metaTitle || 'Блог о n8n и искусственном интеллекте | Новости автоматизации'}</title>
        <meta name="description" content={currentCategory?.metaDescription || 'Читайте последние новости и статьи о n8n, автоматизации рабочих процессов, искусственном интеллекте и машинном обучении. Экспертные обзоры, руководства и аналитика.'} />
        <meta name="keywords" content={currentCategory?.keywords || 'блог n8n, новости автоматизации, искусственный интеллект статьи, машинное обучение, workflow automation'} />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              Блог
            </Link>
            {category && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-800 dark:text-gray-200">{currentCategory?.title}</span>
              </>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            {currentCategory?.title || 'Блог о n8n и AI'}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
            {currentCategory?.description || 'Последние новости, обзоры и экспертные мнения о развитии n8n, автоматизации рабочих процессов и искусственном интеллекте.'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Последнее обновление: {lastUpdated}
          </p>
        </div>

        {/* Рекламный баннер */}
        <AdaptiveAdBlock 
          blockId="R-A-16048264-7" 
          containerId="yandex_rtb_R-A-16048264-7_blog_category" 
          position="main-banner"
          className="mb-8"
        />

        {/* Поиск */}
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
                  onClick={() => navigate(`/blog/article/${article.slug || article.id}`)}
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
                    : `В данной категории пока нет статей.`}
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    navigate('/blog');
                  }}
                  className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
                >
                  Вернуться ко всем статьям
                </button>
              </div>
            )}
          </>
        )}

        {/* Другие категории */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Другие категории</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(categoryInfo)
              .filter(([key]) => key !== category)
              .map(([key, info]) => (
                <Link 
                  key={key}
                  to={`/blog/${key}`}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200"
                >
                  <h3 className="font-semibold mb-2 text-primary-600 dark:text-primary-400">{info.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{info.description}</p>
                </Link>
              ))}
          </div>
        </div>

        {/* Рекламный баннер */}
        <AdaptiveAdBlock 
          blockId="R-A-16048264-8" 
          containerId="yandex_rtb_R-A-16048264-8_blog_category_bottom" 
          position="bottom-banner"
          className="mt-8"
        />
      </div>
    </>
  );
};

export default BlogCategoryPage;