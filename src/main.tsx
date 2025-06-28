import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { ChatProvider } from './contexts/ChatContext';

// Проверка поддержки браузера
const checkBrowserSupport = () => {
  const isSupported = 
    'fetch' in window &&
    'Promise' in window &&
    'localStorage' in window &&
    'sessionStorage' in window;
  
  if (!isSupported) {
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h1>Браузер не поддерживается</h1>
        <p>Пожалуйста, обновите ваш браузер для корректной работы сайта.</p>
      </div>
    `;
    return false;
  }
  return true;
};

// Инициализация приложения
const initApp = () => {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('Root element not found');
    return;
  }

  if (!checkBrowserSupport()) {
    return;
  }

  try {
    const root = createRoot(rootElement);

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
  } catch (error) {
    console.error('Failed to initialize app:', error);
    
    // Fallback UI
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
          <h1>Ошибка загрузки</h1>
          <p>Произошла ошибка при загрузке приложения. Попробуйте обновить страницу.</p>
          <button onclick="window.location.reload()" style="padding: 10px 20px; background: #6366f1; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Обновить страницу
          </button>
        </div>
      `;
    }
  }
};

// Запуск приложения после загрузки DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}