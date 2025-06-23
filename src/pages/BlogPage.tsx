import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Calendar, User, ArrowRight, TrendingUp, Lightbulb, Shield } from 'lucide-react';

const BlogPage: React.FC = () => {
  const articles = [
    {
      id: 1,
      title: "Революция искусственного интеллекта: как ChatGPT меняет наш мир",
      excerpt: "Исследуем влияние больших языковых моделей на различные сферы жизни и их потенциал для будущего развития человечества.",
      date: "15 января 2025",
      author: "Команда AI Hub",
      category: "Технологии",
      readTime: "8 мин",
      image: "https://picsum.photos/800/400?random=1",
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
      `
    },
    {
      id: 2,
      title: "Сравнение языковых моделей: Qwen vs Gemini vs Llama",
      excerpt: "Подробный анализ возможностей различных AI-моделей и рекомендации по выбору оптимальной для ваших задач.",
      date: "12 января 2025",
      author: "Эксперт AI",
      category: "Обзоры",
      readTime: "12 мин",
      image: "https://picsum.photos/800/400?random=2",
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
      `
    },
    {
      id: 3,
      title: "Этика использования ИИ: принципы ответственного взаимодействия",
      excerpt: "Важные аспекты этичного использования искусственного интеллекта и рекомендации для пользователей.",
      date: "10 января 2025",
      author: "Этик AI",
      category: "Этика",
      readTime: "10 мин",
      image: "https://picsum.photos/800/400?random=3",
      content: `
        <p>С ростом популярности AI-технологий становится важным понимание этических аспектов их использования.</p>
        
        <h3>Основные принципы</h3>
        <ul>
          <li>Честность - не выдавайте AI-контент за собственный</li>
          <li>Проверка фактов - всегда верифицируйте полученную информацию</li>
          <li>Уважение к авторским правам</li>
          <li>Ответственное использование возможностей AI</li>
        </ul>
        
        <h3>Что следует избегать</h3>
        <ul>
          <li>Создание вредоносного или оскорбительного контента</li>
          <li>Попытки обойти системы безопасности</li>
          <li>Использование AI для мошенничества</li>
          <li>Распространение дезинформации</li>
        </ul>
        
        <h3>Лучшие практики</h3>
        <p>Используйте AI как инструмент для обучения, творчества и решения проблем. Всегда критически оценивайте полученные результаты и дополняйте их собственными знаниями и опытом.</p>
      `
    },
    {
      id: 4,
      title: "Будущее образования с искусственным интеллектом",
      excerpt: "Как AI-технологии трансформируют процесс обучения и какие возможности открываются для студентов и преподавателей.",
      date: "8 января 2025",
      author: "Педагог-новатор",
      category: "Образование",
      readTime: "9 мин",
      image: "https://picsum.photos/800/400?random=4",
      content: `
        <p>Искусственный интеллект открывает новые горизонты в образовании, делая обучение более персонализированным и доступным.</p>
        
        <h3>Персонализированное обучение</h3>
        <p>AI может адаптироваться к индивидуальному стилю обучения каждого студента:</p>
        <ul>
          <li>Анализ скорости усвоения материала</li>
          <li>Подбор оптимальных методов объяснения</li>
          <li>Создание индивидуальных учебных планов</li>
        </ul>
        
        <h3>Помощь преподавателям</h3>
        <ul>
          <li>Автоматизация проверки заданий</li>
          <li>Генерация учебных материалов</li>
          <li>Анализ успеваемости студентов</li>
          <li>Создание интерактивных упражнений</li>
        </ul>
        
        <h3>Доступность образования</h3>
        <p>AI делает качественное образование доступным для всех, независимо от географического положения или финансовых возможностей.</p>
      `
    }
  ];

  const categories = ["Все", "Технологии", "Обзоры", "Этика", "Образование"];
  const [selectedCategory, setSelectedCategory] = React.useState("Все");
  const [selectedArticle, setSelectedArticle] = React.useState<number | null>(null);

  const filteredArticles = selectedCategory === "Все" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  // Функция для создания fallback изображения
  const createFallbackImage = (title: string, category: string) => {
    const colors = {
      'Технологии': '6366f1',
      'Обзоры': '14b8a6', 
      'Этика': 'f59e0b',
      'Образование': 'ef4444'
    };
    const color = colors[category as keyof typeof colors] || '6366f1';
    const encodedTitle = encodeURIComponent(title.substring(0, 30) + '...');
    return `https://via.placeholder.com/800x400/${color}/ffffff?text=${encodedTitle}`;
  };

  if (selectedArticle) {
    const article = articles.find(a => a.id === selectedArticle);
    if (!article) return null;

    return (
      <>
        <Helmet>
          <title>{article.title} | Блог о ChatGPT и ИИ</title>
          <meta name="description" content={article.excerpt} />
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
                src={article.image} 
                alt={article.title}
                className="w-full h-64 md:h-80 object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = createFallbackImage(article.title, article.category);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-4 left-4">
                <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                  {article.category}
                </span>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {article.date}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {article.author}
                </span>
                <span>{article.readTime}</span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-6">{article.title}</h1>
              
              <div 
                className="prose dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ __html: article.content }}
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
              onClick={() => setSelectedArticle(article.id)}
            >
              <div className="relative">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = createFallbackImage(article.title, article.category);
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
                    {article.date}
                  </span>
                  <span>{article.readTime}</span>
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