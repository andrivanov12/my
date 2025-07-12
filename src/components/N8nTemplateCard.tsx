import React from 'react';
import { ExternalLink, Download, Info } from 'lucide-react';

interface N8nTemplateProps {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  onDetailsClick?: () => void;
}

/**
 * Компонент для отображения карточки шаблона n8n
 */
const N8nTemplateCard: React.FC<N8nTemplateProps> = ({
  title,
  description,
  url,
  imageUrl,
  onDetailsClick
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-200">
      {/* Изображение шаблона */}
      <div className="relative h-40 bg-gray-100 dark:bg-gray-700">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/n8n-placeholder.jpg';
          }}
        />
        <div className="absolute top-2 right-2">
          <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded">
            n8n шаблон
          </span>
        </div>
      </div>
      
      {/* Контент */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
          {description}
        </p>
        
        {/* Кнопки действий */}
        <div className="flex justify-between">
          <button
            onClick={onDetailsClick}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm flex items-center gap-1"
          >
            <Info className="h-4 w-4" />
            <span>Подробнее</span>
          </button>
          
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm flex items-center gap-1"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Открыть</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default N8nTemplateCard;