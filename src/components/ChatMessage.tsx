import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, Copy, Check, FileText, Image, Film, Music, File, Download } from 'lucide-react';
import { Message, Attachment } from '../services/chatService';

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

  const handleCopy = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Film className="h-4 w-4" />;
    if (type.startsWith('audio/')) return <Music className="h-4 w-4" />;
    if (type.startsWith('text/') || type.includes('document')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const renderAttachment = (attachment: Attachment) => {
    if (attachment.type.startsWith('image/')) {
      return (
        <div className="relative group">
          <img
            src={attachment.url}
            alt={attachment.name}
            className="max-w-full h-auto rounded-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
            <a
              href={attachment.url}
              download={attachment.name}
              className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:scale-110 transition-transform duration-200"
              title="Скачать изображение"
            >
              <Download className="h-5 w-5 text-gray-700 dark:text-gray-300" />
            </a>
          </div>
        </div>
      );
    }

    if (attachment.type.startsWith('video/')) {
      return (
        <video
          controls
          className="max-w-full rounded-lg"
          src={attachment.url}
        >
          Your browser does not support the video tag.
        </video>
      );
    }

    if (attachment.type.startsWith('audio/')) {
      return (
        <audio
          controls
          className="w-full"
          src={attachment.url}
        >
          Your browser does not support the audio tag.
        </audio>
      );
    }

    return (
      <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
        {getFileIcon(attachment.type)}
        <span className="flex-1 text-sm truncate">{attachment.name}</span>
        <a
          href={attachment.url}
          download={attachment.name}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors duration-200"
          title="Скачать файл"
        >
          <Download className="h-4 w-4 text-gray-500 dark:text-gray-400" />
        </a>
      </div>
    );
  };

  const formatContent = () => {
    if (isUser) {
      return (
        <>
          <div className="whitespace-pre-wrap">{message.content}</div>
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment, index) => (
                <div key={index}>
                  {renderAttachment(attachment)}
                </div>
              ))}
            </div>
          )}
        </>
      );
    }

    const parts = message.content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
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
      
      return part.trim() ? (
        <div 
          key={index} 
          className="prose dark:prose-invert max-w-none my-2 first:mt-0 last:mb-0 text-gray-800 dark:text-gray-200"
        >
          {part.split('\n').map((line, lineIndex) => {
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