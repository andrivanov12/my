/**
 * Утилиты для SEO оптимизации
 */

/**
 * Генерирует структурированные данные для FAQ
 * @param questions Массив вопросов и ответов
 * @returns Объект структурированных данных для FAQ
 */
export const generateFAQSchema = (questions: { question: string; answer: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  };
};

/**
 * Генерирует структурированные данные для статьи блога
 * @param article Данные статьи
 * @returns Объект структурированных данных для статьи
 */
export const generateArticleSchema = (article: {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  publisher: string;
  publisherLogo: string;
  keywords?: string[];
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.title,
    "description": article.description,
    "image": article.imageUrl,
    "author": {
      "@type": "Person",
      "name": article.author
    },
    "publisher": {
      "@type": "Organization",
      "name": article.publisher,
      "logo": {
        "@type": "ImageObject",
        "url": article.publisherLogo
      }
    },
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": article.url
    },
    "keywords": article.keywords?.join(", ")
  };
};

/**
 * Генерирует структурированные данные для веб-приложения
 * @param app Данные о веб-приложении
 * @returns Объект структурированных данных для веб-приложения
 */
export const generateWebAppSchema = (app: {
  name: string;
  description: string;
  url: string;
  applicationCategory: string;
  operatingSystem: string;
  offers: { price: string; priceCurrency: string };
  features: string[];
  screenshot?: string;
  rating?: { value: number; count: number };
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": app.name,
    "description": app.description,
    "url": app.url,
    "applicationCategory": app.applicationCategory,
    "operatingSystem": app.operatingSystem,
    "offers": {
      "@type": "Offer",
      "price": app.offers.price,
      "priceCurrency": app.offers.priceCurrency
    },
    "featureList": app.features,
    ...(app.screenshot && { "screenshot": app.screenshot }),
    ...(app.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": app.rating.value.toString(),
        "reviewCount": app.rating.count.toString(),
        "bestRating": "5",
        "worstRating": "1"
      }
    })
  };
};

/**
 * Генерирует структурированные данные для организации
 * @param org Данные об организации
 * @returns Объект структурированных данных для организации
 */
export const generateOrganizationSchema = (org: {
  name: string;
  url: string;
  logo: string;
  description: string;
  foundingDate?: string;
  contactPoint?: { contactType: string; url: string; availableLanguage?: string[] };
  sameAs?: string[];
}) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": org.name,
    "url": org.url,
    "logo": org.logo,
    "description": org.description,
    ...(org.foundingDate && { "foundingDate": org.foundingDate }),
    ...(org.contactPoint && { "contactPoint": {
      "@type": "ContactPoint",
      ...org.contactPoint
    }}),
    ...(org.sameAs && { "sameAs": org.sameAs })
  };
};

/**
 * Генерирует структурированные данные для хлебных крошек
 * @param items Элементы хлебных крошек
 * @returns Объект структурированных данных для хлебных крошек
 */
export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
};

/**
 * Генерирует мета-теги для страницы
 * @param title Заголовок страницы
 * @param description Описание страницы
 * @param keywords Ключевые слова
 * @returns Объект с мета-тегами
 */
export const generateMetaTags = (title: string, description: string, keywords?: string) => {
  return {
    title,
    description,
    keywords
  };
};

/**
 * Генерирует URL-friendly slug из строки
 * @param text Исходный текст
 * @returns Slug для URL
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-zа-я0-9\s-]/g, '') // Удаляем специальные символы
    .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
    .replace(/-+/g, '-') // Убираем множественные дефисы
    .replace(/^-|-$/g, '') // Убираем дефисы в начале и конце
    .trim();
};

/**
 * Генерирует мета-описание из контента
 * @param content Контент страницы
 * @param maxLength Максимальная длина описания
 * @returns Мета-описание
 */
export const generateMetaDescription = (content: string, maxLength: number = 160): string => {
  // Удаляем HTML теги и markdown
  const cleanContent = content
    .replace(/<[^>]*>/g, '') // Удаляем HTML теги
    .replace(/[#*`]/g, '') // Удаляем markdown символы
    .replace(/\*\*(.+?)\*\*/g, '$1') // Убираем жирный текст
    .replace(/\n+/g, ' ') // Заменяем переносы строк на пробелы
    .replace(/\s+/g, ' ') // Убираем множественные пробелы
    .trim();
  
  if (cleanContent.length <= maxLength) {
    return cleanContent;
  }
  
  // Ищем последний пробел перед лимитом, чтобы не обрезать слова
  const truncated = cleanContent.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > maxLength * 0.8) {
    return truncated.substring(0, lastSpaceIndex).trim() + '...';
  }
  
  return truncated.trim() + '...';
};

/**
 * Генерирует канонический URL
 * @param path Путь страницы
 * @param baseUrl Базовый URL сайта
 * @returns Канонический URL
 */
export const generateCanonicalUrl = (path: string, baseUrl: string = 'https://aimarkethub.pro'): string => {
  // Удаляем начальный слеш, если он есть
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Удаляем конечный слеш, если он есть
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return `${cleanBaseUrl}/${cleanPath}`;
};

/**
 * Генерирует альтернативные ссылки для разных языков
 * @param path Путь страницы
 * @param languages Объект с языками и соответствующими путями
 * @param baseUrl Базовый URL сайта
 * @returns Массив объектов с альтернативными ссылками
 */
export const generateAlternateLinks = (
  path: string, 
  languages: Record<string, string>, 
  baseUrl: string = 'https://aimarkethub.pro'
): { lang: string; url: string }[] => {
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  
  return Object.entries(languages).map(([lang, langPath]) => ({
    lang,
    url: `${cleanBaseUrl}/${langPath}`
  }));
};

/**
 * Генерирует Open Graph мета-теги
 * @param data Данные для Open Graph
 * @returns Объект с Open Graph мета-тегами
 */
export const generateOpenGraphTags = (data: {
  title: string;
  description: string;
  url: string;
  type?: 'website' | 'article';
  image?: string;
  siteName?: string;
  locale?: string;
}) => {
  return {
    'og:title': data.title,
    'og:description': data.description,
    'og:url': data.url,
    'og:type': data.type || 'website',
    'og:image': data.image || 'https://aimarkethub.pro/images/aimarkethub-hero.jpg',
    'og:site_name': data.siteName || 'AI Market Hub',
    'og:locale': data.locale || 'ru_RU'
  };
};

/**
 * Генерирует Twitter Card мета-теги
 * @param data Данные для Twitter Card
 * @returns Объект с Twitter Card мета-тегами
 */
export const generateTwitterCardTags = (data: {
  title: string;
  description: string;
  image?: string;
  card?: 'summary' | 'summary_large_image';
  site?: string;
  creator?: string;
}) => {
  return {
    'twitter:card': data.card || 'summary_large_image',
    'twitter:title': data.title,
    'twitter:description': data.description,
    'twitter:image': data.image || 'https://aimarkethub.pro/images/aimarkethub-hero.jpg',
    'twitter:site': data.site || '@aimarkethub',
    'twitter:creator': data.creator || '@aimarkethub'
  };
};