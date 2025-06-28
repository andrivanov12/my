export interface GeneratedArticle {
  title: string;
  content: string;
  imageUrl: string;
  category: string;
  tags: string[];
  publishedAt: string;
  author: string;
  excerpt: string;
}

export interface ArticlePrompt {
  topic: string;
  videoUrl?: string;
  category?: string;
}

class ArticleGeneratorService {
  private readonly TOPICS = [
    {
      topic: "Как создать умного помощника для дома с помощью ChatGPT и Telegram",
      category: "Автоматизация",
      videoUrl: "https://youtu.be/example1"
    },
    {
      topic: "Секреты эффективного промптинга: Как получить максимум от AI",
      category: "Технологии",
      videoUrl: "https://youtu.be/example2"
    },
    {
      topic: "Создание голосового ассистента без программирования",
      category: "No-Code",
      videoUrl: "https://youtu.be/example3"
    },
    {
      topic: "Автоматизация рутинных задач с помощью n8n и ChatGPT",
      category: "Автоматизация",
      videoUrl: "https://youtu.be/example4"
    },
    {
      topic: "Как заставить ChatGPT работать как персональный коуч",
      category: "Продуктивность",
      videoUrl: "https://youtu.be/example5"
    },
    {
      topic: "Создание AI-бота для анализа документов и PDF",
      category: "Технологии",
      videoUrl: "https://youtu.be/example6"
    },
    {
      topic: "Интеграция ChatGPT с Google Sheets для автоматизации отчетов",
      category: "Автоматизация",
      videoUrl: "https://youtu.be/example7"
    },
    {
      topic: "Как создать AI-помощника для изучения языков",
      category: "Образование",
      videoUrl: "https://youtu.be/example8"
    },
    {
      topic: "Автоматическая генерация контента для социальных сетей",
      category: "Маркетинг",
      videoUrl: "https://youtu.be/example9"
    },
    {
      topic: "Создание умного календаря с AI-планированием",
      category: "Продуктивность",
      videoUrl: "https://youtu.be/example10"
    }
  ];

  private readonly PROMPT_TEMPLATE = `
Цель: Сгенерировать статью-туториал для аудитории, заинтересованной в автоматизации/технологиях, написанную в дружелюбном, вовлекающем, пошаговом стиле, с упором на практическое применение.

Тема Статьи: {TOPIC}
Ссылка на Видео: {VIDEO_URL}

Инструкции для ИИ:

⊚ Общий Тон и Стиль:
• Дружелюбный и Вовлекающий: Используй неформальное обращение ("Привет, друзья!", "ты"), создавай ощущение диалога.
• Энтузиазм: Подчеркивай ценность и крутость описываемого решения.
• Простота и Доступность: Объясняй сложные концепции простым языком, избегай излишнего жаргона.
• Ориентация на действие: Мотивируй читателя попробовать описанное.

⊚ Структура Статьи:
• Заголовок: Краткий, цепляющий, с использованием эмодзи (от 1 до 3).
• Вступление: Начинай с приветствия и вопроса, заинтригуй читателя.
• Основные Разделы (Шаги): Каждый этап как отдельный "Шаг N" с эмодзи.
• Блок "Важные Советы/Нюансы": С эмодзи и практическими рекомендациями.
• Блок "Пример в Деле: Смотри Сам!": Обязательно с ссылкой на видео.
• Заключение: Начни с поздравления ("Поздравляю! 🎉").
• Хэштеги: От 8 до 15 релевантных хэштегов в конце статьи.

⊚ Особенности Форматирования:
• Эмодзи органично в тексте для живости
• Жирный шрифт для ключевых фраз
• Краткие, ясные предложения
• Призывы к действию: "Готовы?", "Поехали!", "Представьте!"

Создай полную статью следуя этому шаблону!
`;

  async generateArticle(prompt?: ArticlePrompt): Promise<GeneratedArticle> {
    // Если промпт не передан, выбираем случайную тему
    const selectedPrompt = prompt || this.getRandomTopic();
    
    try {
      // Генерируем статью с помощью AI
      const generatedContent = await this.callAIForArticle(selectedPrompt);
      
      // Генерируем изображение для статьи
      const imageUrl = await this.generateImage(selectedPrompt.topic);
      
      // Извлекаем заголовок из сгенерированного контента
      const title = this.extractTitle(generatedContent) || selectedPrompt.topic;
      
      // Генерируем excerpt
      const excerpt = this.generateExcerpt(generatedContent);
      
      // Извлекаем теги
      const tags = this.extractTags(generatedContent);
      
      return {
        title,
        content: generatedContent,
        imageUrl,
        category: selectedPrompt.category || 'Технологии',
        tags,
        publishedAt: new Date().toISOString(),
        author: 'AI Hub Team',
        excerpt
      };
    } catch (error) {
      console.error('Ошибка генерации статьи:', error);
      throw new Error('Не удалось сгенерировать статью');
    }
  }

  private getRandomTopic(): ArticlePrompt {
    const randomIndex = Math.floor(Math.random() * this.TOPICS.length);
    return this.TOPICS[randomIndex];
  }

  private async callAIForArticle(prompt: ArticlePrompt): Promise<string> {
    // Формируем промпт для AI
    const aiPrompt = this.PROMPT_TEMPLATE
      .replace('{TOPIC}', prompt.topic)
      .replace('{VIDEO_URL}', prompt.videoUrl || 'https://youtu.be/example');

    // Здесь мы используем тот же сервис, что и для чата
    const { sendMessageToAI } = await import('./chatService');
    
    try {
      const response = await sendMessageToAI(
        aiPrompt,
        [], // Пустая история сообщений
        'qwen3' // Используем Qwen для генерации статей
      );
      
      return response;
    } catch (error) {
      console.error('Ошибка вызова AI для генерации статьи:', error);
      
      // Fallback - возвращаем шаблон статьи
      return this.generateFallbackArticle(prompt);
    }
  }

  private async generateImage(topic: string): Promise<string> {
    // Список тематических изображений с Pexels
    const imageCategories = {
      'технологии': [
        'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=800&h=400',
        'https://images.pexels.com/photos/8386422/pexels-photo-8386422.jpeg?auto=compress&cs=tinysrgb&w=800&h=400',
        'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800&h=400'
      ],
      'автоматизация': [
        'https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=800&h=400',
        'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=800&h=400'
      ],
      'образование': [
        'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=800&h=400',
        'https://images.pexels.com/photos/4144923/pexels-photo-4144923.jpeg?auto=compress&cs=tinysrgb&w=800&h=400'
      ],
      'продуктивность': [
        'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800&h=400',
        'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800&h=400'
      ]
    };

    // Определяем категорию изображения на основе темы
    const topicLower = topic.toLowerCase();
    let category = 'технологии'; // По умолчанию

    if (topicLower.includes('автоматизация') || topicLower.includes('робот')) {
      category = 'автоматизация';
    } else if (topicLower.includes('обучение') || topicLower.includes('образование')) {
      category = 'образование';
    } else if (topicLower.includes('продуктивность') || topicLower.includes('планирование')) {
      category = 'продуктивность';
    }

    const images = imageCategories[category as keyof typeof imageCategories] || imageCategories.технологии;
    const randomIndex = Math.floor(Math.random() * images.length);
    
    return images[randomIndex];
  }

  private extractTitle(content: string): string | null {
    // Ищем заголовок в начале статьи
    const titleMatch = content.match(/^#\s*(.+)$/m) || 
                      content.match(/^(.+?)(?:\n|$)/);
    
    if (titleMatch) {
      return titleMatch[1].replace(/[#*]/g, '').trim();
    }
    
    return null;
  }

  private generateExcerpt(content: string): string {
    // Удаляем заголовки и форматирование
    const cleanContent = content
      .replace(/^#.+$/gm, '') // Удаляем заголовки
      .replace(/\*\*(.+?)\*\*/g, '$1') // Убираем жирный текст
      .replace(/[#*`]/g, '') // Удаляем markdown символы
      .replace(/\n+/g, ' ') // Заменяем переносы строк на пробелы
      .replace(/\s+/g, ' ') // Убираем множественные пробелы
      .trim();
    
    // Берем первые 200 символов
    if (cleanContent.length <= 200) {
      return cleanContent;
    }
    
    const truncated = cleanContent.substring(0, 200);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > 160) {
      return truncated.substring(0, lastSpaceIndex).trim() + '...';
    }
    
    return truncated.trim() + '...';
  }

  private extractTags(content: string): string[] {
    const text = content.toLowerCase();
    const tags: string[] = [];
    
    // Извлекаем хэштеги из конца статьи
    const hashtagMatch = content.match(/#[\wА-Яа-я]+/g);
    if (hashtagMatch) {
      tags.push(...hashtagMatch.map(tag => tag.substring(1)));
    }
    
    // Добавляем теги на основе ключевых слов
    if (text.includes('chatgpt') || text.includes('чатgpt')) tags.push('ChatGPT');
    if (text.includes('ai') || text.includes('ии') || text.includes('искусственный интеллект')) tags.push('AI');
    if (text.includes('робот') || text.includes('бот')) tags.push('Роботы');
    if (text.includes('no-code') || text.includes('без кода')) tags.push('NoCode');
    if (text.includes('автоматизация')) tags.push('Автоматизация');
    if (text.includes('telegram')) tags.push('Telegram');
    if (text.includes('n8n')) tags.push('n8n');
    if (text.includes('продуктивность')) tags.push('Продуктивность');
    
    // Удаляем дубликаты и ограничиваем количество
    return [...new Set(tags)].slice(0, 10);
  }

  private generateFallbackArticle(prompt: ArticlePrompt): string {
    return `
# 🚀 ${prompt.topic}: Революция в Мире Технологий!

**Привет, друзья! 👋**

Ты когда-нибудь мечтал о том, чтобы технологии работали на тебя, а не наоборот? Сегодня мы разберем невероятную возможность, которая изменит твой подход к автоматизации!

**Готов окунуться в мир будущего? Тогда поехали! 🔥**

---

## Шаг 1: 🧐 Что За "Чудо" Мы Строим?

Представь себе систему, которая:
- Понимает твои потребности
- Автоматически выполняет рутинные задачи
- Экономит часы твоего времени каждый день
- Работает 24/7 без перерывов

**Звучит как магия? Но это реальность!**

---

## Шаг 2: 🛠 Подготавливаем Инструменты

Для создания нашего решения понадобится:

1. **Компьютер или смартфон** - да, всё так просто!
2. **Доступ в интернет** - для подключения к сервисам
3. **15 минут свободного времени** - больше не нужно!
4. **Желание экспериментировать** - самый важный ингредиент!

---

## Шаг 3: 🎯 Создаем Решение Пошагово

**Этап 1: Настройка основы**
- Открываем нужные сервисы
- Создаем аккаунты (если нужно)
- Настраиваем базовые параметры

**Этап 2: Соединяем компоненты**
- Связываем сервисы между собой
- Настраиваем автоматические действия
- Тестируем работу системы

**Этап 3: Запуск и оптимизация**
- Активируем автоматизацию
- Проверяем результаты
- Дорабатываем при необходимости

---

## 💡 Важные Советы и Нюансы:

- **Начинай с простого** - не пытайся сразу автоматизировать всё
- **Тестируй каждый шаг** - это поможет избежать ошибок
- **Сохраняй настройки** - чтобы не потерять проделанную работу
- **Экспериментируй** - каждая ситуация уникальна

---

## 👀 Пример в Деле: Смотри Сам!

Хочешь увидеть всё в действии? Обязательно посмотри это подробное видео, где я показываю весь процесс от А до Я:

👉 [${prompt.videoUrl || 'https://youtu.be/example'}](${prompt.videoUrl || 'https://youtu.be/example'}) 👈

В видео ты найдешь:
- Пошаговую демонстрацию
- Практические советы
- Ответы на частые вопросы
- Бонусные лайфхаки

---

## Поздравляю! 🎉

Ты только что открыл для себя мощный инструмент автоматизации! Теперь рутинные задачи будут выполняться сами, а у тебя появится больше времени для важных дел.

**Не останавливайся на достигнутом!** Экспериментируй, создавай новые автоматизации и делись результатами с друзьями.

**Вперед к новым технологическим высотам! 🚀✨**

---

#AI #Автоматизация #NoCode #Технологии #Продуктивность #ChatGPT #Роботы #БудущееУжеЗдесь #ЛегкоИПросто #ИИ #БезКода #Инновации
`;
  }

  // Метод для получения списка всех доступных тем
  getAvailableTopics(): ArticlePrompt[] {
    return [...this.TOPICS];
  }

  // Метод для добавления новой темы
  addTopic(topic: ArticlePrompt): void {
    this.TOPICS.push(topic);
  }
}

export const articleGenerator = new ArticleGeneratorService();