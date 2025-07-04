import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  articlePublishedTime?: string;
  articleModifiedTime?: string;
  articleAuthor?: string;
  articleTags?: string[];
  twitterCard?: 'summary' | 'summary_large_image';
  noIndex?: boolean;
  structuredData?: Record<string, any>;
  children?: React.ReactNode;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogImage = 'https://aimarkethub.pro/images/aimarkethub-hero.jpg',
  ogType = 'website',
  articlePublishedTime,
  articleModifiedTime,
  articleAuthor,
  articleTags,
  twitterCard = 'summary_large_image',
  noIndex = false,
  structuredData,
  children
}) => {
  const siteUrl = 'https://aimarkethub.pro';
  const fullCanonicalUrl = canonicalUrl ? (canonicalUrl.startsWith('http') ? canonicalUrl : `${siteUrl}${canonicalUrl}`) : undefined;
  
  return (
    <Helmet>
      {/* Базовые мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Canonical URL */}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}
      
      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl || siteUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="AI Market Hub" />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Дополнительные Open Graph теги для статей */}
      {ogType === 'article' && articlePublishedTime && (
        <meta property="article:published_time" content={articlePublishedTime} />
      )}
      {ogType === 'article' && articleModifiedTime && (
        <meta property="article:modified_time" content={articleModifiedTime} />
      )}
      {ogType === 'article' && articleAuthor && (
        <meta property="article:author" content={articleAuthor} />
      )}
      {ogType === 'article' && articleTags && articleTags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Структурированные данные */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
      
      {/* Дополнительные мета-теги */}
      {children}
    </Helmet>
  );
};

export default SEOHead;