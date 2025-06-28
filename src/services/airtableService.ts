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
const AIRTABLE_BASE_ID = 'appYourBaseId'; // Замените на ваш Base ID
const AIRTABLE_TABLE_NAME = 'Articles'; // Замените на название вашей таблицы

class AirtableService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;
  }

  async getArticles(): Promise<AirtableArticle[]> {
    try {
      const response = await fetch(`${this.baseUrl}?sort[0][field]=Published At&sort[0][direction]=desc`, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
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
      const response = await fetch(`${this.baseUrl}?filterByFormula={Slug}="${slug}"`, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.records.length === 0) {
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
    return !!(fields.Title && fields.Content && fields['Image URL']);
  }

  private transformRecord(record: AirtableRecord): AirtableArticle {
    const fields = record.fields;
    
    // Генерируем slug из заголовка, если не указан
    const slug = fields.Slug || this.generateSlug(fields.Title || '');
    
    // Генерируем excerpt из контента, если не указан
    const excerpt = fields.Excerpt || this.generateExcerpt(fields.Content || '');
    
    // Парсим теги из строки
    const tags = fields.Tags ? fields.Tags.split(',').map(tag => tag.trim()) : [];

    return {
      id: record.id,
      title: fields.Title || '',
      content: fields.Content || '',
      imageUrl: fields['Image URL'] || '',
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
      .trim();
    
    if (cleanContent.length <= maxLength) {
      return cleanContent;
    }
    
    return cleanContent.substring(0, maxLength).trim() + '...';
  }
}

export const airtableService = new AirtableService();