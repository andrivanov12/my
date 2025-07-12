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
  preload?: Array<{href: string, as: string, type?: string}>;
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
  preload = [],
  children
}) => {
  return (
    <Helmet>
      {/* Основные мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      
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
      
      <meta name="twitter:creator" content="@aimarkethub" />
      
      {/* Дополнительные мета-теги для улучшения SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="author" content="AI Market Hub Team" />
      <meta name="copyright" content="© 2025 AI Market Hub" />
      <meta name="format-detection" content="telephone=no" />
      <meta name="theme-color" content="#7c3aed" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content="AI Market Hub" />
      <meta name="application-name" content="AI Market Hub" />
      {/* Предзагрузка критических ресурсов */}
      {preload.map((item, index) => (
        <link 
          key={index}
          rel="preload" 
          href={item.href} 
          as={item.as}
          type={item.type}
          crossOrigin={item.as === 'font' ? 'anonymous' : undefined}
        />
      ))}
      
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