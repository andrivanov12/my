import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Brain, Lock, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import FAQ from '../components/FAQ';

const HomePage: React.FC = () => {
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
          <a 
            href="https://bolt.new/?rid=aier2b"
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-gradient-to-r from-primary-600 to-secondary-500 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            <div className="px-6 py-4 md:py-6 text-white">
              <h2 className="text-xl md:text-2xl font-bold mb-2">
                Создавайте свои проекты с Bolt new
              </h2>
              <p className="text-white/90">
                Быстрая разработка веб-приложений с использованием современных технологий.
                Начните бесплатно прямо сейчас!
              </p>
            </div>
          </a>
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

        <section className="max-w-4xl mx-auto mb-12 md:mb-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">
            Как использовать ChatGPT без регистрации
          </h2>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              Наш сервис предоставляет простой и быстрый способ общения с искусственным интеллектом без необходимости регистрации или оплаты. Просто нажмите кнопку "Начать общение" и задайте свой вопрос.
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