const crypto = require('crypto');

exports.handler = async (event, context) => {
  // Настройка CORS заголовков для поддержки Postman и других клиентов
  const headers = {
    'Access-Control-Allow-Origin': '*', // Разрешаем запросы из любых источников для Postman
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
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
        msg: 'Method not allowed. Use POST.',
        documentation: 'Send POST request with JSON body containing: clientId, secret, refreshToken, dataCenter'
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
          msg: 'Missing required parameters',
          required_parameters: {
            clientId: 'Your Tuya IoT Client ID',
            secret: 'Your Tuya IoT Client Secret',
            refreshToken: 'Refresh token from previous /tuya-get-token call',
            dataCenter: 'Tuya API endpoint (e.g., https://openapi.tuyaeu.com)'
          },
          example: {
            clientId: 'your_client_id_here',
            secret: 'your_client_secret_here',
            refreshToken: 'your_refresh_token_here',
            dataCenter: 'https://openapi.tuyaeu.com'
          }
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
          msg: `Tuya API refresh error: ${response.status}`,
          error: {
            status: response.status,
            statusText: response.statusText,
            details: errorText
          },
          troubleshooting: {
            401: 'Invalid refresh token or expired credentials',
            403: 'Refresh token expired, get new token with /tuya-get-token',
            404: 'Check the data center URL',
            500: 'Tuya API server error, try again later'
          }
        })
      };
    }

    // Парсинг ответа от Tuya API
    const data = await response.json();

    // Логирование для отладки (без чувствительных данных)
    console.log('Tuya API refresh response status:', data.success ? 'success' : 'failed');

    // Добавляем дополнительную информацию для пользователей Postman
    if (data.success && data.result) {
      data.postman_info = {
        new_access_token_expires_in: `${data.result.expire_time} seconds`,
        new_refresh_token: 'Updated refresh token for future use',
        usage: 'Use the new access_token for authenticated API requests'
      };
    }

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
        },
        postman_help: {
          endpoint: 'POST /.netlify/functions/tuya-refresh-token',
          content_type: 'application/json',
          body_example: {
            clientId: 'your_client_id',
            secret: 'your_client_secret',
            refreshToken: 'your_refresh_token',
            dataCenter: 'https://openapi.tuyaeu.com'
          }
        }
      })
    };
  }
};