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

export const sendMessageToAI = async (
  message: string, 
  previousMessages: Message[],
  modelId: string = 'qwen3'
): Promise<string> => {
  try {
    const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error('API key not configured. Please add your OpenRouter API key to continue.');
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
        },
        timeout: 30000 // 30 second timeout
      }
    );

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response format from AI service');
    }

    return cleanAIResponse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Error in sendMessageToAI:', error);
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out. Please try again.');
      }
      
      if (!error.response) {
        throw new Error('Network error. Please check your internet connection and try again.');
      }
      
      switch (error.response.status) {
        case 401:
          throw new Error('Invalid API key. Please check your OpenRouter API key configuration.');
        case 402:
          throw new Error('Insufficient credits. Please check your OpenRouter account balance.');
        case 429:
          throw new Error('Too many requests. Please wait a moment and try again.');
        case 500:
          throw new Error('AI service is temporarily unavailable. Please try again later.');
        default:
          throw new Error(`AI service error (${error.response.status}). Please try again later.`);
      }
    }
    
    if (error instanceof Error) {
      throw error;
    }
    
    throw new Error('An unexpected error occurred. Please try again.');
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