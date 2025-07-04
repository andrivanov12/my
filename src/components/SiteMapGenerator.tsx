import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Компонент для автоматической генерации sitemap.xml
 * Отслеживает посещенные страницы и добавляет их в sitemap
 */
const SiteMapGenerator: React.FC = () => {
  const location = useLocation();
  const [visitedPages, setVisitedPages] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Добавляем текущий путь в список посещенных страниц
    setVisitedPages(prev => {
      const newSet = new Set(prev);
      newSet.add(location.pathname);
      return newSet;
    });

    // Сохраняем посещенные страницы в localStorage
    try {
      const currentPages = JSON.parse(localStorage.getItem('visited_pages') || '[]');
      if (!currentPages.includes(location.pathname)) {
        const updatedPages = [...currentPages, location.pathname];
        localStorage.setItem('visited_pages', JSON.stringify(updatedPages));
      }
    } catch (error) {
      console.error('Error saving visited pages:', error);
    }
  }, [location.pathname]);

  return null; // Компонент не рендерит ничего в DOM
};

export default SiteMapGenerator;