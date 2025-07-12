/**
 * Утилиты для оптимизации производительности
 */

/**
 * Отложенная загрузка скриптов
 * @param src URL скрипта
 * @param async Асинхронная загрузка
 * @param defer Отложенная загрузка
 */
export const loadScript = (src: string, async = true, defer = true): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Проверяем, не загружен ли уже скрипт
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    
    script.onload = () => resolve();
    script.onerror = (error) => reject(error);
    
    document.head.appendChild(script);
  });
};

/**
 * Отложенная загрузка стилей
 * @param href URL стилей
 */
export const loadStyle = (href: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Проверяем, не загружены ли уже стили
    if (document.querySelector(`link[href="${href}"]`)) {
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    
    link.onload = () => resolve();
    link.onerror = (error) => reject(error);
    
    document.head.appendChild(link);
  });
};

/**
 * Отложенная загрузка изображения
 * @param src URL изображения
 */
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = (error) => reject(error);
  });
};

/**
 * Измерение времени загрузки страницы
 */
export const measurePageLoad = (): void => {
  if (typeof window !== 'undefined' && window.performance) {
    window.addEventListener('load', () => {
      const timing = window.performance.timing;
      const pageLoadTime = timing.loadEventEnd - timing.navigationStart;
      console.log(`Страница загружена за ${pageLoadTime}ms`);
      
      // Отправка метрики в аналитику (если нужно)
      if (window.gtag) {
        window.gtag('event', 'page_load_time', {
          value: pageLoadTime,
          page_path: window.location.pathname
        });
      }
    });
  }
};

/**
 * Отложенная загрузка компонентов, которые не видны на экране
 * @param callback Функция для выполнения
 * @param delay Задержка в мс
 */
export const deferOffscreenRendering = (callback: () => void, delay = 1000): void => {
  if (typeof window !== 'undefined') {
    if ('requestIdleCallback' in window) {
      // @ts-ignore
      window.requestIdleCallback(() => setTimeout(callback, delay));
    } else {
      setTimeout(callback, delay);
    }
  }
};

/**
 * Оптимизация изображений Pexels
 * @param url URL изображения
 * @param width Ширина
 * @param height Высота
 */
export const optimizePexelsImage = (url: string, width = 800, height = 600): string => {
  if (!url || !url.includes('pexels.com')) return url;
  
  // Добавляем параметры оптимизации
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}auto=compress&cs=tinysrgb&w=${width}&h=${height}&dpr=1`;
};

/**
 * Типы для window.gtag
 */
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}