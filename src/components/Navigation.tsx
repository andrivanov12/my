import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Главная' },
    { path: '/chat', label: 'Чат' },
    { path: '/guide', label: 'Руководство' },
    { path: '/blog', label: 'Блог' },
    { path: '/ai-prompt-optimizer', label: 'Prompt Optimizer' },
    { path: '/n8n-workflow-optimizer', label: 'n8n Оптимизатор' },
    { path: '/n8n-assistant', label: 'n8n Assistant' },
    { path: '/tuya-instructions', label: 'Tuya API' },
    { path: '/about', label: 'О нас' },
    { path: '/contact', label: 'Контакты' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="relative">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`text-sm font-medium transition-colors duration-200 ${
              isActive(item.path)
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* Mobile Navigation Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block px-4 py-2 text-sm transition-colors duration-200 ${
                isActive(item.path)
                  ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                  : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navigation;