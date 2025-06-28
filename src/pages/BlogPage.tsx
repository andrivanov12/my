import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight, TrendingUp, Lightbulb, Shield, Loader2, AlertCircle } from 'lucide-react';
import { airtableService, AirtableArticle } from '../services/airtableService';

const BlogPage: React.FC = () => {
  const [articles, setArticles] = useState<AirtableArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [selectedArticle, setSelectedArticle] = useState<AirtableArticle | null>(null);

  // Статические статьи как fallback
  const staticArticles: AirtableArticle[] = [
    {
      id: 'static-1',
      title: "Революция искусственного интеллекта: как ChatGPT меняет наш мир",
      excerpt: "Исследуем влияние больших языковых моделей на различные сферы жизни и их потенциал для будущего развития человечества.",
      publishedAt: "2025-01-15",
      author: "Команда AI Hub",
      category: "Технологии",
      imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>Искусственный интеллект переживает беспрецедентный период развития. ChatGPT и подобные языковые модели революционизируют способы взаимодействия человека с технологиями.</p>
        
        <h3>Основные области применения</h3>
        <p>Современные AI-системы находят применение в:</p>
        <ul>
          <li>Образовании - персонализированное обучение и объяснение сложных концепций</li>
          <li>Медицине - анализ симптомов и помощь в диагностике</li>
          <li>Программировании - автоматизация написания кода и отладка</li>
          <li>Творчестве - генерация текстов, идей и концепций</li>
        </ul>
        
        <h3>Преимущества для пользователей</h3>
        <p>Доступность AI-технологий без регистрации открывает новые возможности:</p>
        <ul>
          <li>Мгновенный доступ к знаниям и помощи</li>
          <li>Отсутствие барьеров для экспериментирования</li>
          <li>Возможность изучения AI без технических навыков</li>
        </ul>
        
        <h3>Будущее AI-технологий</h3>
        <p>Эксперты прогнозируют дальнейшее развитие в направлении более специализированных и точных моделей, способных решать узкоспециализированные задачи с высокой эффективностью.</p>
        
        <p><strong>#AI #ChatGPT #Технологии #ИскусственныйИнтеллект #Будущее #Инновации #МашинноеОбучение #НейронныеСети</strong></p>
      `,
      tags: ['AI', 'ChatGPT', 'Технологии'],
      slug: 'ai-revolution-chatgpt'
    },
    {
      id: 'static-2',
      title: "Сравнение языковых моделей: Qwen vs Gemini vs Llama",
      excerpt: "Подробный анализ возможностей различных AI-моделей и рекомендации по выбору оптимальной для ваших задач.",
      publishedAt: "2025-01-12",
      author: "Эксперт AI",
      category: "Обзоры",
      imageUrl: "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>Выбор подходящей языковой модели может значительно повлиять на качество получаемых результатов. Рассмотрим особенности каждой модели.</p>
        
        <h3>Qwen 3 30B - универсальный помощник</h3>
        <p>Преимущества:</p>
        <ul>
          <li>Отличное понимание контекста</li>
          <li>Высокое качество генерации текста</li>
          <li>Хорошая работа с русским языком</li>
          <li>Стабильные результаты для большинства задач</li>
        </ul>
        
        <h3>Gemini 2.5 Flash - скорость и эффективность</h3>
        <p>Особенности:</p>
        <ul>
          <li>Быстрая обработка запросов</li>
          <li>Оптимизирована для коротких ответов</li>
          <li>Энергоэффективность</li>
          <li>Подходит для простых задач</li>
        </ul>
        
        <h3>Llama 4 Maverick - мультимодальность</h3>
        <p>Уникальные возможности:</p>
        <ul>
          <li>Анализ изображений</li>
          <li>Работа с визуальным контентом</li>
          <li>Комбинирование текста и изображений</li>
          <li>Инновационные алгоритмы обработки</li>
        </ul>
        
        <h3>Рекомендации по выбору</h3>
        <p>Для начинающих пользователей рекомендуется Qwen 3 30B как наиболее универсальное решение. Gemini подойдет для быстрых консультаций, а Llama - для работы с изображениями.</p>
        
        <p><strong>#Сравнение #AIМодели #Обзор #Qwen #Gemini #Llama #ИИ #Технологии #Выбор #Рекомендации</strong></p>
      `,
      tags: ['Сравнение', 'AI модели', 'Обзор'],
      slug: 'ai-models-comparison'
    }
  ];

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Загружаем статьи из Airtable
      const airtableArticles = await airtableService.getArticles().catch(() => []);
      
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
      
      if (airtableArticles.length === 0) {
        setError('Показываем статические статьи. Статьи из Airtable недоступны.');
      }
    } catch (err) {
      console.error('Error loading articles:', err);
      setError('Не удалось загрузить статьи. Показываем статические статьи.');
      setArticles(staticArticles);
    } finally {
      setLoading(false);
    }
  };

  // Получаем уникальные категории
  const categories = ["Все", ...Array.from(new Set(articles.map(article => article.category)))];

  const filteredArticles = selectedCategory === "Все" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  // Функция для создания fallback изображения
  const createFallbackImage = (title: string, category: string) => {
    const colors = {
      'Технологии': '6366f1',
      'Обзоры': '14b8a6', 
      'Этика': 'f59e0b',
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
          <title>{selectedArticle.title} | Блог о ChatGPT и ИИ</title>
          <meta name="description" content={selectedArticle.excerpt} />
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
        <title>Блог о ChatGPT и искусственном интеллекте | Новости AI</title>
        <meta name="description" content="Читайте последние новости и статьи о ChatGPT, искусственном интеллекте и машинном обучении. Экспертные обзоры, руководства и аналитика." />
        <meta name="keywords" content="блог chatgpt, новости ии, искусственный интеллект статьи, машинное обучение" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            Блог о ChatGPT и ИИ
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Последние новости, обзоры и экспертные мнения о развитии искусственного интеллекта 
            и его влиянии на нашу жизнь.
          </p>
        </div>

        {/* Статус загрузки и ошибки */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Загружаем статьи...</span>
          </div>
        )}

        {error && (
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-blue-800 dark:text-blue-200">{error}</span>
            </div>
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
            <div className="grid md:grid-cols-2 gap-8">
              {filteredArticles.map(article => (
                <article 
                  key={article.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
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
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(article.publishedAt || '')}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold mb-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                      {article.title}
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
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
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  В категории "{selectedCategory}" пока нет статей.
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
              <h3 className="font-semibold mb-2">Тренды ИИ</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Последние достижения в области искусственного интеллекта
              </p>
            </div>
            <div className="text-center">
              <Lightbulb className="h-12 w-12 text-secondary-600 dark:text-secondary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Практические советы</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Как эффективно использовать ChatGPT в повседневной жизни
              </p>
            </div>
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Безопасность</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Этичное и безопасное использование AI-технологий
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Попробуйте ChatGPT прямо сейчас</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Применяйте полученные знания на практике
          </p>
          <Link 
            to="/chat"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            Начать общение с AI
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default BlogPage;