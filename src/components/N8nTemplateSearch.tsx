import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import N8nTemplateCard from './N8nTemplateCard';

interface Template {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
}

interface N8nTemplateSearchProps {
  className?: string;
}

/**
 * Компонент для поиска шаблонов n8n
 */
const N8nTemplateSearch: React.FC<N8nTemplateSearchProps> = ({ className = '' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      setError('Введите минимум 3 символа для поиска');
      return;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      const response = await fetch('/.netlify/functions/n8n-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при поиске шаблонов');
      }
      
      setTemplates(data.templates || []);
      setShowResults(true);
    } catch (err) {
      console.error('Error searching templates:', err);
      setError('Произошла ошибка при поиске шаблонов. Пожалуйста, попробуйте позже.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 ${className}`}>
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        Поиск шаблонов n8n
      </h3>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Например: интеграция с Telegram, автопостинг ВКонтакте..."
            className="w-full p-3 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
        
        <button
          type="submit"
          disabled={isSearching || !searchQuery.trim()}
          className="mt-3 w-full bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isSearching ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Поиск шаблонов...</span>
            </>
          ) : (
            <>
              <Search className="h-5 w-5" />
              <span>Найти шаблоны</span>
            </>
          )}
        </button>
      </form>
      
      {showResults && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900 dark:text-white">
            {templates.length > 0 
              ? `Найдено шаблонов: ${templates.length}` 
              : 'Шаблоны не найдены'}
          </h4>
          
          {templates.length > 0 ? (
            <div className="grid gap-4">
              {templates.map((template, index) => (
                <N8nTemplateCard
                  key={index}
                  title={template.title}
                  description={template.description}
                  url={template.url}
                  imageUrl={template.imageUrl}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              По вашему запросу не найдено шаблонов. Попробуйте изменить поисковый запрос.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default N8nTemplateSearch;