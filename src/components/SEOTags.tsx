import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOTagsProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: Record<string, any>[];
  children?: React.ReactNode;
}

/**
 * Компонент для добавления SEO-тегов на страницу
 */
const SEOTags: React.FC<SEOTagsProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = 'https://aimarkethub.pro/images/aimarkethub-hero.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData = [],
  children
}) => {
  return (
    <Helmet>
      {/* Основные мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph мета-теги */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="AI Market Hub" />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Twitter Card мета-теги */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Структурированные данные */}
      {structuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
      
      {/* Дополнительные мета-теги */}
      {children}
    </Helmet>
  );
};

export default SEOTags;