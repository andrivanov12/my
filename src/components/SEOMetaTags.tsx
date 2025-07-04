import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOMetaTagsProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  children?: React.ReactNode;
}

/**
 * Компонент для добавления SEO мета-тегов на страницу
 */
const SEOMetaTags: React.FC<SEOMetaTagsProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = 'https://aimarkethub.pro/images/aimarkethub-hero.jpg',
  ogType = 'website',
  twitterCard = 'summary_large_image',
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
      <meta name="twitter:site" content="@aimarkethub" />
      
      {/* Дополнительные мета-теги */}
      {children}
    </Helmet>
  );
};

export default SEOMetaTags;