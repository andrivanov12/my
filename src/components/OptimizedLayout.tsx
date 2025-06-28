import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface OptimizedLayoutProps {
  children: React.ReactNode;
}

const OptimizedLayout: React.FC<OptimizedLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default OptimizedLayout;