import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface RelatedContentItem {
  id: string;
  title: string;
  url: string;
  imageUrl?: string;
  category?: string;
}

interface RelatedContentProps {
  title?: string;
  items: RelatedContentItem[];
  className?: string;
}

/**
 * Компонент для отображения связанного контента
 */
const RelatedContent: React.FC<RelatedContentProps> = ({
  title = 'Рекомендуем также',
  items,
  className = ''
}) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className={`mt-8 ${className}`}>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {items.map(item => (
          <Link
            key={item.id}
            to={item.url}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col"
          >
            {item.imageUrl && (
              <div className="relative h-32">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/images/blog-placeholder.jpg';
                  }}
                />
                {item.category && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </div>
                )}
              </div>
            )}
            <div className="p-3 flex-grow flex flex-col">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                {item.title}
              </h4>
              <div className="mt-auto flex items-center justify-end text-primary-600 dark:text-primary-400 text-sm">
                <span>Подробнее</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedContent;