import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  Zap, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Copy, 
  RotateCcw, 
  Lightbulb,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MessageSquare
} from 'lucide-react';

interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  template: string;
}

const AiPromptOptimizerPage: React.FC = () => {
  const [userRequest, setUserRequest] = useState('');
  const [selectedComplexity, setSelectedComplexity] = useState<'beginner' | 'intermediate' | 'advanced' | 'expert'>('beginner');
  const [selectedContext, setSelectedContext] = useState('');
  const [customContext, setCustomContext] = useState('');
  const [includeExamples, setIncludeExamples] = useState(true);
  const [includeFormatting, setIncludeFormatting] = useState(true);
  const [includeStepByStep, setIncludeStepByStep] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [optimizedPrompt, setOptimizedPrompt] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<'generator' | 'tips' | 'faq'>('generator');
  const [openFaqItems, setOpenFaqItems] = useState<number[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  const contexts = [
    { id: 'n8n', name: 'n8n' },
    { id: 'zapier', name: 'Zapier' },
    { id: 'make', name: 'Make.com' },
    { id: 'home-assistant', name: 'Home Assistant' },
    { id: 'ifttt', name: 'IFTTT' },
    { id: 'chatgpt', name: 'ChatGPT API' },
    { id: 'custom', name: 'Другое' }
  ];

  const complexityLabels = {
    beginner: 'Начальный',
    intermediate: 'Средний',
    advanced: 'Продвинутый',
    expert: 'Экспертный'
  };

  const tips = [
    {
      title: 'Будьте конкретны',
      description: 'Чем точнее вы укажете, что хотите получить, тем лучше будет результат.',
      example: '❌ "Создай отчет"\n✅ "Создай еженедельный отчет о посещаемости сайта с графиками по источникам трафика"'
    },
    {
      title: 'Указывайте формат результата',
      description: 'Явно указывайте, в каком формате вы хотите получить данные или результат обработки.',
      example: '❌ "Проанализируй данные о продажах"\n✅ "Проанализируй данные о продажах и представь результаты в виде JSON с полями \'период\', \'сумма_продаж\' и \'прирост_в_процентах\'"'
    },
    {
      title: 'Разбивайте сложные задачи',
      description: 'Для сложных процессов автоматизации разбивайте задачи на четкие пронумерованные шаги.',
      example: '✅ "1. Извлеки данные о товарах из таблицы\n2. Отфильтруй товары с остатком меньше 10 штук\n3. Сформируй список для заказа в формате CSV"'
    },
    {
      title: 'Используйте ограничения',
      description: 'Указывайте ограничения и граничные условия для избежания нежелательных результатов.',
      example: '✅ "Сгенерируй текст для email-рассылки о новой акции, длиной не более 200 слов, без использования спам-слов"'
    },
    {
      title: 'Указывайте пример результата',
      description: 'Приведите пример ожидаемого результата для лучшего понимания AI вашей задачи.',
      example: '✅ "Создай шаблон отчета о проделанной работе. Пример результата: \'Выполненные задачи: [список задач]. Затраченное время: [часы]. Сложности: [описание проблем]\'"'
    },
    {
      title: 'Укажите контекст использования',
      description: 'Объясните, в какой системе или инструменте вы будете использовать результат.',
      example: '✅ "Напиши функцию на JavaScript для обработки данных, которая будет использоваться в n8n в узле Function"'
    }
  ];

  const faqItems = [
    {
      question: 'Что такое AI Prompt Optimizer?',
      answer: 'AI Prompt Optimizer — это инструмент, который помогает преобразовывать обычные запросы в структурированные и эффективные инструкции (промпты) для искусственного интеллекта. Оптимизированные промпты позволяют получить от AI более точные результаты, особенно в контексте задач автоматизации.'
    },
    {
      question: 'Как использовать сгенерированный промпт?',
      answer: 'Сгенерированный промпт можно скопировать и использовать в любой системе, работающей с искусственным интеллектом. Например, вы можете вставить промпт в ChatGPT, в узел AI в n8n, в интеграцию с OpenAI API в Make.com или Zapier, или в любую другую систему автоматизации, которая имеет доступ к инструментам AI.'
    },
    {
      question: 'Чем отличаются уровни сложности промптов?',
      answer: 'Начальный уровень — простые, понятные инструкции для базовых задач автоматизации. Средний уровень — более детализированные инструкции с примерами и структурированием запроса. Продвинутый уровень — детальные инструкции с контекстом использования, примерами, ограничениями и спецификацией формата результата. Экспертный уровень — максимально детализированные инструкции с учетом технических особенностей выбранной системы автоматизации.'
    },
    {
      question: 'Почему важно указывать контекст применения?',
      answer: 'Указание контекста применения позволяет адаптировать промпт под особенности конкретной системы автоматизации. Например, промпт для n8n может содержать специфические инструкции по использованию узлов и переменных, которые отличаются от тех, что используются в Zapier или Make.com. Это повышает точность и применимость сгенерированного промпта.'
    },
    {
      question: 'Можно ли использовать сгенерированные промпты в коммерческих проектах?',
      answer: 'Да, вы можете свободно использовать сгенерированные промпты в любых проектах, включая коммерческие. Однако, имейте в виду, что сам оптимизированный промпт является лишь шаблоном-инструкцией для AI, и результаты, которые вы получите от AI, могут подпадать под другие условия использования в зависимости от платформы AI, которую вы используете.'
    },
    {
      question: 'Как этот инструмент может помочь в создании автоматизации с n8n?',
      answer: 'Для n8n оптимизатор промптов особенно полезен при работе с узлами, взаимодействующими с искусственным интеллектом (AI Agent, OpenAI, HTTP Request к AI API и т.д.). Точные и структурированные промпты помогут получить от AI именно тот результат, который вам нужен для дальнейшей обработки в вашем рабочем процессе.'
    }
  ];

  const generateOptimizedPrompt = (
    request: string,
    complexity: string,
    context: string,
    includeExamples: boolean,
    includeFormatting: boolean,
    includeStepByStep: boolean
  ): string => {
    let prompt = '';
    const contextPart = context ? `для использования в ${context}` : '';
    const taskPart = `"${request}"`;

    switch (complexity) {
      case 'beginner':
        prompt = `Помоги мне создать автоматизацию ${contextPart} для следующей задачи: ${taskPart}.`;
        if (includeStepByStep) {
          prompt += `\n\nПожалуйста, опиши пошаговый процесс, как это можно реализовать.`;
        }
        if (includeExamples) {
          prompt += `\n\nПриведи простой пример, как это может работать.`;
        }
        break;

      case 'intermediate':
        prompt = `Мне нужно создать автоматизацию ${contextPart} для решения следующей задачи: ${taskPart}.`;
        if (includeStepByStep) {
          prompt += `\n\nПожалуйста, предоставь детальный план действий с пронумерованными шагами для реализации этой автоматизации.`;
        }
        if (context) {
          prompt += `\n\nУчти особенности платформы ${context} при составлении инструкций.`;
        }
        if (includeExamples) {
          prompt += `\n\nВключи конкретные примеры настройки и кода, где это необходимо.`;
        }
        prompt += `\n\nУкажи также, какие данные должны быть на входе и какой результат ожидается на выходе.`;
        break;

      case 'advanced':
        prompt = `Я разрабатываю автоматизированное решение ${contextPart} для следующей задачи: ${taskPart}.`;
        prompt += `\n\nМне нужен детальный технический план реализации с учетом следующих требований:`;
        if (includeStepByStep) {
          prompt += `\n- Подробная пошаговая инструкция с объяснением каждого этапа`;
        }
        if (context) {
          prompt += `\n- Специфические особенности и ограничения платформы ${context}`;
          prompt += `\n- Рекомендации по использованию наиболее подходящих компонентов/узлов/интеграций в ${context}`;
        }
        if (includeExamples) {
          prompt += `\n- Примеры кода или настроек для ключевых элементов автоматизации`;
          prompt += `\n- Примеры обработки типичных сценариев и исключений`;
        }
        prompt += `\n- Описание структуры данных на входе и выходе каждого этапа`;
        prompt += `\n- Рекомендации по обеспечению надежности и обработке ошибок`;
        if (includeFormatting) {
          prompt += `\n\nПожалуйста, структурируй ответ с использованием заголовков, списков и, где применимо, таблиц для лучшей читаемости.`;
        }
        break;

      case 'expert':
        prompt = `Я разрабатываю сложную систему автоматизации ${contextPart} для решения следующей бизнес-задачи: ${taskPart}.`;
        prompt += `\n\nМне требуется экспертное руководство по архитектуре и реализации с учетом следующих аспектов:`;
        if (includeStepByStep) {
          prompt += `\n\n1. Архитектурный обзор:`;
          prompt += `\n - Детальная схема компонентов и их взаимосвязей`;
          prompt += `\n - Потоки данных между компонентами`;
          prompt += `\n - Критические точки и потенциальные узкие места`;
        }
        if (context) {
          prompt += `\n\n2. Технические спецификации для ${context}:`;
          prompt += `\n - Оптимальная структура рабочего процесса`;
          prompt += `\n - Рекомендуемые компоненты, триггеры, действия`;
          prompt += `\n - Особенности конфигурации и настройки`;
          prompt += `\n - Известные ограничения платформы и способы их обхода`;
        }
        prompt += `\n\n3. Спецификация данных:`;
        prompt += `\n - Точное описание форматов входных и выходных данных`;
        prompt += `\n - Структуры JSON/XML для обмена информацией`;
        prompt += `\n - Валидация и обработка ошибок для всех типов данных`;
        if (includeExamples) {
          prompt += `\n\n4. Реализация:`;
          prompt += `\n - Исчерпывающие примеры кода для всех компонентов`;
          prompt += `\n - Шаблоны для обработки различных сценариев`;
          prompt += `\n - Образцы конфигурации для интеграции с внешними системами`;
        }
        prompt += `\n\n5. Оптимизация и масштабирование:`;
        prompt += `\n - Рекомендации по повышению производительности`;
        prompt += `\n - Стратегии обработки больших объемов данных`;
        prompt += `\n - Методы мониторинга и отладки автоматизации`;
        if (includeFormatting) {
          prompt += `\n\nПредоставь ответ в структурированном формате с четким разделением разделов, использованием заголовков, списков, таблиц и, при необходимости, блоков кода с соответствующим синтаксисом.`;
        }
        prompt += `\n\nДобавь раздел с анализом потенциальных проблем и рисков, а также стратегии их минимизации.`;
        break;
    }

    return prompt;
  };

  const handleGenerate = () => {
    if (!userRequest.trim()) {
      alert('Пожалуйста, введите запрос для оптимизации.');
      return;
    }

    setIsLoading(true);
    setShowResult(false);

    const context = selectedContext === 'custom' ? customContext : selectedContext;
    
    setTimeout(() => {
      const optimized = generateOptimizedPrompt(
        userRequest,
        selectedComplexity,
        context,
        includeExamples,
        includeFormatting,
        includeStepByStep
      );
      
      setOptimizedPrompt(optimized);
      setIsLoading(false);
      setShowResult(true);
    }, 1500);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(optimizedPrompt);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Не удалось скопировать текст. Пожалуйста, выделите текст и скопируйте его вручную.');
    }
  };

  const handleClear = () => {
    setUserRequest('');
    setSelectedComplexity('beginner');
    setSelectedContext('');
    setCustomContext('');
    setIncludeExamples(true);
    setIncludeFormatting(true);
    setIncludeStepByStep(true);
    setShowResult(false);
    setOptimizedPrompt('');
  };

  const toggleFaqItem = (index: number) => {
    setOpenFaqItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <>
      <Helmet>
        <title>AI Prompt Optimizer для автоматизации | aimarkethub.pro</title>
        <meta name="description" content="Превратите ваши обычные запросы в оптимизированные промпты для искусственного интеллекта. Создавайте более эффективные инструкции для AI в контексте автоматизации задач." />
        <meta name="keywords" content="ai prompt optimizer, промпт оптимизатор, автоматизация ai, n8n промпты, zapier ai, make.com ai" />
        <link rel="canonical" href="https://aimarkethub.pro/ai-prompt-optimizer" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            AI Prompt Optimizer для автоматизации
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto mb-8">
            Превратите обычные запросы в оптимизированные промпты для искусственного интеллекта. 
            Создавайте четкие инструкции, которые приведут к желаемым результатам в ваших задачах автоматизации.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <Clock className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium">Экономия времени</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Более точные результаты</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Повышение эффективности</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Различные варианты сложности</span>
            </div>
          </div>
        </section>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('generator')}
              className={`px-6 py-4 font-semibold transition-colors duration-200 ${
                activeTab === 'generator'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
              }`}
            >
              Генератор промптов
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`px-6 py-4 font-semibold transition-colors duration-200 ${
                activeTab === 'tips'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
              }`}
            >
              Советы и примеры
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-6 py-4 font-semibold transition-colors duration-200 ${
                activeTab === 'faq'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
              }`}
            >
              FAQ
            </button>
          </div>

          <div className="p-6">
            {/* Generator Tab */}
            {activeTab === 'generator' && (
              <div className="space-y-6">
                {/* User Request */}
                <div>
                  <label htmlFor="prompt-request" className="block font-semibold mb-2">
                    Что вы хотите автоматизировать?
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Опишите своими словами, какую задачу вы хотите решить с помощью ИИ в процессе автоматизации.
                  </p>
                  <textarea
                    id="prompt-request"
                    value={userRequest}
                    onChange={(e) => setUserRequest(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none"
                    rows={4}
                    placeholder="Например: Хочу автоматически создавать ежедневный отчет о работе сайта и отправлять его в Telegram"
                  />
                </div>

                {/* Complexity Level */}
                <div>
                  <label className="block font-semibold mb-3">Уровень детализации промпта:</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {Object.entries(complexityLabels).map(([key, label]) => (
                      <label key={key} className="relative">
                        <input
                          type="radio"
                          name="complexity"
                          value={key}
                          checked={selectedComplexity === key}
                          onChange={(e) => setSelectedComplexity(e.target.value as any)}
                          className="sr-only"
                        />
                        <div className={`p-3 border-2 rounded-lg cursor-pointer transition-colors duration-200 text-center ${
                          selectedComplexity === key
                            ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                        }`}>
                          <span className="font-medium">{label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Context */}
                <div>
                  <label className="block font-semibold mb-3">Контекст применения:</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {contexts.map((context) => (
                      <button
                        key={context.id}
                        onClick={() => setSelectedContext(context.id)}
                        className={`p-3 border rounded-lg transition-colors duration-200 ${
                          selectedContext === context.id
                            ? 'border-primary-600 bg-primary-600 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
                        }`}
                      >
                        {context.name}
                      </button>
                    ))}
                  </div>
                  
                  {selectedContext === 'custom' && (
                    <input
                      type="text"
                      value={customContext}
                      onChange={(e) => setCustomContext(e.target.value)}
                      className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Укажите ваш контекст применения"
                    />
                  )}
                </div>

                {/* Options */}
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeExamples}
                      onChange={(e) => setIncludeExamples(e.target.checked)}
                      className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span>Добавить примеры использования</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeFormatting}
                      onChange={(e) => setIncludeFormatting(e.target.checked)}
                      className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span>Добавить форматирование для лучшей читаемости</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={includeStepByStep}
                      onChange={(e) => setIncludeStepByStep(e.target.checked)}
                      className="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <span>Включить пошаговые инструкции</span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleClear}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                  >
                    Очистить
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isLoading || !userRequest.trim()}
                    className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Оптимизируем промпт...
                      </>
                    ) : (
                      <>
                        <Zap className="h-5 w-5" />
                        Оптимизировать промпт
                      </>
                    )}
                  </button>
                </div>

                {/* Result */}
                {showResult && (
                  <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Оптимизированный промпт</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedComplexity === 'beginner' ? 'bg-green-100 text-green-800' :
                        selectedComplexity === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        selectedComplexity === 'advanced' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {complexityLabels[selectedComplexity]}
                      </span>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                      <pre className="whitespace-pre-wrap text-sm leading-relaxed">{optimizedPrompt}</pre>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Используйте этот промпт для взаимодействия с AI в выбранной системе автоматизации
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                        >
                          <Copy className="h-4 w-4" />
                          {copySuccess ? 'Скопировано!' : 'Копировать'}
                        </button>
                        <button
                          onClick={handleGenerate}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Сгенерировать заново
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tips Tab */}
            {activeTab === 'tips' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Советы по созданию эффективных промптов для автоматизации</h3>
                <div className="grid gap-6">
                  {tips.map((tip, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{tip.title}</h4>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">{tip.description}</p>
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            <pre className="text-sm whitespace-pre-wrap">{tip.example}</pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Tab */}
            {activeTab === 'faq' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Часто задаваемые вопросы</h3>
                <div className="space-y-4">
                  {faqItems.map((item, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <button
                        onClick={() => toggleFaqItem(index)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <span className="font-medium">{item.question}</span>
                        {openFaqItems.includes(index) ? (
                          <ChevronUp className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {openFaqItems.includes(index) && (
                        <div className="px-4 pb-4">
                          <p className="text-gray-600 dark:text-gray-300">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <section className="text-center mt-12 bg-gradient-to-r from-primary-600 to-secondary-500 text-white p-8 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Готовы создать свою автоматизацию?</h2>
          <p className="text-lg mb-6 opacity-90">
            Используйте оптимизированные промпты в ваших проектах автоматизации
          </p>
          <Link 
            to="/chat"
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200 hover:bg-gray-50"
          >
            <MessageSquare className="h-5 w-5" />
            Попробовать с ChatGPT
          </Link>
        </section>
      </div>
    </>
  );
};

export default AiPromptOptimizerPage;