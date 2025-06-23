import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Navigation from './Navigation';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-2 md:py-3 flex justify-between items-center">
        <Link 
          to="/" 
          className="flex items-center gap-1.5 md:gap-2 text-primary-600 dark:text-primary-400 font-semibold"
        >
          <MessageSquare className="h-5 w-5 md:h-6 md:w-6" />
          <span className="text-base md:text-lg">ChatGPT Без Регистрации</span>
        </Link>
        
        <div className="flex items-center gap-2 md:gap-4">
          <Navigation />
          
          <button
            onClick={toggleTheme}
            className="p-1.5 md:p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 md:h-5 md:w-5" /> : <Moon className="h-4 w-4 md:h-5 md:w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;