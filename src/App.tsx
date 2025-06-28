import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import AboutPage from './pages/AboutPage';
import GuidePage from './pages/GuidePage';
import BlogPage from './pages/BlogPage';
import ContactPage from './pages/ContactPage';
import TuyaTokenPage from './pages/TuyaTokenPage';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/tuya-token-generator" element={<TuyaTokenPage />} />
      </Routes>
    </Layout>
  );
}

export default App;