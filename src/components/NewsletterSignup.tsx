import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Валидация email
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Пожалуйста, введите корректный email адрес');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Имитация отправки запроса
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Сохраняем в localStorage для демонстрации
      localStorage.setItem('newsletter_email', email);
      
      setIsSubmitted(true);
      setEmail('');
    } catch (err) {
      setError('Произошла ошибка при подписке. Пожалуйста, попробуйте позже.');
      console.error('Newsletter signup error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 p-6 md:p-8 rounded-xl">
      {isSubmitted ? (
        <div className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Спасибо за подписку!</h3>
          <p className="text-gray-600 dark:text-gray-300">
            Вы успешно подписались на нашу рассылку новостей о n8n и AI.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-2 text-center">Подпишитесь на новости n8n и AI</h3>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
            Получайте последние новости, обновления и советы по n8n и искусственному интеллекту
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Ваш email адрес"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting}
              />
              {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:bg-primary-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Подписываемся...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Подписаться
                </>
              )}
            </button>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
            Мы не отправляем спам. Вы можете отписаться в любое время.
          </p>
        </>
      )}
    </div>
  );
};

export default NewsletterSignup;