import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, Smartphone, Monitor, Tablet, Wifi, Zap, Globe, CheckCircle } from 'lucide-react';

const AiChatOnlinePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>AI чат онлайн — Искусственный интеллект в браузере | aimarkethub.pro</title>
        <meta name="description" content="AI чат онлайн — общайтесь с искусственным интеллектом прямо в браузере. Работает на всех устройствах, не требует установки приложений. Попробуйте прямо сейчас!" />
        <meta name="keywords" content="ai чат онлайн, искусственный интеллект онлайн, нейросеть онлайн, чат с ии онлайн, ai online, chatbot online" />
        <link rel="canonical" href="https://aimarkethub.pro/ai-chat-online" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Hero секция */}
        <section className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center mb-6">
            <Globe className="h-12 w-12 text-blue-500 mr-4" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
              AI чат онлайн
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
            Общайтесь с искусственным интеллектом прямо в браузере. 
            Работает на всех устройствах без установки приложений!
          </p>
          <Link 
            to="/chat"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            <MessageSquare className="h-6 w-6" />
            <span>Открыть AI чат онлайн</span>
          </Link>
        </section>

        {/* Преимущества онлайн чата */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Преимущества AI чата онлайн
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Wifi className="h-10 w-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Работает в браузере</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Не нужно скачивать и устанавливать приложения. 
                Просто откройте браузер и начните общение с AI.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Мгновенный доступ</h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI чат загружается за секунды. Никаких долгих установок, 
                обновлений или настроек.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Доступно везде</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Работает в любой стране, на любом устройстве с интернетом. 
                Никаких региональных ограничений.
              </p>
            </div>
          </div>
        </section>

        {/* Поддерживаемые устройства */}
        <section className="mb-12 md:mb-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            AI чат работает на всех устройствах
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <Monitor className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Компьютер</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Windows, macOS, Linux
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <Smartphone className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Смартфон</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  iPhone, Android
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <Tablet className="h-16 w-16 text-purple-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Планшет</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  iPad, Android планшеты
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <Globe className="h-16 w-16 text-orange-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Любой браузер</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Chrome, Safari, Firefox, Edge
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Возможности AI чата онлайн */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Что можно делать в AI чате онлайн
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Для учебы и работы:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Решение задач по математике и физике</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Написание эссе и рефератов</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Изучение иностранных языков</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Программирование и отладка кода</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Анализ данных и составление отчетов</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Для творчества и развлечений:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span>Написание стихов и рассказов</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span>Создание сценариев и диалогов</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span>Генерация идей для проектов</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span>Анализ изображений и фотографий</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span>Интересные беседы на любые темы</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Технические особенности */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Технические особенности AI чата онлайн
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Производительность</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Быстрая загрузка интерфейса (менее 3 секунд)</li>
                <li>• Оптимизация для мобильных устройств</li>
                <li>• Адаптивный дизайн для любых экранов</li>
                <li>• Минимальное потребление трафика</li>
                <li>• Работа в офлайн режиме (история чата)</li>
              </ul>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-semibold mb-4">Безопасность</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Шифрование всех данных (HTTPS)</li>
                <li>• Локальное хранение истории чата</li>
                <li>• Никаких cookies для отслеживания</li>
                <li>• Защита от вредоносного контента</li>
                <li>• Соответствие стандартам приватности</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Сравнение с мобильными приложениями */}
        <section className="mb-12 md:mb-16 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            AI чат онлайн vs Мобильные приложения
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">
                ✅ AI чат онлайн (наш сервис)
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Не занимает место на устройстве</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Всегда актуальная версия</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Работает на любом устройстве</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Не требует разрешений</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Мгновенный доступ</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-red-600 dark:text-red-400">
                ❌ Мобильные приложения
              </h3>
              <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                <li>• Занимают место в памяти устройства</li>
                <li>• Требуют регулярных обновлений</li>
                <li>• Ограничены операционной системой</li>
                <li>• Запрашивают множество разрешений</li>
                <li>• Долгая установка и настройка</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Отзывы пользователей */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Отзывы о AI чате онлайн
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Очень удобно, что можно пользоваться AI чатом прямо в браузере. 
                Не нужно ничего устанавливать, работает быстро на любом устройстве."
              </p>
              <p className="font-semibold">— Сергей Л., веб-дизайнер</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Пользуюсь AI чатом и на компьютере, и на телефоне. Везде работает одинаково хорошо. 
                История синхронизируется автоматически."
              </p>
              <p className="font-semibold">— Мария В., студентка</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Отличная альтернатива мобильным приложениям! Не засоряет память телефона, 
                а функционал такой же богатый."
              </p>
              <p className="font-semibold">— Андрей К., программист</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Вопросы об AI чате онлайн
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Нужно ли устанавливать приложение для AI чата?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Нет, наш AI чат работает полностью онлайн в браузере. Никаких приложений устанавливать не нужно.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Работает ли AI чат на мобильных устройствах?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Да, AI чат полностью адаптирован для мобильных устройств и работает в любом браузере на смартфонах и планшетах.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Какие браузеры поддерживаются?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI чат работает во всех современных браузерах: Chrome, Safari, Firefox, Edge, Opera и других.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Сохраняется ли история чата при переходе между устройствами?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                История чата сохраняется локально в браузере каждого устройства. Для синхронизации между устройствами можно экспортировать историю.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-blue-600 to-purple-500 text-white p-8 md:p-12 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Попробуйте AI чат онлайн прямо сейчас!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Никаких установок, регистраций или ожидания — просто откройте и пользуйтесь
          </p>
          <Link 
            to="/chat"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-medium py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-lg hover:bg-gray-50"
          >
            <MessageSquare className="h-6 w-6" />
            <span>Открыть AI чат онлайн</span>
          </Link>
        </section>
      </div>
    </>
  );
};

export default AiChatOnlinePage;