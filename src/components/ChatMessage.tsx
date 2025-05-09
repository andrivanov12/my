import React from 'react';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import { Message } from '../services/chatService';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div 
      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div 
        className={`max-w-[90%] sm:max-w-[85%] md:max-w-[75%] rounded-lg p-2 md:p-3 ${
          isUser 
            ? 'bg-primary-100 dark:bg-primary-900/40 text-gray-800 dark:text-gray-100 rounded-tr-none' 
            : 'bg-white dark:bg-gray-700 shadow-sm rounded-tl-none'
        } ${message.isError ? 'border border-red-300 dark:border-red-700' : ''}`}
      >
        <div className="flex items-center gap-1.5 md:gap-2 mb-1">
          {!isUser && (
            <div className="p-0.5 md:p-1 bg-primary-500 rounded-full">
              {message.isError 
                ? <AlertTriangle className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" /> 
                : <MessageSquare className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" />
              }
            </div>
          )}
          <span className={`text-xs ${isUser ? 'text-primary-700 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'}`}>
            {isUser ? 'Вы' : 'ChatGPT'} • {formattedTime}
          </span>
        </div>
        
        <div className="whitespace-pre-wrap text-sm md:text-base">{message.content}</div>
      </div>
    </div>
  );
};

export default ChatMessage;