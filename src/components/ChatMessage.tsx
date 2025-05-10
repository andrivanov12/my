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

    // Split content by code blocks
    const parts = message.content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      // Check if this is a code block
      if (part.startsWith('```') && part.endsWith('```')) {
        // Extract language and code
        const content = part.slice(3, -3).trim();
        const firstLineEnd = content.indexOf('\n');
        const language = firstLineEnd > -1 ? content.slice(0, firstLineEnd).trim() : '';
        const code = firstLineEnd > -1 ? content.slice(firstLineEnd + 1).trim() : content.trim();

        return (
          <div key={index} className="my-4 first:mt-2 last:mb-2">
            <div className="relative rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                {language && (
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {language}
                  </span>
                )}
                <button
                  onClick={() => handleCopy(code, index)}
                  className="flex items-center gap-1.5 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Скопировано!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Копировать</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="p-4 m-0 overflow-x-auto font-mono text-sm">
                <code>{code}</code>
              </pre>
            </div>
          </div>
        );
      }
      
      // Regular text with enhanced formatting
      return part.trim() ? (
        <div 
          key={index} 
          className="prose dark:prose-invert max-w-none my-2 first:mt-0 last:mb-0 text-gray-800 dark:text-gray-200"
        >
          {part.split('\n').map((line, lineIndex) => {
            // Check for list items
            if (line.startsWith('• ') || line.startsWith('⊚ ')) {
              return (
                <div 
                  key={lineIndex}
                  className="flex items-start gap-2 my-1.5 pl-2"
                >
                  <span className="text-primary-500 dark:text-primary-400 font-medium leading-relaxed">
                    {line.startsWith('⊚ ') ? '⊚' : '•'}
                  </span>
                  <span className="flex-1">{line.slice(2)}</span>
                </div>
              );
            }
            
            // Regular paragraph
            return line.trim() ? (
              <p key={lineIndex} className="my-2 leading-relaxed">
                {line}
              </p>
            ) : null;
          }).filter(Boolean)}
        </div>
      ) : null;
    }).filter(Boolean);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[90%] sm:max-w-[85%] md:max-w-[75%] rounded-lg p-2 md:p-3 ${
          isUser 
            ? 'bg-primary-100 dark:bg-primary-900/40 text-gray-800 dark:text-gray-100 rounded-tr-none' 
            : 'bg-white dark:bg-gray-700 shadow-sm rounded-tl-none'
        } ${message.isError ? 'border border-red-300 dark:border-red-700' : ''}`}
      >
        <div className="flex items-center gap-1.5 md:gap-2 mb-2">
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