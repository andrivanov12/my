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

const AIRTABLE_API_KEY = 'patEo1SDRR2SG5Zy9.c802fcede50de3f933e1ae976fcaaf218f8688fdc51b02de16b9212442db67f8';
const AIRTABLE_BASE_ID = 'appyP9QGbW0Tw3xJH';
const AIRTABLE_TABLE_ID = 'tblj5JESrocaYbZwO';
const AIRTABLE_VIEW_ID = 'viwrWdFSXL3eX3G5g';

class AirtableService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;
  }

  async getArticles(): Promise<AirtableArticle[]> {
    try {
      // Используем View ID для получения данных в нужном порядке
      const url = `${this.baseUrl}?view=${AIRTABLE_VIEW_ID}&sort[0][field]=Published At&sort[0][direction]=desc`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Airtable API error response:', errorText);
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Airtable response:', data);
      
      if (!data.records || !Array.isArray(data.records)) {
        console.warn('No records found in Airtable response');
        return [];
      }

      return data.records
        .filter((record: AirtableRecord) => this.isValidRecord(record))
        .map((record: AirtableRecord) => this.transformRecord(record));
    } catch (error) {
      console.error('Error fetching articles from Airtable:', error);
      throw new Error('Не удалось загрузить статьи из Airtable. Проверьте настройки API.');
    }
  }

  async getArticleBySlug(slug: string): Promise<AirtableArticle | null> {
    try {
      const url = `${this.baseUrl}?view=${AIRTABLE_VIEW_ID}&filterByFormula={Slug}="${slug}"`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
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
}

export const airtableService = new AirtableService();