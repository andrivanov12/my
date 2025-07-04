import { createWriteStream } from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

// Список всех URL сайта
const links = [
  { url: '/', changefreq: 'daily', priority: 1.0, lastmod: new Date().toISOString() },
  { url: '/chat', changefreq: 'daily', priority: 0.9, lastmod: new Date().toISOString() },
  { url: '/guide', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/blog', changefreq: 'daily', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/about', changefreq: 'monthly', priority: 0.7, lastmod: new Date().toISOString() },
  { url: '/contact', changefreq: 'monthly', priority: 0.6, lastmod: new Date().toISOString() },
  
  // Инструменты
  { url: '/ai-prompt-optimizer', changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/n8n-workflow-optimizer', changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/n8n-assistant', changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/tuya-token-generator', changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/tuya-instructions', changefreq: 'monthly', priority: 0.8, lastmod: new Date().toISOString() },
  
  // SEO страницы
  { url: '/chatgpt-bez-registracii', changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() },
  { url: '/chat-gpt-besplatno', changefreq: 'weekly', priority: 0.9, lastmod: new Date().toISOString() },
  { url: '/ai-chat-online', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/chatgpt-na-russkom', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/besplatnyj-chatgpt', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/gpt-chat-bez-registracii', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/ai-assistant-online', changefreq: 'weekly', priority: 0.7, lastmod: new Date().toISOString() },
  { url: '/neural-network-chat', changefreq: 'weekly', priority: 0.7, lastmod: new Date().toISOString() },
  { url: '/openai-chat-free', changefreq: 'weekly', priority: 0.7, lastmod: new Date().toISOString() },
  
  // Новые SEO страницы
  { url: '/ai-tools-platform', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/n8n-automation-guide', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/prompt-engineering-tips', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/tuya-api-integration', changefreq: 'weekly', priority: 0.7, lastmod: new Date().toISOString() },
  
  // Блог категории
  { url: '/blog/n8n', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/blog/ai-tools', changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() },
  { url: '/blog/data-analysis', changefreq: 'weekly', priority: 0.7, lastmod: new Date().toISOString() },
  { url: '/blog/case-studies', changefreq: 'weekly', priority: 0.7, lastmod: new Date().toISOString() },
  
  // Популярные статьи блога
  { url: '/blog/article/n8n-complete-guide', changefreq: 'monthly', priority: 0.7, lastmod: new Date().toISOString() },
  { url: '/blog/article/top-10-n8n-workflows-for-marketers', changefreq: 'monthly', priority: 0.7, lastmod: new Date().toISOString() },
  { url: '/blog/article/chatgpt-n8n-integration', changefreq: 'monthly', priority: 0.7, lastmod: new Date().toISOString() },
  { url: '/blog/article/data-analysis-with-n8n', changefreq: 'monthly', priority: 0.7, lastmod: new Date().toISOString() },
  { url: '/blog/article/case-study-company-x-n8n', changefreq: 'monthly', priority: 0.7, lastmod: new Date().toISOString() }
];

// Создаем поток для записи sitemap
const sitemap = new SitemapStream({ hostname: 'https://aimarkethub.pro' });
const writeStream = createWriteStream('./public/sitemap.xml');

// Добавляем ссылки в sitemap
links.forEach(link => {
  sitemap.write({
    url: link.url,
    changefreq: link.changefreq,
    priority: link.priority,
    lastmod: link.lastmod
  });
});

// Завершаем запись и создаем sitemap
sitemap.end();
sitemap.pipe(writeStream);

console.log('Sitemap generated successfully!');