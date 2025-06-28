import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { 
  Key, 
  Download, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  Code,
  Globe,
  Shield,
  Zap
} from 'lucide-react';

const TuyaInstructionsPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Инструкция по получению токенов Tuya через Postman | aimarkethub.pro</title>
        <meta name="description" content="Пошаговая инструкция по получению токенов API Tuya с помощью Postman. Скачайте готовую коллекцию и получите токены за несколько минут." />
        <meta name="keywords" content="tuya api postman, инструкция tuya токены, postman коллекция tuya, умный дом api" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full mr-4">
              <Key className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Tuya Token Generator
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Простой способ получить токены доступа к API Tuya без программирования
          </p>
        </div>

        {/* Navigation */}
        <div className="bg-gray-800 dark:bg-gray-900 text-white p-4 rounded-xl mb-8 text-center">
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/" 
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
            >
              ← Главная
            </Link>
            <Link 
              to="/tuya-token-generator" 
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Веб-генератор токенов
            </Link>
            <Link 
              to="/contact" 
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
            >
              Поддержка
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="font-semibold mb-2">Без программирования</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Используйте готовую коллекцию Postman для получения токенов
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-4">🔒</div>
            <h3 className="font-semibold mb-2">Безопасно</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Все запросы идут напрямую к API Tuya с вашего компьютера
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="font-semibold mb-2">Быстро</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Получите токены за несколько минут следуя инструкции
            </p>
          </div>
        </div>

        {/* Quick Access */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl mb-8 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start">
            <Download className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Быстрый старт</h3>
              <p className="text-purple-800 dark:text-purple-200 mb-4">
                Скачайте готовую коллекцию Postman и следуйте инструкции ниже:
              </p>
              <div className="flex flex-wrap gap-3">
                <a 
                  href="/tuya-token-generator.postman_collection.json" 
                  download
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <Download className="h-4 w-4" />
                  Скачать коллекцию Postman
                </a>
                <a 
                  href="https://www.postman.com/downloads/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  <ExternalLink className="h-4 w-4" />
                  Скачать Postman
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Options */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <Code className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
              <h3 className="font-semibold">Веб-интерфейс</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Используйте наш веб-генератор токенов прямо в браузере без установки дополнительного ПО.
            </p>
            <Link 
              to="/tuya-token-generator"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <Zap className="h-4 w-4" />
              Открыть веб-генератор
            </Link>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
              <h3 className="font-semibold">Подробная инструкция</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Полная пошаговая инструкция с картинками и примерами для работы с Postman.
            </p>
            <a 
              href="/tuya-instructions.html"
              target="_blank"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              <ExternalLink className="h-4 w-4" />
              Открыть инструкцию
            </a>
          </div>
        </div>

        {/* Steps Preview */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
            <h2 className="text-xl font-semibold">Краткая инструкция</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Получите учетные данные Tuya</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Зарегистрируйтесь на <a href="https://iot.tuya.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Tuya IoT Platform</a> и получите Client ID и Client Secret
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Установите Postman</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Скачайте и установите <a href="https://www.postman.com/downloads/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">Postman</a> - бесплатный инструмент для работы с API
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Импортируйте коллекцию</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Скачайте нашу готовую коллекцию и импортируйте её в Postman
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-purple-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Настройте переменные</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Введите ваши Client ID, Client Secret и выберите регион API
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Получите токены</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Выполните запрос "Get Token" и получите access_token и refresh_token
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Regions */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl mb-8 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start">
            <Globe className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-3">Выбор региона API</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <h4 className="font-medium mb-1">🇺🇸 Америка</h4>
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">https://openapi.tuyaus.com</code>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <h4 className="font-medium mb-1">🇪🇺 Европа</h4>
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">https://openapi.tuyaeu.com</code>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <h4 className="font-medium mb-1">🇨🇳 Китай</h4>
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">https://openapi.tuyacn.com</code>
                </div>
                <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                  <h4 className="font-medium mb-1">🇮🇳 Индия</h4>
                  <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">https://openapi.tuyain.com</code>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security Warning */}
        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl mb-8 border border-red-200 dark:border-red-800">
          <div className="flex items-start">
            <Shield className="h-6 w-6 text-red-600 dark:text-red-400 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100 mb-2">Важно для безопасности</h3>
              <ul className="text-red-800 dark:text-red-200 space-y-1 text-sm">
                <li>• Никогда не передавайте Client Secret третьим лицам</li>
                <li>• Не публикуйте учетные данные в открытом доступе</li>
                <li>• Храните токены в безопасном месте</li>
                <li>• Регулярно обновляйте токены для безопасности</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Success Features */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl mb-8 border border-green-200 dark:border-green-800">
          <div className="flex items-start">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-3">Что включено в коллекцию</h3>
              <div className="grid md:grid-cols-2 gap-3 text-green-800 dark:text-green-200 text-sm">
                <div>• Автоматическая генерация HMAC-SHA256 подписи</div>
                <div>• Правильное формирование заголовков запроса</div>
                <div>• Автоматическое сохранение полученных токенов</div>
                <div>• Поддержка всех регионов Tuya API</div>
                <div>• Подробные комментарии и логирование</div>
                <div>• Обработка ошибок с подсказками</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-4">📖</div>
            <h3 className="font-semibold mb-2">Документация Tuya</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Официальная документация API Tuya
            </p>
            <a 
              href="https://developer.tuya.com/en/docs/cloud/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Перейти к документации
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="font-semibold mb-2">Поддержка</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Если возникли вопросы, обратитесь к нашей поддержке
            </p>
            <a 
              href="https://t.me/solvillage" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Написать в Telegram
            </a>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
            <div className="text-4xl mb-4">🔧</div>
            <h3 className="font-semibold mb-2">Веб-генератор</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
              Попробуйте веб-версию генератора токенов
            </p>
            <Link 
              to="/tuya-token-generator"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Открыть генератор
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default TuyaInstructionsPage;