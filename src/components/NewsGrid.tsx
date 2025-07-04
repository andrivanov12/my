import React from 'react';
import NewsCard from './NewsCard';
import { NewsItem } from '../utils/newsService';

interface NewsGridProps {
  news: NewsItem[];
  loading: boolean;
  onNewsClick?: (news: NewsItem) => void;
}

const NewsGrid: React.FC<NewsGridProps> = ({ news, loading, onNewsClick }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!news || news.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 dark:bg-gray-900 rounded-xl">
        <div className="w-16 h-16 mx-auto mb-4 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
          Новости не найдены
        </p>
        <p className="text-gray-500 dark:text-gray-500">
          В данный момент нет доступных новостей. Пожалуйста, проверьте позже.
        </p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.map((item, index) => (
        <NewsCard
          key={index}
          title={item.title}
          excerpt={item.excerpt}
          imageUrl={item.imageUrl}
          publishDate={item.publishDate}
          category={item.category}
          source={item.source}
          url={item.url}
          onClick={() => onNewsClick && onNewsClick(item)}
        />
      ))}
    </div>
  );
};

export default NewsGrid;