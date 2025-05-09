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
  sendMessage: (content: string) => Promise<void>;
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
    const savedSessionId = Cookies.get('chat_session_id');
    return savedSessionId || uuidv4();
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem(`chat_messages_${sessionId}`);
    return savedMessages ? JSON.parse(savedMessages) : [];
  });
  
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(() => {
    const savedModel = localStorage.getItem('selected_model');
    return savedModel || 'qwen3';
  });

  useEffect(() => {
    Cookies.set('chat_session_id', sessionId, { expires: 7 });
  }, [sessionId]);

  useEffect(() => {
    localStorage.setItem(`chat_messages_${sessionId}`, JSON.stringify(messages));
  }, [messages, sessionId]);

  useEffect(() => {
    localStorage.setItem('selected_model', selectedModel);
  }, [selectedModel]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setLoading(true);

    try {
      const aiResponse = await sendMessageToAI(content, messages, selectedModel);
      
      const aiMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'An error occurred while processing your request.',
        timestamp: new Date().toISOString(),
        isError: true,
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    Cookies.set('chat_session_id', newSessionId, { expires: 7 });
    localStorage.removeItem(`chat_messages_${sessionId}`);
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