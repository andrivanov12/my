import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, CheckCircle, Star, ArrowRight, Zap, Shield, Globe } from 'lucide-react';

const ChatGptBezRegistraciiPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>ChatGPT без регистрации — Бесплатный доступ к ИИ | aimarkethub.pro</title>
        <meta name="description" content="ChatGPT без регистрации — получите мгновенный доступ к искусственному интеллекту. Бесплатно, без входа в аккаунт, без ограничений. Начните общение прямо сейчас!" />
        <meta name="keywords" content="chatgpt без регистрации, чат гпт без регистрации, chatgpt бесплатно без регистрации, gpt без регистрации, ai без регистрации" />
        <link rel="canonical" href="https://aimarkethub.pro/chatgpt-bez-registracii" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Hero секция */}
        <section className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            ChatGPT без регистрации
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
            Мгновенный доступ к искусственному интеллекту без создания аккаунта, 
            без ввода email и без подтверждения телефона
          </p>
          <Link 
            to="/chat"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            <MessageSquare className="h-6 w-6" />
            <span>Попробовать ChatGPT сейчас</span>
          </Link>
        </section>

        {/* Преимущества */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Почему ChatGPT без регистрации — лучший выбор?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Мгновенный старт</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Никаких форм регистрации, подтверждений email или ожидания. 
                Просто откройте сайт и начните общение с ChatGPT прямо сейчас.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Полная анонимность</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Мы не собираем личные данные, не требуем email или телефон. 
                Ваша приватность защищена на 100%.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Доступно везде</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Работает на всех устройствах и в любой стране. 
                Никаких ограничений по региону или типу устройства.
              </p>
            </div>
          </div>
        </section>

        {/* Сравнение */}
        <section className="mb-12 md:mb-16 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            ChatGPT без регистрации vs с регистрацией
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">
                ✅ Без регистрации (наш сервис)
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Мгновенный доступ</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Полная анонимность</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Никаких личных данных</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Бесплатно навсегда</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Несколько AI моделей</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
                ❌ С регистрацией (официальный сайт)
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li>• Требуется email и телефон</li>
                <li>• Долгий процесс регистрации</li>
                <li>• Сбор личных данных</li>
                <li>• Ограничения для бесплатных пользователей</li>
                <li>• Платная подписка для полного доступа</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Инструкция */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Как использовать ChatGPT без регистрации
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Откройте чат</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Нажмите кнопку "Попробовать ChatGPT" и перейдите на страницу чата
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Выберите модель</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Выберите подходящую AI модель из выпадающего списка
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Начните общение</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Введите ваш вопрос и получите ответ от искусственного интеллекта
              </p>
            </div>
          </div>
        </section>

        {/* Отзывы */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Что говорят пользователи
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Наконец-то нашел ChatGPT без регистрации! Очень удобно, что не нужно вводить email и создавать аккаунт."
              </p>
              <p className="font-semibold">— Алексей М.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Отличный сервис! Пользуюсь уже месяц, все работает стабильно. Особенно нравится, что есть разные AI модели."
              </p>
              <p className="font-semibold">— Мария К.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Идеально для студентов! Помогает с учебой, а главное — бесплатно и без всяких регистраций."
              </p>
              <p className="font-semibold">— Дмитрий П.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Часто задаваемые вопросы
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Действительно ли ChatGPT без регистрации бесплатный?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Да, наш сервис полностью бесплатный. Мы не берем плату за использование ChatGPT и не требуем подписки.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Есть ли ограничения на количество сообщений?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Мы используем систему честного распределения ресурсов. При высокой нагрузке могут быть временные ограничения, но в целом сервис доступен круглосуточно.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Какие AI модели доступны без регистрации?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                У нас доступны Qwen 3, Gemini 2.5 Flash, Llama 4 Maverick, Deepseek Chat и другие современные языковые модели.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Сохраняется ли история переписки?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                История сохраняется локально в вашем браузере на 7 дней. Мы не храним переписку на серверах для обеспечения приватности.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-primary-600 to-secondary-500 text-white p-8 md:p-12 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Попробуйте ChatGPT без регистрации прямо сейчас!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Никаких форм, паролей или ожидания — просто начните общение
          </p>
          <Link 
            to="/chat"
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-medium py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-lg hover:bg-gray-50"
          >
            <MessageSquare className="h-6 w-6" />
            <span>Начать общение с ChatGPT</span>
            <ArrowRight className="h-6 w-6" />
          </Link>
        </section>
      </div>
    </>
  );
};

export default ChatGptBezRegistraciiPage;