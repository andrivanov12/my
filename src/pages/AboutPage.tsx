import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, Shield, Zap, Globe, Users, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>О команде AIMarketHub | Эксперты по искусственному интеллекту и автоматизации</title>
        <meta name="description" content="Узнайте больше о команде AIMarketHub - экспертах по искусственному интеллекту и автоматизации. Наша миссия - сделать AI технологии доступными для всех." />
        <meta name="keywords" content="команда AIMarketHub, эксперты по искусственному интеллекту, специалисты AI технологий, миссия AIMarketHub, ценности AI компании, история создания AI платформы" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            О команде AIMarketHub
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Мы команда экспертов по искусственному интеллекту и автоматизации, 
            создавшая платформу AI инструментов для бизнеса и частных пользователей.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
              <h2 className="text-xl font-semibold">Наша миссия</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
              Наша миссия — сделать передовые AI технологии доступными для всех и помочь 
              бизнесу и частным пользователям использовать искусственный интеллект и автоматизацию 
              для решения повседневных задач.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Мы стремимся создать экосистему AI инструментов, которая будет понятна даже 
              пользователям без технического образования, но при этом достаточно мощной 
              для решения сложных бизнес-задач.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mr-3" />
              <h2 className="text-xl font-semibold">Безопасность</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-3">
              Безопасность и приватность — наши ключевые приоритеты. Мы используем 
              передовые методы защиты данных и строго следим за соблюдением 
              конфиденциальности пользовательской информации.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Все инструменты на нашей платформе разработаны с учетом лучших практик 
              безопасности, а данные пользователей хранятся только локально в их браузерах.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-8 rounded-xl mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Почему выбирают нас</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Zap className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Комплексные решения</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Все необходимые AI инструменты на одной платформе
              </p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 text-secondary-600 dark:text-secondary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Интеграции</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Возможность интеграции с различными сервисами и API
              </p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Экспертная поддержка</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Команда экспертов по AI и автоматизации всегда готова помочь
              </p>
            </div>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-12">
          <h2 className="text-2xl font-bold mb-4">История создания</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            AI Market Hub родился из идеи создать единую платформу для всех AI инструментов, 
            которые могут понадобиться бизнесу и частным пользователям. Мы заметили, что 
            существует множество разрозненных решений, но нет единой экосистемы, где можно 
            найти все необходимые инструменты.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Команда экспертов по искусственному интеллекту, автоматизации и интеграциям 
            объединилась, чтобы создать платформу, которая делает AI технологии доступными 
            для всех. Мы начали с бесплатного доступа к ChatGPT без регистрации, а затем 
            добавили инструменты для n8n автоматизации, prompt оптимизации и Tuya API интеграций.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Технологии, которые мы используем</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-primary-600 dark:text-primary-400">
                AI инструменты
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• ChatGPT и другие языковые модели</li>
                <li>• n8n для автоматизации процессов</li>
                <li>• AI Prompt Optimizer для эффективных запросов</li>
                <li>• Tuya API для интеграции с умным домом</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-secondary-600 dark:text-secondary-400">
                Инфраструктура
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• React и TypeScript для надежного интерфейса</li>
                <li>• Tailwind CSS для адаптивного дизайна</li>
                <li>• Supabase для хранения данных</li>
                <li>• OpenRouter для доступа к AI моделям</li>
                <li>• Netlify для хостинга и CI/CD</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Присоединяйтесь к тысячам пользователей, которые уже используют платформу AI Market Hub
          </p>
          <Link 
            to="/chat"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Начать использовать AI инструменты</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AboutPage;