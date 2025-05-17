import axios from 'axios';
import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isError?: boolean;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  thumbnailUrl?: string;
}

export interface AIModel {
  id: string;
  name: string;
  value: string;
}

export const AI_MODELS: AIModel[] = [
  { id: 'qwen3', name: 'Qwen 3 30B', value: 'qwen/qwen3-30b-a3b' },
  { id: 'gemini-25', name: 'Gemini 2.5 Flash', value: 'google/gemini-2.5-flash-preview' },
  { id: 'gemini-20', name: 'Gemini 2.0 Flash', value: 'google/gemini-2.0-flash-lite-001' }
];

// Maximum file size in bytes (50MB)
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

// Supported file types
export const SUPPORTED_FILE_TYPES = {
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/gif': ['gif'],
  'video/mp4': ['mp4'],
  'video/quicktime': ['mov'],
  'video/x-msvideo': ['avi'],
  'audio/mpeg': ['mp3'],
  'audio/wav': ['wav'],
  'audio/x-m4a': ['m4a'],
  'application/pdf': ['pdf'],
  'application/msword': ['doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
  'text/plain': ['txt']
};

export const isFileTypeSupported = (file: File): boolean => {
  return Object.keys(SUPPORTED_FILE_TYPES).includes(file.type);
};

export const validateFile = (file: File): string | null => {
  if (!isFileTypeSupported(file)) {
    return 'Неподдерживаемый формат файла';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'Файл слишком большой (максимум 50MB)';
  }
  return null;
};

const generateThumbnail = async (file: File): Promise<string | undefined> => {
  if (!file.type.startsWith('image/')) return undefined;

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_THUMB_SIZE = 200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_THUMB_SIZE) {
            height *= MAX_THUMB_SIZE / width;
            width = MAX_THUMB_SIZE;
          }
        } else {
          if (height > MAX_THUMB_SIZE) {
            width *= MAX_THUMB_SIZE / height;
            height = MAX_THUMB_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};

export const uploadFile = async (file: File): Promise<Attachment> => {
  const validationError = validateFile(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const fileId = crypto.randomUUID();
  const fileExt = file.name.split('.').pop();
  const fileName = `${fileId}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('chat-attachments')
    .upload(filePath, file);

  if (uploadError) {
    throw new Error('Ошибка загрузки файла');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('chat-attachments')
    .getPublicUrl(filePath);

  const thumbnailUrl = await generateThumbnail(file);

  return {
    id: fileId,
    name: file.name,
    url: publicUrl,
    type: file.type,
    size: file.size,
    thumbnailUrl
  };
};

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

export const sendMessageToAI = async (
  content: string,
  previousMessages: Message[],
  modelId: string = 'qwen3'
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenRouter API key not configured. Please check your environment variables.');
    }

    const selectedModel = AI_MODELS.find(model => model.id === modelId);
    if (!selectedModel) {
      throw new Error('Invalid model selected');
    }

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
              content
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
          timeout: 30000 // 30 second timeout
        }
      );

      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from AI service');
      }

      return cleanAIResponse(response.data.choices[0].message.content);
    } catch (axiosError) {
      if (axios.isAxiosError(axiosError)) {
        if (axiosError.code === 'ECONNABORTED') {
          throw new Error('Request timed out. Please try again.');
        }
        if (!axiosError.response) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        if (axiosError.response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenRouter API key configuration.');
        }
        if (axiosError.response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        if (axiosError.response.status === 402) {
          throw new Error('Insufficient credits. Please check your OpenRouter account balance.');
        }
        throw new Error(`API Error: ${axiosError.response.data?.error?.message || 'Unknown error occurred'}`);
      }
      throw axiosError;
    }
  } catch (error) {
    console.error('Error in sendMessageToAI:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred. Please try again.');
  }
};