import React from 'react';
import { Helmet } from 'react-helmet-async';
import { generateArticleSchema, generateBreadcrumbSchema } from '../utils/seoUtils';

interface BlogSEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  imageUrl?: string;
  publishDate: string;
  modifiedDate?: string;
  author: string;
  category?: string;
  tags?: string[];
  slug: string;
}

const BlogSEO: React.FC<BlogSEOProps> = ({
  title,
  description,
  keywords,
  canonicalUrl,
  imageUrl = 'https://aimarkethub.pro/images/blog-placeholder.jpg',
  publishDate,
  modifiedDate,
  author,
  category,
  tags,
  slug
}) => {
  // Генерируем структурированные данные для статьи
  const articleSchema = generateArticleSchema({
    title,
    description,
    url: canonicalUrl,
    imageUrl,
    datePublished: publishDate,
    dateModified: modifiedDate || publishDate,
    author,
    publisher: 'AI Market Hub',
    publisherLogo: 'https://aimarkethub.pro/images/logo.png',
    keywords: tags
  });

  // Генерируем хлебные крошки
  const breadcrumbItems = [
    { name: 'Главная', url: 'https://aimarkethub.pro' },
    { name: 'Блог', url: 'https://aimarkethub.pro/blog' }
  ];

  if (category) {
    breadcrumbItems.push({
      name: category,
      url: `https://aimarkethub.pro/blog/${category.toLowerCase().replace(/\s+/g, '-')}`
    });
  }

  breadcrumbItems.push({ name: title, url: canonicalUrl });

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

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
      <meta property="og:type" content="article" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:site_name" content="AI Market Hub" />
      <meta property="og:locale" content="ru_RU" />
      <meta property="article:published_time" content={publishDate} />
      {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
      <meta property="article:author" content={author} />
      {category && <meta property="article:section" content={category} />}
      {tags && tags.map((tag, index) => (
        <meta key={index} property="article:tag" content={tag} />
      ))}
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:site" content="@aimarkethub" />
      <meta name="twitter:creator" content="@aimarkethub" />
      
      {/* Структурированные данные */}
      <script type="application/ld+json">
        {JSON.stringify(articleSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(breadcrumbSchema)}
      </script>
    </Helmet>
  );
};

export default BlogSEO;