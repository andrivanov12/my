import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, Copy, Check } from 'lucide-react';
import { Message } from '../services/chatService';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const isUser = message.role === 'user';
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  // Function to handle copying code
  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Function to format message content with copyable code blocks
  const formatContent = () => {
    if (isUser) {
      return <div className="whitespace-pre-wrap">{message.content}</div>;
    }

    // Split content by code block markers (```), preserving the markers
    const parts = message.content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      // Check if this part is a code block
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language if specified
        const firstLineEnd = part.indexOf('\n');
        const firstLine = part.slice(3, firstLineEnd).trim();
        const code = part.slice(firstLineEnd + 1, -3).trim();
        const language = firstLine.length > 0 ? firstLine : 'plaintext';
        
        return (
          <div key={index} className="relative my-4 first:mt-2 last:mb-2">
            {language !== 'plaintext' && (
              <div className="absolute top-0 left-2 px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-900 rounded-t-lg">
                {language}
              </div>
            )}
            <div className="relative group">
              <pre className="mt-6 bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto font-mono text-sm">
                <code>{code}</code>
              </pre>
              <button
                onClick={() => handleCopy(code, index)}
                className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm"
                title="Copy code"
              >
                {copiedIndex === index ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
        );
      }
      // Regular text
      return (
        <div key={index} className="whitespace-pre-wrap my-2 first:mt-0 last:mb-0">
          {part.trim()}
        </div>
      );
    });
  };

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
        
        <div className="text-sm md:text-base">
          {formatContent()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;