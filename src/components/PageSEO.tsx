import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateWebAppSchema, generateBreadcrumbSchema } from '../utils/seoUtils';

interface PageSEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  imageUrl?: string;
  breadcrumbs?: { name: string; url: string }[];
  isWebApp?: boolean;
  webAppData?: {
    name: string;
    applicationCategory: string;
    features: string[];
    screenshot?: string;
    rating?: { value: number; count: number };
  };
  children?: React.ReactNode;
}

const PageSEO: React.FC<PageSEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  imageUrl = 'https://aimarkethub.pro/images/aimarkethub-hero.jpg',
  breadcrumbs,
  isWebApp = false,
  webAppData,
  children
}) => {
  // Генерируем структурированные данные для хлебных крошек
  const defaultBreadcrumbs = [
    { name: 'Главная', url: 'https://aimarkethub.pro' },
    { name: title, url: canonicalUrl }
  ];
  
  const breadcrumbItems = breadcrumbs || defaultBreadcrumbs;
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  // Генерируем структурированные данные для веб-приложения, если нужно
  let webAppSchema = null;
  if (isWebApp && webAppData) {
    webAppSchema = generateWebAppSchema({
      name: webAppData.name,
      description,
      url: canonicalUrl,
      applicationCategory: webAppData.applicationCategory,
      operatingSystem: 'Any',
      offers: { price: '0', priceCurrency: 'RUB' },
      features: webAppData.features,
      screenshot: webAppData.screenshot,
      rating: webAppData.rating
    });
  }

  return (
    <Helmet>
      {/* Базовые мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="AI Market Hub" />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@aimarkethub" />
      
      {/* Структурированные данные */}
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
      
      {webAppSchema && (
        <script type="application/ld+json">
          {JSON.stringify(webAppSchema)}
        </script>
      )}
      
      {/* Дополнительные мета-теги */}
      {children}
    </Helmet>
  );
};

export default PageSEO;