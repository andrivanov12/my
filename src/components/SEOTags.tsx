import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Brain, Lock, Sparkles, BookOpen, Users, Award, ArrowRight, Star, CheckCircle, Zap, Globe, Shield, TrendingUp, Settings, Cpu } from 'lucide-react';
import FAQ from '../components/FAQ';
import SEOTags from '../components/SEOTags';
import StructuredData from '../components/StructuredData';
import AdaptiveAdBlock from '../components/AdaptiveAdBlock';
import { airtableService, AirtableArticle } from '../services/airtableService';
import { generateWebAppSchema, generateOrganizationSchema, generateFAQSchema } from '../utils/seoHelpers';

const HomePage: React.FC = () => {
  const [latestArticles, setLatestArticles] = useState<AirtableArticle[]>([]);

  useEffect(() => {
    loadLatestArticles();
  }, []);

  const loadLatestArticles = async () => {
    try {
      const articles = await airtableService.getArticles();
      setLatestArticles(articles.slice(0, 2));
      
      if (articles.length === 0) {
        setLatestArticles([
          {
            id: 'fallback-1',
            title: "ChatGPT 2025: Новые возможности искусственного интеллекта",
            excerpt: "Обзор последних обновлений ChatGPT и новых функций для пользователей...",
            publishedAt: "2025-01-27",
            author: "Команда AI Hub",
            category: "Технологии",
            imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
            content: "",
            slug: "chatgpt-2025-new-features"
          },
          {
            id: 'fallback-2',
            title: "Как эффективно использовать AI для бизнеса в 2025 году",
            excerpt: "Практические советы по внедрению искусственного интеллекта в бизнес-процессы...",
            publishedAt: "2025-01-25",
            author: "Эксперт AI",
            category: "Бизнес",
            imageUrl: "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
            content: "",
            slug: "ai-for-business-2025"
          }
        ]);
      }
    } catch (error) {
      console.warn('⚠️ Ошибка при загрузке последних статей:', error);
      setLatestArticles([
        {
          id: 'fallback-1',
          title: "ChatGPT 2025: Новые возможности искусственного интеллекта",
          excerpt: "Обзор последних обновлений ChatGPT и новых функций для пользователей...",
          publishedAt: "2025-01-27",
          author: "Команда AI Hub",
          category: "Технологии",
          imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
          content: "",
          slug: "chatgpt-2025-new-features"
        }
      ]);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // FAQ для структурированных данных
  const faqItems = [
    {
      question: "Как искусственный интеллект может помочь в маркетинге?",
      answer: "Искусственный интеллект трансформирует маркетинг через автоматизацию рутинных задач, персонализацию контента, анализ больших данных для выявления паттернов поведения клиентов, оптимизацию рекламных кампаний в реальном времени и создание высококачественного контента. AI Market Hub предоставляет все необходимые инструменты для внедрения ИИ в ваш маркетинг."
    },
    {
      question: "Какие бизнес-процессы можно автоматизировать с помощью n8n и AI?",
      answer: "С помощью n8n и искусственного интеллекта можно автоматизировать множество бизнес-процессов: сбор и анализ данных о клиентах, генерацию персонализированного контента, мониторинг упоминаний бренда в социальных сетях, автоматическую классификацию обращений клиентов, создание и оптимизацию рекламных кампаний, а также формирование аналитических отчетов."
    },
    {
      question: "Как AI помогает в генерации и оптимизации контента?",
      answer: "Искусственный интеллект революционизирует создание контента через автоматическую генерацию текстов разных форматов (статьи, посты, email-рассылки), оптимизацию существующего контента под SEO, анализ эффективности контента и предложение улучшений, создание персонализированных материалов для разных сегментов аудитории и автоматическое перепрофилирование контента для разных платформ."
    },
    {
      question: "Какие преимущества дает анализ данных с помощью нейросетей?",
      answer: "Анализ данных с использованием нейросетей предоставляет бизнесу глубокие инсайты через выявление скрытых паттернов и корреляций в больших массивах данных, прогнозирование поведения клиентов и рыночных трендов с высокой точностью, сегментацию аудитории на основе множества параметров, оптимизацию маркетинговых стратегий в реальном времени и автоматическую генерацию аналитических отчетов с рекомендациями."
    }
  ];

  // Структурированные данные для веб-приложения
  const webAppSchema = generateWebAppSchema({
    name: "AI Market Hub – Инструменты ИИ для Маркетинга и Бизнеса",
    description: "Платформа инструментов искусственного интеллекта для маркетинга, бизнеса и автоматизации. Используйте ChatGPT без регистрации, n8n автоматизацию, генерацию контента и аналитику данных.",
    url: "https://aimarkethub.pro",
    applicationCategory: "BusinessApplication, MarketingApplication, AIApplication",
    operatingSystem: "Any",
    offers: { price: "0", priceCurrency: "RUB" },
    features: [
      "ChatGPT без регистрации для бизнес-задач",
      "Автоматизация маркетинга с помощью n8n",
      "Генерация контента искусственным интеллектом",
      "Персонализация маркетинга с помощью ИИ",
      "Анализ данных с помощью нейросетей",
      "Оптимизация рабочих процессов",
      "Интеграция с внешними сервисами и API"
    ],
    screenshot: "https://aimarkethub.pro/images/chatgpt-screenshot.jpg",
    rating: { value: 4.9, count: 2847 }
  });

  // Структурированные данные для организации
  const organizationSchema = generateOrganizationSchema({
    name: "AI Market Hub",
    url: "https://aimarkethub.pro",
    logo: "https://aimarkethub.pro/images/logo.png",
    description: "Платформа инструментов искусственного интеллекта для маркетинга, бизнеса и автоматизации",
    foundingDate: "2024",
    contactPoint: {
      contactType: "customer service",
      url: "https://t.me/solvillage",
      availableLanguage: ["Russian", "English"]
    },
    sameAs: ["https://t.me/solvillage"]
  });

  // Структурированные данные для FAQ
  const faqSchema = generateFAQSchema(faqItems);

  return (
    <>
      <SEOTags
        title="AI Market Hub – Инструменты ИИ для Маркетинга и Бизнеса | Нейросети Без Регистрации"
        description="⭐ AI Market Hub – платформа инструментов искусственного интеллекта для маркетинга и бизнеса. Автоматизация процессов, генерация контента, анализ данных и персонализация с помощью нейросетей. Доступ к ChatGPT без регистрации!"
        keywords="нейросети для маркетинга, AI инструменты для бизнеса, автоматизация маркетинга с AI, генерация контента искусственным интеллектом, персонализация с ИИ, анализ данных с помощью нейросетей, оптимизация рабочих процессов, n8n автоматизация, prompt инженерия, искусственный интеллект для бизнеса, чат gpt без регистрации"
        canonicalUrl="https://aimarkethub.pro"
        imageUrl="https://aimarkethub.pro/images/aimarkethub-hero.jpg"
        structuredData={[
          webAppSchema,
          organizationSchema,
          faqSchema
        ]}
        preload={[
          {href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap', as: 'style'},
          {href: '/images/aimarkethub-hero.jpg', as: 'image'}
        ]}
      >
        <meta name="author" content="AI Market Hub" />
        <meta name="publisher" content="AI Market Hub" />
        <meta name="copyright" content="© 2025 AI Market Hub" />
        <meta name="language" content="Russian" />
        <meta name="geo.region" content="RU" />
        <meta name="geo.country" content="Russia" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="revisit-after" content="1 day" />
      </SEOTags>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Главный рекламный баннер */}
        <AdaptiveAdBlock 
          blockId="R-A-16048264-1" 
          containerId="yandex_rtb_R-A-16048264-1_main" 
          position="main-banner"
          className="mb-8 md:mb-12"
        />

        {/* Hero секция с улучшенным SEO контентом */}
        <section className="max-w-5xl mx-auto text-center mb-12 md:mb-16">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-8 md:p-12 rounded-2xl mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              Инструменты Искусственного Интеллекта для Маркетинга и Бизнеса
            </h1>
            
            <h2 className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed">
              ⭐ Автоматизация маркетинга, генерация контента, анализ данных и персонализация с помощью нейросетей
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm md:text-base">
              <div className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">Маркетинг с ИИ</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <Shield className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Бизнес-аналитика</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <Globe className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Автоматизация процессов</span>
              </div>
            </div>
            
            <Link 
              to="/chat"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-4 md:py-5 px-8 md:px-10 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg md:text-xl animate-bounce-short transform hover:scale-105"
            >
              <MessageSquare className="h-6 w-6 md:h-7 md:w-7" />
              <span>Начать использовать ИИ для бизнеса</span>
            </Link>
          </div>
        </section>

        {/* Подробное SEO описание */}
        <section className="max-w-4xl mx-auto mb-12 md:mb-16 px-4">
          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-md">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
              Как искусственный интеллект трансформирует маркетинг и бизнес
            </h2>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                <strong>AI Market Hub</strong> — это комплексная платформа инструментов искусственного интеллекта, разработанная специально для <strong>маркетологов и бизнеса</strong>. 
                Наши решения помогают автоматизировать рутинные задачи, генерировать высококачественный контент, анализировать большие объемы данных 
                и создавать персонализированные маркетинговые кампании с помощью <strong>передовых нейросетей</strong>.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary-600 dark:text-primary-400">
                    🚀 Нейросети для маркетинга
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Генерация контента для разных каналов</li>
                    <li>• Персонализация коммуникаций с клиентами</li>
                    <li>• Анализ эффективности маркетинговых кампаний</li>
                    <li>• Оптимизация контента для SEO</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-secondary-600 dark:text-secondary-400">
                    🎯 Автоматизация бизнес-процессов
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Интеграция с CRM и маркетинговыми платформами</li>
                    <li>• Автоматический сбор и анализ данных</li>
                    <li>• Оптимизация рабочих процессов с n8n</li>
                    <li>• Мониторинг и отчетность в реальном времени</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>AI Market Hub</strong> — это не просто набор инструментов, а стратегический партнер для бизнеса, 
                стремящегося использовать потенциал искусственного интеллекта для роста и оптимизации. 
                Наши решения помогают компаниям любого размера внедрять передовые AI технологии без необходимости 
                найма дорогостоящих специалистов по данным и машинному обучению.
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">💡 Как ИИ трансформирует маркетинг:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">📊 Аналитика и прогнозирование:</p>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Прогнозирование поведения клиентов</li>
                      <li>• Анализ эффективности каналов</li>
                      <li>• Выявление скрытых паттернов</li>
                      <li>• Оптимизация маркетингового бюджета</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">🎨 Контент и креатив:</p>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Автоматическая генерация контента</li>
                      <li>• Персонализация сообщений</li>
                      <li>• Оптимизация заголовков и текстов</li>
                      <li>• Создание визуального контента</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Статистика с улучшенными цифрами */}
        <section className="max-w-4xl mx-auto mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Эффективность искусственного интеллекта в цифрах
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">+37%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Рост конверсии</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">-42%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Снижение затрат</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">+68%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Рост вовлеченности</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">5x</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ускорение процессов</div>
            </div>
          </div>
        </section>

        {/* Преимущества с расширенным контентом */}
        <section className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 sm:col-span-2 md:col-span-3">
            Как искусственный интеллект трансформирует ваш бизнес
          </h2>
          
          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Персонализация маркетинга</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Нейросети анализируют поведение клиентов и создают персонализированные предложения, увеличивая конверсию до 37%. Автоматическая сегментация аудитории и индивидуальные коммуникации на всех этапах воронки продаж.
            </p>
          </article>
          
          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Lock className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Генерация контента</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Создавайте высококачественные тексты для сайта, блога, социальных сетей и email-рассылок в 5 раз быстрее. ИИ генерирует SEO-оптимизированный контент, адаптированный под вашу целевую аудиторию и бренд-голос.
            </p>
          </article>
          
          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Предиктивная аналитика</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Прогнозируйте поведение клиентов и рыночные тренды с точностью до 85%. Выявляйте скрытые закономерности в данных и принимайте стратегические решения на основе предиктивных моделей, созданных нейросетями.
            </p>
          </article>

          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Globe className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Оптимизация рекламы</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Снижайте стоимость привлечения клиентов на 42% с помощью ИИ-оптимизации рекламных кампаний. Автоматическое тестирование креативов, таргетинга и ставок для достижения максимальной эффективности вашего рекламного бюджета.
            </p>
          </article>

          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Автоматизация процессов</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Автоматизируйте до 80% рутинных маркетинговых задач с помощью n8n и искусственного интеллекта. Настройте автоматический сбор лидов, квалификацию, нуртуринг и аналитику без необходимости написания кода.
            </p>
          </article>

          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Клиентский сервис</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Повышайте удовлетворенность клиентов на 68% с помощью AI-чатботов и автоматизированных систем поддержки. Мгновенные ответы на вопросы, интеллектуальная маршрутизация обращений и проактивная помощь клиентам.
            </p>
          </article>
        </section>

        {/* Возможности использования с расширенным списком */}
        <section className="max-w-5xl mx-auto mb-12 md:mb-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Комплексные решения для маркетинга и бизнеса
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <MessageSquare className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="font-semibold mb-2">Маркетинговая аналитика с ИИ</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Глубокий анализ маркетинговых данных с помощью нейросетей для принятия стратегических решений
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <li>• Мультиканальная атрибуция</li>
                <li>• Прогнозирование LTV клиентов</li>
                <li>• Анализ эффективности кампаний</li>
                <li>• Выявление точек роста</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <Settings className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mb-4" />
              <h3 className="font-semibold mb-2">Автоматизация маркетинга</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Комплексная автоматизация маркетинговых процессов с интеграцией всех ваших инструментов
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <li>• Автоматический сбор и нуртуринг лидов</li>
                <li>• Персонализированные email-кампании</li>
                <li>• Мультиканальные маркетинговые сценарии</li>
                <li>• Интеграция с CRM и аналитикой</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <Zap className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="font-semibold mb-2">Генерация контента с ИИ</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Создание высококачественного контента для всех маркетинговых каналов с помощью нейросетей
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <li>• SEO-оптимизированные статьи для блога</li>
                <li>• Контент для социальных сетей</li>
                <li>• Email-рассылки и лендинги</li>
                <li>• Рекламные тексты и описания продуктов</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Последние статьи из блога */}
        <section className="max-w-5xl mx-auto mb-12 md:mb-16 px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Полезные статьи о AI и n8n</h2>
            <Link 
              to="/blog"
              className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium flex items-center gap-1"
            >
              Все статьи
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {latestArticles.map((article) => (
              <article key={article.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <h3 className="font-semibold mb-2 text-lg line-clamp-2">
                  <Link to={`/blog/article/${article.slug || article.id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
                    {article.title}
                  </Link>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {article.excerpt}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {formatDate(article.publishedAt || '')}
                </div>
                <div className="mt-3">
                  <Link 
                    to={`/blog/article/${article.slug || article.id}`}
                    className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center gap-1"
                  >
                    Читать полностью
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>

        <FAQ />
        
        {/* Финальный CTA с улучшенным дизайном */}
        <section className="max-w-4xl mx-auto text-center px-4 mt-12 md:mt-16">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white p-8 md:p-12 rounded-2xl shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Готовы трансформировать ваш маркетинг с помощью ИИ?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Присоединяйтесь к тысячам компаний, которые уже увеличили эффективность маркетинга с AI Market Hub
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link 
                to="/chat"
                className="inline-flex items-center gap-2 bg-white text-primary-600 font-medium py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg hover:bg-gray-50 transform hover:scale-105"
              >
                <MessageSquare className="h-6 w-6" />
                <span>Начать трансформацию маркетинга</span>
              </Link>
              
              <div className="flex items-center gap-2 text-white/80">
                <Star className="h-5 w-5 fill-current text-yellow-300" />
                <span className="text-sm">4.9/5 на основе 2,847 отзывов</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm opacity-80">
              <div>
                <div className="font-semibold">100%</div>
                <div>ROI</div>
              </div>
              <div>
                <div className="font-semibold">+37%</div>
                <div>Конверсия</div>
              </div>
              <div>
                <div className="font-semibold">-42%</div>
                <div>Затраты</div>
              </div>
            </div>
          </div>
        </section>

        {/* Нижний рекламный баннер */}
        <AdaptiveAdBlock 
          blockId="R-A-16048264-2" 
          containerId="yandex_rtb_R-A-16048264-2_bottom" 
          position="bottom-banner"
          className="mt-8 md:mt-12"
        />
      </div>
    </>
  );
};

export default HomePage;