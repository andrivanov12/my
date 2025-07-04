import { createWriteStream } from 'fs';
import { SitemapStream, streamToPromise } from 'sitemap';
import { Readable } from 'stream';

// Список всех URL сайта
const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/chat', changefreq: 'daily', priority: 0.9 },
  { url: '/guide', changefreq: 'weekly', priority: 0.8 },
  { url: '/blog', changefreq: 'daily', priority: 0.8 },
  { url: '/about', changefreq: 'monthly', priority: 0.7 },
  { url: '/contact', changefreq: 'monthly', priority: 0.6 },
  
  // Инструменты
  { url: '/ai-prompt-optimizer', changefreq: 'monthly', priority: 0.8 },
  { url: '/n8n-workflow-optimizer', changefreq: 'monthly', priority: 0.8 },
  { url: '/n8n-assistant', changefreq: 'monthly', priority: 0.8 },
  { url: '/tuya-token-generator', changefreq: 'monthly', priority: 0.8 },
  { url: '/tuya-instructions', changefreq: 'monthly', priority: 0.8 },
  
  // SEO страницы
  { url: '/chatgpt-bez-registracii', changefreq: 'weekly', priority: 0.9 },
  { url: '/chat-gpt-besplatno', changefreq: 'weekly', priority: 0.9 },
  { url: '/ai-chat-online', changefreq: 'weekly', priority: 0.8 },
  { url: '/chatgpt-na-russkom', changefreq: 'weekly', priority: 0.8 },
  { url: '/besplatnyj-chatgpt', changefreq: 'weekly', priority: 0.8 },
  { url: '/gpt-chat-bez-registracii', changefreq: 'weekly', priority: 0.8 },
  { url: '/ai-assistant-online', changefreq: 'weekly', priority: 0.7 },
  { url: '/neural-network-chat', changefreq: 'weekly', priority: 0.7 },
  { url: '/openai-chat-free', changefreq: 'weekly', priority: 0.7 }
];

// Создаем поток для записи sitemap
const sitemap = new SitemapStream({ hostname: 'https://aimarkethub.pro' });
const writeStream = createWriteStream('./public/sitemap.xml');

// Добавляем текущую дату для lastmod
const today = new Date().toISOString().split('T')[0];

// Добавляем ссылки в sitemap
links.forEach(link => {
  sitemap.write({
    url: link.url,
    changefreq: link.changefreq,
    priority: link.priority,
    lastmod: today
  });
});

// Завершаем запись и создаем sitemap
sitemap.end();
sitemap.pipe(writeStream);

console.log('Sitemap generated successfully!');