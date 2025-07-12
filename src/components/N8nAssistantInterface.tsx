import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Settings, Zap } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const N8nAssistantInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: `👋 Привет! Я ваш помощник по созданию автоматизаций в n8n.

Опишите, какую автоматизацию вы хотите создать, и я помогу вам с:
- Пошаговыми инструкциями по настройке
- Рекомендациями по выбору узлов (nodes)
- Готовыми шаблонами с n8nworkflows.xyz
- Советами по оптимизации вашего процесса

Например, вы можете спросить: "Как создать автопостинг из RSS в Telegram" или "Хочу настроить отправку данных из Google Sheets в CRM"`,
        timestamp: new Date()
      }
    ]);
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Example queries
  const exampleQueries = [
    "Автопостинг из RSS в Telegram",
    "Как настроить отправку данных из формы в CRM",
    "Автоматическая публикация в соцсети ВКонтакте",
    "Email-рассылка при добавлении записи в Google Sheets"
  ];

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Call Netlify function
      const response = await fetch('/.netlify/functions/n8n-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputValue }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'Извините, я не смог обработать ваш запрос. Пожалуйста, попробуйте еще раз.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // If there are templates, add them to the message
      if (data.templates && data.templates.length > 0) {
        const templatesContent = `
**Найдены подходящие шаблоны:**

${data.templates.map((template: any, index: number) => `
${index + 1}. **${template.title}**
   ${template.description}
   [Открыть шаблон](${template.url})
`).join('\n')}
        `;

        const templatesMessage: Message = {
          id: (Date.now() + 2).toString(),
          role: 'assistant',
          content: templatesContent,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, templatesMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Произошла ошибка при обработке вашего запроса. Пожалуйста, попробуйте позже.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleExampleClick = (query: string) => {
    setInputValue(query);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Format message content with markdown
  const formatMessage = (content: string) => {
    let formattedContent = content
      // Bold text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic text
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">$1</a>')
      // Lists
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      // Code blocks
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg my-2 overflow-x-auto"><code>$1</code></pre>');
    
    // Convert line breaks to paragraphs
    const paragraphs = formattedContent.split('\n\n');
    formattedContent = paragraphs.map(p => {
      if (p.trim().startsWith('<li>')) {
        return `<ul class="list-disc pl-5 my-2">${p}</ul>`;
      }
      if (p.trim().startsWith('<pre')) {
        return p;
      }
      return `<p>${p.replace(/\n/g, '<br>')}</p>`;
    }).join('');
    
    return formattedContent;
  };

  return (
    <div className="n8n-assistant-container bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="chat-header bg-primary-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 animate-spin-slow" />
          <span className="font-semibold">N8N Ассистент</span>
        </div>
        <div className="chat-status flex items-center gap-2 text-sm">
          <span className="status-dot w-2 h-2 bg-green-400 rounded-full"></span>
          <span>Онлайн</span>
        </div>
      </div>
      
      {/* Messages */}
      <div className="chat-messages p-4 h-[400px] overflow-y-auto bg-gray-50 dark:bg-gray-900" id="chat-messages">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`message mb-4 ${
              message.role === 'user' 
                ? 'user-message ml-auto max-w-[80%]' 
                : 'assistant-message mr-auto max-w-[80%]'
            }`}
          >
            <div className={`message-content p-3 rounded-lg ${
              message.role === 'user'
                ? 'bg-primary-600 text-white rounded-tr-none'
                : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none'
            }`}>
              <div className="message-sender text-xs opacity-70 mb-1">
                {message.role === 'user' ? 'Вы' : 'N8N Ассистент'}
              </div>
              <div 
                className="message-text"
                dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
              />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message assistant-message mr-auto max-w-[80%]">
            <div className="message-content p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-tl-none">
              <div className="message-sender text-xs opacity-70 mb-1">
                N8N Ассистент
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="chat-input-container p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="chat-input flex gap-2">
          <textarea
            ref={inputRef}
            id="user-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Опишите автоматизацию, которую хотите создать..."
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white min-h-[80px] md:min-h-[120px]"
            rows={3}
          />
          <button
            id="send-button"
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="send-btn bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white p-3 rounded-lg flex-shrink-0 flex items-center justify-center w-12 h-12 self-end"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        
        {/* Examples */}
        <div className="examples-container mt-4">
          <div className="examples-title text-sm text-gray-600 dark:text-gray-400 mb-2">Популярные запросы:</div>
          <div className="examples flex flex-wrap gap-2">
            {exampleQueries.map((query, index) => (
              <div 
                key={index}
                className="example-chip px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                onClick={() => handleExampleClick(query)}
              >
                {query}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default N8nAssistantInterface;