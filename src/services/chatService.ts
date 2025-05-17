import axios from 'axios';
import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isError?: boolean;
  attachments?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
}

export interface AIModel {
  id: string;
  name: string;
  value: string;
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB max file size

export const SUPPORTED_FILE_TYPES = {
  // Images
  'image/jpeg': true,
  'image/png': true,
  'image/gif': true,
  'image/webp': true,
  // Documents
  'application/pdf': true,
  'text/plain': true,
  'application/msword': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true,
  // Audio
  'audio/mpeg': true,
  'audio/wav': true,
  'audio/ogg': true,
  // Video
  'video/mp4': true,
  'video/webm': true,
  'video/ogg': true
};

export const validateFile = (file: File): string | null => {
  if (!SUPPORTED_FILE_TYPES[file.type]) {
    return 'File type not supported';
  }
  if (file.size > MAX_FILE_SIZE) {
    return `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`;
  }
  return null;
};

export const AI_MODELS: AIModel[] = [
  { id: 'qwen3', name: 'Qwen 3 30B', value: 'qwen/qwen3-30b-a3b' },
  { id: 'gemini-25', name: 'Gemini 2.5 Flash', value: 'google/gemini-2.5-flash-preview' },
  { id: 'gemini-20', name: 'Gemini 2.0 Flash', value: 'google/gemini-2.0-flash-lite-001' }
];

const cleanAIResponse = (text: string): string => {
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
};

export const uploadFile = async (file: File) => {
  if (!navigator.onLine) {
    throw new Error('Нет подключения к интернету. Пожалуйста, проверьте соединение и попробуйте снова.');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { data, error } = await supabase.storage
    .from('chat-attachments')
    .upload(filePath, file);

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from('chat-attachments')
    .getPublicUrl(filePath);

  return {
    name: file.name,
    url: publicUrl,
    type: file.type
  };
};

const checkApiKey = () => {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('API ключ не настроен. Пожалуйста, добавьте ваш OpenRouter API ключ в файл .env');
  }
  return apiKey;
};

export const sendMessageToAI = async (
  message: string, 
  previousMessages: Message[],
  modelId: string = 'qwen3',
  retryCount = 0
): Promise<string> => {
  try {
    if (!navigator.onLine) {
      throw new Error('Нет подключения к интернету. Пожалуйста, проверьте соединение и попробуйте снова.');
    }

    const apiKey = checkApiKey();
    
    const selectedModel = AI_MODELS.find(model => model.id === modelId);
    if (!selectedModel) {
      throw new Error('Выбрана неверная модель');
    }

    // Add debug logging
    console.log('Sending request to OpenRouter API:', {
      model: selectedModel.value,
      messagesCount: previousMessages.length + 1,
      hasApiKey: !!apiKey
    });

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
              content: message
            }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': window.location.origin,
            'X-Title': 'ChatGPT',
            'Origin': window.location.origin
          },
          timeout: 60000 // Increased timeout to 60 seconds
        }
      );

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Некорректный формат ответа от AI сервиса');
      }

      return cleanAIResponse(response.data.choices[0].message.content);
    } catch (axiosError) {
      // Log the full error for debugging
      console.error('OpenRouter API Error:', axiosError);
      throw axiosError;
    }
  } catch (error) {
    console.error('Error in sendMessageToAI:', error);
    
    // If we haven't exceeded max retries and it's a network error, retry
    if (retryCount < 3 && ( // Increased max retries to 3
      !navigator.onLine || 
      (axios.isAxiosError(error) && !error.response)
    )) {
      console.log(`Retrying request (attempt ${retryCount + 1})...`);
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
      return sendMessageToAI(message, previousMessages, modelId, retryCount + 1);
    }
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Превышено время ожидания запроса. Пожалуйста, попробуйте снова.');
      }
      
      if (!error.response) {
        throw new Error('Ошибка сети при подключении к OpenRouter API. Пожалуйста, проверьте подключение к интернету и попробуйте снова.');
      }
      
      const errorMessage = error.response.data?.error?.message || error.response.data?.message;
      
      switch (error.response.status) {
        case 401:
          throw new Error(`Ошибка авторизации: ${errorMessage || 'Неверный API ключ. Пожалуйста, проверьте конфигурацию OpenRouter API ключа.'}`);
        case 402:
          throw new Error(`Ошибка оплаты: ${errorMessage || 'Недостаточно кредитов. Пожалуйста, проверьте баланс вашего аккаунта OpenRouter.'}`);
        case 429:
          throw new Error(`Превышен лимит запросов: ${errorMessage || 'Слишком много запросов. Пожалуйста, подождите немного и попробуйте снова.'}`);
        case 500:
          throw new Error(`Ошибка сервера: ${errorMessage || 'AI сервис временно недоступен. Пожалуйста, попробуйте позже.'}`);
        default:
          throw new Error(`Ошибка AI сервиса (${error.response.status}): ${errorMessage || 'Пожалуйста, попробуйте позже.'}`);
      }
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('Произошла непредвиденная ошибка при отправке сообщения. Пожалуйста, попробуйте снова.');
  }
};

export const createChat = async (userId: string, model: string = 'qwen3') => {
  if (!navigator.onLine) {
    throw new Error('Нет подключения к интернету. Пожалуйста, проверьте соединение и попробуйте снова.');
  }

  const { data: chat, error } = await supabase
    .from('chats')
    .insert([{ user_id: userId, model }])
    .select()
    .single();

  if (error) throw error;
  return chat;
};

export const saveMessage = async (chatId: string, message: Omit<Message, 'id'>) => {
  if (!navigator.onLine) {
    throw new Error('Нет подключения к интернету. Пожалуйста, проверьте соединение и попробуйте снова.');
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([{
      chat_id: chatId,
      role: message.role,
      content: message.content,
      timestamp: message.timestamp,
      is_error: message.isError || false,
      attachments: message.attachments || null
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getChatMessages = async (chatId: string) => {
  if (!navigator.onLine) {
    throw new Error('Нет подключения к интернету. Пожалуйста, проверьте соединение и попробуйте снова.');
  }

  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('timestamp', { ascending: true });

  if (error) throw error;
  return messages;
};

export const deleteChat = async (chatId: string) => {
  if (!navigator.onLine) {
    throw new Error('Нет подключения к интернету. Пожалуйста, проверьте соединение и попробуйте снова.');
  }

  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId);

  if (error) throw error;
};