import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  MessageSquare, 
  Lightbulb, 
  Code, 
  BookOpen, 
  PenTool, 
  Calculator,
  Globe,
  Zap,
  Shield,
  HelpCircle
} from 'lucide-react';

const GuidePage: React.FC = () => {
  const useCases = [
    {
      icon: <PenTool className="h-6 w-6" />,
      title: "Написание текстов",
      description: "Создание статей, писем, резюме, творческих текстов",
      examples: ["Напиши статью о пользе чтения", "Составь резюме для программиста", "Создай план презентации"]
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "Программирование",
      description: "Помощь с кодом, отладка, объяснение алгоритмов",
      examples: ["Объясни, как работает рекурсия", "Найди ошибку в коде JavaScript", "Создай функцию сортировки"]
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Обучение",
      description: "Объяснение сложных тем, подготовка к экзаменам",
      examples: ["Объясни квантовую физику простыми словами", "Помоги подготовиться к ЕГЭ по математике"]
    },
    {
      icon: <Calculator className="h-6 w-6" />,
      title: "Решение задач",
      description: "Математические вычисления, логические задачи",
      examples: ["Реши уравнение x² + 5x - 6 = 0", "Помоги с задачей по геометрии"]
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Переводы",
      description: "Перевод текстов на разные языки",
      examples: ["Переведи на английский", "Как сказать 'спасибо' на японском?"]
    },
    {
      icon: <Lightbulb className="h-6 w-6" />,
      title: "Творчество",
      description: "Генерация идей, мозговой штурм, креативные решения",
      examples: ["Придумай название для стартапа", "Идеи для подарка на день рождения"]
    }
  ];

  const tips = [
    {
      title: "Будьте конкретными",
      description: "Чем точнее вы сформулируете вопрос, тем лучше будет ответ. Вместо 'Расскажи о программировании' лучше спросить 'Как изучить Python с нуля?'"
    },
    {
      title: "Используйте контекст",
      description: "Предоставьте дополнительную информацию, если она важна для понимания вашего вопроса."
    },
    {
      title: "Задавайте уточняющие вопросы",
      description: "Если ответ неполный или непонятный, не стесняйтесь просить разъяснения или дополнительные детали."
    },
    {
      title: "Экспериментируйте с моделями",
      description: "Разные AI модели могут давать различные ответы. Попробуйте несколько моделей для сравнения результатов."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Руководство по искусственному интеллекту | Как эффективно работать с AI</title>
        <meta name="description" content="Полное руководство по искусственному интеллекту и AI инструментам. Узнайте, как эффективно использовать ChatGPT, n8n автоматизацию и другие AI технологии." />
        <meta name="keywords" content="гайд по работе с AI, руководство по искусственному интеллекту, обучение работе с AI, инструкции по использованию AI, как работать с искусственным интеллектом, AI справочник" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            Руководство по искусственному интеллекту
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Изучите возможности искусственного интеллекта и научитесь эффективно 
            использовать AI инструменты для решения различных задач в бизнесе и повседневной жизни.
          </p>
        </div>

        {/* Быстрый старт */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-8 rounded-xl mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Zap className="h-6 w-6 mr-2 text-primary-600 dark:text-primary-400" />
            Быстрый старт с AI инструментами
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">1</div>
              <h3 className="font-semibold mb-2">Выберите инструмент</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Определите, какой AI инструмент нужен для вашей задачи
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-secondary-600 dark:text-secondary-400 mb-2">2</div>
              <h3 className="font-semibold mb-2">Настройте параметры</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Укажите необходимые параметры и настройки для выбранного инструмента
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">3</div>
              <h3 className="font-semibold mb-2">Получите результат</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                AI обработает ваш запрос и предоставит результат в соответствии с задачей
              </p>
            </div>
          </div>
        </div>

        {/* Возможности использования */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Возможности AI инструментов</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg text-primary-600 dark:text-primary-400 mr-3">
                    {useCase.icon}
                  </div>
                  <h3 className="font-semibold">{useCase.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                  {useCase.description}
                </p>
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    Примеры запросов:
                  </h4>
                  {useCase.examples.map((example, exampleIndex) => (
                    <div key={exampleIndex} className="text-xs text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      "{example}"
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Советы по эффективному использованию */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Советы по эффективному использованию AI</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {tips.map((tip, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <h3 className="font-semibold mb-3 text-primary-600 dark:text-primary-400">
                  {tip.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Доступные модели */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">Доступные AI инструменты</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-semibold text-primary-600 dark:text-primary-400">ChatGPT без регистрации</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Бесплатный доступ к ChatGPT и другим AI моделям без необходимости создания аккаунта.
                </p>
              </div>
              <div className="border-l-4 border-secondary-500 pl-4">
                <h3 className="font-semibold text-secondary-600 dark:text-secondary-400">n8n Assistant</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Специализированный AI-ассистент для создания и оптимизации n8n workflow.
                </p>
              </div>
              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-semibold text-primary-600 dark:text-primary-400">n8n Workflow Optimizer</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Инструмент для анализа и оптимизации n8n workflow, выявления ошибок и улучшения производительности.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="border-l-4 border-secondary-500 pl-4">
                <h3 className="font-semibold text-secondary-600 dark:text-secondary-400">AI Prompt Optimizer</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Инструмент для создания эффективных промптов для AI моделей и автоматизации.
                </p>
              </div>
              <div className="border-l-4 border-primary-500 pl-4">
                <h3 className="font-semibold text-primary-600 dark:text-primary-400">Tuya API Generator</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Инструмент для генерации токенов и интеграции с API Tuya для умного дома.
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium mb-2 flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  Как выбрать инструмент?
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Выбирайте инструмент в зависимости от вашей задачи: ChatGPT для общения с AI, n8n Assistant для автоматизации, Prompt Optimizer для улучшения запросов.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Безопасность и конфиденциальность */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-8 rounded-xl mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Shield className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
            Безопасность и приватность данных
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 text-green-600 dark:text-green-400">Что мы защищаем</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Все сообщения шифруются при передаче</li>
                <li>• История чата хранится только в вашем браузере</li>
                <li>• Мы не собираем персональные данные</li>
                <li>• Нет отслеживания пользователей</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">Рекомендации</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                <li>• Не делитесь конфиденциальной информацией</li>
                <li>• Очищайте историю браузера при необходимости</li>
                <li>• Используйте VPN для дополнительной анонимности</li>
                <li>• Проверяйте полученную информацию из других источников</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Готовы попробовать?</h2>
          <p className="text-gray-700 dark:text-gray-300 mb-6">
            Теперь, когда вы знаете основы, пора начать использовать AI инструменты
          </p>
          <Link 
            to="/chat"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Начать работу с AI</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default GuidePage;