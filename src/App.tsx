import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import OptimizedLayout from './components/OptimizedLayout';
import LoadingSpinner from './components/LoadingSpinner';

// Ленивая загрузка страниц для уменьшения начального бандла
const HomePage = lazy(() => import('./pages/HomePage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const GuidePage = lazy(() => import('./pages/GuidePage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const TuyaTokenPage = lazy(() => import('./pages/TuyaTokenPage'));
const TuyaInstructionsPage = lazy(() => import('./pages/TuyaInstructionsPage'));

function App() {
  return (
    <OptimizedLayout>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/tuya-token-generator" element={<TuyaTokenPage />} />
          <Route path="/tuya-instructions" element={<TuyaInstructionsPage />} />
        </Routes>
      </Suspense>
    </OptimizedLayout>
  );
}

export default App;