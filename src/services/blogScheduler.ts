import { articleGenerator, GeneratedArticle } from './articleGenerator';

interface ScheduledArticle {
  id: string;
  article: GeneratedArticle;
  scheduledFor: Date;
  published: boolean;
  createdAt: Date;
}

class BlogSchedulerService {
  private readonly STORAGE_KEY = 'scheduled_articles';
  private readonly LAST_PUBLISH_KEY = 'last_publish_date';
  
  constructor() {
    this.initializeScheduler();
  }

  private initializeScheduler(): void {
    // Проверяем, нужно ли опубликовать статью сегодня
    this.checkAndPublishDaily();
    
    // Устанавливаем интервал проверки каждый час
    setInterval(() => {
      this.checkAndPublishDaily();
    }, 60 * 60 * 1000); // Каждый час
  }

  private async checkAndPublishDaily(): Promise<void> {
    const now = new Date();
    const today = now.toDateString();
    const currentHour = now.getHours();
    
    // Проверяем, что сейчас 9 утра (или позже, если пропустили)
    if (currentHour < 9) {
      return;
    }
    
    const lastPublishDate = localStorage.getItem(this.LAST_PUBLISH_KEY);
    
    // Если уже публиковали сегодня, пропускаем
    if (lastPublishDate === today) {
      return;
    }
    
    try {
      console.log('🕘 Время для ежедневной публикации статьи!');
      await this.publishDailyArticle();
      localStorage.setItem(this.LAST_PUBLISH_KEY, today);
      console.log('✅ Ежедневная статья опубликована успешно');
    } catch (error) {
      console.error('❌ Ошибка при публикации ежедневной статьи:', error);
    }
  }

  private async publishDailyArticle(): Promise<void> {
    try {
      // Генерируем новую статью
      const article = await articleGenerator.generateArticle();
      
      // Добавляем статью в локальное хранилище (имитация добавления в блог)
      this.addArticleToLocalStorage(article);
      
      // Уведомляем пользователя (если он на сайте)
      this.notifyNewArticle(article);
      
      console.log('📝 Новая статья добавлена:', article.title);
    } catch (error) {
      console.error('Ошибка генерации ежедневной статьи:', error);
      throw error;
    }
  }

  private addArticleToLocalStorage(article: GeneratedArticle): void {
    try {
      // Получаем существующие статьи
      const existingArticles = this.getStoredArticles();
      
      // Создаем новую запись
      const newArticle: ScheduledArticle = {
        id: this.generateId(),
        article,
        scheduledFor: new Date(),
        published: true,
        createdAt: new Date()
      };
      
      // Добавляем в начало списка
      existingArticles.unshift(newArticle);
      
      // Ограничиваем количество статей (храним последние 50)
      const limitedArticles = existingArticles.slice(0, 50);
      
      // Сохраняем обратно
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(limitedArticles));
      
      // Также добавляем в формат, совместимый с BlogPage
      this.addToBlogPageFormat(article);
    } catch (error) {
      console.error('Ошибка сохранения статьи:', error);
    }
  }

  private addToBlogPageFormat(article: GeneratedArticle): void {
    try {
      const blogArticlesKey = 'blog_articles';
      const existingBlogArticles = JSON.parse(localStorage.getItem(blogArticlesKey) || '[]');
      
      // Преобразуем в формат, ожидаемый BlogPage
      const blogArticle = {
        id: this.generateId(),
        title: article.title,
        content: article.content,
        imageUrl: article.imageUrl,
        author: article.author,
        category: article.category,
        publishedAt: article.publishedAt,
        excerpt: article.excerpt,
        tags: article.tags,
        slug: this.generateSlug(article.title)
      };
      
      existingBlogArticles.unshift(blogArticle);
      localStorage.setItem(blogArticlesKey, JSON.stringify(existingBlogArticles.slice(0, 50)));
    } catch (error) {
      console.error('Ошибка добавления в формат BlogPage:', error);
    }
  }

  private getStoredArticles(): ScheduledArticle[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Ошибка чтения сохраненных статей:', error);
      return [];
    }
  }

  private notifyNewArticle(article: GeneratedArticle): void {
    // Создаем уведомление для пользователя
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Новая статья в блоге!', {
        body: article.title,
        icon: '/favicon.svg'
      });
    }
    
    // Также можем отправить кастомное событие
    window.dispatchEvent(new CustomEvent('newArticlePublished', {
      detail: { article }
    }));
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-zа-я0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();
  }

  // Публичные методы для управления планировщиком

  async scheduleArticle(topic?: string, scheduledFor?: Date): Promise<void> {
    try {
      const article = await articleGenerator.generateArticle(
        topic ? { topic, category: 'Технологии' } : undefined
      );
      
      const scheduled: ScheduledArticle = {
        id: this.generateId(),
        article,
        scheduledFor: scheduledFor || new Date(),
        published: false,
        createdAt: new Date()
      };
      
      const articles = this.getStoredArticles();
      articles.push(scheduled);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(articles));
      
      console.log('📅 Статья запланирована:', article.title);
    } catch (error) {
      console.error('Ошибка планирования статьи:', error);
      throw error;
    }
  }

  getScheduledArticles(): ScheduledArticle[] {
    return this.getStoredArticles();
  }

  async publishNow(): Promise<void> {
    await this.publishDailyArticle();
  }

  // Метод для получения статей в формате BlogPage
  getBlogArticles(): any[] {
    try {
      const blogArticles = localStorage.getItem('blog_articles');
      return blogArticles ? JSON.parse(blogArticles) : [];
    } catch (error) {
      console.error('Ошибка получения статей блога:', error);
      return [];
    }
  }

  // Метод для ручного запуска генерации статьи
  async generateArticleNow(topic?: string): Promise<GeneratedArticle> {
    const article = await articleGenerator.generateArticle(
      topic ? { topic, category: 'Технологии' } : undefined
    );
    
    this.addArticleToLocalStorage(article);
    return article;
  }

  // Метод для получения статистики
  getStats(): { total: number; published: number; scheduled: number } {
    const articles = this.getStoredArticles();
    return {
      total: articles.length,
      published: articles.filter(a => a.published).length,
      scheduled: articles.filter(a => !a.published).length
    };
  }

  // Запрос разрешения на уведомления
  async requestNotificationPermission(): Promise<void> {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  }
}

export const blogScheduler = new BlogSchedulerService();