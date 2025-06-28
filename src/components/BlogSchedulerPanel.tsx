import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Plus, Play, BarChart3, Settings } from 'lucide-react';
import { blogScheduler } from '../services/blogScheduler';
import { articleGenerator } from '../services/articleGenerator';

const BlogSchedulerPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({ total: 0, published: 0, scheduled: 0 });
  const [isGenerating, setIsGenerating] = useState(false);
  const [customTopic, setCustomTopic] = useState('');
  const [lastGenerated, setLastGenerated] = useState<string | null>(null);

  useEffect(() => {
    updateStats();
    
    // Запрашиваем разрешение на уведомления
    blogScheduler.requestNotificationPermission();
    
    // Слушаем события новых статей
    const handleNewArticle = (event: CustomEvent) => {
      setLastGenerated(event.detail.article.title);
      updateStats();
      setTimeout(() => setLastGenerated(null), 5000);
    };
    
    window.addEventListener('newArticlePublished', handleNewArticle as EventListener);
    
    return () => {
      window.removeEventListener('newArticlePublished', handleNewArticle as EventListener);
    };
  }, []);

  const updateStats = () => {
    const newStats = blogScheduler.getStats();
    setStats(newStats);
  };

  const handleGenerateNow = async () => {
    setIsGenerating(true);
    try {
      const article = await blogScheduler.generateArticleNow(customTopic || undefined);
      setLastGenerated(article.title);
      setCustomTopic('');
      updateStats();
      setTimeout(() => setLastGenerated(null), 5000);
    } catch (error) {
      console.error('Ошибка генерации статьи:', error);
      alert('Ошибка при генерации статьи. Попробуйте еще раз.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublishDaily = async () => {
    setIsGenerating(true);
    try {
      await blogScheduler.publishNow();
      updateStats();
    } catch (error) {
      console.error('Ошибка публикации:', error);
      alert('Ошибка при публикации статьи. Попробуйте еще раз.');
    } finally {
      setIsGenerating(false);
    }
  };

  const availableTopics = articleGenerator.getAvailableTopics();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50"
        title="Панель управления блогом"
      >
        <Settings className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-6 w-96 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-purple-600" />
          Планировщик блога
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
          <div className="text-xs text-blue-600 dark:text-blue-400">Всего</div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.published}</div>
          <div className="text-xs text-green-600 dark:text-green-400">Опубликовано</div>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.scheduled}</div>
          <div className="text-xs text-orange-600 dark:text-orange-400">Запланировано</div>
        </div>
      </div>

      {/* Уведомление о последней сгенерированной статье */}
      {lastGenerated && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-800 dark:text-green-200">
              Статья создана: "{lastGenerated.substring(0, 50)}..."
            </span>
          </div>
        </div>
      )}

      {/* Быстрые действия */}
      <div className="space-y-3 mb-4">
        <button
          onClick={handlePublishDaily}
          disabled={isGenerating}
          className="w-full flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          {isGenerating ? 'Генерируем...' : 'Опубликовать сейчас'}
        </button>

        <div className="flex gap-2">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="Своя тема статьи..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-white dark:bg-gray-700"
          />
          <button
            onClick={handleGenerateNow}
            disabled={isGenerating}
            className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-200 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Информация о расписании */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Автопубликация
          </span>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          Каждый день в 9:00 утра автоматически публикуется новая статья по случайной теме из списка.
        </div>
      </div>

      {/* Список доступных тем */}
      <details className="mt-4">
        <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
          Доступные темы ({availableTopics.length})
        </summary>
        <div className="mt-2 max-h-32 overflow-y-auto">
          {availableTopics.map((topic, index) => (
            <div
              key={index}
              className="text-xs text-gray-600 dark:text-gray-400 py-1 border-b border-gray-200 dark:border-gray-600 last:border-b-0"
            >
              {topic.topic}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};

export default BlogSchedulerPanel;