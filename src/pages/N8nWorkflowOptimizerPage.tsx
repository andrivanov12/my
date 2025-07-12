import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  Copy, 
  RotateCcw, 
  Lightbulb,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MessageSquare,
  Code,
  Zap,
  Bug
} from 'lucide-react';
import SEOTags from '../components/SEOTags';
import StructuredData from '../components/StructuredData';
import AdaptiveAdBlock from '../components/AdaptiveAdBlock';
import { generateFAQSchema } from '../utils/seoHelpers';

interface WorkflowIssue {
  type: 'error' | 'warning' | 'optimization';
  severity: 'high' | 'medium' | 'low';
  message: string;
  suggestion: string;
  nodeId?: string;
}

const N8nWorkflowOptimizerPage: React.FC = () => {
  const [workflowData, setWorkflowData] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<WorkflowIssue[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<'analyzer' | 'tips' | 'faq'>('analyzer');
  const [openFaqItems, setOpenFaqItems] = useState<number[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);

  const tips = [
    {
      title: 'Используйте правильные типы данных',
      description: 'Убедитесь, что данные передаются в правильном формате между узлами.',
      example: 'Используйте Set node для преобразования строк в числа перед математическими операциями.'
    },
    {
      title: 'Добавляйте обработку ошибок',
      description: 'Всегда предусматривайте обработку ошибок для критически важных операций.',
      example: 'Используйте Error Trigger или IF node для проверки успешности выполнения операций.'
    },
    {
      title: 'Оптимизируйте количество запросов',
      description: 'Группируйте операции для уменьшения количества API вызовов.',
      example: 'Используйте Merge node для объединения данных вместо множественных HTTP запросов.'
    },
    {
      title: 'Используйте переменные окружения',
      description: 'Храните чувствительные данные в переменных окружения, а не в самом workflow.',
      example: 'API ключи, пароли и токены должны быть в Environment Variables.'
    },
    {
      title: 'Добавляйте логирование',
      description: 'Используйте узлы для логирования важных этапов выполнения workflow.',
      example: 'Добавьте HTTP Request узлы для отправки логов в внешние системы мониторинга.'
    },
    {
      title: 'Тестируйте с разными данными',
      description: 'Проверяйте workflow с различными наборами входных данных.',
      example: 'Используйте Manual Trigger с разными JSON объектами для тестирования.'
    }
  ];

  const faqItems = [
    {
      question: 'Что такое n8n Workflow Debugger & Optimizer?',
      answer: 'Это инструмент для анализа и оптимизации рабочих процессов n8n. Он помогает выявить потенциальные проблемы, ошибки конфигурации и предлагает улучшения для повышения производительности и надежности ваших автоматизаций.'
    },
    {
      question: 'Как использовать анализатор workflow?',
      answer: 'Скопируйте JSON код вашего workflow из n8n (через экспорт) и вставьте его в поле анализатора. Инструмент проанализирует структуру, соединения между узлами, конфигурацию и выдаст рекомендации по улучшению.'
    },
    {
      question: 'Какие типы проблем может выявить анализатор?',
      answer: 'Анализатор выявляет ошибки конфигурации, проблемы с типами данных, отсутствующие обработчики ошибок, неоптимальные соединения между узлами, проблемы безопасности (хранение секретов в открытом виде), и возможности для оптимизации производительности.'
    },
    {
      question: 'Безопасно ли загружать мой workflow для анализа?',
      answer: 'Анализ происходит полностью в вашем браузере, данные не отправляются на сервер. Однако рекомендуется удалить или заменить реальные API ключи, пароли и другие чувствительные данные перед анализом.'
    },
    {
      question: 'Можно ли использовать этот инструмент для коммерческих проектов?',
      answer: 'Да, инструмент можно использовать для анализа и оптимизации коммерческих n8n workflow. Рекомендации помогут улучшить надежность и производительность ваших бизнес-процессов.'
    },
    {
      question: 'Как часто нужно анализировать workflow?',
      answer: 'Рекомендуется анализировать workflow после каждого значительного изменения, перед развертыванием в продакшн, и периодически (например, раз в месяц) для выявления возможностей оптимизации.'
    }
  ];

  const analyzeWorkflow = (workflowJson: string): WorkflowIssue[] => {
    const issues: WorkflowIssue[] = [];
    
    try {
      const workflow = JSON.parse(workflowJson);
      
      // Проверяем наличие основных полей
      if (!workflow.nodes || !Array.isArray(workflow.nodes)) {
        issues.push({
          type: 'error',
          severity: 'high',
          message: 'Отсутствует массив узлов (nodes)',
          suggestion: 'Убедитесь, что экспортированный workflow содержит корректную структуру с узлами.'
        });
        return issues;
      }

      if (!workflow.connections) {
        issues.push({
          type: 'warning',
          severity: 'medium',
          message: 'Отсутствуют соединения между узлами',
          suggestion: 'Проверьте, что узлы правильно соединены между собой.'
        });
      }

      // Анализируем узлы
      workflow.nodes.forEach((node: any, index: number) => {
        // Проверяем обязательные поля узла
        if (!node.type) {
          issues.push({
            type: 'error',
            severity: 'high',
            message: `Узел ${index + 1}: отсутствует тип узла`,
            suggestion: 'Каждый узел должен иметь указанный тип.',
            nodeId: node.id || `node-${index}`
          });
        }

        // Проверяем наличие credentials в открытом виде
        if (node.credentials) {
          Object.keys(node.credentials).forEach(credKey => {
            if (typeof node.credentials[credKey] === 'string' && 
                (node.credentials[credKey].includes('password') || 
                 node.credentials[credKey].includes('token') ||
                 node.credentials[credKey].includes('key'))) {
              issues.push({
                type: 'warning',
                severity: 'high',
                message: `Узел "${node.name || node.type}": возможно содержит чувствительные данные`,
                suggestion: 'Используйте переменные окружения для хранения паролей, токенов и API ключей.',
                nodeId: node.id
              });
            }
          });
        }

        // Проверяем HTTP узлы
        if (node.type === 'n8n-nodes-base.httpRequest') {
          if (!node.parameters?.url) {
            issues.push({
              type: 'error',
              severity: 'medium',
              message: `HTTP узел "${node.name || 'HTTP Request'}": не указан URL`,
              suggestion: 'Укажите URL для HTTP запроса.',
              nodeId: node.id
            });
          }

          if (node.parameters?.authentication === 'genericCredentialType' && !node.credentials) {
            issues.push({
              type: 'warning',
              severity: 'medium',
              message: `HTTP узел "${node.name || 'HTTP Request'}": настроена аутентификация, но не указаны credentials`,
              suggestion: 'Добавьте соответствующие credentials для аутентификации.',
              nodeId: node.id
            });
          }
        }

        // Проверяем IF узлы
        if (node.type === 'n8n-nodes-base.if') {
          if (!node.parameters?.conditions?.values || node.parameters.conditions.values.length === 0) {
            issues.push({
              type: 'warning',
              severity: 'medium',
              message: `IF узел "${node.name || 'IF'}": не настроены условия`,
              suggestion: 'Настройте условия для корректной работы логики ветвления.',
              nodeId: node.id
            });
          }
        }

        // Проверяем Set узлы
        if (node.type === 'n8n-nodes-base.set') {
          if (!node.parameters?.values?.values || node.parameters.values.values.length === 0) {
            issues.push({
              type: 'optimization',
              severity: 'low',
              message: `Set узел "${node.name || 'Set'}": не настроены значения`,
              suggestion: 'Убедитесь, что Set узел настроен для установки нужных значений.',
              nodeId: node.id
            });
          }
        }
      });

      // Проверяем соединения
      if (workflow.connections) {
        const nodeIds = workflow.nodes.map((node: any) => node.id);
        
        Object.keys(workflow.connections).forEach(sourceNodeId => {
          if (!nodeIds.includes(sourceNodeId)) {
            issues.push({
              type: 'error',
              severity: 'medium',
              message: `Соединение ссылается на несуществующий узел: ${sourceNodeId}`,
              suggestion: 'Удалите неверные соединения или добавьте отсутствующие узлы.'
            });
          }
        });
      }

      // Проверяем наличие Error Trigger
      const hasErrorTrigger = workflow.nodes.some((node: any) => node.type === 'n8n-nodes-base.errorTrigger');
      if (!hasErrorTrigger && workflow.nodes.length > 3) {
        issues.push({
          type: 'optimization',
          severity: 'medium',
          message: 'Отсутствует обработка ошибок',
          suggestion: 'Добавьте Error Trigger узел для обработки ошибок в workflow.'
        });
      }

      // Проверяем наличие Manual Trigger для тестирования
      const hasManualTrigger = workflow.nodes.some((node: any) => node.type === 'n8n-nodes-base.manualTrigger');
      if (!hasManualTrigger) {
        issues.push({
          type: 'optimization',
          severity: 'low',
          message: 'Отсутствует Manual Trigger',
          suggestion: 'Добавьте Manual Trigger для удобного тестирования workflow.'
        });
      }

      // Если проблем не найдено
      if (issues.length === 0) {
        issues.push({
          type: 'optimization',
          severity: 'low',
          message: 'Workflow выглядит хорошо настроенным!',
          suggestion: 'Основные проблемы не обнаружены. Рекомендуется протестировать workflow с различными входными данными.'
        });
      }

    } catch (error) {
      issues.push({
        type: 'error',
        severity: 'high',
        message: 'Ошибка парсинга JSON',
        suggestion: 'Убедитесь, что вставленный код является корректным JSON из экспорта n8n workflow.'
      });
    }

    return issues;
  };

  const handleAnalyze = () => {
    if (!workflowData.trim()) {
      alert('Пожалуйста, вставьте JSON код вашего n8n workflow.');
      return;
    }

    setIsAnalyzing(true);
    setShowResult(false);

    setTimeout(() => {
      const issues = analyzeWorkflow(workflowData);
      setAnalysisResult(issues);
      setIsAnalyzing(false);
      setShowResult(true);
    }, 2000);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Не удалось скопировать текст. Пожалуйста, выделите текст и скопируйте его вручную.');
    }
  };

  const handleClear = () => {
    setWorkflowData('');
    setShowResult(false);
    setAnalysisResult([]);
  };

  const toggleFaqItem = (index: number) => {
    setOpenFaqItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100 dark:bg-red-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'warning': return <HelpCircle className="h-5 w-5 text-yellow-500" />;
      case 'optimization': return <TrendingUp className="h-5 w-5 text-blue-500" />;
      default: return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  // FAQ для структурированных данных
  const faqSchemaItems = faqItems.map(item => ({
    question: item.question,
    answer: item.answer
  }));

  // Структурированные данные для FAQ
  const faqSchema = generateFAQSchema(faqSchemaItems);

  return (
    <>
      <SEOTags
        title="Автоматизация маркетинговых процессов с n8n | Оптимизация workflow для маркетинга"
        description="Создавайте и оптимизируйте маркетинговые workflow с n8n. Автоматизируйте сбор лидов, email-маркетинг, аналитику, персонализацию и интеграцию с CRM для повышения эффективности маркетинга."
        keywords="автоматизация маркетинга с n8n, маркетинговые workflow, оптимизация маркетинговых процессов, автоматизация сбора лидов, автоматизация email-маркетинга, интеграция маркетинговых инструментов, n8n для маркетологов, маркетинговая аналитика с n8n, автоматизация социальных сетей, n8n интеграции с CRM"
        canonicalUrl="https://aimarkethub.pro/n8n-workflow-optimizer"
        imageUrl="https://aimarkethub.pro/images/n8n-workflow-optimizer.jpg"
        structuredData={[faqSchema]}
      >
        <meta name="application-name" content="n8n Workflow Optimizer" />
        <meta name="apple-mobile-web-app-title" content="n8n Workflow Optimizer" />
      </SEOTags>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
        {/* Рекламный баннер R-A-16048264-7 размером 1000x120 над заголовком */}
        <AdaptiveAdBlock 
          blockId="R-A-16048264-7" 
          containerId="yandex_rtb_R-A-16048264-7_n8n_optimizer" 
          position="n8n-optimizer-top"
          className="mb-8 md:mb-12"
        />

        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            Автоматизация маркетинговых процессов с n8n
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto mb-8">
            Создавайте эффективные маркетинговые workflow с n8n. Автоматизируйте сбор и нуртуринг лидов, 
            email-маркетинг, аналитику, персонализацию коммуникаций и интеграцию с CRM для повышения 
            эффективности вашего маркетинга.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <Bug className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium">Поиск ошибок</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium">Оптимизация</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium">Проверка качества</span>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-sm">
              <Zap className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium">Повышение производительности</span>
            </div>
          </div>
        </section>

        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`px-6 py-4 font-semibold transition-colors duration-200 ${
                activeTab === 'analyzer'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
              }`}
            >
              Анализатор Workflow
            </button>
            <button
              onClick={() => setActiveTab('tips')}
              className={`px-6 py-4 font-semibold transition-colors duration-200 ${
                activeTab === 'tips'
                  ? 'text-primary-600 border-b-2 border-primary-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600'
              }`}
            >
              Советы по оптимизации
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
            {/* Analyzer Tab */}
            {activeTab === 'analyzer' && (
              <div className="space-y-6">
                {/* Workflow Input */}
                <div>
                  <label htmlFor="workflow-data" className="block font-semibold mb-2">
                    JSON код вашего n8n workflow
                  </label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    Экспортируйте ваш workflow из n8n (Settings → Export) и вставьте JSON код ниже для анализа.
                  </p>
                  <textarea
                    id="workflow-data"
                    value={workflowData}
                    onChange={(e) => setWorkflowData(e.target.value)}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none font-mono text-sm"
                    rows={12}
                    placeholder={`{
  "name": "My Workflow",
  "nodes": [
    {
      "id": "node-1",
      "type": "n8n-nodes-base.manualTrigger",
      "name": "Manual Trigger",
      "parameters": {},
      "position": [250, 300]
    }
  ],
  "connections": {},
  "active": true,
  "settings": {}
}`}
                  />
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
                    onClick={handleAnalyze}
                    disabled={isAnalyzing || !workflowData.trim()}
                    className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                        Анализируем workflow...
                      </>
                    ) : (
                      <>
                        <Settings className="h-5 w-5" />
                        Анализировать workflow
                      </>
                    )}
                  </button>
                </div>

                {/* Results */}
                {showResult && (
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Результаты анализа</h3>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Найдено проблем: {analysisResult.length}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      {analysisResult.map((issue, index) => (
                        <div key={index} className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start gap-3">
                            {getTypeIcon(issue.type)}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">{issue.message}</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                                  {issue.severity === 'high' ? 'Высокий' : 
                                   issue.severity === 'medium' ? 'Средний' : 'Низкий'}
                                </span>
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                                {issue.suggestion}
                              </p>
                              {issue.nodeId && (
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Узел: {issue.nodeId}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Анализ завершен. Исправьте найденные проблемы для улучшения workflow.
                      </p>
                      <button
                        onClick={handleAnalyze}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Повторить анализ
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tips Tab */}
            {activeTab === 'tips' && (
              <div>
                <h3 className="text-xl font-semibold mb-6">Советы по оптимизации n8n workflow</h3>
                <div className="grid gap-6">
                  {tips.map((tip, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="h-6 w-6 text-yellow-500 mt-1 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold mb-2">{tip.title}</h4>
                          <p className="text-gray-600 dark:text-gray-300 mb-3">{tip.description}</p>
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-700 dark:text-gray-300">{tip.example}</p>
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
          <h2 className="text-2xl font-bold mb-4">Нужна помощь с n8n автоматизацией?</h2>
          <p className="text-lg mb-6 opacity-90">
            Используйте AI для создания и оптимизации ваших workflow
          </p>
          <Link 
            to="/chat"
            className="inline-flex items-center gap-2 bg-white text-primary-600 font-medium py-3 px-6 rounded-lg transition-colors duration-200 hover:bg-gray-50"
          >
            <MessageSquare className="h-5 w-5" />
            Получить помощь от AI
          </Link>
        </section>

        {/* Рекламный баннер R-A-16048264-8 размером 1000x120 под кнопкой "Получить помощь от AI" */}
        <AdaptiveAdBlock 
          blockId="R-A-16048264-8" 
          containerId="yandex_rtb_R-A-16048264-8_n8n_optimizer_bottom" 
          position="n8n-optimizer-bottom"
          className="mt-8 md:mt-12"
        />
      </div>
    </>
  );
};

export default N8nWorkflowOptimizerPage;