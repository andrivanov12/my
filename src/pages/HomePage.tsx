import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Brain, Lock, Sparkles, BookOpen, Users, Award, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import FAQ from '../components/FAQ';
import { airtableService, AirtableArticle } from '../services/airtableService';

const HomePage: React.FC = () => {
  const [latestArticles, setLatestArticles] = useState<AirtableArticle[]>([]);

  useEffect(() => {
    loadLatestArticles();
  }, []);

  const loadLatestArticles = async () => {
    try {
      const articles = await airtableService.getArticles();
      // Берем только 2 последние статьи для главной страницы
      setLatestArticles(articles.slice(0, 2));
      
      // Если статей из Airtable нет, используем fallback статьи
      if (articles.length === 0) {
        setLatestArticles([
          {
            id: 'fallback-1',
            title: "Революция искусственного интеллекта: как ChatGPT меняет наш мир",
            excerpt: "Исследуем влияние больших языковых моделей на различные сферы жизни...",
            publishedAt: "2025-01-15",
            author: "Команда AI Hub",
            category: "Технологии",
            imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
            content: "",
            slug: "ai-revolution"
          },
          {
            id: 'fallback-2',
            title: "Сравнение языковых моделей: Qwen vs Gemini vs Llama",
            excerpt: "Подробный анализ возможностей различных AI-моделей и рекомендации...",
            publishedAt: "2025-01-12",
            author: "Эксперт AI",
            category: "Обзоры",
            imageUrl: "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
            content: "",
            slug: "ai-models-comparison"
          }
        ]);
      }
    } catch (error) {
      console.warn('⚠️ Ошибка при загрузке последних статей:', error);
      // Используем fallback статьи при любой ошибке
      setLatestArticles([
        {
          id: 'fallback-1',
          title: "Революция искусственного интеллекта: как ChatGPT меняет наш мир",
          excerpt: "Исследуем влияние больших языковых моделей на различные сферы жизни...",
          publishedAt: "2025-01-15",
          author: "Команда AI Hub",
          category: "Технологии",
          imageUrl: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
          content: "",
          slug: "ai-revolution"
        },
        {
          id: 'fallback-2',
          title: "Сравнение языковых моделей: Qwen vs Gemini vs Llama",
          excerpt: "Подробный анализ возможностей различных AI-моделей и рекомендации...",
          publishedAt: "2025-01-12",
          author: "Эксперт AI",
          category: "Обзоры",
          imageUrl: "https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800&h=400",
          content: "",
          slug: "ai-models-comparison"
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

  return (
    <>
      <Helmet>
        <title>Бесплатный ChatGPT без регистрации — Онлайн AI чат</title>
        <meta name="description" content="Используйте ChatGPT бесплатно и без регистрации. Общайтесь с AI онлайн прямо сейчас! Быстро, удобно, без входа." />
        <meta name="keywords" content="чат gpt без регистрации, бесплатный chatgpt онлайн, использовать chatgpt бесплатно, чатбот gpt без регистрации" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Bolt new Banner */}
        <div className="max-w-4xl mx-auto mb-8 md:mb-12">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-500 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="px-6 py-4 md:py-6 text-white">
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                Создавайте свои проекты с Bolt new
              </h2>
              <p className="text-white/90 mb-4">
                Быстрая разработка веб-приложений с использованием современных технологий.
                Начните бесплатно прямо сейчас!
              </p>
              <a 
                href="https://bolt.new/?rid=aier2b"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-white text-primary-600 font-medium px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Перейти
              </a>
            </div>
          </div>
        </div>

        <section className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            Бесплатный ChatGPT без регистрации
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed px-4">
            Получите мгновенный доступ к возможностям искусственного интеллекта без необходимости 
            создания аккаунта или ввода личных данных.
          </p>
          
          <Link 
            to="/chat"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 md:py-3 px-5 md:px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg text-sm md:text-base animate-bounce-short"
          >
            <MessageSquare className="h-4 w-4 md:h-5 md:w-5" />
            <span>Начать общение</span>
          </Link>
        </section>

        {/* Статистика */}
        <section className="max-w-4xl mx-auto mb-12 md:mb-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">50K+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Пользователей</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">1M+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Сообщений</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">6</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">AI Моделей</div>
            </div>
            <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <div className="text-2xl md:text-3xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">24/7</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Доступность</div>
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto mb-12 md:mb-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
            Как использовать ChatGPT без регистрации
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Наш сервис предоставляет простой и быстрый способ общения с искусственным интеллектом без необходимости регистрации или оплаты. Просто нажмите кнопку "Начать общение" и задайте свой вопрос.
            </p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Мы интегрировали несколько передовых AI-моделей, включая Qwen 3, Gemini 2.5 Flash, Llama 4 Maverick и другие, чтобы предоставить вам лучший опыт общения с искусственным интеллектом.
            </p>
          </div>
        </section>
        
        <section className="max-w-5xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8 sm:col-span-2 md:col-span-3">
            Преимущества общения с ИИ
          </h2>
          
          <article className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-2.5 md:p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
              <Brain className="h-6 w-6 md:h-8 md:w-8 text-primary-600 dark:text-primary-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Мощный ИИ</h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Доступ к передовой модели искусственного интеллекта для решения задач, получения информации и творческих идей.
            </p>
          </article>
          
          <article className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-2.5 md:p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
              <Lock className="h-6 w-6 md:h-8 md:w-8 text-secondary-600 dark:text-secondary-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Без регистрации</h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Нет необходимости создавать аккаунт, запоминать пароли или предоставлять личную информацию.
            </p>
          </article>
          
          <article className="bg-white dark:bg-gray-800 p-5 md:p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-2.5 md:p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
              <Sparkles className="h-6 w-6 md:h-8 md:w-8 text-primary-600 dark:text-primary-400" aria-hidden="true" />
            </div>
            <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-3">Мгновенный доступ</h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
              Начните общение с ИИ прямо сейчас, без лишних шагов и ожидания активации аккаунта.
            </p>
          </article>
        </section>

        {/* Возможности использования */}
        <section className="max-w-5xl mx-auto mb-12 md:mb-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Что можно делать с ChatGPT
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="font-semibold mb-2">Обучение и образование</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Объяснение сложных тем, помощь с домашними заданиями, изучение новых предметов
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <Users className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mb-4" />
              <h3 className="font-semibold mb-2">Работа и бизнес</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Написание писем, создание презентаций, анализ данных, генерация идей
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <Award className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="font-semibold mb-2">Творчество</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Написание стихов, рассказов, сценариев, создание контента для соцсетей
              </p>
            </div>
          </div>
        </section>

        {/* Последние статьи из блога */}
        <section className="max-w-5xl mx-auto mb-12 md:mb-16 px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Полезные статьи</h2>
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
                <h3 className="font-semibold mb-2 text-lg">
                  <Link to="/blog" className="hover:text-primary-600 dark:hover:text-primary-400">
                    {article.title}
                  </Link>
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                  {article.excerpt}
                </p>
                <div className="text-xs text-gray-500 dark:text-gray-500">
                  {formatDate(article.publishedAt || '')}
                </div>
              </article>
            ))}
          </div>
        </section>

        <FAQ />
        
        <section className="max-w-4xl mx-auto text-center px-4 mt-12 md:mt-16">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-3 md:mb-4">Готовы начать?</h2>
          <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6 md:mb-8">
            Нажмите кнопку ниже и начните общение с ChatGPT прямо сейчас!
          </p>
          
          <Link 
            to="/chat"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 md:py-3 px-5 md:px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg animate-bounce-short text-sm md:text-base"
          >
            <MessageSquare className="h-4 w-4 md:h-5 md:w-5" aria-hidden="true" />
            <span>Начать общение</span>
          </Link>
        </section>
      </div>
    </>
  );
};

export default HomePage;