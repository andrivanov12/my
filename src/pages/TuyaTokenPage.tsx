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
  HelpCircle
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
}

// Добавляем CryptoJS типы
declare global {
  interface Window {
    CryptoJS: any;
  }
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
  const [cryptoJSLoaded, setCryptoJSLoaded] = useState(false);

  const dataCenters = [
    { value: 'https://openapi.tuyaeu.com', label: 'Центральная Европа (openapi.tuyaeu.com)' },
    { value: 'https://openapi.tuyaus.com', label: 'Америка (openapi.tuyaus.com)' },
    { value: 'https://openapi.tuyacn.com', label: 'Китай (openapi.tuyacn.com)' },
    { value: 'https://openapi.tuyain.com', label: 'Индия (openapi.tuyain.com)' }
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
      question: 'Почему возникают ошибки CORS?',
      answer: 'API Tuya имеет ограничения CORS для прямых запросов из браузера. Для решения этой проблемы используйте прокси-сервер или серверную интеграцию. В данной реализации мы используем публичный CORS прокси.'
    }
  ];

  // Load CryptoJS library
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js';
    script.integrity = 'sha512-E8QSvWZ0eCLGk4km3hxSsNmGWbLtSCSUcewDQPQWZF6pEU8GlT8a5fF32wOl1i8ftdMhssTrF/OhyGWwonTcXA==';
    script.crossOrigin = 'anonymous';
    script.onload = () => setCryptoJSLoaded(true);
    script.onerror = () => setError('Не удалось загрузить библиотеку шифрования');
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

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

  const generateSignature = (clientId: string, secret: string, timestamp: string, path: string) => {
    if (!window.CryptoJS) {
      throw new Error('CryptoJS library not loaded');
    }
    
    const signString = `${clientId}${timestamp}GET\n\n\n${path}`;
    return window.CryptoJS.HmacSHA256(signString, secret).toString().toUpperCase();
  };

  const makeProxyRequest = async (url: string, headers: Record<string, string>) => {
    // Используем публичный CORS прокси
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    
    try {
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...headers
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      // Fallback to another CORS proxy
      const fallbackProxyUrl = `https://cors-anywhere.herokuapp.com/${url}`;
      const fallbackResponse = await fetch(fallbackProxyUrl, {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...headers
        }
      });
      
      if (!fallbackResponse.ok) {
        throw new Error(`HTTP error! status: ${fallbackResponse.status}`);
      }
      
      return await fallbackResponse.json();
    }
  };

  const getToken = async () => {
    if (!cryptoJSLoaded) {
      setError('Библиотека шифрования еще не загружена. Попробуйте еще раз.');
      return;
    }

    setLoading(true);
    setError(null);
    setTokenData(null);

    try {
      const timestamp = Date.now().toString();
      const path = '/v1.0/token?grant_type=1';
      const signature = generateSignature(formData.clientId, formData.secret, timestamp, path);
      
      const headers = {
        'client_id': formData.clientId,
        'sign': signature,
        't': timestamp,
        'sign_method': 'HMAC-SHA256'
      };

      const url = `${formData.dataCenter}${path}`;
      const data = await makeProxyRequest(url, headers);

      if (data.success) {
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
      setError('Произошла ошибка при запросе. Проверьте подключение к интернету и попробуйте снова. Возможно, потребуется использовать VPN для обхода CORS ограничений.');
    } finally {
      setLoading(false);
    }
  };

  const refreshToken = async () => {
    if (!cryptoJSLoaded) {
      setError('Библиотека шифрования еще не загружена. Попробуйте еще раз.');
      return;
    }

    const savedRefreshToken = localStorage.getItem('tuya_refresh_token');
    if (!savedRefreshToken) {
      setError('Refresh token не найден. Пожалуйста, получите новый токен.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const timestamp = Date.now().toString();
      const path = `/v1.0/token/${savedRefreshToken}`;
      const signature = generateSignature(formData.clientId, formData.secret, timestamp, path);
      
      const headers = {
        'client_id': formData.clientId,
        'sign': signature,
        't': timestamp,
        'sign_method': 'HMAC-SHA256'
      };

      const url = `${formData.dataCenter}${path}`;
      const data = await makeProxyRequest(url, headers);

      if (data.success) {
        setTokenData(data.result);
        localStorage.setItem('tuya_refresh_token', data.result.refresh_token);
      } else {
        setError(data.msg || 'Не удалось обновить токен');
      }
    } catch (err) {
      console.error('Error refreshing token:', err);
      setError('Произошла ошибка при обновлении токена.');
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

        {/* CORS Warning */}
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-6 rounded-xl mb-8 border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Важная информация о CORS</h3>
              <p className="text-yellow-800 dark:text-yellow-200 mb-2">
                API Tuya имеет ограничения CORS для прямых запросов из браузера. Мы используем публичный прокси-сервер для обхода этих ограничений.
              </p>
              <p className="text-yellow-800 dark:text-yellow-200">
                Если возникают ошибки, попробуйте использовать VPN или обратитесь к администратору для настройки серверного прокси.
              </p>
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
                disabled={loading || !cryptoJSLoaded}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Получение токена...
                  </>
                ) : !cryptoJSLoaded ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Загрузка библиотеки...
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