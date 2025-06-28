import axios from 'axios';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isError?: boolean;
  attachments?: FileAttachment[];
}

export interface FileAttachment {
  name: string;
  type: string;
  size: number;
  url?: string;
}

export interface AIModel {
  id: string;
  name: string;
  value: string;
  supportsImages?: boolean;
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SUPPORTED_FILE_TYPES = {
  'image/jpeg': true,
  'image/png': true,
  'image/gif': true,
  'image/webp': true
};

export const validateFile = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return 'File size exceeds 10MB limit';
  }
  
  if (!SUPPORTED_FILE_TYPES[file.type]) {
    return 'Only images (JPEG, PNG, GIF, WebP) are supported';
  }
  
  return null;
};

export const AI_MODELS: AIModel[] = [
  { id: 'gemini-25', name: 'Gemini 2.5 Flash', value: 'google/gemini-2.5-flash-preview' },
  { 
    id: 'llama4', 
    name: 'Llama 4 Maverick', 
    value: 'meta-llama/llama-4-maverick',
    supportsImages: true 
  },
  { id: 'deepseek', name: 'Deepseek Chat', value: 'deepseek/deepseek-chat-v3-0324' },
  { id: 'qwen3-235b', name: 'Qwen 3 235B', value: 'qwen/qwen3-235b-a22b' },
  { id: 'qwen3', name: 'Qwen 3 30B', value: 'qwen/qwen3-30b-a3b' },
  { id: 'gemini-20', name: 'Gemini 2.0 Flash', value: 'google/gemini-2.0-flash-lite-001' }
];

const cleanAIResponse = (text: string): string => {
  if (!text || typeof text !== 'string') {
    return 'No response received from AI service';
  }

  try {
    // Remove markdown headers (###)
    text = text.replace(/#{1,6}\s/g, '');
    
    // Remove markdown bold/italic (**text** or *text*)
    text = text.replace(/\*{1,2}(.*?)\*{1,2}/g, '$1');
    
    // Remove markdown links
    text = text.replace(/\[(.*?)\]\(.*?\)/g, '$1');
    
    // Remove quote markers (>)
    text = text.replace(/^\s*>\s*/gm, '');
    
    // Split by code blocks and process non-code parts
    const parts = text.split(/(```[\s\S]*?```)/g);
    const processed = parts.map((part, index) => {
      // If it's a code block (odd indices), leave it unchanged
      if (index % 2 === 1) return part;
      
      // Process numbered lists
      part = part.replace(/^\d+\.\s+/gm, (match) => {
        return `⊚ `;
      });
      
      // Process bullet points
      part = part.replace(/^[-•]\s+/gm, '• ');
      
      // Clean up excessive newlines and spacing
      return part
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\s+$/gm, '')  // Remove trailing spaces
        .replace(/^\s+/gm, ''); // Remove leading spaces
    });
    
    return processed.join('\n').trim();
  } catch (error) {
    console.error('Error cleaning AI response:', error);
    return text; // Return original text if cleaning fails
  }
};

// Упрощенная функция загрузки файлов без Supabase
export const uploadFile = async (file: File): Promise<string> => {
  // Создаем локальный URL для файла
  return URL.createObjectURL(file);
};

export const sendMessageToAI = async (
  message: string, 
  previousMessages: Message[],
  modelId: string = 'qwen3',
  attachments?: File[]
): Promise<string> => {
  try {
    // Use the provided API key directly, fallback to environment variable
    const apiKey = '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' || 
                   import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!apiKey || apiKey.trim() === '') {
      throw new Error(
        'Сервис временно недоступен. API ключ не настроен. ' +
        'Пожалуйста, обратитесь к администратору сайта для настройки доступа к AI сервису.'
      );
    }

    // Validate API key format
    if (!apiKey.startsWith('sk-or-v1-')) {
      throw new Error(
        'Неверный формат API ключа. Пожалуйста, проверьте настройки сервиса.'
      );
    }

    const selectedModel = AI_MODELS.find(model => model.id === modelId);
    if (!selectedModel) {
      throw new Error('Invalid model selected');
    }

    // Check if images are supported
    if (attachments?.length && !selectedModel.supportsImages) {
      throw new Error('The selected model does not support image processing. Please switch to Llama 4 Maverick to analyze images.');
    }

    // Upload files if present
    const uploadedAttachments = attachments ? await Promise.all(
      attachments.map(async (file) => {
        const url = await uploadFile(file);
        return {
          name: file.name,
          type: file.type,
          size: file.size,
          url
        };
      })
    ) : [];

    // Prepare message content based on model and attachments
    let messageContent: any = message;

    if (selectedModel.supportsImages && uploadedAttachments.length > 0) {
      messageContent = [
        {
          type: "text",
          text: message || "What is in this image?"
        },
        ...uploadedAttachments.map(att => ({
          type: "image_url",
          image_url: {
            url: att.url
          }
        }))
      ];
    }

    // Создаем контроллер для отмены запроса
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 секунд таймаут

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: selectedModel.value,
          messages: [
            ...previousMessages.slice(-10).map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: messageContent
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'ChatGPT'
          },
          signal: controller.signal,
          timeout: 30000
        }
      );

      clearTimeout(timeoutId);

      // Log the complete response data for debugging
      console.debug('AI service complete response:', JSON.stringify(response.data, null, 2));

      // Check for error response first
      if (response.data.error) {
        const error = response.data.error;
        
        // Check for region restriction error
        if (error.metadata?.raw) {
          try {
            const rawError = JSON.parse(error.metadata.raw);
            if (rawError.error?.code === 'unsupported_country_region_territory') {
              throw new Error(
                'Ваш регион в настоящее время не поддерживается этой AI моделью. ' +
                'Попробуйте использовать VPN или переключитесь на другую AI модель. ' +
                'Доступные модели можно выбрать в выпадающем меню выше.'
              );
            }
          } catch (parseError) {
            // If JSON parsing fails, throw the original error message
            throw new Error(error.message || 'Произошла неизвестная ошибка');
          }
        }
        
        // For other errors, throw the error message
        throw new Error(error.message || 'Произошла неизвестная ошибка');
      }

      // Enhanced response validation with more detailed error messages
      if (!response.data) {
        console.error('Empty response received:', response);
        throw new Error('Получен пустой ответ от AI сервиса. Попробуйте еще раз или проверьте статус OpenRouter.');
      }

      if (!response.data.choices || !Array.isArray(response.data.choices)) {
        console.error('Invalid response format:', response.data);
        throw new Error(`Неверный формат ответа от AI сервиса. Ожидался массив 'choices', но получен: ${JSON.stringify(response.data)}`);
      }

      if (response.data.choices.length === 0) {
        console.error('Empty choices array:', response.data);
        return 'AI модель в настоящее время испытывает высокую нагрузку. Попробуйте еще раз через некоторое время.';
      }

      const firstChoice = response.data.choices[0];
      if (!firstChoice) {
        console.error('Missing first choice:', response.data.choices);
        return 'AI модель в настоящее время недоступна. Попробуйте переключиться на другую модель.';
      }

      if (!firstChoice.message) {
        console.error('Missing message in first choice:', firstChoice);
        return 'AI модель вернула неверный ответ. Попробуйте еще раз с другим запросом.';
      }

      const content = firstChoice.message.content;
      if (typeof content !== 'string') {
        console.error('Invalid content type:', typeof content, content);
        return 'AI модель вернула неожиданный формат ответа. Попробуйте еще раз.';
      }

      if (content.trim() === '') {
        return 'AI модель не предоставила ответ. Попробуйте переформулировать вопрос или переключиться на другую модель.';
      }

      return cleanAIResponse(content);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  } catch (error) {
    console.error('Error in sendMessageToAI:', error);
    
    // Enhanced error handling with more specific error messages
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error('Время ожидания запроса истекло. AI сервис слишком долго отвечает. Попробуйте еще раз.');
      }

      if (!error.response) {
        throw new Error('Ошибка сети: Невозможно подключиться к AI сервису. Проверьте подключение к интернету.');
      }

      console.error('AI service error response:', error.response.data);

      // Check for region restriction error in axios error response
      if (error.response.data?.error?.metadata?.raw) {
        try {
          const rawError = JSON.parse(error.response.data.error.metadata.raw);
          if (rawError.error?.code === 'unsupported_country_region_territory') {
            throw new Error(
              'Ваш регион в настоящее время не поддерживается этой AI моделью. ' +
              'Попробуйте использовать VPN или переключитесь на другую AI модель. ' +
              'Доступные модели можно выбрать в выпадающем меню выше.'
            );
          }
        } catch (parseError) {
          // Continue with normal error handling if JSON parsing fails
        }
      }

      if (error.response.status === 401) {
        throw new Error('Ошибка аутентификации. Проверьте настройки API ключа OpenRouter.');
      } else if (error.response.status === 429) {
        throw new Error('Превышен лимит запросов. Подождите немного перед повторной попыткой.');
      } else if (error.response.status === 402) {
        throw new Error('Недостаточно кредитов. Проверьте баланс вашего аккаунта OpenRouter.');
      } else if (error.response.status === 503) {
        throw new Error('AI сервис временно недоступен. Попробуйте позже.');
      } else if (error.response.status === 504) {
        throw new Error('Время ожидания запроса к AI сервису истекло. Попробуйте еще раз.');
      } else {
        throw new Error(`Ошибка AI сервиса (${error.response.status}): ${error.response.data.error || 'Неизвестная ошибка'}. Попробуйте позже.`);
      }
    }
    
    if (error instanceof Error) {
      // Preserve custom error messages but add debugging context
      throw new Error(`${error.message}`);
    }
    
    throw new Error('Произошла неожиданная ошибка при обращении к AI сервису. Попробуйте еще раз.');
  }
};