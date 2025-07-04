/**
 * Утилиты для SEO оптимизации
 */

/**
 * Генерирует мета-описание из текста
 * @param text Текст для генерации описания
 * @param maxLength Максимальная длина описания
 * @returns Мета-описание
 */
export const generateMetaDescription = (text: string, maxLength: number = 160): string => {
  // Очищаем текст от HTML-тегов и лишних пробелов
  const cleanText = text
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // Обрезаем текст до последнего полного слова в пределах maxLength
  const truncated = cleanText.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
};

/**
 * Генерирует slug из строки
 * @param text Текст для генерации slug
 * @returns Slug для URL
 */
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\wа-яё\s-]/g, '') // Удаляем специальные символы
    .replace(/[\s_-]+/g, '-') // Заменяем пробелы, подчеркивания и дефисы на одиночный дефис
    .replace(/^-+|-+$/g, '') // Удаляем дефисы в начале и конце
    .replace(/[а-яё]/g, char => { // Транслитерация русских букв
      const translitMap: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo', 
        'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 
        'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 
        'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'sch', 'ъ': '', 
        'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
      };
      return translitMap[char] || char;
    });
};

/**
 * Генерирует структурированные данные для хлебных крошек
 * @param items Элементы хлебных крошек
 * @returns Структурированные данные для хлебных крошек
 */
export const generateBreadcrumbSchema = (items: { name: string; url: string }[]): Record<string, any> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  };
};

/**
 * Генерирует структурированные данные для статьи
 * @param article Данные статьи
 * @returns Структурированные данные для статьи
 */
export const generateArticleSchema = (article: {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  authorUrl?: string;
  publisher: string;
  publisherLogo: string;
  keywords?: string[];
}): Record<string, any> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.description,
    'image': article.imageUrl,
    'datePublished': article.datePublished,
    'dateModified': article.dateModified || article.datePublished,
    'author': {
      '@type': 'Person',
      'name': article.author,
      'url': article.authorUrl || 'https://aimarkethub.pro/about'
    },
    'publisher': {
      '@type': 'Organization',
      'name': article.publisher,
      'logo': {
        '@type': 'ImageObject',
        'url': article.publisherLogo
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': article.url
    },
    'keywords': article.keywords?.join(', ')
  };
};

/**
 * Генерирует структурированные данные для FAQ
 * @param questions Вопросы и ответы
 * @returns Структурированные данные для FAQ
 */
export const generateFAQSchema = (questions: { question: string; answer: string }[]): Record<string, any> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': questions.map(q => ({
      '@type': 'Question',
      'name': q.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': q.answer
      }
    }))
  };
};

/**
 * Генерирует структурированные данные для организации
 * @param org Данные организации
 * @returns Структурированные данные для организации
 */
export const generateOrganizationSchema = (org: {
  name: string;
  url: string;
  logo: string;
  description: string;
  sameAs?: string[];
}): Record<string, any> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': org.name,
    'url': org.url,
    'logo': org.logo,
    'description': org.description,
    'sameAs': org.sameAs || []
  };
};

/**
 * Генерирует структурированные данные для веб-приложения
 * @param app Данные веб-приложения
 * @returns Структурированные данные для веб-приложения
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
}): Record<string, any> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': app.name,
    'description': app.description,
    'url': app.url,
    'applicationCategory': app.applicationCategory,
    'operatingSystem': app.operatingSystem,
    'offers': {
      '@type': 'Offer',
      'price': app.offers.price,
      'priceCurrency': app.offers.priceCurrency
    },
    'featureList': app.features,
    ...(app.screenshot && { 'screenshot': app.screenshot }),
    ...(app.rating && {
      'aggregateRating': {
        '@type': 'AggregateRating',
        'ratingValue': app.rating.value.toString(),
        'reviewCount': app.rating.count.toString(),
        'bestRating': '5',
        'worstRating': '1'
      }
    })
  };
};

/**
 * Извлекает ключевые слова из текста
 * @param text Текст для извлечения ключевых слов
 * @param maxKeywords Максимальное количество ключевых слов
 * @returns Массив ключевых слов
 */
export const extractKeywords = (text: string, maxKeywords: number = 10): string[] => {
  // Очищаем текст от HTML-тегов и лишних пробелов
  const cleanText = text
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/\s+/g, ' ')
    .toLowerCase()
    .trim();
  
  // Список стоп-слов (слова, которые не должны быть ключевыми)
  const stopWords = new Set([
    'и', 'в', 'на', 'с', 'по', 'для', 'не', 'что', 'как', 'это', 'так',
    'к', 'у', 'из', 'за', 'от', 'при', 'по', 'о', 'об', 'но', 'да', 'или',
    'если', 'то', 'я', 'мы', 'вы', 'он', 'она', 'оно', 'они', 'его', 'её',
    'их', 'мой', 'твой', 'наш', 'ваш', 'этот', 'тот', 'такой', 'который',
    'где', 'когда', 'куда', 'откуда', 'зачем', 'почему', 'чтобы', 'всё',
    'весь', 'все', 'всю', 'вся', 'всего', 'всей', 'всем', 'всеми', 'всех',
    'был', 'была', 'были', 'быть', 'есть', 'будет', 'будут', 'бы'
  ]);
  
  // Разбиваем текст на слова
  const words = cleanText.split(/\s+/);
  
  // Считаем частоту слов
  const wordFrequency: Record<string, number> = {};
  words.forEach(word => {
    // Игнорируем короткие слова и стоп-слова
    if (word.length < 3 || stopWords.has(word)) {
      return;
    }
    
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  // Сортируем слова по частоте
  const sortedWords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word)
    .slice(0, maxKeywords);
  
  return sortedWords;
};

/**
 * Генерирует мета-теги для страницы
 * @param title Заголовок страницы
 * @param description Описание страницы
 * @param keywords Ключевые слова
 * @returns Объект с мета-тегами
 */
export const generateMetaTags = (
  title: string,
  description: string,
  keywords?: string[]
): Record<string, string> => {
  return {
    title,
    description,
    keywords: keywords?.join(', ') || ''
  };
};