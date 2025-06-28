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

class AirtableService {
  private baseUrl: string;
  private isConfigured: boolean;

  constructor() {
    this.baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_ID}`;
    this.isConfigured = !!(AIRTABLE_API_KEY && AIRTABLE_BASE_ID && AIRTABLE_TABLE_ID);
    
    console.log('🔧 Конфигурация Airtable:', {
      hasApiKey: !!AIRTABLE_API_KEY,
      hasBaseId: !!AIRTABLE_BASE_ID,
      hasTableId: !!AIRTABLE_TABLE_ID,
      hasViewId: !!AIRTABLE_VIEW_ID,
      isConfigured: this.isConfigured,
      baseUrl: this.baseUrl
    });
  }

  async getArticles(): Promise<AirtableArticle[]> {
    if (!this.isConfigured) {
      console.error('❌ Airtable не настроен. Проверьте переменные окружения.');
      return [];
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
      params.append('sort[0][direction]', 'desc');
      
      // Ограничиваем количество записей для оптимизации
      params.append('maxRecords', '50');
      
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
          error: errorText,
          url: url
        });
        
        throw new Error(`Airtable API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('📊 Ответ от Airtable:', {
        recordsCount: data.records?.length || 0,
        hasRecords: !!data.records,
        records: data.records?.map((r: any) => ({
          id: r.id,
          title: r.fields?.Title,
          hasContent: !!r.fields?.Content,
          hasImage: !!r.fields?.['Image URL']
        }))
      });
      
      if (!data.records || !Array.isArray(data.records)) {
        console.warn('⚠️ Записи не найдены в ответе Airtable');
        return [];
      }

      const articles = data.records
        .filter((record: AirtableRecord) => this.isValidRecord(record))
        .map((record: AirtableRecord) => this.transformRecord(record));

      console.log(`✅ Загружено ${articles.length} статей из Airtable`);
      return articles;
    } catch (error) {
      console.error('❌ Ошибка при загрузке статей из Airtable:', error);
      throw error;
    }
  }

  async getArticleBySlug(slug: string): Promise<AirtableArticle | null> {
    if (!this.isConfigured) {
      return null;
    }

    try {
      let url = this.baseUrl;
      const params = new URLSearchParams();
      
      if (AIRTABLE_VIEW_ID) {
        params.append('view', AIRTABLE_VIEW_ID);
      }
      
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

      // Ищем статью по slug
      const record = data.records.find((r: AirtableRecord) => {
        const recordSlug = this.generateSlug(r.fields.Title || '');
        return recordSlug === slug;
      });

      return record && this.isValidRecord(record) ? this.transformRecord(record) : null;
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
    
    // Обрабатываем URL изображения
    let imageUrl = fields['Image URL'] || '';
    
    // Если URL изображения пустой, используем дефолтное
    if (!imageUrl || !imageUrl.trim()) {
      imageUrl = 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400';
    } else {
      // Очищаем URL от лишних пробелов
      imageUrl = imageUrl.trim();
      
      // Проверяем, является ли это валидным URL
      try {
        new URL(imageUrl);
      } catch {
        console.warn('⚠️ Неверный URL изображения, используется дефолтное:', imageUrl);
        imageUrl = 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400';
      }
    }

    // Определяем категорию на основе контента или заголовка
    const category = this.detectCategory(fields.Title || '', fields.Content || '');

    // Обрабатываем контент для корректного отображения
    const processedContent = this.processContent(fields.Content || '');

    console.log('🔄 Обрабатываем статью:', {
      id: record.id,
      title: fields.Title,
      category,
      slug,
      excerptLength: excerpt.length,
      contentLength: processedContent.length,
      imageUrl: imageUrl.substring(0, 50) + '...'
    });

    return {
      id: record.id,
      title: fields.Title || '',
      content: processedContent,
      imageUrl,
      author: 'AI Hub Team',
      category,
      publishedAt: record.createdTime,
      excerpt,
      tags: this.extractTags(fields.Title || '', fields.Content || ''),
      slug,
    };
  }

  private processContent(content: string): string {
    // Обрабатываем контент для корректного отображения в HTML
    let processed = content;
    
    // Обрабатываем заголовки (## -> h3, ### -> h4)
    processed = processed.replace(/^### (.+)$/gm, '<h4>$1</h4>');
    processed = processed.replace(/^## (.+)$/gm, '<h3>$1</h3>');
    processed = processed.replace(/^# (.+)$/gm, '<h2>$1</h2>');
    
    // Обрабатываем жирный текст (**text** -> <strong>text</strong>)
    processed = processed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    
    // Обрабатываем курсив (*text* -> <em>text</em>)
    processed = processed.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
    
    // Обрабатываем ссылки [text](url)
    processed = processed.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Обрабатываем списки
    processed = processed.replace(/^- (.+)$/gm, '<li>$1</li>');
    
    // Группируем списки
    processed = processed.replace(/(<li>.*?<\/li>\s*)+/gs, (match) => {
      return '<ul>' + match + '</ul>';
    });
    
    // Обрабатываем переносы строк
    processed = processed.replace(/\n\n/g, '</p><p>');
    processed = processed.replace(/\n/g, '<br>');
    
    // Оборачиваем в параграфы, если еще не обернуто
    if (!processed.startsWith('<')) {
      processed = '<p>' + processed + '</p>';
    }
    
    // Очищаем лишние теги
    processed = processed.replace(/<p><\/p>/g, '');
    processed = processed.replace(/<p>(<h[1-6]>)/g, '$1');
    processed = processed.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
    processed = processed.replace(/<p>(<ul>)/g, '$1');
    processed = processed.replace(/(<\/ul>)<\/p>/g, '$1');
    
    return processed;
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
  }

  private detectCategory(title: string, content: string): string {
    const text = (title + ' ' + content).toLowerCase();
    
    // Простая категоризация на основе ключевых слов
    if (text.includes('ai') || text.includes('ии') || text.includes('искусственный интеллект') || text.includes('chatgpt') || text.includes('робот')) {
      return 'Технологии';
    }
    if (text.includes('обзор') || text.includes('сравнение') || text.includes('тест')) {
      return 'Обзоры';
    }
    if (text.includes('обучение') || text.includes('образование') || text.includes('курс') || text.includes('инструкция')) {
      return 'Образование';
    }
    if (text.includes('этика') || text.includes('безопасность') || text.includes('приватность')) {
      return 'Этика';
    }
    if (text.includes('no-code') || text.includes('без кода') || text.includes('автоматизация')) {
      return 'No-Code';
    }
    
    return 'Общее';
  }

  private extractTags(title: string, content: string): string[] {
    const text = (title + ' ' + content).toLowerCase();
    const tags: string[] = [];
    
    // Извлекаем теги на основе ключевых слов
    if (text.includes('chatgpt')) tags.push('ChatGPT');
    if (text.includes('ai') || text.includes('ии')) tags.push('AI');
    if (text.includes('робот')) tags.push('Роботы');
    if (text.includes('no-code') || text.includes('без кода')) tags.push('NoCode');
    if (text.includes('автоматизация')) tags.push('Автоматизация');
    if (text.includes('машинное обучение')) tags.push('Машинное обучение');
    if (text.includes('нейронные сети')) tags.push('Нейронные сети');
    if (text.includes('программирование')) tags.push('Программирование');
    if (text.includes('веб-разработка')) tags.push('Веб-разработка');
    if (text.includes('telegram')) tags.push('Telegram');
    if (text.includes('openai')) tags.push('OpenAI');
    if (text.includes('n8n')) tags.push('n8n');
    if (text.includes('make')) tags.push('Make');
    if (text.includes('zapier')) tags.push('Zapier');
    
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