import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Ленивая загрузка страниц с обработкой ошибок
const HomePage = lazy(() => 
  import('./pages/HomePage').catch(() => ({
    default: () => <div>Ошибка загрузки главной страницы</div>
  }))
);

const ChatPage = lazy(() => 
  import('./pages/ChatPage').catch(() => ({
    default: () => <div>Ошибка загрузки страницы чата</div>
  }))
);

const AboutPage = lazy(() => 
  import('./pages/AboutPage').catch(() => ({
    default: () => <div>Ошибка загрузки страницы "О нас"</div>
  }))
);

const GuidePage = lazy(() => 
  import('./pages/GuidePage').catch(() => ({
    default: () => <div>Ошибка загрузки руководства</div>
  }))
);

const BlogPage = lazy(() => 
  import('./pages/BlogPage').catch(() => ({
    default: () => <div>Ошибка загрузки блога</div>
  }))
);

const ContactPage = lazy(() => 
  import('./pages/ContactPage').catch(() => ({
    default: () => <div>Ошибка загрузки контактов</div>
  }))
);

const TuyaTokenPage = lazy(() => 
  import('./pages/TuyaTokenPage').catch(() => ({
    default: () => <div>Ошибка загрузки Tuya Token Generator</div>
  }))
);

const TuyaInstructionsPage = lazy(() => 
  import('./pages/TuyaInstructionsPage').catch(() => ({
    default: () => <div>Ошибка загрузки инструкций Tuya</div>
  }))
);

// Новые SEO страницы
const ChatGptBezRegistraciiPage = lazy(() => 
  import('./pages/ChatGptBezRegistraciiPage').catch(() => ({
    default: () => <div>Ошибка загрузки страницы</div>
  }))
);

const ChatGptBesplatnoPage = lazy(() => 
  import('./pages/ChatGptBesplatnoPage').catch(() => ({
    default: () => <div>Ошибка загрузки страницы</div>
  }))
);

const AiChatOnlinePage = lazy(() => 
  import('./pages/AiChatOnlinePage').catch(() => ({
    default: () => <div>Ошибка загрузки страницы</div>
  }))
);

// n8n Workflow Optimizer
const N8nWorkflowOptimizerPage = lazy(() => 
  import('./pages/N8nWorkflowOptimizerPage').catch(() => ({
    default: () => <div>Ошибка загрузки n8n Workflow Optimizer</div>
  }))
);

// Компонент загрузки с таймаутом
const LoadingFallback = () => {
  const [showError, setShowError] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowError(true);
    }, 10000); // 10 секунд таймаут

    return () => clearTimeout(timer);
  }, []);

  if (showError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Медленная загрузка</h2>
          <p className="text-gray-600 mb-4">Страница загружается дольше обычного</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
          >
            Обновить страницу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>
  );
};

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/guide" element={<GuidePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/tuya-token-generator" element={<TuyaTokenPage />} />
          <Route path="/tuya-instructions" element={<TuyaInstructionsPage />} />
          
          {/* SEO страницы */}
          <Route path="/chatgpt-bez-registracii" element={<ChatGptBezRegistraciiPage />} />
          <Route path="/chat-gpt-besplatno" element={<ChatGptBesplatnoPage />} />
          <Route path="/ai-chat-online" element={<AiChatOnlinePage />} />
          
          {/* n8n Workflow Optimizer */}
          <Route path="/n8n-workflow-optimizer" element={<N8nWorkflowOptimizerPage />} />
          
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Страница не найдена</h1>
                <p className="text-gray-600 mb-4">Запрашиваемая страница не существует</p>
                <a href="/" className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
                  На главную
                </a>
              </div>
            </div>
          } />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;