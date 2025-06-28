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
    content: `
      <p>Это демонстрационная статья. Настройте подключение к Airtable для загрузки реальных статей.</p>
      
      <h3>Как настроить Airtable</h3>
      <p>Для подключения к вашей базе Airtable выполните следующие шаги:</p>
      <ul>
        <li>Получите API ключ в настройках Airtable</li>
        <li>Скопируйте ID базы данных</li>
        <li>Укажите ID таблицы и представления</li>
        <li>Добавьте эти данные в файл .env</li>
      </ul>
      
      <p>После настройки здесь будут отображаться ваши статьи из Airtable.</p>
    `,
    imageUrl: 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400',
    author: 'Команда AI Hub',
    category: 'Настройка',
    publishedAt: new Date().toISOString(),
    excerpt: 'Демонстрационная статья для показа функциональности блога. Настройте Airtable для загрузки ваших статей.',
    tags: ['demo', 'welcome', 'setup'],
    slug: 'welcome-to-ai-hub',
  }
];

class AirtableService {
  private baseUrl: string;
  private isConfigured: boolean;

  constructor() {
    this.baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;
    this.isConfigured = !!(AIRTABLE_API_KEY && AIRTABLE_BASE_ID && AIRTABLE_TABLE_ID);
    
    if (!this.isConfigured) {
      console.warn('🔧 Airtable не настроен. Используются демонстрационные статьи.');
      console.warn('📝 Для подключения к Airtable установите переменные окружения:');
      console.warn('   - VITE_AIRTABLE_API_KEY');
      console.warn('   - VITE_AIRTABLE_BASE_ID');
      console.warn('   - VITE_AIRTABLE_TABLE_ID');
      console.warn('   - VITE_AIRTABLE_VIEW_ID (опционально)');
    } else {
      console.info('✅ Airtable настроен и готов к использованию');
    }
  }

  async getArticles(): Promise<AirtableArticle[]> {
    // Return mock data if Airtable is not configured
    if (!this.isConfigured) {
      console.info('📄 Используются демонстрационные статьи');
      return MOCK_ARTICLES;
    }

    try {
      // Строим URL для запроса
      let url = this.baseUrl;
      const params = new URLSearchParams();
      
      // Добавляем view если указан
      if (AIRTABLE_VIEW_ID) {
        params.append('view', AIRTABLE_VIEW_ID);
      }
      
      // Сортируем по дате создания (новые сначала)
      params.append('sort[0][field]', 'Title');
      params.append('sort[0][direction]', 'asc');
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
      
      console.log('🔄 Загружаем статьи из Airtable:', url);
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Ошибка Airtable API:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        
        // Return mock data on API error
        console.warn('⚠️ Используются демонстрационные статьи из-за ошибки API');
        return MOCK_ARTICLES;
      }

      const data = await response.json();
      console.log('📊 Ответ от Airtable:', {
        recordsCount: data.records?.length || 0,
        hasRecords: !!data.records
      });
      
      if (!data.records || !Array.isArray(data.records)) {
        console.warn('⚠️ Записи не найдены в ответе Airtable, используются демонстрационные статьи');
        return MOCK_ARTICLES;
      }

      const articles = data.records
        .filter((record: AirtableRecord) => this.isValidRecord(record))
        .map((record: AirtableRecord) => this.transformRecord(record));

      console.log(`✅ Загружено ${articles.length} статей из Airtable`);

      // If no valid articles found, return mock data
      if (articles.length === 0) {
        console.warn('⚠️ Валидные статьи не найдены в Airtable, используются демонстрационные статьи');
        return MOCK_ARTICLES;
      }

      return articles;
    } catch (error) {
      console.error('❌ Ошибка при загрузке статей из Airtable:', error);
      console.warn('⚠️ Используются демонстрационные статьи из-за ошибки');
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
      let url = this.baseUrl;
      const params = new URLSearchParams();
      
      if (AIRTABLE_VIEW_ID) {
        params.append('view', AIRTABLE_VIEW_ID);
      }
      
      // Фильтруем по slug (генерируется из Title)
      params.append('filterByFormula', `LOWER(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE({Title}, " ", "-"), ".", ""), ",", "")) = "${slug}"`);
      
      url += '?' + params.toString();
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error(`❌ Ошибка Airtable API: ${response.status} ${response.statusText}`);
        return null;
      }

      const data = await response.json();
      
      if (!data.records || data.records.length === 0) {
        return null;
      }

      const record = data.records[0];
      return this.isValidRecord(record) ? this.transformRecord(record) : null;
    } catch (error) {
      console.error('❌ Ошибка при загрузке статьи по slug из Airtable:', error);
      return null;
    }
  }

  private isValidRecord(record: AirtableRecord): boolean {
    const fields = record.fields;
    
    // Проверяем наличие обязательных полей: Title и Content
    const hasTitle = fields.Title && fields.Title.trim().length > 0;
    const hasContent = fields.Content && fields.Content.trim().length > 0;
    
    if (!hasTitle || !hasContent) {
      console.warn('⚠️ Запись пропускается - отсутствуют обязательные поля:', {
        id: record.id,
        hasTitle,
        hasContent,
        title: fields.Title?.substring(0, 50) + '...' || 'Нет заголовка'
      });
      return false;
    }
    
    return true;
  }

  private transformRecord(record: AirtableRecord): AirtableArticle {
    const fields = record.fields;
    
    // Генерируем slug из заголовка
    const slug = this.generateSlug(fields.Title || '');
    
    // Генерируем excerpt из контента
    const excerpt = this.generateExcerpt(fields.Content || '');
    
    // Используем дефолтное изображение, если не указано
    const defaultImage = 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400';
    const imageUrl = fields['Image URL'] && fields['Image URL'].trim() ? fields['Image URL'] : defaultImage;

    // Определяем категорию на основе контента или заголовка
    const category = this.detectCategory(fields.Title || '', fields.Content || '');

    return {
      id: record.id,
      title: fields.Title || '',
      content: fields.Content || '',
      imageUrl,
      author: 'Автор', // Можете изменить на ваше имя
      category,
      publishedAt: record.createdTime, // Используем дату создания записи
      excerpt,
      tags: this.extractTags(fields.Title || '', fields.Content || ''),
      slug,
    };
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-zа-я0-9\s-]/g, '') // Удаляем специальные символы
      .replace(/\s+/g, '-') // Заменяем пробелы на дефисы
      .replace(/-+/g, '-') // Убираем множественные дефисы
      .replace(/^-|-$/g, '') // Убираем дефисы в начале и конце
      .trim();
  }

  private generateExcerpt(content: string, maxLength: number = 200): string {
    // Удаляем HTML теги и markdown
    const cleanContent = content
      .replace(/<[^>]*>/g, '') // Удаляем HTML теги
      .replace(/[#*`]/g, '') // Удаляем markdown символы
      .replace(/\n+/g, ' ') // Заменяем переносы строк на пробелы
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

  private detectCategory(title: string, content: string): string {
    const text = (title + ' ' + content).toLowerCase();
    
    // Простая категоризация на основе ключевых слов
    if (text.includes('ai') || text.includes('ии') || text.includes('искусственный интеллект') || text.includes('chatgpt')) {
      return 'Технологии';
    }
    if (text.includes('обзор') || text.includes('сравнение') || text.includes('тест')) {
      return 'Обзоры';
    }
    if (text.includes('обучение') || text.includes('образование') || text.includes('курс')) {
      return 'Образование';
    }
    if (text.includes('этика') || text.includes('безопасность') || text.includes('приватность')) {
      return 'Этика';
    }
    
    return 'Общее';
  }

  private extractTags(title: string, content: string): string[] {
    const text = (title + ' ' + content).toLowerCase();
    const tags: string[] = [];
    
    // Извлекаем теги на основе ключевых слов
    if (text.includes('chatgpt')) tags.push('ChatGPT');
    if (text.includes('ai') || text.includes('ии')) tags.push('AI');
    if (text.includes('машинное обучение')) tags.push('Машинное обучение');
    if (text.includes('нейронные сети')) tags.push('Нейронные сети');
    if (text.includes('программирование')) tags.push('Программирование');
    if (text.includes('веб-разработка')) tags.push('Веб-разработка');
    
    return tags.slice(0, 5); // Ограничиваем количество тегов
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

      const success = response.ok;
      console.log(success ? '✅ Подключение к Airtable успешно' : '❌ Ошибка подключения к Airtable');
      return success;
    } catch (error) {
      console.error('❌ Тест подключения к Airtable не удался:', error);
      return false;
    }
  }

  // Getter to check if service is properly configured
  get configured(): boolean {
    return this.isConfigured;
  }
}

export const airtableService = new AirtableService();