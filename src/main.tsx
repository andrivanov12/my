import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';

// Оптимизация рендеринга
const root = createRoot(document.getElementById('root')!);

// Предварительная загрузка критических ресурсов
const preloadCriticalResources = () => {
  // Предзагрузка маршрутов, которые пользователь может посетить
  const criticalRoutes = ['/chat', '/guide'];
  criticalRoutes.forEach(route => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  });
};

// Запускаем предзагрузку после монтирования приложения
setTimeout(preloadCriticalResources, 1000);

root.render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ChatProvider>
            <App />
          </ChatProvider>
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);