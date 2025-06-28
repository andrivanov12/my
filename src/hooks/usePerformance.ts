import { useEffect } from 'react';

export const usePerformance = () => {
  useEffect(() => {
    // Предварительная загрузка критических ресурсов
    const preloadCriticalResources = () => {
      // Предзагрузка шрифтов
      const fontLink = document.createElement('link');
      fontLink.rel = 'preload';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
      fontLink.as = 'style';
      fontLink.crossOrigin = 'anonymous';
      document.head.appendChild(fontLink);

      // Предзагрузка DNS для внешних ресурсов
      const dnsPrefetch = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://mc.yandex.ru',
        'https://yandex.ru'
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

    // Удаление неиспользуемых стилей
    const removeUnusedStyles = () => {
      // Удаляем неиспользуемые CSS классы (только в продакшене)
      if (process.env.NODE_ENV === 'production') {
        const unusedSelectors = [
          '.unused-class',
          '.debug-only'
        ];

        const styleSheets = Array.from(document.styleSheets);
        styleSheets.forEach(sheet => {
          try {
            const rules = Array.from(sheet.cssRules || []);
            rules.forEach((rule, index) => {
              if (rule instanceof CSSStyleRule) {
                unusedSelectors.forEach(selector => {
                  if (rule.selectorText?.includes(selector)) {
                    sheet.deleteRule(index);
                  }
                });
              }
            });
          } catch (e) {
            // Игнорируем ошибки CORS для внешних стилей
          }
        });
      }
    };

    // Оптимизация скриптов
    const optimizeScripts = () => {
      // Отложенная загрузка неважных скриптов
      const deferredScripts = [
        'https://mc.yandex.ru/metrika/tag.js',
        'https://yandex.ru/ads/system/context.js'
      ];

      deferredScripts.forEach(src => {
        const script = document.querySelector(`script[src="${src}"]`);
        if (script && !script.hasAttribute('defer')) {
          script.setAttribute('defer', 'true');
        }
      });
    };

    // Запускаем оптимизации
    preloadCriticalResources();
    
    // Запускаем остальные оптимизации после загрузки DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        optimizeImages();
        removeUnusedStyles();
        optimizeScripts();
      });
    } else {
      optimizeImages();
      removeUnusedStyles();
      optimizeScripts();
    }

    // Мониторинг производительности
    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
          const paint = performance.getEntriesByType('paint');
          
          console.log('Performance metrics:', {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime
          });
        }, 0);
      });
    }

  }, []);
};