import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Send, Copy, Check, Settings, Layers, Code, Zap, GitBranch, HelpCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

interface Template {
  title: string;
  prompt: string;
  category: string;
}

const N8nAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [rememberKey, setRememberKey] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const templates: Template[] = [
    {
      title: "Настройка HTTP Request узла",
      prompt: "Как настроить HTTP Request узел для подключения к REST API?",
      category: "basic"
    },
    {
      title: "Работа с JSON данными",
      prompt: "Как работать с JSON данными в n8n?",
      category: "basic"
    },
    {
      title: "Настройка webhook-триггера",
      prompt: "Как настроить webhook-триггер в n8n?",
      category: "basic"
    },
    {
      title: "Обработка ошибок в workflow",
      prompt: "Как обрабатывать ошибки в n8n workflow?",
      category: "basic"
    },
    {
      title: "Google Sheets интеграция",
      prompt: "Как интегрировать Google Sheets с n8n? Приведи подробный пример workflow.",
      category: "integrations"
    },
    {
      title: "Отправка уведомлений в Telegram",
      prompt: "Как отправлять уведомления в Telegram с помощью n8n? Покажи пример workflow с настройками.",
      category: "integrations"
    },
    {
      title: "Подключение к MySQL",
      prompt: "Создай workflow для подключения n8n к базе данных MySQL и выполнения запросов.",
      category: "integrations"
    },
    {
      title: "Интеграция с OpenAI",
      prompt: "Как интегрировать n8n с OpenAI API для использования ChatGPT в автоматизациях?",
      category: "integrations"
    },
    {
      title: "Резервное копирование данных",
      prompt: "Создай workflow для автоматического резервного копирования данных из одной системы в другую. Подробно опиши каждый шаг.",
      category: "automation"
    },
    {
      title: "Мониторинг веб-сайта",
      prompt: "Как создать workflow для мониторинга веб-сайта и отправки уведомлений при недоступности? Объясни настройку каждого узла.",
      category: "automation"
    },
    {
      title: "Автоматизация отчётов",
      prompt: "Создай n8n workflow для периодической выгрузки данных из API, их обработки и отправки отчёта по email.",
      category: "automation"
    }
  ];

  const systemPrompt = `Ты - специализированный AI-ассистент по платформе n8n (произносится "n-eight-n"), инструменту для автоматизации рабочих процессов без кода или с минимальным программированием.

Основная информация о n8n:
- n8n - это инструмент для создания workflow автоматизаций с помощью узлов (nodes)
- Узлы представляют различные сервисы и функциональность (HTTP Request, Telegram, Google Sheets, JavaScript функции и т.д.)
- Узлы соединяются для создания последовательных рабочих процессов (workflows)
- n8n может работать как self-hosted решение или как облачный сервис (n8n.cloud)
- n8n имеет открытый исходный код и коммерческую версию n8n Enterprise с дополнительными возможностями

Особенности архитектуры и концепций n8n:
1. Узлы (Nodes) - основные строительные блоки workflow в n8n, каждый выполняет определенную функцию.
2. Соединения (Connections) - связи между узлами, определяют поток данных.
3. Рабочие процессы (Workflows) - последовательности узлов и соединений для выполнения задачи автоматизации.
4. Триггеры (Triggers) - специальные узлы для запуска workflow (Webhook, Cron, и т.д.).
5. Выражения (Expressions) - способ доступа к данным с использованием синтаксиса {{ $json.field }}
6. Pinned Data - возможность сохранения тестовых данных для узлов
7. Credentials - защищенное хранилище для учетных данных сервисов
8. Parameters - настройки узлов, определяющие их поведение
9. Environments - разделение рабочих сред (dev, staging, production)

При ответах на вопросы:
- Давай точные инструкции по настройке узлов с описанием всех требуемых параметров
- Всегда предлагай полный workflow для решения задачи, перечисляя все необходимые узлы по порядку
- При необходимости включай примеры JavaScript кода для Function и FunctionItem узлов
- Добавляй советы по обработке ошибок и отладке workflow
- Предлагай альтернативные подходы, если они могут быть более эффективными
- Используй последние знания о возможностях n8n до версии 1.20.0

Форматируй ответы с использованием markdown для лучшей читаемости. Для примеров кода используй блоки кода с указанием языка.

Важные узлы n8n:
- HTTP Request: для API запросов
- Webhook: для получения данных через веб-хуки
- Function: для исполнения JavaScript кода для одного элемента
- FunctionItem: для обработки каждого элемента в массиве отдельно
- Code: для выполнения произвольного кода Node.js
- IF: для условной логики
- Switch: для множественных условий
- Set: для установки переменных
- Edit Fields: для изменения структуры данных
- Execute Workflow: для запуска других workflows
- Split In Batches: для обработки больших наборов данных
- Error Workflow: для обработки ошибок
- Merge: для объединения нескольких потоков
- Filter: для фильтрации элементов

Особенности работы с данными в n8n:
- Данные передаются между узлами как массив объектов в формате JSON
- Доступ к данным осуществляется через expression {{ $json.fieldName }} или {{ $node["NodeName"].json.fieldName }}
- Для преобразования данных часто используются узлы Function, Set и Item Lists
- Можно использовать такие выражения как $binary, $env, $items, $parameters, $workflow
- Для доступа к переменным workflow используется выражение {{ $workflow.variables.variableName }}

Давай максимально подробные и точные ответы. Всегда старайся давать именно тот ответ, который решит конкретную задачу пользователя с n8n.`;

  useEffect(() => {
    // Проверяем сохраненный API ключ
    const savedKey = localStorage.getItem('n8n_openai_api_key') || sessionStorage.getItem('n8n_openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    } else {
      setShowApiKeyModal(true);
    }

    // Добавляем приветственное сообщение
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: `Привет! Я специализированный n8n Assistant, эксперт по автоматизации с помощью n8n. Расскажите, какой workflow вы хотите создать или какие вопросы у вас есть по n8n?

Я могу помочь с:
- Настройкой конкретных узлов n8n
- Созданием рабочих процессов для различных задач
- Интеграцией внешних сервисов и API
- Отладкой и оптимизацией workflows
- Примерами кода для Function и FunctionItem узлов`,
      timestamp: new Date().toISOString()
    };

    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add event listeners for copy buttons after messages update
  useEffect(() => {
    const handleCopyCode = (event: Event) => {
      const button = event.target as HTMLButtonElement;
      const codeBlock = button.closest('.code-block');
      if (codeBlock) {
        const codeElement = codeBlock.querySelector('code');
        if (codeElement) {
          const code = codeElement.textContent || '';
          navigator.clipboard.writeText(code).then(() => {
            const originalHTML = button.innerHTML;
            button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>';
            setTimeout(() => {
              button.innerHTML = originalHTML;
            }, 1000);
          }).catch(err => {
            console.error('Не удалось скопировать текст: ', err);
          });
        }
      }
    };

    // Add event listeners to all copy buttons
    const copyButtons = document.querySelectorAll('.code-copy-btn');
    copyButtons.forEach(button => {
      button.addEventListener('click', handleCopyCode);
    });

    // Cleanup event listeners
    return () => {
      copyButtons.forEach(button => {
        button.removeEventListener('click', handleCopyCode);
      });
    };
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleApiKeySave = () => {
    if (!apiKey || !apiKey.startsWith('sk-')) {
      alert('Пожалуйста, введите действительный API ключ OpenAI, начинающийся с "sk-"');
      return;
    }

    if (rememberKey) {
      localStorage.setItem('n8n_openai_api_key', apiKey);
    } else {
      sessionStorage.setItem('n8n_openai_api_key', apiKey);
    }

    setShowApiKeyModal(false);
  };

  const handleTemplateClick = (prompt: string) => {
    setInputValue(prompt);
    textareaRef.current?.focus();
    setSidebarOpen(false); // Закрываем сайдбар на мобильных
  };

  const formatMessage = (content: string) => {
    // Заменяем блоки кода
    content = content.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<div class="code-block" data-language="${lang}">
        <div class="code-header">
          <span class="code-language">${lang}</span>
          <button class="code-copy-btn" type="button">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"></path>
            </svg>
          </button>
        </div>
        <pre><code>${code.trim()}</code></pre>
      </div>`;
    });

    // Заменяем inline код
    content = content.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>');

    // Заменяем заголовки
    content = content.replace(/^### (.*$)/gm, '<h4>$1</h4>');
    content = content.replace(/^## (.*$)/gm, '<h3>$1</h3>');
    content = content.replace(/^# (.*$)/gm, '<h2>$1</h2>');

    // Заменяем жирный текст
    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Заменяем курсив
    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Заменяем ссылки
    content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

    // Заменяем списки
    content = content.replace(/^\s*-\s(.*$)/gm, '<li>$1</li>');
    content = content.replace(/(<li>.*<\/li>)\s*\n\s*(?!<li>)/g, '<ul>$1</ul>');

    // Заменяем нумерованные списки
    content = content.replace(/^\s*\d+\.\s(.*$)/gm, '<li>$1</li>');
    content = content.replace(/(<li>.*<\/li>)\s*\n\s*(?!<li>)/g, '<ol>$1</ol>');

    // Заменяем переносы строк на параграфы
    const paragraphs = content.split(/\n\s*\n/);
    content = paragraphs.map(p => {
      if (!p.startsWith('<h') && !p.startsWith('<ul') && !p.startsWith('<ol') && !p.startsWith('<div class="code-block"')) {
        return `<p>${p.replace(/\n/g, '<br>')}</p>`;
      }
      return p;
    }).join('');

    return content;
  };

  const sendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const currentApiKey = apiKey || localStorage.getItem('n8n_openai_api_key') || sessionStorage.getItem('n8n_openai_api_key');
    if (!currentApiKey) {
      setShowApiKeyModal(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4-1106-preview',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages.filter(m => m.role !== 'system').map(m => ({
              role: m.role,
              content: m.content
            })),
            { role: 'user', content: inputValue }
          ],
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'Произошла ошибка при получении ответа. Пожалуйста, попробуйте еще раз.';
      
      if (error instanceof Error && error.message.includes('API key')) {
        errorMessage = 'Неверный API ключ OpenAI. Пожалуйста, проверьте ваш ключ и попробуйте снова.';
        localStorage.removeItem('n8n_openai_api_key');
        sessionStorage.removeItem('n8n_openai_api_key');
        setTimeout(() => setShowApiKeyModal(true), 1000);
      }

      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <Helmet>
        <title>n8n Assistant | Специализированный AI для автоматизации с n8n | AIMarketHub</title>
        <meta name="description" content="Специализированный AI-ассистент для n8n. Получите точные ответы по созданию workflows, настройке узлов и автоматизации процессов с n8n." />
        <meta name="keywords" content="n8n, n8n assistant, n8n автоматизация, n8n workflow, n8n nodes, n8n интеграция, ChatGPT, prompt engineering, n8n AI" />
        <link rel="canonical" href="https://aimarkethub.pro/n8n-assistant" />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  n8n Assistant
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                  Специализированный AI-ассистент для создания и оптимизации workflow в n8n
                </p>
              </div>
              
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className={`
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
            transform transition-transform duration-300 ease-in-out lg:transform-none
            flex flex-col
          `}>
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Шаблоны</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 hidden lg:block">
                Готовые шаблоны запросов
              </h3>

              {/* Basic Templates */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Основы</h4>
                <div className="space-y-2">
                  {templates.filter(t => t.category === 'basic').map((template, index) => (
                    <button
                      key={index}
                      onClick={() => handleTemplateClick(template.prompt)}
                      className="w-full text-left p-3 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group"
                    >
                      <span className="group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {template.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Integration Templates */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Интеграции</h4>
                <div className="space-y-2">
                  {templates.filter(t => t.category === 'integrations').map((template, index) => (
                    <button
                      key={index}
                      onClick={() => handleTemplateClick(template.prompt)}
                      className="w-full text-left p-3 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group"
                    >
                      <span className="group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {template.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Automation Templates */}
              <div>
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">Автоматизация</h4>
                <div className="space-y-2">
                  {templates.filter(t => t.category === 'automation').map((template, index) => (
                    <button
                      key={index}
                      onClick={() => handleTemplateClick(template.prompt)}
                      className="w-full text-left p-3 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all duration-200 group"
                    >
                      <span className="group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        {template.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* Chat Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Messages Container - Fixed Height */}
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
              style={{ height: 'calc(100vh - 200px)' }}
            >
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <Settings className="h-4 w-4 text-white" />
                    </div>
                  )}
                  
                  <div
                    className={`max-w-[85%] md:max-w-[75%] p-3 md:p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-primary-600 text-white rounded-br-sm'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-bl-sm'
                    }`}
                  >
                    <div
                      className="prose prose-sm max-w-none dark:prose-invert"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0 text-white font-medium text-xs">
                      Вы
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Settings className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg rounded-bl-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area - Fixed at Bottom */}
            <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
              <div className="flex gap-3">
                <textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Опишите задачу автоматизации или задайте вопрос о n8n..."
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg p-3 resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white min-h-[44px] max-h-32"
                  disabled={isLoading}
                  rows={1}
                  style={{ height: 'auto' }}
                  onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 128) + 'px';
                  }}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  className="w-11 h-11 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg flex items-center justify-center transition-colors duration-200 flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Shift+Enter для новой строки
              </p>

              {/* Status */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-600 dark:text-gray-400 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>n8n Assistant на связи</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-8">
            <h2 className="text-xl md:text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Возможности n8n Assistant
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="text-center p-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Layers className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Настройка узлов
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Точные инструкции по настройке
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <GitBranch className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Готовые процессы
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Полные workflow для задач
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Code className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Примеры кода
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  JavaScript для Function узлов
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <HelpCircle className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Отладка
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Решение проблем workflow
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Zap className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Интеграции
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Подключение к сервисам
                </p>
              </div>

              <div className="text-center p-4">
                <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-3 mx-auto">
                  <Check className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  Лучшие практики
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Рекомендации экспертов
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* API Key Modal */}
        {showApiKeyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Введите ваш API ключ OpenAI
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
                Для использования n8n Assistant требуется ваш OpenAI API ключ. 
                Ключ хранится только в вашем браузере и не передается на наш сервер.
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg mb-4 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Ваш API ключ должен начинаться с "sk-". Вы можете получить ключ на{' '}
                <a 
                  href="https://platform.openai.com/api-keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700"
                >
                  сайте OpenAI
                </a>.
              </p>
              <label className="flex items-center gap-2 mb-4">
                <input
                  type="checkbox"
                  checked={rememberKey}
                  onChange={(e) => setRememberKey(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Запомнить мой API ключ на этом устройстве
                </span>
              </label>
              <button
                onClick={handleApiKeySave}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
              >
                Сохранить и продолжить
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .prose .code-block {
          background-color: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 0.5rem;
          position: relative;
          margin: 1rem 0;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.875rem;
          overflow-x: auto;
        }

        .prose .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #374151;
        }

        .prose .code-language {
          font-size: 0.75rem;
          color: #9ca3af;
          text-transform: uppercase;
        }

        .prose .code-copy-btn {
          background-color: rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          border: none;
          border-radius: 0.25rem;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .prose .code-copy-btn:hover {
          background-color: rgba(255, 255, 255, 0.2);
        }

        .prose .inline-code {
          background-color: rgba(0, 0, 0, 0.07);
          padding: 0.125rem 0.25rem;
          border-radius: 3px;
          font-family: 'Fira Code', 'Courier New', monospace;
          font-size: 0.875em;
        }

        .prose h2, .prose h3, .prose h4 {
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
          line-height: 1.25;
        }

        .prose h2 {
          font-size: 1.25rem;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 0.25rem;
        }

        .prose h3 {
          font-size: 1.125rem;
        }

        .prose ul, .prose ol {
          margin: 0.5rem 0 0.5rem 1.5rem;
        }

        .prose ul li, .prose ol li {
          margin-bottom: 0.25rem;
        }

        .prose a {
          color: #7c3aed;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .prose strong {
          font-weight: 600;
        }

        .prose em {
          font-style: italic;
        }
      `}</style>
    </>
  );
};

export default N8nAssistantPage;