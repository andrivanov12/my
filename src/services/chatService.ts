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

export const AI_MODELS: AIModel[] = [
  { id: 'qwen3', name: 'Qwen 3 30B', value: 'qwen/qwen3-30b-a3b' },
  { id: 'gemini-25', name: 'Gemini 2.5 Flash', value: 'google/gemini-2.5-flash-preview' },
  { id: 'gemini-20', name: 'Gemini 2.0 Flash', value: 'google/gemini-2.0-flash-lite-001' }
];

const SUPPORTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'application/pdf',
  'text/plain',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'video/mp4',
  'video/webm'
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
  if (!SUPPORTED_FILE_TYPES.includes(file.type)) {
    throw new Error('Unsupported file type');
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `uploads/${fileName}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('chat-attachments')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw new Error('Failed to upload file');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('chat-attachments')
    .getPublicUrl(filePath);

  return {
    name: file.name,
    url: publicUrl,
    type: file.type
  };
};

export const sendMessageToAI = async (
  message: string, 
  previousMessages: Message[],
  modelId: string = 'qwen3'
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error('OpenRouter API key not found. Please add VITE_OPENROUTER_API_KEY to your .env file.');
    }

    const selectedModel = AI_MODELS.find(model => model.id === modelId);
    if (!selectedModel) {
      throw new Error('Invalid model selected');
    }

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
          'X-Title': 'ChatGPT'
        }
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from AI service');
    }

    return cleanAIResponse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Error in sendMessageToAI:', error);
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please check your OpenRouter API key.');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      } else if (error.response?.status === 402) {
        throw new Error('Insufficient credits. Please check your OpenRouter account.');
      }
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to get response from AI service. Please try again.');
  }
};

export const createChat = async (userId: string, model: string = 'qwen3') => {
  const { data: chat, error } = await supabase
    .from('chats')
    .insert([{ user_id: userId, model }])
    .select()
    .single();

  if (error) throw error;
  return chat;
};

export const saveMessage = async (chatId: string, message: Omit<Message, 'id'>) => {
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
  const { data: messages, error } = await supabase
    .from('messages')
    .select('*')
    .eq('chat_id', chatId)
    .order('timestamp', { ascending: true });

  if (error) throw error;
  return messages;
};

export const deleteChat = async (chatId: string) => {
  const { error } = await supabase
    .from('chats')
    .delete()
    .eq('id', chatId);

  if (error) throw error;
};

export { SUPPORTED_FILE_TYPES }