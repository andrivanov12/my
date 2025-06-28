export interface AirtableArticle {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  author?: string;
  category?: string;
  publishedAt?: string;
  excerpt?: string;
  tags?: string[];
  slug?: string;
}

export interface AirtableRecord {
  id: string;
  fields: {
    Title?: string;
    Content?: string;
    'Image URL'?: string;
    Author?: string;
    Category?: string;
    'Published At'?: string;
    Excerpt?: string;
    Tags?: string;
    Slug?: string;
  };
  createdTime: string;
}

// Get configuration from environment variables
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_ID = import.meta.env.VITE_AIRTABLE_TABLE_ID;
const AIRTABLE_VIEW_ID = import.meta.env.VITE_AIRTABLE_VIEW_ID;

// Fallback mock data for when Airtable is not available
const MOCK_ARTICLES: AirtableArticle[] = [
  {
    id: 'mock-1',
    title: 'Добро пожаловать в AI Hub',
    content: 'Это демонстрационная статья. Настройте подключение к Airtable для загрузки реальных статей.',
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400',
    author: 'Команда AI Hub',
    category: 'Общее',
    publishedAt: new Date().toISOString(),
    excerpt: 'Демонстрационная статья для показа функциональности блога.',
    tags: ['demo', 'welcome'],
    slug: 'welcome-to-ai-hub',
  },
  {
    id: 'mock-2',
    title: 'Настройка Airtable',
    content: 'Для подключения к Airtable необходимо настроить API ключ и идентификаторы базы данных.',
    imageUrl: 'https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800&h=400',
    author: 'Команда AI Hub',
    category: 'Настройка',
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    excerpt: 'Пошаговое руководство по настройке подключения к Airtable.',
    tags: ['airtable', 'setup', 'configuration'],
    slug: 'airtable-setup',
  },
];

class AirtableService {
  private baseUrl: string;
  private isConfigured: boolean;

  constructor() {
    this.baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;
    this.isConfigured = !!(AIRTABLE_API_KEY && AIRTABLE_BASE_ID && AIRTABLE_TABLE_ID);
    
    if (!this.isConfigured) {
      console.warn('Airtable not configured. Using mock data. Please set environment variables:');
      console.warn('- VITE_AIRTABLE_API_KEY');
      console.warn('- VITE_AIRTABLE_BASE_ID');
      console.warn('- VITE_AIRTABLE_TABLE_ID');
      console.warn('- VITE_AIRTABLE_VIEW_ID');
    }
  }

  async getArticles(): Promise<AirtableArticle[]> {
    // Return mock data if Airtable is not configured
    if (!this.isConfigured) {
      console.info('Using mock articles data');
      return MOCK_ARTICLES;
    }

    try {
      // Используем View ID для получения данных в нужном порядке
      const url = AIRTABLE_VIEW_ID 
        ? `${this.baseUrl}?view=${AIRTABLE_VIEW_ID}&sort[0][field]=Published At&sort[0][direction]=desc`
        : `${this.baseUrl}?sort[0][field]=Published At&sort[0][direction]=desc`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Airtable API error response:', errorText);
        
        // Return mock data on API error
        console.warn('Falling back to mock data due to Airtable API error');
        return MOCK_ARTICLES;
      }

      const data = await response.json();
      console.log('Airtable response:', data);
      
      if (!data.records || !Array.isArray(data.records)) {
        console.warn('No records found in Airtable response, using mock data');
        return MOCK_ARTICLES;
      }

      const articles = data.records
        .filter((record: AirtableRecord) => this.isValidRecord(record))
        .map((record: AirtableRecord) => this.transformRecord(record));

      // If no valid articles found, return mock data
      if (articles.length === 0) {
        console.warn('No valid articles found in Airtable, using mock data');
        return MOCK_ARTICLES;
      }

      return articles;
    } catch (error) {
      console.error('Error fetching articles from Airtable:', error);
      console.warn('Falling back to mock data due to error');
      return MOCK_ARTICLES;
    }
  }

  async getArticleBySlug(slug: string): Promise<AirtableArticle | null> {
    // Check mock data first
    const mockArticle = MOCK_ARTICLES.find(article => article.slug === slug);
    if (mockArticle) {
      return mockArticle;
    }

    if (!this.isConfigured) {
      return null;
    }

    try {
      const url = AIRTABLE_VIEW_ID
        ? `${this.baseUrl}?view=${AIRTABLE_VIEW_ID}&filterByFormula={Slug}="${slug}"`
        : `${this.baseUrl}?filterByFormula={Slug}="${slug}"`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`Airtable API error: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      
      if (!data.records || data.records.length === 0) {
        return null;
      }

      const record = data.records[0];
      return this.isValidRecord(record) ? this.transformRecord(record) : null;
    } catch (error) {
      console.error('Error fetching article by slug from Airtable:', error);
      return null;
    }
  }

  private isValidRecord(record: AirtableRecord): boolean {
    const fields = record.fields;
    // Проверяем наличие обязательных полей
    const hasTitle = fields.Title && fields.Title.trim().length > 0;
    const hasContent = fields.Content && fields.Content.trim().length > 0;
    
    if (!hasTitle || !hasContent) {
      console.warn('Record missing required fields:', {
        id: record.id,
        hasTitle,
        hasContent,
        fields: Object.keys(fields)
      });
      return false;
    }
    
    return true;
  }

  private transformRecord(record: AirtableRecord): AirtableArticle {
    const fields = record.fields;
    
    // Генерируем slug из заголовка, если не указан
    const slug = fields.Slug || this.generateSlug(fields.Title || '');
    
    // Генерируем excerpt из контента, если не указан
    const excerpt = fields.Excerpt || this.generateExcerpt(fields.Content || '');
    
    // Парсим теги из строки
    const tags = fields.Tags ? fields.Tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

    // Используем дефолтное изображение, если не указано
    const defaultImage = 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400';
    const imageUrl = fields['Image URL'] && fields['Image URL'].trim() ? fields['Image URL'] : defaultImage;

    return {
      id: record.id,
      title: fields.Title || '',
      content: fields.Content || '',
      imageUrl,
      author: fields.Author || 'Команда AI Hub',
      category: fields.Category || 'Общее',
      publishedAt: fields['Published At'] || record.createdTime,
      excerpt,
      tags,
      slug,
    };
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-zа-я0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  private generateExcerpt(content: string, maxLength: number = 200): string {
    // Удаляем HTML теги и markdown
    const cleanContent = content
      .replace(/<[^>]*>/g, '')
      .replace(/[#*`]/g, '')
      .replace(/\n+/g, ' ')
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
  }

  // Метод для тестирования подключения
  async testConnection(): Promise<boolean> {
    if (!this.isConfigured) {
      return false;
    }

    try {
      const response = await fetch(`${this.baseUrl}?maxRecords=1`, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      return response.ok;
    } catch (error) {
      console.error('Airtable connection test failed:', error);
      return false;
    }
  }

  // Getter to check if service is properly configured
  get configured(): boolean {
    return this.isConfigured;
  }
}

export const airtableService = new AirtableService();