import React, { useRef, useEffect, useState } from 'react';

interface AdaptiveAdBlockProps {
  blockId: string;
  containerId: string;
  position: 'top' | 'bottom' | 'sidebar';
  className?: string;
}

const AdaptiveAdBlock: React.FC<AdaptiveAdBlockProps> = ({ 
  blockId, 
  containerId, 
  position,
  className = '' 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Определяем тип устройства
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Проверяем, что мы находимся на продакшн домене
    const isProductionDomain = window.location.hostname === 'aimarkethub.pro' || 
                              window.location.hostname === 'www.aimarkethub.pro';
    
    if (!isProductionDomain) {
      console.log(`Реклама ${blockId} не загружается на localhost`);
      return;
    }

    // Инициализируем Яндекс.РТБ
    if (!window.yaContextCb) {
      window.yaContextCb = [];
    }

    // Добавляем скрипт Яндекс.РТБ если его еще нет
    if (!document.querySelector('script[src*="yandex.ru/ads/system/context.js"]')) {
      const script = document.createElement('script');
      script.src = 'https://yandex.ru/ads/system/context.js';
      script.async = true;
      script.onload = () => {
        console.log('Яндекс.РТБ скрипт загружен');
        setIsLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }

    // Задержка для загрузки скрипта
    const timer = setTimeout(() => {
      window.yaContextCb.push(() => {
        try {
          if (window.Ya && window.Ya.Context && window.Ya.Context.AdvManager) {
            window.Ya.Context.AdvManager.render({
              "blockId": blockId,
              "renderTo": containerId
            });
            console.log(`Рекламный блок ${blockId} инициализирован`);
          } else {
            console.warn('Яндекс.РТБ API недоступен');
          }
        } catch (error) {
          console.error('Ошибка инициализации рекламного блока:', error);
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [blockId, containerId]);

  // Не показываем блок рекламы на localhost
  const isProductionDomain = window.location.hostname === 'aimarkethub.pro' || 
                            window.location.hostname === 'www.aimarkethub.pro';
  
  if (!isProductionDomain) {
    return (
      <div className={`w-full bg-gray-100 dark:bg-gray-800 p-3 rounded-lg ${className}`}>
        <div 
          className="w-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded"
          style={getAdDimensions(position, isMobile)}
        >
          <div className="text-gray-500 dark:text-gray-400 text-center">
            <div className="text-sm font-medium mb-1">Рекламный блок</div>
            <div className="text-xs">{position} - {isMobile ? 'мобильная' : 'десктопная'} версия</div>
            <div className="text-xs mt-1">ID: {blockId}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${getContainerClasses(position, isMobile)} ${className}`}>
      <div 
        id={containerId}
        className="w-full flex items-center justify-center bg-transparent"
        style={getAdDimensions(position, isMobile)}
      >
        {/* Fallback контент пока загружается реклама */}
        {!isLoaded && (
          <div className="text-gray-300 dark:text-gray-700 text-center">
            <div className="animate-pulse text-xs">Загрузка рекламы...</div>
          </div>
        )}
      </div>
    </div>
  );
};

// Функция для получения размеров рекламного блока
const getAdDimensions = (position: string, isMobile: boolean) => {
  const dimensions = {
    top: isMobile 
      ? { maxWidth: '320px', height: '100px', margin: '0 auto' }
      : { maxWidth: '728px', height: '90px', margin: '0 auto' },
    bottom: isMobile 
      ? { maxWidth: '320px', height: '100px', margin: '0 auto' }
      : { maxWidth: '728px', height: '90px', margin: '0 auto' },
    sidebar: isMobile 
      ? { maxWidth: '300px', height: '250px', margin: '0 auto' }
      : { maxWidth: '300px', height: '250px', margin: '0 auto' }
  };

  return dimensions[position as keyof typeof dimensions] || dimensions.top;
};

// Функция для получения CSS классов контейнера
const getContainerClasses = (position: string, isMobile: boolean) => {
  const baseClasses = 'bg-gray-50 dark:bg-gray-900 rounded-lg';
  
  if (position === 'top' || position === 'bottom') {
    return isMobile 
      ? `${baseClasses} p-2 mb-4`
      : `${baseClasses} p-3 mb-6`;
  }
  
  if (position === 'sidebar') {
    return `${baseClasses} p-3`;
  }
  
  return baseClasses;
};

export default AdaptiveAdBlock;