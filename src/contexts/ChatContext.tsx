import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Cookies from 'js-cookie';
import { Message, sendMessageToAI, AI_MODELS, AIModel } from '../services/chatService';

interface ChatContextType {
  messages: Message[];
  loading: boolean;
  sessionId: string;
  selectedModel: string;
  availableModels: AIModel[];
  sendMessage: (content: string, attachments?: File[]) => Promise<void>;
  clearChat: () => void;
  setSelectedModel: (modelId: string) => void;
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  loading: false,
  sessionId: '',
  selectedModel: 'qwen3',
  availableModels: AI_MODELS,
  sendMessage: async () => {},
  clearChat: () => {},
  setSelectedModel: () => {},
});

export const useChat = () => useContext(ChatContext);

interface ChatProviderProps {
  children: React.ReactNode;
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const [sessionId, setSessionId] = useState<string>(() => {
    try {
      const savedSessionId = Cookies.get('chat_session_id');
      return savedSessionId || uuidv4();
    } catch (error) {
      console.warn('Error reading session ID from cookies:', error);
      return uuidv4();
    }
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const savedMessages = localStorage.getItem(`chat_messages_${sessionId}`);
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (error) {
      console.warn('Error reading messages from localStorage:', error);
      return [];
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    try {
      const savedModel = localStorage.getItem('selected_model');
      // Validate the saved model exists in AI_MODELS, otherwise use default
      return AI_MODELS.find(model => model.id === savedModel) ? savedModel : 'qwen3';
    } catch (error) {
      console.warn('Error reading selected model from localStorage:', error);
      return 'qwen3';
    }
  });

  useEffect(() => {
    try {
      Cookies.set('chat_session_id', sessionId, { expires: 7 });
    } catch (error) {
      console.warn('Error saving session ID to cookies:', error);
    }
  }, [sessionId]);

  useEffect(() => {
    try {
      localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(messages));
    } catch (error) {
      console.warn('Error saving messages to localStorage:', error);
    }
  }, [messages, sessionId]);

  useEffect(() => {
    try {
      localStorage.setItem('selected_model', selectedModel);
    } catch (error) {
      console.warn('Error saving selected model to localStorage:', error);
    }
  }, [selectedModel]);

  const sendMessage = async (content: string, attachments?: File[]) => {
    if (!content.trim() && (!attachments || attachments.length === 0)) return;

    // Validate selected model before proceeding
    if (!AI_MODELS.find(model => model.id === selectedModel)) {
      const errorResponse: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `Invalid AI model selected. Please choose a valid model from the dropdown menu.`,
        timestamp: new Date().toISOString(),
        isError: true,
      };
      setMessages((prevMessages) => [...prevMessages, errorResponse]);
      return;
    }

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      attachments: attachments?.map(file => ({
        name: file.name,
        type: file.type,
        size: file.size
      }))
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setLoading(true);

    try {
      const aiResponse = await sendMessageToAI(content, messages, selectedModel, attachments);
      
      const aiMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      let errorMessage = 'An error occurred while processing your request.';
      
      if (error instanceof Error) {
        // Check for specific error types and provide user-friendly messages
        if (error.message.includes('rate limit')) {
          errorMessage = 'You have reached the rate limit. Please wait a moment before sending another message.';
        } else if (error.message.includes('authentication')) {
          errorMessage = 'There was an authentication error. Please try selecting a different AI model.';
        } else if (error.message.includes('credits')) {
          errorMessage = 'Insufficient credits. Please try selecting a different AI model or try again later.';
        } else if (error.message.includes('Provider returned error')) {
          errorMessage = 'The AI service is currently unavailable. Please try selecting a different model or try again later.';
        } else if (error.message.includes('timeout')) {
          errorMessage = 'Request timed out. Please try again with a shorter message or check your internet connection.';
        } else {
          // Include the actual error message for other cases
          errorMessage = `Error: ${error.message}`;
        }
      }

      const errorResponse: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prevMessages) => [...prevMessages, errorResponse]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    try {
      Cookies.set('chat_session_id', newSessionId, { expires: 7 });
      localStorage.removeItem(`chat_messages_${sessionId}`);
    } catch (error) {
      console.warn('Error clearing chat data:', error);
    }
  };

  return (
    <ChatContext.Provider value={{ 
      messages, 
      loading, 
      sessionId,
      selectedModel,
      availableModels: AI_MODELS,
      sendMessage, 
      clearChat,
      setSelectedModel
    }}>
      {children}
    </ChatContext.Provider>
  );
};