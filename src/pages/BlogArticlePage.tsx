import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, ArrowLeft, Share2, Bookmark, Copy, Check, MessageSquare } from 'lucide-react';
import { airtableService, AirtableArticle } from '../services/airtableService';
import AdaptiveAdBlock from '../components/AdaptiveAdBlock';
import BlogSEO from '../components/BlogSEO';

const BlogArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<AirtableArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState<AirtableArticle[]>([]);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  // Статические статьи как fallback
  const staticArticles: AirtableArticle[] = [
    {
      id: 'static-1',
      title: "Полное руководство по n8n: от новичка до профессионала",
      excerpt: "Подробное руководство по использованию n8n для автоматизации рабочих процессов, от базовых понятий до продвинутых техник.",
      publishedAt: "2025-01-25",
      author: "Команда AI Hub",
      category: "n8n",
      imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
      content: `
        <p>n8n — это мощный инструмент для автоматизации рабочих процессов, который позволяет соединять различные сервисы и создавать сложные автоматизации без необходимости глубоких технических знаний. В этом руководстве мы рассмотрим все аспекты работы с n8n, начиная с базовых понятий и заканчивая продвинутыми техниками.</p>
        
        <h3>Что такое n8n?</h3>
        <p>n8n (произносится как "n-eight-n") — это инструмент автоматизации рабочих процессов с открытым исходным кодом, который позволяет соединять различные сервисы и API для создания автоматизированных рабочих процессов. Ключевые особенности n8n:</p>
        <ul>
          <li>Открытый исходный код и возможность self-hosted установки</li>
          <li>Более 300+ интеграций с популярными сервисами</li>
          <li>Визуальный редактор для создания workflow</li>
          <li>Возможность использования JavaScript для сложной логики</li>
          <li>Отсутствие ограничений на количество операций</li>
          <li>Поддержка webhook, cron и других триггеров</li>
        </ul>
        
        <h3>Основные концепции n8n</h3>
        <p>Для эффективной работы с n8n необходимо понимать следующие базовые концепции:</p>
        <ul>
          <li><strong>Узлы (Nodes)</strong> — основные строительные блоки workflow, каждый выполняет определенную функцию</li>
          <li><strong>Соединения (Connections)</strong> — связи между узлами, определяющие поток данных</li>
          <li><strong>Рабочие процессы (Workflows)</strong> — последовательности узлов и соединений для выполнения задачи автоматизации</li>
          <li><strong>Триггеры (Triggers)</strong> — специальные узлы для запуска workflow (Webhook, Cron и т.д.)</li>
          <li><strong>Выражения (Expressions)</strong> — способ доступа к данным с использованием синтаксиса {{ $json.field }}</li>
        </ul>
        
        <h3>Начало работы с n8n</h3>
        <p>Для начала работы с n8n вам необходимо:</p>
        <ol>
          <li>Установить n8n (локально или использовать облачную версию n8n.cloud)</li>
          <li>Создать свой первый workflow</li>
          <li>Добавить триггер для запуска workflow</li>
          <li>Настроить узлы для выполнения нужных действий</li>
          <li>Соединить узлы для определения потока данных</li>
          <li>Активировать workflow</li>
        </ol>
        
        <h3>Продвинутые техники в n8n</h3>
        <p>После освоения основ вы можете перейти к более сложным техникам:</p>
        <ul>
          <li>Использование JavaScript в Function узлах для сложной логики</li>
          <li>Работа с условиями и ветвлениями с помощью IF и Switch узлов</li>
          <li>Обработка ошибок и исключений</li>
          <li>Создание многоуровневых workflow с использованием Execute Workflow</li>
          <li>Оптимизация производительности для обработки больших объемов данных</li>
        </ul>
        
        <h3>Лучшие практики работы с n8n</h3>
        <p>Для создания эффективных и надежных workflow рекомендуется следовать этим лучшим практикам:</p>
        <ul>
          <li>Давайте понятные имена узлам и workflow</li>
          <li>Используйте комментарии для документирования сложной логики</li>
          <li>Разбивайте сложные workflow на более мелкие и управляемые</li>
          <li>Всегда добавляйте обработку ошибок</li>
          <li>Тестируйте workflow с различными входными данными</li>
          <li>Используйте переменные окружения для хранения чувствительных данных</li>
        </ul>
        
        <p><strong>#n8n #Автоматизация #Workflow #NoCode #LowCode #Интеграции #Руководство</strong></p>
      `,
      tags: ['n8n', 'Автоматизация', 'Руководство'],
      slug: 'n8n-complete-guide'
    },
    {
      id: 'static-2',
      title: "10 готовых workflow в n8n для автоматизации маркетинга",
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
    }
  ];

  useEffect(() => {
    if (slug) {
      loadArticle(slug);
    }
  }, [slug]);

  const loadArticle = async (articleSlug: string) => {
    setLoading(true);
    
    try {
      // Проверяем, есть ли статья в кэше
      const cachedArticle = localStorage.getItem(`article_${articleSlug}`);
      if (cachedArticle) {
        setArticle(JSON.parse(cachedArticle));
        
        // Загружаем связанные статьи
        await loadRelatedArticles(JSON.parse(cachedArticle));
        setLoading(false);
        return;
      }
      
      // Пытаемся найти статью в Airtable
      const airtableArticle = await airtableService.getArticleBySlug(articleSlug);
      
      if (airtableArticle) {
        setArticle(airtableArticle);
        localStorage.setItem(`article_${articleSlug}`, JSON.stringify(airtableArticle));
        
        // Загружаем связанные статьи
        await loadRelatedArticles(airtableArticle);
      } else {
        // Ищем в статических статьях
        const staticArticle = staticArticles.find(a => a.slug === articleSlug || a.id === articleSlug);
        
        if (staticArticle) {
          setArticle(staticArticle);
          localStorage.setItem(`article_${articleSlug}`, JSON.stringify(staticArticle));
          
          // Загружаем связанные статьи
          await loadRelatedArticles(staticArticle);
        } else {
          // Статья не найдена
          navigate('/blog');
        }
      }
    } catch (error) {
      console.error('Ошибка при загрузке статьи:', error);
      navigate('/blog');
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedArticles = async (currentArticle: AirtableArticle) => {
    try {
      // Получаем все статьи
      const allArticles = await airtableService.getArticles();
      
      // Объединяем с статическими статьями
      const combinedArticles = [...allArticles, ...staticArticles];
      
      // Удаляем дубликаты
      const uniqueArticles = combinedArticles.filter((article, index, self) => 
        index === self.findIndex(a => a.title === article.title)
      );
      
      // Находим связанные статьи
      let related = uniqueArticles.filter(article => 
        article.id !== currentArticle.id && (
          article.category === currentArticle.category ||
          article.tags?.some(tag => currentArticle.tags?.includes(tag))
        )
      );
      
      // Если связанных статей мало, добавляем другие статьи
      if (related.length < 3) {
        const otherArticles = uniqueArticles.filter(article => 
          article.id !== currentArticle.id && 
          !related.some(r => r.id === article.id)
        );
        
        related = [...related, ...otherArticles].slice(0, 3);
      } else {
        related = related.slice(0, 3);
      }
      
      setRelatedArticles(related);
    } catch (error) {
      console.error('Ошибка при загрузке связанных статей:', error);
      
      // Fallback: используем статические статьи
      const related = staticArticles.filter(article => 
        article.id !== currentArticle.id
      ).slice(0, 3);
      
      setRelatedArticles(related);
    }
  };

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleBookmark = () => {
    // Получаем текущие закладки
    const bookmarks = JSON.parse(localStorage.getItem('blog_bookmarks') || '[]');
    
    // Проверяем, есть ли уже эта статья в закладках
    const isBookmarked = bookmarks.some((b: any) => b.id === article?.id);
    
    if (isBookmarked) {
      // Удаляем из закладок
      const updatedBookmarks = bookmarks.filter((b: any) => b.id !== article?.id);
      localStorage.setItem('blog_bookmarks', JSON.stringify(updatedBookmarks));
      setBookmarked(false);
    } else if (article) {
      // Добавляем в закладки
      const bookmarkData = {
        id: article.id,
        title: article.title,
        slug: article.slug || article.id,
        category: article.category,
        date: new Date().toISOString()
      };
      
      const updatedBookmarks = [...bookmarks, bookmarkData];
      localStorage.setItem('blog_bookmarks', JSON.stringify(updatedBookmarks));
      setBookmarked(true);
    }
  };

  // Проверяем, находится ли статья в закладках
  useEffect(() => {
    if (article) {
      const bookmarks = JSON.parse(localStorage.getItem('blog_bookmarks') || '[]');
      const isBookmarked = bookmarks.some((b: any) => b.id === article.id);
      setBookmarked(isBookmarked);
    }
  }, [article]);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Статья не найдена</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Запрашиваемая статья не существует или была удалена.</p>
        <Link 
          to="/blog"
          className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Вернуться к блогу
        </Link>
      </div>
    );
  }

  return (
    <>
      <BlogSEO
        title={`${article.title} | Блог о n8n и AI`}
        description={article.excerpt || ''}
        keywords={article.tags?.join(', ')}
        canonicalUrl={`https://aimarkethub.pro/blog/article/${article.slug || article.id}`}
        imageUrl={article.imageUrl}
        publishDate={article.publishedAt || new Date().toISOString()}
        author={article.author || 'AI Market Hub'}
        category={article.category}
        tags={article.tags}
        slug={article.slug || article.id}
      />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Навигация */}
        <div className="flex items-center gap-2 mb-6 text-sm">
          <Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
            Блог
          </Link>
          <span className="text-gray-400">/</span>
          {article.category && (
            <>
              <Link 
                to={`/blog/${article.category.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
              >
                {article.category}
              </Link>
              <span className="text-gray-400">/</span>
            </>
          )}
          <span className="text-gray-800 dark:text-gray-200 truncate">{article.title}</span>
        </div>

        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* Изображение статьи */}
          <div className="relative">
            <img 
              src={article.imageUrl} 
              alt={article.title}
              className="w-full h-64 md:h-96 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `/images/${article.category?.toLowerCase() || 'blog'}-placeholder.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {article.category}
              </span>
            </div>
          </div>
          
          {/* Контент статьи */}
          <div className="p-6 md:p-8">
            {/* Мета-информация */}
            <div className="flex items-center justify-between gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatDate(article.publishedAt || '')}
                </span>
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {article.author}
                </span>
              </div>
              
              {/* Действия */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleCopyLink}
                  className="p-1.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Копировать ссылку"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                </button>
                <button 
                  onClick={handleBookmark}
                  className={`p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    bookmarked 
                      ? 'text-primary-600 dark:text-primary-400' 
                      : 'text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400'
                  }`}
                  title={bookmarked ? "Удалить из закладок" : "Добавить в закладки"}
                >
                  <Bookmark className="h-4 w-4" fill={bookmarked ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Заголовок */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6">{article.title}</h1>
            
            {/* Теги */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Рекламный баннер перед контентом */}
            <AdaptiveAdBlock 
              blockId="R-A-16048264-7" 
              containerId="yandex_rtb_R-A-16048264-7_article_top" 
              position="main-banner"
              className="mb-8"
            />
            
            {/* Основной контент */}
            <div 
              className="prose dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
            
            {/* Рекламный баннер после контента */}
            <AdaptiveAdBlock 
              blockId="R-A-16048264-8" 
              containerId="yandex_rtb_R-A-16048264-8_article_bottom" 
              position="bottom-banner"
              className="mt-8"
            />
            
            {/* Автор и поделиться */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Автор</p>
                  <p className="font-semibold">{article.author}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Поделиться:</span>
                  <button 
                    onClick={() => window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(article.title)}`, '_blank', 'noopener,noreferrer')}
                    className="p-2 bg-[#0088cc] text-white rounded-full hover:opacity-90 transition-opacity"
                    title="Поделиться в Telegram"
                    aria-label="Поделиться в Telegram"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.44 4.552 2.56 11.017c-1.151.435-1.143 1.102-.21 1.387l4.349 1.358 10.073-6.352c.476-.294.91-.134.553.188L8.818 15.51l-.206 3.08c.3.418.436.418.872.127l2.092-1.854 4.35 3.21c.803.442 1.38.211 1.58-.744l2.859-13.471c.294-1.176-.447-1.712-1.247-1.306Z"/>
                    </svg>
                  </button>
                  <button 
                    onClick={() => window.open(`https://vk.com/share.php?url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(article.title)}`, '_blank', 'noopener,noreferrer')}
                    className="p-2 bg-[#4C75A3] text-white rounded-full hover:opacity-90 transition-opacity"
                    title="Поделиться ВКонтакте"
                    aria-label="Поделиться ВКонтакте"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.579 6.855c.14-.465 0-.806-.666-.806h-2.199c-.56 0-.817.296-.956.624 0 0-1.116 2.719-2.7 4.484-.51.51-.743.675-1.021.675-.14 0-.347-.165-.347-.63V6.855c0-.56-.161-.806-.626-.806H9.642c-.347 0-.557.26-.557.507 0 .532.794.654.874 2.15v3.251c0 .713-.129.842-.41.842-.743 0-2.549-2.731-3.62-5.857-.21-.606-.42-.854-.98-.854H2.752c-.626 0-.752.296-.752.624 0 .584.743 3.477 3.461 7.302 1.812 2.614 4.363 4.029 6.684 4.029 1.393 0 1.565-.314 1.565-.853v-1.966c0-.626.132-.752.574-.752.325 0 .882.166 2.183 1.417 1.486 1.486 1.732 2.153 2.567 2.153h2.199c.626 0 .939-.314.759-.932-.197-.614-.907-1.506-1.849-2.564-.51-.604-1.277-1.254-1.51-1.579-.325-.419-.232-.604 0-.976.001 0 2.672-3.765 2.949-5.044Z"/>
                    </svg>
                  </button>
                  <button 
                    onClick={handleCopyLink}
                    className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    title="Копировать ссылку"
                    aria-label="Копировать ссылку"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Связанные статьи */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Похожие статьи</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map(relatedArticle => (
                <article 
                  key={relatedArticle.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
                  onClick={() => {
                    navigate(`/blog/article/${relatedArticle.slug || relatedArticle.id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="relative">
                    <img 
                      src={relatedArticle.imageUrl} 
                      alt={relatedArticle.title}
                      className="w-full h-40 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `/images/${relatedArticle.category?.toLowerCase() || 'blog'}-placeholder.jpg`;
                      }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-primary-600 text-white px-2 py-0.5 rounded text-xs font-medium">
                        {relatedArticle.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2 line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200">
                      {relatedArticle.title}
                    </h3>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatDate(relatedArticle.publishedAt || '')}</span>
                      <span className="flex items-center gap-1 text-primary-600 dark:text-primary-400">
                        Читать
                        <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-6 md:p-8 rounded-xl text-center">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Нужна помощь с n8n?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Получите персональную консультацию от нашего AI-ассистента
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/n8n-assistant"
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <MessageSquare className="h-5 w-5" />
              <span>Открыть n8n Assistant</span>
            </Link>
            <Link 
              to="/blog"
              className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg transition-colors duration-200 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Вернуться к блогу</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogArticlePage;