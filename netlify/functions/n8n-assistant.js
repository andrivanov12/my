// n8n-assistant.js
const axios = require('axios');

exports.handler = async (event, context) => {
  
  // Проверяем, что метод запроса POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }
  
  try {
    // Получаем данные из запроса
    const body = JSON.parse(event.body);
    const { query } = body;
    
    // Проверяем, что запрос не пустой
    if (!query || query.trim().length < 3) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Query too short' })
      };
    }
    
    // Вызываем OpenAI API для ответа ассистента
    const aiResponse = await getAIResponse(query);
    
    // Ищем шаблоны n8n workflows (имитация)
    const templates = await findTemplates(query);
    
    // Возвращаем успешный ответ
    return {
      statusCode: 200,
      body: JSON.stringify({
        response: aiResponse,
        templates: templates
      })
    };
    
  } catch (error) {
    // Возвращаем ошибку
    console.log('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error', message: error.toString() })
    };
  }
};

// Функция для получения ответа от AI (OpenAI)
async function getAIResponse(query) {
  const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  
  try {
    const response = await axios.post(OPENAI_API_URL, 
      {
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: `Ты эксперт по n8n - платформе для автоматизации рабочих процессов.
            Твоя задача - помогать пользователям создавать автоматизации в n8n.
            
            Когда объясняешь про n8n, учитывай следующее:
            1. Основная терминология: nodes (узлы), workflows (рабочие процессы), triggers (триггеры), connections (соединения).
            2. Популярные узлы: HTTP Request, Function, IF, Set, Schedule, Webhook, Gmail, Google Sheets.
            3. Типы триггеров: по расписанию, по событию, по входящим запросам.
            
            При ответе:
            1. Давай четкие пошаговые инструкции с номерами шагов.
            2. Приводи примеры кода для Function node, где это уместно.
            3. Объясняй, какие параметры нужно настроить в каждом узле.
            4. Упоминай возможные проблемы и как их решить.
            
            Используй маркдаун для форматирования. Код оформляй в \`\`\` блоки с указанием языка.`
          },
          {
            role: "user",
            content: query
          }
        ],
        temperature: 0.7,
        max_tokens: 3000
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    return "Извините, возникла ошибка при обработке вашего запроса. Пожалуйста, попробуйте еще раз.";
  }
}

// Функция для имитации поиска шаблонов
async function findTemplates(query) {
  // Демо-данные с шаблонами
  const allTemplates = [
    {
      title: "RSS в Telegram с изображениями",
      description: "Автоматически публикует статьи из RSS-ленты в Telegram-канал с изображениями",
      url: "https://n8nworkflows.xyz/workflow/rss-telegram-images",
      imageUrl: "https://n8n.io/images/workflows/rss-telegram.png"
    },
    {
      title: "ВКонтакте автопостер",
      description: "Публикация контента в группы VK через API с возможностью планирования",
      url: "https://n8nworkflows.xyz/workflow/vk-autoposter",
      imageUrl: "https://n8n.io/images/workflows/vk-posting.png"
    },
    {
      title: "Google Sheets to Email Notifier",
      description: "Отправляет уведомления на email при обновлении данных в Google Sheets",
      url: "https://n8nworkflows.xyz/workflow/sheets-email-notify",
      imageUrl: "https://n8n.io/images/workflows/sheets-email.png"
    },
    {
      title: "Форма в AmoCRM",
      description: "Создает сделки в AmoCRM из данных веб-формы",
      url: "https://n8nworkflows.xyz/workflow/form-to-amocrm",
      imageUrl: "https://n8n.io/images/workflows/form-crm.png"
    }
  ];
  
  const queryLower = query.toLowerCase();
  
  // Возвращаем фильтрованные шаблоны
  return allTemplates.filter(template => {
    return (
      template.title.toLowerCase().includes(queryLower) ||
      template.description.toLowerCase().includes(queryLower) ||
      // Ключевые слова для VK
      ((queryLower.includes('vk') || queryLower.includes('вк') || 
        queryLower.includes('вконтакте')) && 
       (template.title.toLowerCase().includes('vk') || 
        template.title.toLowerCase().includes('вконтакте'))) ||
      // Ключевые слова для Telegram
      ((queryLower.includes('telegram') || queryLower.includes('телеграм') || 
        queryLower.includes('rss')) &&
       (template.title.toLowerCase().includes('telegram') || 
        template.title.toLowerCase().includes('rss'))) ||
      // Ключевые слова для Google Sheets
      ((queryLower.includes('google') || queryLower.includes('sheets') || 
        queryLower.includes('email')) &&
       (template.title.toLowerCase().includes('google') || 
        template.title.toLowerCase().includes('email') || 
        template.title.toLowerCase().includes('sheets'))) ||
      // Ключевые слова для CRM
      ((queryLower.includes('crm') || queryLower.includes('форма') || 
        queryLower.includes('amocrm')) &&
       (template.title.toLowerCase().includes('crm') || 
        template.title.toLowerCase().includes('форма')))
    );
  }).slice(0, 3); // Ограничиваем количество результатов
}