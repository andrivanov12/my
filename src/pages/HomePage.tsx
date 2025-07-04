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
      question: "Что такое AI Market Hub?",
      answer: "AI Market Hub — это платформа AI инструментов, предоставляющая бесплатный доступ к ChatGPT без регистрации, инструменты для n8n автоматизации, prompt оптимизации и Tuya API интеграции. Все необходимые AI решения в одном месте."
    },
    {
      question: "Нужно ли создавать аккаунт для использования ChatGPT?",
      answer: "Нет, наш сервис предоставляет доступ к ChatGPT без необходимости регистрации или создания аккаунта. Вы можете начать общение с ИИ немедленно, просто открыв сайт."
    },
    {
      question: "Какие модели ИИ доступны на сайте?",
      answer: "Мы предоставляем доступ к нескольким передовым моделям ИИ: Qwen 3 30B, Gemini 2.5 Flash, Llama 4 Maverick, Deepseek Chat, Gemini 2.0 Flash и другие. Каждая модель имеет свои особенности и преимущества."
    },
    {
      question: "Как долго сохраняется история переписки?",
      answer: "История вашей переписки сохраняется локально в браузере в течение 7 дней. После этого или при очистке данных браузера история будет удалена. Мы не храним переписку на серверах для обеспечения вашей приватности."
    }
  ];

  // Структурированные данные для веб-приложения
  const webAppSchema = generateWebAppSchema({
    name: "AI Market Hub - платформа AI инструментов",
    description: "Платформа AI инструментов с ChatGPT без регистрации, n8n автоматизацией, prompt оптимизацией и Tuya API интеграциями. Все AI решения в одном месте!",
    url: "https://aimarkethub.pro",
    applicationCategory: "AI Tools Platform",
    operatingSystem: "Any",
    offers: { price: "0", priceCurrency: "RUB" },
    features: [
      "ChatGPT без регистрации и входа",
      "n8n Assistant для автоматизации",
      "AI Prompt Optimizer для эффективных запросов",
      "Tuya API интеграции для умного дома",
      "6+ AI моделей",
      "Анализ изображений",
      "Поддержка русского языка"
    ],
    screenshot: "https://aimarkethub.pro/images/chatgpt-screenshot.jpg",
    rating: { value: 4.9, count: 2847 }
  });

  // Структурированные данные для организации
  const organizationSchema = generateOrganizationSchema({
    name: "AI Market Hub",
    url: "https://aimarkethub.pro",
    logo: "https://aimarkethub.pro/images/logo.png",
    description: "Платформа для бесплатного доступа к ChatGPT и другим AI технологиям без регистрации",
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
        title="AI Market Hub - платформа AI инструментов | ChatGPT без регистрации бесплатно 2025"
        description="⭐ AI Market Hub - платформа AI инструментов и ChatGPT без регистрации бесплатно! Используйте чат ГПТ онлайн, n8n автоматизацию, prompt оптимизацию и Tuya API интеграции. Все AI решения в одном месте!"
        keywords="AIMarketHub, AI инструменты, искусственный интеллект, AI платформа, AI маркетплейс, n8n автоматизация, Prompt оптимизация, Tuya API интеграции, chatgpt без регистрации, чат гпт бесплатно, chatgpt онлайн, чат гпт без входа, бесплатный chatgpt, чатгпт без регистрации, gpt чат онлайн, ai чат бесплатно"
        canonicalUrl="https://aimarkethub.pro"
        imageUrl="https://aimarkethub.pro/images/aimarkethub-hero.jpg"
        structuredData={[
          webAppSchema,
          organizationSchema,
          faqSchema
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
              AI Market Hub - платформа AI инструментов
            </h1>
            
            <h2 className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed">
              ⭐ Платформа AI инструментов с ChatGPT без регистрации, n8n автоматизацией и Prompt оптимизацией
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm md:text-base">
              <div className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">100% Бесплатно</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <Shield className="h-5 w-5 text-blue-500" />
                <span className="font-medium">AI инструменты</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <Globe className="h-5 w-5 text-purple-500" />
                <span className="font-medium">Автоматизация</span>
              </div>
            </div>
            
            <Link 
              to="/chat"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-4 md:py-5 px-8 md:px-10 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg md:text-xl animate-bounce-short transform hover:scale-105"
            >
              <MessageSquare className="h-6 w-6 md:h-7 md:w-7" />
              <span>Начать общение с ChatGPT</span>
            </Link>
          </div>
        </section>

        {/* Подробное SEO описание */}
        <section className="max-w-4xl mx-auto mb-12 md:mb-16 px-4">
          <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-xl shadow-md">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
              Почему выбирают AI Market Hub?
            </h2>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                <strong>AI Market Hub</strong> — это платформа AI инструментов, предоставляющая <strong>бесплатный доступ к ChatGPT без регистрации</strong>, 
                инструменты для <strong>n8n автоматизации</strong>, <strong>prompt оптимизации</strong> и <strong>Tuya API интеграции</strong>. 
                Все необходимые AI решения в одном месте!
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary-600 dark:text-primary-400">
                    🚀 AI инструменты для всех задач
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• ChatGPT без регистрации и входа</li>
                    <li>• n8n Assistant для автоматизации</li>
                    <li>• AI Prompt Optimizer для эффективных запросов</li>
                    <li>• Tuya API интеграции для умного дома</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-secondary-600 dark:text-secondary-400">
                    🎯 Преимущества платформы
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Все инструменты бесплатно</li>
                    <li>• Интеграция между сервисами</li>
                    <li>• Регулярные обновления</li>
                    <li>• Экспертная поддержка</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>AI Market Hub</strong> — это центр AI технологий, где каждый найдет инструменты для своих задач. 
                Наша платформа объединяет лучшие AI решения для бизнеса, образования и личного использования.
              </p>
              
              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-3">💡 Что можно делать с нашим ChatGPT:</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-2">📚 Обучение и работа:</p>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Решение задач по математике</li>
                      <li>• Написание эссе и статей</li>
                      <li>• Изучение языков</li>
                      <li>• Программирование</li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">🎨 Творчество и развлечения:</p>
                    <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                      <li>• Создание стихов и рассказов</li>
                      <li>• Анализ изображений</li>
                      <li>• Генерация идей</li>
                      <li>• Интересные беседы</li>
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
            Нам доверяют тысячи пользователей и компаний
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">150K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Пользователей</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">5M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Сообщений</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">6+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">AI Моделей</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Доступность</div>
            </div>
          </div>
        </section>

        {/* Преимущества с расширенным контентом */}
        <section className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 sm:col-span-2 md:col-span-3">
            Преимущества платформы AI Market Hub
          </h2>
          
          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Мощный ИИ</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Доступ к передовым AI технологиям и инструментам для решения различных задач: от общения с ChatGPT до автоматизации бизнес-процессов с n8n.
            </p>
          </article>
          
          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Lock className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Без регистрации</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Никаких аккаунтов, паролей или личных данных для использования большинства инструментов. Полная анонимность и приватность для всех пользователей.
            </p>
          </article>
          
          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Мгновенный доступ</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Начните использовать AI инструменты прямо сейчас. Никаких очередей, ожидания активации или подтверждения email. Просто откройте и пользуйтесь.
            </p>
          </article>

          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Globe className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Интеграции</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Возможность интеграции различных сервисов и API. Подключайте n8n к внешним системам, используйте Tuya API для умного дома и многое другое.
            </p>
          </article>

          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Автоматизация</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Инструменты для автоматизации бизнес-процессов с помощью n8n. Оптимизируйте рабочие процессы, интегрируйте сервисы и экономьте время.
            </p>
          </article>

          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Prompt инженерия</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Инструменты для создания эффективных промптов для AI. Оптимизируйте запросы к искусственному интеллекту для получения лучших результатов.
            </p>
          </article>
        </section>

        {/* Возможности использования с расширенным списком */}
        <section className="max-w-5xl mx-auto mb-12 md:mb-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Инструменты AI Market Hub
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <MessageSquare className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="font-semibold mb-2">ChatGPT без регистрации</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Бесплатный доступ к ChatGPT и другим AI моделям без регистрации и ограничений
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <li>• 6+ AI моделей</li>
                <li>• Анализ изображений</li>
                <li>• Поддержка русского языка</li>
                <li>• Работает 24/7</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <Settings className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mb-4" />
              <h3 className="font-semibold mb-2">n8n автоматизация</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Инструменты для создания, оптимизации и отладки n8n workflow
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <li>• n8n Assistant</li>
                <li>• Workflow Optimizer</li>
                <li>• Готовые шаблоны</li>
                <li>• Интеграции с API</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <Zap className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="font-semibold mb-2">Prompt оптимизация</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Инструменты для создания эффективных промптов для AI моделей
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <li>• AI Prompt Optimizer</li>
                <li>• Шаблоны промптов</li>
                <li>• Советы по prompt инженерии</li>
                <li>• Примеры эффективных запросов</li>
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
              Готовы начать использовать AI инструменты?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Присоединяйтесь к 150,000+ пользователей, которые уже используют платформу AI Market Hub
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link 
                to="/chat"
                className="inline-flex items-center gap-2 bg-white text-primary-600 font-medium py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg hover:bg-gray-50 transform hover:scale-105"
              >
                <MessageSquare className="h-6 w-6" />
                <span>Начать использовать AI инструменты</span>
              </Link>
              
              <div className="flex items-center gap-2 text-white/80">
                <Star className="h-5 w-5 fill-current text-yellow-300" />
                <span className="text-sm">4.9/5 на основе 2,847 отзывов</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center text-sm opacity-80">
              <div>
                <div className="font-semibold">100%</div>
                <div>Бесплатно</div>
              </div>
              <div>
                <div className="font-semibold">0 сек</div>
                <div>Регистрация</div>
              </div>
              <div>
                <div className="font-semibold">24/7</div>
                <div>Доступность</div>
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