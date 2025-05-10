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

    // Split content by code blocks, including empty lines as separators
    const blocks = message.content.split(/(?=```[\s\S]*?```)/);
    
    return blocks.map((block, index) => {
      // Check if this block contains a code section
      const codeMatch = block.match(/```([\s\S]*?)```/);
      
      if (codeMatch) {
        // Extract the text before the code block
        const textBefore = block.slice(0, block.indexOf('```')).trim();
        
        // Extract language and code
        const codeContent = codeMatch[1];
        const firstLineEnd = codeContent.indexOf('\n');
        const language = firstLineEnd > -1 ? codeContent.slice(0, firstLineEnd).trim() : '';
        const code = firstLineEnd > -1 ? codeContent.slice(firstLineEnd + 1).trim() : codeContent.trim();
        
        return (
          <div key={index} className="space-y-2">
            {textBefore && (
              <div className="whitespace-pre-wrap">{textBefore}</div>
            )}
            <div className="relative rounded-lg overflow-hidden">
              {language && (
                <div className="absolute top-0 right-0 px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-bl-lg">
                  {language}
                </div>
              )}
              <div className="relative group">
                <pre className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-x-auto font-mono text-sm">
                  <code>{code}</code>
                </pre>
                <button
                  onClick={() => handleCopy(code, index)}
                  className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
          </div>
        );
      }
      
      // Regular text block
      return block.trim() ? (
        <div key={index} className="whitespace-pre-wrap">
          {block.trim()}
        </div>
      ) : null;
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
        
        <div className="text-sm md:text-base space-y-2">
          {formatContent()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;