import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MessageSquare, Gift, Zap, Users, CheckCircle, ArrowRight, DollarSign, Clock } from 'lucide-react';

const ChatGptBesplatnoPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>ChatGPT бесплатно — Чат ГПТ без оплаты и подписки | aimarkethub.pro</title>
        <meta name="description" content="ChatGPT бесплатно навсегда! Чат ГПТ без оплаты, без подписки, без ограничений. Используйте искусственный интеллект бесплатно прямо сейчас." />
        <meta name="keywords" content="chatgpt бесплатно, чат гпт бесплатно, chatgpt free, gpt бесплатно, ai бесплатно, нейросеть бесплатно" />
        <link rel="canonical" href="https://aimarkethub.pro/chat-gpt-besplatno" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Hero секция */}
        <section className="text-center mb-12 md:mb-16">
          <div className="flex items-center justify-center mb-6">
            <Gift className="h-12 w-12 text-green-500 mr-4" />
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-500 bg-clip-text text-transparent">
              ChatGPT бесплатно
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed max-w-4xl mx-auto">
            Используйте чат ГПТ бесплатно без оплаты, подписки и скрытых платежей. 
            Полный доступ к возможностям искусственного интеллекта!
          </p>
          <Link 
            to="/chat"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-lg"
          >
            <MessageSquare className="h-6 w-6" />
            <span>Использовать ChatGPT бесплатно</span>
          </Link>
        </section>

        {/* Почему бесплатно */}
        <section className="mb-12 md:mb-16 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Почему ChatGPT у нас бесплатно?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">
                Наша миссия — доступный ИИ для всех
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Мы верим, что искусственный интеллект должен быть доступен каждому, 
                независимо от финансовых возможностей. Поэтому мы предоставляем 
                ChatGPT бесплатно для всех пользователей.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Никаких скрытых платежей</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Без автоматических списаний</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Полный функционал бесплатно</span>
                </li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Что вы получаете бесплатно:</h3>
              <ul className="space-y-3">
                <li className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-green-500" />
                  <span>Доступ к 6+ AI моделям</span>
                </li>
                <li className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-green-500" />
                  <span>Анализ изображений</span>
                </li>
                <li className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-green-500" />
                  <span>Неограниченное время использования</span>
                </li>
                <li className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-green-500" />
                  <span>Поддержка русского языка</span>
                </li>
                <li className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-green-500" />
                  <span>Мобильная версия</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Сравнение с платными сервисами */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Бесплатный ChatGPT vs Платные сервисы
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Функция</th>
                  <th className="px-6 py-4 text-center font-semibold text-green-600">Наш сервис (бесплатно)</th>
                  <th className="px-6 py-4 text-center font-semibold text-red-600">ChatGPT Plus ($20/мес)</th>
                  <th className="px-6 py-4 text-center font-semibold text-red-600">Другие сервисы</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4">Доступ к ChatGPT</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Несколько AI моделей</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400">Ограниченно</td>
                  <td className="px-6 py-4 text-center text-gray-400">Ограниченно</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Анализ изображений</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400">За доплату</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Без регистрации</td>
                  <td className="px-6 py-4 text-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  </td>
                  <td className="px-6 py-4 text-center text-red-500">Требуется</td>
                  <td className="px-6 py-4 text-center text-red-500">Требуется</td>
                </tr>
                <tr>
                  <td className="px-6 py-4">Стоимость</td>
                  <td className="px-6 py-4 text-center font-bold text-green-600">$0</td>
                  <td className="px-6 py-4 text-center font-bold text-red-600">$20/мес</td>
                  <td className="px-6 py-4 text-center font-bold text-red-600">$10-50/мес</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Как мы можем предоставлять ChatGPT бесплатно */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Как мы можем предоставлять ChatGPT бесплатно?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Оптимизация затрат</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Мы используем эффективные технологии и оптимизируем расходы на API, 
                что позволяет предоставлять сервис бесплатно.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Большая аудитория</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Благодаря большому количеству пользователей мы можем распределить 
                затраты и поддерживать бесплатный доступ.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <Zap className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Эффективная архитектура</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Современная техническая архитектура позволяет минимизировать 
                операционные расходы без ущерба качеству.
              </p>
            </div>
          </div>
        </section>

        {/* Экономия для пользователей */}
        <section className="mb-12 md:mb-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-8 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Сколько вы экономите с нашим бесплатным ChatGPT?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Годовая экономия:</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>ChatGPT Plus:</span>
                  <span className="font-bold text-red-600">$240/год</span>
                </div>
                <div className="flex justify-between">
                  <span>Claude Pro:</span>
                  <span className="font-bold text-red-600">$240/год</span>
                </div>
                <div className="flex justify-between">
                  <span>Другие AI сервисы:</span>
                  <span className="font-bold text-red-600">$120-600/год</span>
                </div>
                <hr className="my-3" />
                <div className="flex justify-between text-lg">
                  <span>Наш сервис:</span>
                  <span className="font-bold text-green-600">$0/год</span>
                </div>
              </div>
            </div>

            <div className="bg-green-100 dark:bg-green-900/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4 text-green-800 dark:text-green-200">
                Ваша экономия:
              </h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">$240+</div>
                <div className="text-lg text-green-700 dark:text-green-300">в год</div>
                <p className="mt-4 text-green-800 dark:text-green-200">
                  Эти деньги вы можете потратить на что-то более важное!
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Отзывы о бесплатном сервисе */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Отзывы о бесплатном ChatGPT
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Не могу поверить, что такой качественный сервис предоставляется бесплатно! 
                Экономлю $20 в месяц и получаю даже больше функций."
              </p>
              <p className="font-semibold">— Анна С., студентка</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Пользуюсь уже полгода, ни разу не попросили оплату. Отличная альтернатива 
                дорогим подпискам на ChatGPT Plus."
              </p>
              <p className="font-semibold">— Михаил К., программист</p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                "Для школьника это просто спасение! Помогает с учебой, а родителям не нужно 
                платить за подписку. Спасибо за бесплатный доступ!"
              </p>
              <p className="font-semibold">— Елена М., школьница</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Вопросы о бесплатном ChatGPT
          </h2>
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Действительно ли ChatGPT у вас навсегда бесплатный?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Да, мы планируем поддерживать бесплатный доступ к ChatGPT как можно дольше. 
                Наша бизнес-модель позволяет предоставлять сервис без взимания платы с пользователей.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Есть ли скрытые платежи или подписки?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Нет, у нас нет никаких скрытых платежей, автоматических списаний или принудительных подписок. 
                Сервис полностью бесплатный.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Чем отличается бесплатная версия от платной?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                У нас нет платной версии — весь функционал доступен бесплатно. Вы получаете доступ 
                ко всем AI моделям, анализу изображений и другим возможностям без ограничений.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <h3 className="font-semibold mb-2">Могу ли я использовать бесплатный ChatGPT для коммерческих целей?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Да, вы можете использовать наш сервис для любых целей, включая коммерческие проекты, 
                обучение, работу и личные нужды.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-green-600 to-blue-500 text-white p-8 md:p-12 rounded-xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Начните экономить уже сегодня!
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Используйте ChatGPT бесплатно вместо платных подписок
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/chat"
              className="inline-flex items-center gap-2 bg-white text-green-600 font-medium py-4 px-8 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl text-lg hover:bg-gray-50"
            >
              <MessageSquare className="h-6 w-6" />
              <span>Попробовать бесплатно</span>
            </Link>
            <div className="flex items-center gap-2 text-green-100">
              <Clock className="h-5 w-5" />
              <span>Экономия начинается прямо сейчас</span>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ChatGptBesplatnoPage;