import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

interface NewsCardProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  publishDate: string;
  category: string;
  source: string;
  url: string;
  onClick?: () => void;
}

const NewsCard: React.FC<NewsCardProps> = ({
  title,
  excerpt,
  imageUrl,
  publishDate,
  category,
  source,
  url,
  onClick
}) => {
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'n8n':
        return 'bg-primary-600';
      case 'ai':
        return 'bg-secondary-600';
      case 'automation':
        return 'bg-purple-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <article 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer flex flex-col h-full"
      onClick={handleClick}
    >
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-48 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/images/news-placeholder.jpg';
          }}
        />
        <div className="absolute top-4 left-4">
          <span className={`${getCategoryColor(category)} text-white px-2 py-1 rounded text-xs font-medium`}>
            {category}
          </span>
        </div>
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold mb-3 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 line-clamp-2">
          {title}
        </h3>
        
        <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3 flex-grow">
          {excerpt}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4" />
            {formatDate(publishDate)}
          </div>
          
          <div className="flex items-center gap-1 text-primary-600 dark:text-primary-400 font-medium">
            Читать
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;