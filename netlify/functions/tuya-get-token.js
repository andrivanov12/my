const crypto = require('crypto');

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ success: false, msg: 'Method not allowed' }),
    };
  }

  try {
    const { clientId, secret, dataCenter } = JSON.parse(event.body);

    if (!clientId || !secret || !dataCenter) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          success: false,
          msg: 'Missing required parameters: clientId, secret, or dataCenter'
        }),
      };
    }

    // Get current timestamp
    const timestamp = Date.now().toString();

    // Create signature
    const stringToSign = clientId + timestamp + 'GET\n\n\n/v1.0/token?grant_type=1';
    const signature = crypto
      .createHmac('sha256', secret)
      .update(stringToSign, 'utf8')
      .digest('hex')
      .toUpperCase();

    // Make request to Tuya API
    const response = await fetch(`${dataCenter}/v1.0/token?grant_type=1`, {
      method: 'GET',
      headers: {
        'client_id': clientId,
        'sign': signature,
        't': timestamp,
        'sign_method': 'HMAC-SHA256'
      }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data),
    };

  } catch (error) {
    console.error('Error getting token:', error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        msg: error.message || 'Internal server error',
        error: error.toString()
      }),
    };
  }
};