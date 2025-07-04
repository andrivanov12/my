import axios from 'axios';

export interface NewsItem {
  title: string;
  excerpt: string;
  source: string;
  url: string;
  imageUrl: string;
  publishDate: string;
  category: 'n8n' | 'ai' | 'automation';
}

export interface NewsData {
  lastUpdated: string;
  news: NewsItem[];
}

// Fallback news data
const fallbackNews: NewsItem[] = [
  {
    title: "Новое обновление n8n 1.20: улучшенная производительность и новые узлы",
    excerpt: "Вышло обновление n8n 1.20 с улучшенной производительностью, новыми узлами и расширенными возможностями для автоматизации.",
    source: "n8n Blog",
    url: "https://n8n.io/blog/",
    imageUrl: "/images/n8n-placeholder.jpg",
    publishDate: new Date().toISOString(),
    category: "n8n"
  },
  {
    title: "Интеграция ChatGPT с n8n: новые возможности для автоматизации",
    excerpt: "Узнайте, как интегрировать ChatGPT с n8n для создания интеллектуальных автоматизаций и обработки естественного языка.",
    source: "AI Market Hub",
    url: "/n8n-assistant",
    imageUrl: "/images/ai-placeholder.jpg",
    publishDate: new Date().toISOString(),
    category: "ai"
  },
  {
    title: "10 лучших workflow для автоматизации маркетинга с n8n",
    excerpt: "Подборка готовых workflow для автоматизации маркетинговых задач с помощью n8n: от сбора лидов до аналитики.",
    source: "AI Market Hub",
    url: "/blog",
    imageUrl: "/images/n8n-placeholder.jpg",
    publishDate: new Date().toISOString(),
    category: "n8n"
  },
  {
    title: "Gemini 2.5 Pro: новые возможности для интеграции с n8n",
    excerpt: "Google представил Gemini 2.5 Pro с расширенными возможностями для интеграции с инструментами автоматизации, включая n8n.",
    source: "AI News",
    url: "/blog",
    imageUrl: "/images/ai-placeholder.jpg",
    publishDate: new Date().toISOString(),
    category: "ai"
  }
];

// Функция для получения новостей
export const fetchNews = async (forceRefresh = false): Promise<NewsData> => {
  try {
    // Проверяем кэш, если не требуется принудительное обновление
    if (!forceRefresh) {
      const cachedNews = localStorage.getItem('newsCache');
      const cacheTime = localStorage.getItem('newsCacheTime');
      
      if (cachedNews && cacheTime) {
        const cacheAge = Date.now() - parseInt(cacheTime);
        // Используем кэш, если он не старше 24 часов
        if (cacheAge < 24 * 60 * 60 * 1000) {
          return JSON.parse(cachedNews);
        }
      }
    }
    
    // Здесь должен быть код для получения новостей из API
    // В данном примере мы используем статические данные
    
    // Имитация задержки сетевого запроса
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Создаем объект с данными
    const newsData: NewsData = {
      lastUpdated: new Date().toISOString(),
      news: fallbackNews
    };
    
    // Сохраняем в кэш
    localStorage.setItem('newsCache', JSON.stringify(newsData));
    localStorage.setItem('newsCacheTime', Date.now().toString());
    
    return newsData;
  } catch (error) {
    console.error('Error fetching news:', error);
    
    // В случае ошибки возвращаем fallback данные
    return {
      lastUpdated: new Date().toISOString(),
      news: fallbackNews
    };
  }
};

// Функция для получения новостей из RSS-лент
export const fetchRssNews = async (forceRefresh = false): Promise<NewsItem[]> => {
  try {
    // Проверяем кэш, если не требуется принудительное обновление
    if (!forceRefresh) {
      const cachedRss = localStorage.getItem('rssNewsCache');
      const cacheTime = localStorage.getItem('rssNewsCacheTime');
      
      if (cachedRss && cacheTime) {
        const cacheAge = Date.now() - parseInt(cacheTime);
        // Используем кэш, если он не старше 12 часов
        if (cacheAge < 12 * 60 * 60 * 1000) {
          return JSON.parse(cachedRss);
        }
      }
    }
    
    // Список RSS-лент для n8n и AI новостей
    const rssSources = [
      { url: 'https://n8n.io/blog/rss/', category: 'n8n' }
    ];
    
    // Функция для парсинга RSS через прокси-сервис
    const parseRss = async (url: string, category: string): Promise<NewsItem[]> => {
      try {
        // Используем прокси-сервис для обхода CORS
        const response = await axios.get(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`);
        
        if (response.data.status !== 'ok') {
          throw new Error('Failed to fetch RSS feed');
        }
        
        return response.data.items.map((item: any) => ({
          title: item.title,
          excerpt: item.description.replace(/<[^>]*>/g, '').substring(0, 150) + '...',
          source: response.data.feed.title,
          url: item.link,
          imageUrl: item.enclosure?.link || 
                   item.thumbnail || 
                   (category === 'n8n' ? '/images/n8n-placeholder.jpg' : '/images/ai-placeholder.jpg'),
          publishDate: item.pubDate,
          category: category as 'n8n' | 'ai' | 'automation'
        }));
      } catch (error) {
        console.error(`Error fetching RSS from ${url}:`, error);
        return [];
      }
    };
    
    // Получаем новости из всех источников параллельно
    const newsPromises = rssSources.map(source => parseRss(source.url, source.category));
    const newsArrays = await Promise.all(newsPromises);
    
    // Объединяем все новости
    let allNews = newsArrays.flat();
    
    // Сортируем по дате публикации
    allNews.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    
    // Ограничиваем количество новостей
    allNews = allNews.slice(0, 10);
    
    // Если новостей нет или произошла ошибка, используем fallback
    if (allNews.length === 0) {
      allNews = fallbackNews;
    }
    
    // Сохраняем в кэш
    localStorage.setItem('rssNewsCache', JSON.stringify(allNews));
    localStorage.setItem('rssNewsCacheTime', Date.now().toString());
    
    return allNews;
  } catch (error) {
    console.error('Error fetching RSS news:', error);
    return fallbackNews;
  }
};

// Функция для получения новостей из нескольких источников
export const fetchCombinedNews = async (forceRefresh = false): Promise<NewsItem[]> => {
  try {
    // Получаем новости из разных источников параллельно
    const [rssNews, apiNews] = await Promise.all([
      fetchRssNews(forceRefresh),
      fetchNews(forceRefresh).then(data => data.news)
    ]);
    
    // Объединяем новости
    let allNews = [...rssNews, ...apiNews];
    
    // Удаляем дубликаты по заголовку
    allNews = allNews.filter((news, index, self) => 
      index === self.findIndex(n => n.title === news.title)
    );
    
    // Сортируем по дате публикации
    allNews.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
    
    // Ограничиваем количество новостей
    return allNews.slice(0, 12);
  } catch (error) {
    console.error('Error fetching combined news:', error);
    return fallbackNews;
  }
};