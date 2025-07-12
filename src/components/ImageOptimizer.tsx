import React, { useState, useEffect } from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  lazy?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Компонент для оптимизации изображений
 * - Ленивая загрузка
 * - Оптимизированные размеры
 * - Поддержка WebP
 * - Плейсхолдеры
 */
const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  lazy = true,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [supportsWebP, setSupportsWebP] = useState(false);
  
  // Проверяем поддержку WebP
  useEffect(() => {
    const checkWebP = async () => {
      try {
        const webPSupport = document.createElement('canvas')
          .toDataURL('image/webp')
          .indexOf('data:image/webp') === 0;
        setSupportsWebP(webPSupport);
      } catch (e) {
        setSupportsWebP(false);
      }
    };
    
    checkWebP();
  }, []);
  
  // Оптимизируем URL изображения
  const getOptimizedSrc = () => {
    // Если это URL Pexels, добавляем параметры оптимизации
    if (src.includes('pexels.com')) {
      const url = new URL(src);
      
      // Добавляем параметры для оптимизации
      if (width) url.searchParams.set('w', width.toString());
      if (height) url.searchParams.set('h', height.toString());
      url.searchParams.set('auto', 'compress');
      url.searchParams.set('cs', 'tinysrgb');
      url.searchParams.set('q', '80');
      
      // Добавляем формат WebP, если поддерживается
      if (supportsWebP) {
        url.searchParams.set('format', 'webp');
      }
      
      return url.toString();
    }
    
    // Для других изображений возвращаем исходный URL
    return src;
  };
  
  const optimizedSrc = getOptimizedSrc();
  
  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };
  
  const handleError = () => {
    setIsError(true);
    if (onError) onError();
  };
  
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Плейсхолдер */}
      {!isLoaded && !isError && (
        <div 
          className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse"
          style={{ backgroundImage: `url(${placeholder})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
          aria-hidden="true"
        />
      )}
      
      {/* Изображение */}
      <img
        src={isError ? placeholder : optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : 'eager'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export default ImageOptimizer;