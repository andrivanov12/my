import { useEffect } from 'react';

export const usePerformance = () => {
  useEffect(() => {
    // Предварительная загрузка критических ресурсов
    const preloadCriticalResources = () => {
      // Предзагрузка DNS для внешних ресурсов
      const dnsPrefetch = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];

      dnsPrefetch.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Оптимизация изображений
    const optimizeImages = () => {
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        // Добавляем loading="lazy" если не установлено
        if (!img.hasAttribute('loading')) {
          img.setAttribute('loading', 'lazy');
        }
        
        // Добавляем decoding="async"
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
      });
    };

    // Запускаем оптимизации
    preloadCriticalResources();
    
    // Запускаем остальные оптимизации после загрузки DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        optimizeImages();
      });
    } else {
      optimizeImages();
    }

  }, []);
};