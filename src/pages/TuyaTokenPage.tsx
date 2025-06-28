import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Key, 
  Copy, 
  RefreshCw, 
  Shield, 
  Clock, 
  Globe, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Wifi,
  Server,
  Code,
  ExternalLink,
  Info,
  Download
} from 'lucide-react';

interface TokenData {
  access_token: string;
  refresh_token: string;
  expire_time: number;
}

interface ApiResponse {
  success: boolean;
  result?: TokenData;
  msg?: string;
  error?: any;
  postman_info?: any;
}

const TuyaTokenPage: React.FC = () => {
  const [formData, setFormData] = useState({
    clientId: '',
    secret: '',
    dataCenter: 'https://openapi.tuyaeu.com'
  });
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number[]>([0]);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');

  const dataCenters = [
    { value: 'https://openapi.tuyaeu.com', label: 'Центральная Европа (openapi.tuyaeu.com)', region: 'EU' },
    { value: 'https://openapi.tuyaus.com', label: 'Америка (openapi.tuyaus.com)', region: 'US' },
    { value: 'https://openapi.tuyacn.com', label: 'Китай (openapi.tuyacn.com)', region: 'CN' },
    { value: 'https://openapi.tuyain.com', label: 'Индия (openapi.tuyain.com)', region: 'IN' }
  ];

  const faqItems = [
    {
      question: 'Где найти Client ID и Client Secret?',
      answer: 'Для получения Client ID и Client Secret вам нужно зарегистрироваться на платформе Tuya IoT Platform (iot.tuya.com), создать проект и получить учетные данные в разделе Cloud Development > API Key.'
    },
    {
      question: 'Как долго действует токен?',
      answer: 'Access Token обычно действует 2 часа. Refresh Token действует примерно 30 дней и может быть использован для получения нового Access Token без ввода учетных данных.'
    },
    {
      question: 'Безопасны ли мои учетные данные?',
      answer: 'Ваши учетные данные не сохраняются на нашем сервере. Они используются только для запроса токена и проходят через защищенное соединение. Мы рекомендуем создать отдельный API-ключ с ограниченными правами доступа для использования с внешними сервисами.'
    },
    {
      question: 'Что делать, если токен не работает?',
      answer: 'Убедитесь, что вы выбрали правильный регион центра данных, соответствующий вашему аккаунту Tuya. Также проверьте правильность введенных Client ID и Secret. Если проблема сохраняется, попробуйте обновить токен.'
    },
    {
      question: 'Как работает новая серверная интеграция?',
      answer: 'Мы используем Netlify Functions для безопасной обработки запросов к API Tuya. Это решает проблемы с CORS и обеспечивает стабильную работу без необходимости использования внешних прокси-серверов.'
    },
    {
      question: 'Можно ли использовать API через Postman?',
      answer: 'Да! Наши Netlify Functions поддерживают запросы из Postman и других API клиентов. Используйте POST запросы к эндпойнтам /.netlify/functions/tuya-get-token и /.netlify/functions/tuya-refresh-token с JSON телом запроса.'
    },
    {
      question: 'Почему показывает "Проблемы с соединением"?',
      answer: 'Это означает, что Netlify Functions еще не развернуты на сервере. В режиме локальной разработки функции недоступны. После развертывания на Netlify все будет работать корректно.'
    }
  ];

  // Load saved data from localStorage
  useEffect(() => {
    const savedClientId = localStorage.getItem('tuya_client_id');
    const savedSecret = localStorage.getItem('tuya_secret');
    const savedDataCenter = localStorage.getItem('tuya_data_center');

    if (savedClientId || savedSecret || savedDataCenter) {
      setFormData({
        clientId: savedClientId || '',
        secret: savedSecret || '',
        dataCenter: savedDataCenter || 'https://openapi.tuyaeu.com'
      });
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      alert('Не удалось скопировать. Пожалуйста, выделите и скопируйте вручную.');
    }
  };

  const testConnection = async () => {
    setConnectionStatus('testing');
    try {
      // Проверяем, работаем ли мы в режиме разработки
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isDevelopment) {
        // В режиме разработки показываем предупреждение
        setConnectionStatus('failed');
        setError('В режиме локальной разработки Netlify Functions недоступны. После развертывания на Netlify все будет работать корректно.');
        return;
      }

      const response = await fetch('/.netlify/functions/tuya-get-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          clientId: 'test',
          secret: 'test',
          dataCenter: formData.dataCenter
        })
      });

      if (response.status === 400) {
        // Ожидаемая ошибка для тестовых данных означает, что функция работает
        setConnectionStatus('success');
        setError(null);
      } else if (response.status === 404) {
        setConnectionStatus('failed');
        setError('Netlify Functions не найдены. Убедитесь, что проект развернут на Netlify.');
      } else {
        setConnectionStatus('failed');
        setError(`Неожиданный ответ сервера: ${response.status}`);
      }
    } catch (error) {
      setConnectionStatus('failed');
      console.error('Connection test error:', error);
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        setError('Не удалось подключиться к серверу. Проверьте подключение к интернету или убедитесь, что сайт развернут на Netlify.');
      } else {
        setError('Ошибка при тестировании соединения. Попробуйте позже.');
      }
    }
  };

  const getToken = async () => {
    setLoading(true);
    setError(null);
    setTokenData(null);

    try {
      // Проверяем, работаем ли мы в режиме разработки
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isDevelopment) {
        // В режиме разработки показываем предупреждение
        setError('В режиме локальной разработки Netlify Functions недоступны. После развертывания на Netlify все будет работать корректно.');
        return;
      }

      const response = await fetch('/.netlify/functions/tuya-get-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // Read response as text first
      const responseText = await response.text();
      
      let data: ApiResponse;
      
      try {
        // Try to parse as JSON
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', responseText);
        setError(`Сервер вернул некорректный ответ. Статус: ${response.status}. Попробуйте позже или обратитесь в поддержку.`);
        return;
      }

      if (data.success && data.result) {
        setTokenData(data.result);
        // Save to localStorage
        localStorage.setItem('tuya_client_id', formData.clientId);
        localStorage.setItem('tuya_secret', formData.secret);
        localStorage.setItem('tuya_data_center', formData.dataCenter);
        localStorage.setItem('tuya_refresh_token', data.result.refresh_token);
      } else {
        setError(data.msg || 'Не удалось получить токен');
      }
    } catch (err) {
      console.error('Error getting token:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Не удалось подключиться к серверу. Убедитесь, что сайт развернут на Netlify и функции доступны.');
      } else {
        setError('Произошла ошибка при запросе. Проверьте подключение к интернету и попробуйте снова.');
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    const savedRefreshToken = localStorage.getItem('tuya_refresh_token');
    if (!savedRefreshToken) {
      setError('Refresh token не найден. Пожалуйста, получите новый токен.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Проверяем, работаем ли мы в режиме разработки
      const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
      if (isDevelopment) {
        // В режиме разработки показываем предупреждение
        setError('В режиме локальной разработки Netlify Functions недоступны. После развертывания на Netlify все будет работать корректно.');
        return;
      }

      const response = await fetch('/.netlify/functions/tuya-refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          refreshToken: savedRefreshToken
        })
      });

      // Read response as text first
      const responseText = await response.text();
      
      let data: ApiResponse;
      
      try {
        // Try to parse as JSON
        data = JSON.parse(responseText);
      } catch (jsonError) {
        console.error('Failed to parse JSON response:', responseText);
        setError(`Сервер вернул некорректный ответ при обновлении токена. Статус: ${response.status}. Попробуйте позже.`);
        return;
      }

      if (data.success && data.result) {
        setTokenData(data.result);
        localStorage.setItem('tuya_refresh_token', data.result.refresh_token);
      } else {
        setError(data.msg || 'Не удалось обновить токен');
      }
    } catch (err) {
      console.error('Error refreshing token:', err);
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Не удалось подключиться к серверу при обновлении токена. Убедитесь, что сайт развернут на Netlify.');
      } else {
        setError('Произошла ошибка при обновлении токена.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    getToken();
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const formatExpireTime = (expireSeconds: number) => {
    const expireDate = new Date(Date.now() + expireSeconds * 1000);
    const hours = Math.floor(expireSeconds / 3600);
    const minutes = Math.floor((expireSeconds % 3600) / 60);
    return `${hours}ч ${minutes}м (до ${expireDate.toLocaleString()})`;
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Wifi className="h-4 w-4 text-gray-400" />;
    }
  };

  const currentDomain = typeof window !== 'undefined' ? window.location.origin : 'https://aimarkethub.pro';
  const isDevelopment = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

  // Postman collection for direct API access
  const postmanCollection = {
    info: {
      name: "Tuya Token Generator API",
      description: "Прямой доступ к API генератора токенов Tuya через aimarkethub.pro",
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    variable: [
      {
        key: "base_url",
        value: currentDomain,
        type: "string"
      },
      {
        key: "client_id",
        value: "Введите ваш client_id сюда",
        type: "string"
      },
      {
        key: "client_secret",
        value: "Введите ваш client_secret сюда",
        type: "string"
      },
      {
        key: "data_center",
        value: "https://openapi.tuyaeu.com",
        type: "string"
      }
    ],
    item: [
      {
        name: "Get Token via aimarkethub.pro",
        request: {
          method: "POST",
          header: [
            {
              key: "Content-Type",
              value: "application/json"
            }
          ],
          body: {
            mode: "raw",
            raw: JSON.stringify({
              clientId: "{{client_id}}",
              secret: "{{client_secret}}",
              dataCenter: "{{data_center}}"
            }, null, 2)
          },
          url: {
            raw: "{{base_url}}/.netlify/functions/tuya-get-token",
            host: ["{{base_url}}"],
            path: [".netlify", "functions", "tuya-get-token"]
          },
          description: "Получение токенов доступа к API Tuya через aimarkethub.pro"
        },
        event: [
          {
            listen: "test",
            script: {
              exec: [
                "// Автоматическое сохранение токенов из ответа",
                "var jsonData = pm.response.json();",
                "",
                "if (jsonData && jsonData.success && jsonData.result) {",
                "    // Сохраняем access_token",
                "    if (jsonData.result.access_token) {",
                "        pm.collectionVariables.set('access_token', jsonData.result.access_token);",
                "        console.log('✅ Сохранен access_token:', jsonData.result.access_token.substring(0, 10) + '...');",
                "    }",
                "    ",
                "    // Сохраняем refresh_token",
                "    if (jsonData.result.refresh_token) {",
                "        pm.collectionVariables.set('refresh_token', jsonData.result.refresh_token);",
                "        console.log('✅ Сохранен refresh_token:', jsonData.result.refresh_token.substring(0, 10) + '...');",
                "    }",
                "    ",
                "    // Вывод информации о сроке действия",
                "    if (jsonData.result.expire_time) {",
                "        const expireTime = jsonData.result.expire_time;",
                "        const expireDate = new Date();",
                "        expireDate.setSeconds(expireDate.getSeconds() + expireTime);",
                "        console.log(`✅ Токен действителен ${expireTime} секунд (до ${expireDate.toLocaleString()})`);",
                "    }",
                "} else if (jsonData && !jsonData.success) {",
                "    console.error('❌ Ошибка получения токена:', jsonData.msg);",
                "}"
              ]
            }
          }
        ]
      },
      {
        name: "Refresh Token via aimarkethub.pro",
        request: {
          method: "POST",
          header: [
            {
              key: "Content-Type",
              value: "application/json"
            }
          ],
          body: {
            mode: "raw",
            raw: JSON.stringify({
              clientId: "{{client_id}}",
              secret: "{{client_secret}}",
              dataCenter: "{{data_center}}",
              refreshToken: "{{refresh_token}}"
            }, null, 2)
          },
          url: {
            raw: "{{base_url}}/.netlify/functions/tuya-refresh-token",
            host: ["{{base_url}}"],
            path: [".netlify", "functions", "tuya-refresh-token"]
          },
          description: "Обновление истекающего токена через aimarkethub.pro"
        },
        event: [
          {
            listen: "test",
            script: {
              exec: [
                "// Автоматическое сохранение обновленных токенов",
                "var jsonData = pm.response.json();",
                "",
                "if (jsonData && jsonData.success && jsonData.result) {",
                "    // Сохраняем новый access_token",
                "    if (jsonData.result.access_token) {",
                "        pm.collectionVariables.set('access_token', jsonData.result.access_token);",
                "        console.log('✅ Обновлен access_token:', jsonData.result.access_token.substring(0, 10) + '...');",
                "    }",
                "    ",
                "    // Сохраняем новый refresh_token",
                "    if (jsonData.result.refresh_token) {",
                "        pm.collectionVariables.set('refresh_token', jsonData.result.refresh_token);",
                "        console.log('✅ Обновлен refresh_token:', jsonData.result.refresh_token.substring(0, 10) + '...');",
                "    }",
                "} else if (jsonData && !jsonData.success) {",
                "    console.error('❌ Ошибка обновления токена:', jsonData.msg);",
                "}"
              ]
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <Helmet>
        <title>Получение токенов Tuya API для умного дома | aimarkethub.pro</title>
        <meta name="description" content="Генератор токенов для API Tuya - получите токен для управления вашими устройствами умного дома через API Tuya." />
        <meta name="keywords" content="tuya api token, умный дом api, tuya токен, iot api, генератор токенов" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full mr-4">
              <Key className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              Генератор токенов Tuya API
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Получите токен для управления вашими устройствами умного дома через API Tuya
          </p>
        </div>

        {/* Development Mode Warning */}
        {isDevelopment && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl mb-8 border border-yellow-200 dark:border-yellow-800">
            <div className="flex items-start">
              <Info className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Режим разработки</h3>
                <p className="text-yellow-800 dark:text-yellow-200 mb-2">
                  Вы находитесь в режиме локальной разработки. Netlify Functions недоступны в этом режиме.
                </p>
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  Для полного тестирования функциональности разверните проект на Netlify или используйте Netlify CLI для локальной разработки.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Postman Integration Info */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-6 rounded-xl mb-8 border border-purple-200 dark:border-purple-800">
          <div className="flex items-start">
            <Code className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center">
                Поддержка Postman и API клиентов
                <ExternalLink className="h-4 w-4 ml-2" />
              </h3>
              <p className="text-purple-800 dark:text-purple-200 mb-3">
                Теперь вы можете использовать наши эндпойнты напрямую из Postman или других API клиентов!
              </p>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-200 dark:border-purple-700">
                <h4 className="font-medium mb-2">Эндпойнты для API:</h4>
                <div className="space-y-2 text-sm font-mono">
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">POST</span>
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{currentDomain}/.netlify/functions/tuya-get-token</code>
                    <button
                      onClick={() => copyToClipboard(`${currentDomain}/.netlify/functions/tuya-get-token`, 'endpoint1')}
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
                    >
                      {copiedField === 'endpoint1' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">POST</span>
                    <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{currentDomain}/.netlify/functions/tuya-refresh-token</code>
                    <button
                      onClick={() => copyToClipboard(`${currentDomain}/.netlify/functions/tuya-refresh-token`, 'endpoint2')}
                      className="text-purple-600 hover:text-purple-700 dark:text-purple-400"
                    >
                      {copiedField === 'endpoint2' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">Пример JSON для получения токена:</p>
                  <pre className="text-xs bg-gray-800 text-green-400 p-2 rounded overflow-x-auto">
{`{
  "clientId": "your_client_id",
  "secret": "your_client_secret", 
  "dataCenter": "https://openapi.tuyaeu.com"
}`}
                  </pre>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => copyToClipboard(JSON.stringify(postmanCollection, null, 2), 'postman-collection')}
                    className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200"
                  >
                    {copiedField === 'postman-collection' ? (
                      <>
                        <CheckCircle className="h-4 w-4" />
                        Скопировано!
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        Копировать коллекцию Postman
                      </>
                    )}
                  </button>
                  <a 
                    href="/tuya-instructions"
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors duration-200"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Инструкция Postman
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Server Status */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-6 rounded-xl mb-8 border border-green-200 dark:border-green-800">
          <div className="flex items-start">
            <Server className="h-6 w-6 text-green-600 dark:text-green-400 mr-3 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-green-900 dark:text-green-100 mb-2">Серверная интеграция</h3>
              <p className="text-green-800 dark:text-green-200 mb-3">
                Мы используем Netlify Functions для безопасной обработки запросов к API Tuya. 
                Это решает проблемы с CORS и обеспечивает стабильную работу.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={testConnection}
                  disabled={connectionStatus === 'testing'}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                >
                  {getConnectionStatusIcon()}
                  {connectionStatus === 'testing' ? 'Тестирование...' : 'Тест соединения'}
                </button>
                {connectionStatus === 'success' && (
                  <span className="text-green-700 dark:text-green-300 text-sm">✓ Сервер доступен</span>
                )}
                {connectionStatus === 'failed' && (
                  <span className="text-red-700 dark:text-red-300 text-sm">✗ Проблемы с соединением</span>
                )}
              </div>
              {isDevelopment && (
                <div className="mt-2 text-sm text-green-700 dark:text-green-300">
                  💡 В режиме разработки функции недоступны. После развертывания на Netlify все будет работать.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Block */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl mb-8 border border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <HelpCircle className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Как это работает</h3>
              <p className="text-blue-800 dark:text-blue-200 mb-2">
                Этот инструмент помогает получить токены для работы с API Tuya. Вам нужно ввести ваш Client ID и Secret из аккаунта разработчика Tuya.
              </p>
              <p className="text-blue-800 dark:text-blue-200 mb-2">
                Токены используются для взаимодействия с вашими устройствами умного дома через API Tuya.
              </p>
              <div className="border-t border-blue-200 dark:border-blue-700 pt-2 mt-3">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Ваши учетные данные не сохраняются на нашем сервере, они обрабатываются только для получения токена.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-primary-600 text-white p-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Key className="h-5 w-5 mr-2" />
              Введите данные для получения токена
            </h2>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client ID (Access ID)
                </label>
                <input
                  type="text"
                  id="clientId"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Введите ваш Client ID"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Введите ваш Client ID из аккаунта разработчика Tuya
                </p>
              </div>

              <div>
                <label htmlFor="secret" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Client Secret (Access Secret)
                </label>
                <input
                  type="password"
                  id="secret"
                  name="secret"
                  value={formData.secret}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Введите ваш Client Secret"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Введите ваш Client Secret из аккаунта разработчика Tuya
                </p>
              </div>

              <div>
                <label htmlFor="dataCenter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Центр обработки данных
                </label>
                <select
                  id="dataCenter"
                  name="dataCenter"
                  value={formData.dataCenter}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                >
                  {dataCenters.map(center => (
                    <option key={center.value} value={center.value}>
                      {center.label}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                  <Globe className="h-4 w-4 mr-1" />
                  Выберите ближайший к вам регион
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Получение токена...
                  </>
                ) : (
                  <>
                    <Key className="h-5 w-5 mr-2" />
                    Получить токен
                  </>
                )}
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Token Results */}
            {tokenData && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center text-green-600 dark:text-green-400 mb-4">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <h3 className="text-lg font-semibold">Токен успешно получен!</h3>
                </div>

                {/* Access Token */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Access Token:
                  </label>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded border font-mono text-sm break-all max-h-24 overflow-y-auto">
                    {tokenData.access_token}
                  </div>
                  <button
                    onClick={() => copyToClipboard(tokenData.access_token, 'access')}
                    className="mt-2 inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors duration-200"
                  >
                    {copiedField === 'access' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Скопировано!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Копировать
                      </>
                    )}
                  </button>
                </div>

                {/* Refresh Token */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Refresh Token:
                  </label>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded border font-mono text-sm break-all max-h-24 overflow-y-auto">
                    {tokenData.refresh_token}
                  </div>
                  <button
                    onClick={() => copyToClipboard(tokenData.refresh_token, 'refresh')}
                    className="mt-2 inline-flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors duration-200"
                  >
                    {copiedField === 'refresh' ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Скопировано!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Копировать
                      </>
                    )}
                  </button>
                </div>

                {/* Expire Time */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Срок действия:
                  </label>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                    {formatExpireTime(tokenData.expire_time)}
                  </div>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={refreshToken}
                  disabled={loading}
                  className="w-full bg-secondary-600 hover:bg-secondary-700 disabled:bg-secondary-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Обновление токена...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-5 w-5 mr-2" />
                      Обновить токен
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Documentation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-xl font-semibold">Инструкция по использованию</h2>
          </div>
          
          <div className="p-6">
            <ol className="list-decimal list-inside space-y-3 text-gray-700 dark:text-gray-300">
              <li>Введите свой <strong>Client ID</strong> и <strong>Client Secret</strong> от приложения Tuya IoT</li>
              <li>Выберите регион API, соответствующий вашему проекту Tuya</li>
              <li>Нажмите кнопку "Получить токен"</li>
              <li>После успешной генерации скопируйте полученные токены для использования в ваших запросах к API</li>
              <li>Когда токен истечет, вы можете использовать кнопку "Обновить токен"</li>
            </ol>
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Примечание:</strong> Access Token действителен в течение 2 часов. После этого используйте Refresh Token для получения нового.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-700 p-6 border-b border-gray-200 dark:border-gray-600">
            <h2 className="text-xl font-semibold">Часто задаваемые вопросы</h2>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {item.question}
                    </span>
                    {openFaq.includes(index) ? (
                      <ChevronUp className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    )}
                  </button>
                  
                  {openFaq.includes(index) && (
                    <div className="px-4 pb-4">
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TuyaTokenPage;