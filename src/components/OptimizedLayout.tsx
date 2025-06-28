import React, { Suspense, lazy } from 'react';
import { usePerformance } from '../hooks/usePerformance';
import LoadingSpinner from './LoadingSpinner';

// Ленивая загрузка компонентов
const Header = lazy(() => import('./Header'));
const Footer = lazy(() => import('./Footer'));

interface OptimizedLayoutProps {
  children: React.ReactNode;
}

const OptimizedLayout: React.FC<OptimizedLayoutProps> = ({ children }) => {
  usePerformance();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Suspense fallback={<div className="h-16 bg-white dark:bg-gray-800 shadow-sm" />}>
        <Header />
      </Suspense>
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Suspense fallback={<div className="h-16 bg-white dark:bg-gray-800 shadow-inner" />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default OptimizedLayout;