import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  data: Record<string, any> | Record<string, any>[];
}

/**
 * Компонент для добавления структурированных данных на страницу
 */
const StructuredData: React.FC<StructuredDataProps> = ({ data }) => {
  // Если передан массив данных, рендерим несколько скриптов
  if (Array.isArray(data)) {
    return (
      <Helmet>
        {data.map((item, index) => (
          <script key={index} type="application/ld+json">
            {JSON.stringify(item)}
          </script>
        ))}
      </Helmet>
    );
  }
  
  // Если передан один объект, рендерим один скрипт
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
};

export default StructuredData;