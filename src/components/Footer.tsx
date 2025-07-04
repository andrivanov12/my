import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Mail, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner border-t border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Основной контент футера */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* О проекте */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              AI Market Hub - платформа AI инструментов
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
              Платформа AI инструментов с бесплатным доступом к ChatGPT без регистрации. Используйте передовые 
              AI технологии для обучения, работы и автоматизации бизнес-процессов. 
              Все инструменты искусственного интеллекта в одном месте.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://t.me/solvillage"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
                title="Связаться с нами в Telegram"
              >
                <MessageCircle className="h-5 w-5" />
                <span className="text-sm">Telegram</span>
              </a>
              <a
                href="mailto:support@aimarkethub.pro"
                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors duration-200"
                title="Написать нам email"
              >
                <Mail className="h-5 w-5" />
                <span className="text-sm">Email</span>
              </a>
            </div>
          </div>

          {/* Быстрые ссылки */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
              Быстрые ссылки
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/chat" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm font-medium"
                >
                  ChatGPT без регистрации
                </Link>
              </li>
              <li>
                <Link 
                  to="/guide" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm font-medium"
                >
                  Руководство по AI
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm font-medium"
                >
                  Блог о AI и n8n
                </Link>
              </li>
              <li>
                <Link 
                  to="/ai-prompt-optimizer" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm font-medium"
                >
                  Prompt инженерия
                </Link>
              </li>
            </ul>
          </div>

          {/* Инструменты */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
              Инструменты
            </h4>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/n8n-assistant" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm font-medium"
                >
                  n8n Assistant
                </Link>
              </li>
              <li>
                <Link 
                  to="/n8n-workflow-optimizer" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm font-medium"
                >
                  Оптимизация n8n workflow
                </Link>
              </li>
              <li>
                <Link 
                  to="/tuya-instructions" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm font-medium"
                >
                  Tuya API интеграции
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 text-sm font-medium"
                >
                  О команде AIMarketHub
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* SEO ссылки */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Популярные запросы:
          </h4>
          <div className="flex flex-wrap gap-2 mb-4">
            <Link 
              to="/chatgpt-bez-registracii" 
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-2 py-1 rounded transition-colors duration-200"
            >
              ChatGPT без регистрации
            </Link>
            <Link 
              to="/chat-gpt-besplatno" 
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-2 py-1 rounded transition-colors duration-200"
            >
              ChatGPT бесплатно
            </Link>
            <Link 
              to="/ai-chat-online" 
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-2 py-1 rounded transition-colors duration-200"
            >
              AI чат онлайн
            </Link>
            <Link 
              to="/chatgpt-na-russkom" 
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-2 py-1 rounded transition-colors duration-200"
            >
              ChatGPT на русском
            </Link>
            <Link 
              to="/n8n-assistant" 
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-2 py-1 rounded transition-colors duration-200"
            >
              n8n интеграции
            </Link>
            <Link 
              to="/ai-prompt-optimizer" 
              className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 px-2 py-1 rounded transition-colors duration-200"
            >
              Prompt инженерия
            </Link>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">нейросеть онлайн</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">искусственный интеллект</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">машинное обучение</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">автоматизация бизнес-процессов</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">генеративный AI</span>
            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">AI интеграции</span>
          </div>
        </div>

        {/* Нижняя часть */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <p className="text-xs text-gray-600 dark:text-gray-400">
                &copy; {currentYear} AI Market Hub - платформа AI инструментов. Все права защищены.
              </p>
              <Link 
                to="/contact" 
                className="text-xs text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              >
                Контакты
              </Link>
            </div>

            <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <span>Создано с</span>
              <Heart className="h-3 w-3 mx-1 text-red-500 animate-pulse-light" />
              <span>для доступного ИИ</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;