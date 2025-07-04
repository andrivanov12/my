import React from 'react';
import { Link } from 'react-router-dom';

interface KeywordTagsProps {
  keywords: string[];
  linkPrefix?: string;
  className?: string;
}

/**
 * Компонент для отображения ключевых слов в виде тегов
 */
const KeywordTags: React.FC<KeywordTagsProps> = ({
  keywords,
  linkPrefix = '/blog/tag',
  className = ''
}) => {
  if (!keywords || keywords.length === 0) {
    return null;
  }

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {keywords.map((keyword, index) => {
        const slug = keyword
          .toLowerCase()
          .replace(/[^\wа-яё\s-]/g, '')
          .replace(/[\s_-]+/g, '-')
          .replace(/^-+|-+$/g, '');
        
        return (
          <Link
            key={index}
            to={`${linkPrefix}/${slug}`}
            className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 px-2 py-1 rounded text-xs transition-colors duration-200"
          >
            #{keyword}
          </Link>
        );
      })}
    </div>
  );
};

export default KeywordTags;