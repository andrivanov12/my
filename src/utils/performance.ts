// Утилиты для оптимизации производительности

// Дебаунс для оптимизации событий
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Троттлинг для ограничения частоты вызовов
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Предзагрузка ресурсов
export const preloadResource = (href: string, as: string, type?: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  if (type) link.type = type;
  document.head.appendChild(link);
};

// Оптимизация изображений
export const createOptimizedImageUrl = (
  originalUrl: string, 
  width?: number, 
  height?: number,
  quality: number = 80
): string => {
  // Для Pexels изображений добавляем параметры оптимизации
  if (originalUrl.includes('pexels.com')) {
    const url = new URL(originalUrl);
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    url.searchParams.set('auto', 'compress');
    url.searchParams.set('cs', 'tinysrgb');
    url.searchParams.set('q', quality.toString());
    
    // Проверяем поддержку WebP
    if (supportsWebP()) {
      url.searchParams.set('format', 'webp');
    }
    
    return url.toString();
  }
  
  return originalUrl;
};

// Проверка поддержки WebP
export const supportsWebP = (): boolean => {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

// Мониторинг производительности
export const measurePerformance = (name: string, fn: () => void) => {
  if ('performance' in window && 'mark' in performance) {
    performance.mark(`${name}-start`);
    fn();
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name)[0];
    console.log(`${name} took ${measure.duration.toFixed(2)}ms`);
  } else {
    fn();
  }
};

// Очистка неиспользуемых ресурсов
export const cleanupResources = () => {
  // Очистка performance entries
  if ('performance' in window && 'clearMarks' in performance) {
    performance.clearMarks();
    performance.clearMeasures();
  }
};

// Проверка поддержки современных возможностей браузера
export const getModernFeatureSupport = () => {
  return {
    webp: supportsWebP(),
    intersectionObserver: 'IntersectionObserver' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webWorker: 'Worker' in window,
    localStorage: (() => {
      try {
        localStorage.setItem('test', 'test');
        localStorage.removeItem('test');
        return true;
      } catch {
        return false;
      }
    })()
  };
};

// Адаптивная загрузка ресурсов в зависимости от соединения
export const getConnectionAwareSettings = () => {
  const connection = (navigator as any).connection;
  
  if (!connection) {
    return { quality: 80, preload: true };
  }
  
  const effectiveType = connection.effectiveType;
  
  switch (effectiveType) {
    case 'slow-2g':
    case '2g':
      return { quality: 40, preload: false };
    case '3g':
      return { quality: 60, preload: false };
    case '4g':
    default:
      return { quality: 80, preload: true };
  }
};