const crypto = require('crypto');

exports.handler = async (event, context) => {
  // Настройка CORS заголовков
  const headers = {
    'Access-Control-Allow-Origin': 'https://aimarkethub.pro',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Обработка preflight запросов
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // Проверка метода запроса
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        success: false,
        msg: 'Method not allowed. Use POST.'
      })
    };
  }

  try {
    // Парсинг данных запроса
    const { clientId, secret, refreshToken, dataCenter } = JSON.parse(event.body);

    // Валидация обязательных параметров
    if (!clientId || !secret || !refreshToken || !dataCenter) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          msg: 'Missing required parameters: clientId, secret, refreshToken, or dataCenter'
        })
      };
    }

    // Генерация временной метки
    const timestamp = Date.now().toString();
    
    // Создание строки для подписи
    const signString = `${clientId}${timestamp}GET\n\n\n/v1.0/token/${refreshToken}`;
    
    // Генерация HMAC-SHA256 подписи
    const signature = crypto
      .createHmac('sha256', secret)
      .update(signString)
      .digest('hex')
      .toUpperCase();

    // Формирование заголовков для запроса к Tuya API
    const tuyaHeaders = {
      'client_id': clientId,
      'sign': signature,
      't': timestamp,
      'sign_method': 'HMAC-SHA256',
      'Content-Type': 'application/json'
    };

    // Выполнение запроса к Tuya API
    const response = await fetch(`${dataCenter}/v1.0/token/${refreshToken}`, {
      method: 'GET',
      headers: tuyaHeaders
    });

    // Проверка статуса ответа
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Tuya API refresh error:', response.status, errorText);
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({
          success: false,
          msg: `Tuya API refresh error: ${response.status} - ${errorText}`,
          error: {
            status: response.status,
            statusText: response.statusText
          }
        })
      };
    }

    // Парсинг ответа от Tuya API
    const data = await response.json();

    // Логирование для отладки (без чувствительных данных)
    console.log('Tuya API refresh response status:', data.success ? 'success' : 'failed');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error('Error in tuya-refresh-token function:', error);

    // Обработка различных типов ошибок
    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (error.name === 'SyntaxError') {
      errorMessage = 'Invalid JSON in request body';
      statusCode = 400;
    } else if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
      errorMessage = 'Unable to connect to Tuya API. Please check the data center URL.';
      statusCode = 502;
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      statusCode,
      headers,
      body: JSON.stringify({
        success: false,
        msg: errorMessage,
        error: {
          type: error.name,
          code: error.code
        }
      })
    };
  }
};