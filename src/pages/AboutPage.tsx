import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, Shield, Zap, Globe, Users, Award } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>О нас - ChatGPT без регистрации | Бесплатный AI чат</title>
        <meta name="description" content="Узнайте больше о нашем сервисе ChatGPT без регистрации. Мы предоставляем бесплатный доступ к искусственному интеллекту для всех пользователей." />
        <meta name="keywords" content="о chatgpt, искусственный интеллект, ai чат, машинное обучение, нейронные сети" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            О нашем сервисе
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Мы создали платформу для свободного общения с искусственным интеллектом, 
            доступную каждому без регистрации и ограничений.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <MessageSquare className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
              <h2 className="text-xl font-semibold">Наша миссия</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Мы стремимся сделать передовые технологии искусственного интеллекта доступными 
              для всех. Наша цель — предоставить простой и удобный способ взаимодействия с AI 
              без технических барьеров и сложных процедур регистрации.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <Shield className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mr-3" />
              <h2 className="text-xl font-semibold">Безопасность</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Мы серьезно относимся к защите ваших данных. Все разговоры шифруются, 
              история сохраняется только локально в вашем браузере, и мы не собираем 
              персональную информацию пользователей.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-8 rounded-xl mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Почему выбирают нас</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <Zap className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Мгновенный доступ</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Начните общение с AI прямо сейчас, без регистрации и ожидания
              </p>
            </div>
            <div className="text-center">
              <Globe className="h-12 w-12 text-secondary-600 dark:text-secondary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Доступность</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Работает на всех устройствах и в любом современном браузере
              </p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-primary-600 dark:text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Для всех</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Подходит как для новичков, так и для опытных пользователей AI
              </p>
            </div>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none mb-12">
          <h2 className="text-2xl font-bold mb-4">История создания</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Наш проект родился из желания сделать искусственный интеллект более доступным. 
            Мы заметили, что многие люди хотят попробовать ChatGPT, но сталкиваются с 
            барьерами в виде обязательной регистрации, ограничений по регионам или 
            сложных процедур верификации.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Команда разработчиков и энтузиастов AI решила создать платформу, которая 
            устраняет эти препятствия. Мы интегрировали несколько передовых языковых 
            моделей, включая Qwen, Gemini и Llama, чтобы предоставить пользователям 
            выбор и лучший опыт общения с искусственным интеллектом.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Технологии, которые мы используем</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-primary-600 dark:text-primary-400">
                Языковые модели
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Qwen 3 - для точных и детальных ответов</li>
                <li>• Gemini 2.5 Flash - для быстрой обработки запросов</li>
                <li>• Llama 4 Maverick - для анализа изображений</li>
                <li>• Deepseek Chat - для специализированных задач</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-secondary-600 dark:text-secondary-400">
                Инфраструктура
              </h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• React и TypeScript для надежного интерфейса</li>
                <li>• Tailwind CSS для адаптивного дизайна</li>
                <li>• Защищенные API для обработки запросов</li>
                <li>• Современные методы шифрования данных</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Присоединяйтесь к тысячам пользователей, которые уже используют наш сервис
          </p>
          <Link 
            to="/chat"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Начать общение с AI</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default AboutPage;