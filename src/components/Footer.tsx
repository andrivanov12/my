import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner py-3 md:py-4">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 text-center md:text-left">
            &copy; {currentYear} ChatGPT Без Регистрации. Все права защищены.
          </p>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
              <span>Создано с</span>
              <Heart className="h-3 w-3 md:h-4 md:w-4 mx-1 text-red-500 animate-pulse-light" />
              <span>для простых разговоров с ИИ</span>
            </div>

            <a
              href="https://t.me/aimarkethub"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-gray-600 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400 transition-colors duration-200"
              title="Связаться с нами в Telegram"
            >
              <MessageCircle className="h-4 w-4 md:h-5 md:w-5" />
              <span className="text-xs md:text-sm">Telegram</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;