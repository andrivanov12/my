import axios from 'axios';
import { supabase } from '../lib/supabase';

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
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const SUPPORTED_FILE_TYPES = {
  'image/jpeg': true,
  'image/png': true,
  'image/gif': true,
  'application/pdf': true,
  'text/plain': true,
  'application/msword': true,
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': true
};

export const validateFile = (file: File): string | null => {
  if (file.size > MAX_FILE_SIZE) {
    return 'File size exceeds 10MB limit';
  }
  
  if (!SUPPORTED_FILE_TYPES[file.type]) {
    return 'Unsupported file type';
  }
  
  return null;
};

export const AI_MODELS: AIModel[] = [
  { id: 'qwen3-235b', name: 'Qwen 3 235B', value: 'qwen/qwen3-235b-a22b' },
  { id: 'qwen3', name: 'Qwen 3 30B', value: 'qwen/qwen3-30b-a3b' },
  { id: 'gemini-25', name: 'Gemini 2.5 Flash', value: 'google/gemini-2.5-flash-preview' },
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

export const uploadFile = async (file: File): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('chat-attachments')
    .upload(`${Date.now()}-${file.name}`, file);

  if (error) throw error;
  
  const { data: { publicUrl } } = supabase.storage
    .from('chat-attachments')
    .getPublicUrl(data.path);

  return publicUrl;
};

export const sendMessageToAI = async (
  message: string, 
  previousMessages: Message[],
  modelId: string = 'qwen3',
  attachments?: File[]
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

    // Prepare message content with file information
    const messageWithAttachments = attachments?.length 
      ? `${message}\n\nПрикрепленные файлы:\n${uploadedAttachments
          .map(att => `- ${att.name} (${att.type})`)
          .join('\n')}`
      : message;

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
            content: messageWithAttachments
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
              'Your region is currently not supported by this AI model. ' +
              'Please try using a VPN service or switch to a different AI model. ' +
              'Available models can be selected from the dropdown menu above.'
            );
          }
        } catch (parseError) {
          // If JSON parsing fails, throw the original error message
          throw new Error(error.message || 'Unknown error occurred');
        }
      }
      
      // For other errors, throw the error message
      throw new Error(error.message || 'Unknown error occurred');
    }

    // Enhanced response validation with more detailed error messages
    if (!response.data) {
      console.error('Empty response received:', response);
      throw new Error('Empty response received from AI service. Please try again or check OpenRouter status.');
    }

    if (!response.data.choices || !Array.isArray(response.data.choices)) {
      console.error('Invalid response format:', response.data);
      throw new Error(`Invalid response format from AI service. Expected 'choices' array but received: ${JSON.stringify(response.data)}`);
    }

    if (response.data.choices.length === 0) {
      console.error('Empty choices array:', response.data);
      throw new Error('AI service returned an empty response. Please try again or check if the model is currently available.');
    }

    const firstChoice = response.data.choices[0];
    if (!firstChoice) {
      console.error('Missing first choice:', response.data.choices);
      throw new Error('AI service response is missing the first choice. Please try again.');
    }

    if (!firstChoice.message) {
      console.error('Missing message in first choice:', firstChoice);
      throw new Error('AI service response is missing the message object. Please try again.');
    }

    const content = firstChoice.message.content;
    if (typeof content !== 'string') {
      console.error('Invalid content type:', typeof content, content);
      throw new Error(`AI service response content is invalid. Expected string but got ${typeof content}`);
    }

    if (content.trim() === '') {
      throw new Error('AI service returned an empty message. Please try again.');
    }

    return cleanAIResponse(content);
  } catch (error) {
    console.error('Error in sendMessageToAI:', error);
    
    // Enhanced error handling with more specific error messages
    if (axios.isAxiosError(error)) {
      if (!error.response) {
        throw new Error('Network error: Unable to reach the AI service. Please check your internet connection.');
      }

      console.error('AI service error response:', error.response.data);

      // Check for region restriction error in axios error response
      if (error.response.data?.error?.metadata?.raw) {
        try {
          const rawError = JSON.parse(error.response.data.error.metadata.raw);
          if (rawError.error?.code === 'unsupported_country_region_territory') {
            throw new Error(
              'Your region is currently not supported by this AI model. ' +
              'Please try using a VPN service or switch to a different AI model. ' +
              'Available models can be selected from the dropdown menu above.'
            );
          }
        } catch (parseError) {
          // Continue with normal error handling if JSON parsing fails
        }
      }

      if (error.response.status === 401) {
        throw new Error('Authentication failed. Please check your OpenRouter API key.');
      } else if (error.response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
      } else if (error.response.status === 402) {
        throw new Error('Insufficient credits. Please check your OpenRouter account balance.');
      } else if (error.response.status === 503) {
        throw new Error('AI service is temporarily unavailable. Please try again later.');
      } else if (error.response.status === 504) {
        throw new Error('AI service request timed out. Please try again.');
      } else {
        throw new Error(`AI service error (${error.response.status}): ${error.response.data.error || 'Unknown error'}. Please try again later.`);
      }
    }
    
    if (error instanceof Error) {
      // Preserve custom error messages but add debugging context
      throw new Error(`${error.message} (Debug info: Check console for detailed error logs)`);
    }
    
    throw new Error('An unexpected error occurred while communicating with the AI service. Please try again.');
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