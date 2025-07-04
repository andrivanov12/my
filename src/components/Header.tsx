import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Moon, Sun, Zap } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Navigation from './Navigation';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-2 md:py-3 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-1.5 md:gap-2 text-primary-600 dark:text-primary-400 font-semibold hover:text-primary-700 dark:hover:text-primary-300 transition-colors duration-200"
          title="AI Market Hub - платформа AI инструментов и ChatGPT без регистрации"
        >
          <Zap className="h-5 w-5 md:h-6 md:w-6" />
          <span className="text-base md:text-lg">AI Market Hub</span>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Navigation />
          
          <button
            onClick={toggleTheme}
            className="p-1.5 md:p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label={theme === 'dark' ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
            title={theme === 'dark' ? 'Светлая тема' : 'Темная тема'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;