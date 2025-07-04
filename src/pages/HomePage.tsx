import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Brain, Lock, Sparkles, BookOpen, Users, Award, ArrowRight, Star, CheckCircle, Zap, Globe, Shield, TrendingUp } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import FAQ from '../components/FAQ';
import AdaptiveAdBlock from '../components/AdaptiveAdBlock';
import { airtableService, AirtableArticle } from '../services/airtableService';

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

  return (
    <>
      <Helmet>
        <title>ChatGPT без регистрации бесплатно 2025 | Чат ГПТ онлайн без входа | AI Market Hub</title>
        <meta name="description" content="⭐ ChatGPT без регистрации бесплатно! Используйте чат ГПТ онлайн прямо сейчас без входа в аккаунт. 6+ AI моделей, анализ изображений, русский язык. Работает 24/7!" />
        <meta name="keywords" content="chatgpt без регистрации, чат гпт бесплатно, chatgpt онлайн, чат гпт без входа, бесплатный chatgpt, чатгпт без регистрации, gpt чат онлайн, ai чат бесплатно, искусственный интеллект чат, нейросеть онлайн, chatgpt русский, гпт чат, чат с ии, openai чат, машинное обучение чат, chatgpt 2025" />
        <link rel="canonical" href="https://aimarkethub.pro" />
      </Helmet>

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
              ChatGPT без регистрации бесплатно 2025
            </h1>
            
            <h2 className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6 md:mb-8 leading-relaxed">
              ⭐ Чат ГПТ онлайн без входа в аккаунт — используйте искусственный интеллект прямо сейчас!
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8 text-sm md:text-base">
              <div className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium">100% Бесплатно</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <Shield className="h-5 w-5 text-blue-500" />
                <span className="font-medium">Без регистрации</span>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                <Globe className="h-5 w-5 text-purple-500" />
                <span className="font-medium">6+ AI моделей</span>
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
              Почему выбирают наш ChatGPT без регистрации?
            </h2>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                Наш сервис предоставляет <strong>бесплатный доступ к ChatGPT без регистрации</strong> — это реальность! 
                Просто нажмите кнопку "Начать общение\" и задайте свой вопрос. Никаких форм, паролей или подтверждений email.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 my-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-primary-600 dark:text-primary-400">
                    🚀 Мгновенный доступ
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• Без регистрации и входа в аккаунт</li>
                    <li>• Работает в любом браузере</li>
                    <li>• Доступен на всех устройствах</li>
                    <li>• Никаких ограничений по региону</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-secondary-600 dark:text-secondary-400">
                    🎯 Передовые AI модели
                  </h3>
                  <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                    <li>• <strong>Qwen 3 30B</strong> — универсальная модель</li>
                    <li>• <strong>Gemini 2.5 Flash</strong> — быстрые ответы</li>
                    <li>• <strong>Llama 4 Maverick</strong> — анализ изображений</li>
                    <li>• <strong>Deepseek Chat</strong> — технические задачи</li>
                  </ul>
                </div>
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                <strong>ChatGPT на русском языке</strong> работает круглосуточно и поддерживает все современные функции: 
                анализ изображений, генерацию кода, решение математических задач, написание текстов и многое другое.
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
            Нам доверяют тысячи пользователей
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
            Преимущества нашего ChatGPT
          </h2>
          
          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Brain className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Мощный ИИ</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Доступ к 6+ передовым AI моделям включая Qwen 3, Gemini 2.5, Llama 4 Maverick с поддержкой анализа изображений и Deepseek Chat для технических задач.
            </p>
          </article>
          
          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-secondary-100 dark:bg-secondary-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Lock className="h-8 w-8 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Без регистрации</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Никаких аккаунтов, паролей или личных данных. Полная анонимность и приватность. История чата сохраняется только в вашем браузере.
            </p>
          </article>
          
          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Sparkles className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Мгновенный доступ</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Начните общение с ChatGPT прямо сейчас. Никаких очередей, ожидания активации или подтверждения email. Просто откройте и пользуйтесь.
            </p>
          </article>

          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Globe className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Русский язык</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Полная поддержка русского языка. ChatGPT отлично понимает и отвечает на русском, помогает с переводами и изучением языков.
            </p>
          </article>

          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Всегда актуально</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Регулярные обновления и добавление новых AI моделей. Мы следим за последними достижениями в области искусственного интеллекта.
            </p>
          </article>

          <article className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg">
            <div className="mb-4 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full w-14 h-14 flex items-center justify-center">
              <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Высокая скорость</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Быстрые ответы благодаря оптимизированной инфраструктуре. Модель Gemini 2.5 Flash обеспечивает мгновенные ответы на простые вопросы.
            </p>
          </article>
        </section>

        {/* Возможности использования с расширенным списком */}
        <section className="max-w-5xl mx-auto mb-12 md:mb-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Что можно делать с ChatGPT бесплатно
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <BookOpen className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="font-semibold mb-2">Обучение и образование</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Объяснение сложных тем, помощь с домашними заданиями, изучение новых предметов
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <li>• Решение математических задач</li>
                <li>• Подготовка к экзаменам</li>
                <li>• Изучение иностранных языков</li>
                <li>• Объяснение научных концепций</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <Users className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mb-4" />
              <h3 className="font-semibold mb-2">Работа и бизнес</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Написание писем, создание презентаций, анализ данных, генерация идей
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <li>• Составление резюме</li>
                <li>• Бизнес-планы</li>
                <li>• Email-рассылки</li>
                <li>• Анализ конкурентов</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <Award className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-4" />
              <h3 className="font-semibold mb-2">Творчество</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Написание стихов, рассказов, сценариев, создание контента для соцсетей
              </p>
              <ul className="text-xs text-gray-500 dark:text-gray-500 space-y-1">
                <li>• Генерация идей для контента</li>
                <li>• Написание статей</li>
                <li>• Создание слоганов</li>
                <li>• Редактирование текстов</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Последние статьи из блога */}
        <section className="max-w-5xl mx-auto mb-12 md:mb-16 px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">Полезные статьи о ChatGPT</h2>
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
        
        {/* Финальный CTA с улучшенным дизайном */}
        <section className="max-w-4xl mx-auto text-center px-4 mt-12 md:mt-16">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-500 text-white p-8 md:p-12 rounded-2xl shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Готовы начать использовать ChatGPT бесплатно?
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              Присоединяйтесь к 150,000+ пользователей, которые уже используют наш сервис
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link 
                to="/chat"
                className="inline-flex items-center gap-2 bg-white text-primary-600 font-medium py-4 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl text-lg hover:bg-gray-50 transform hover:scale-105"
              >
                <MessageSquare className="h-6 w-6" />
                <span>Начать общение с ChatGPT</span>
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