# ChatGPT без регистрации

Бесплатный доступ к ChatGPT и другим AI моделям без необходимости регистрации.

## Возможности

- 🤖 Доступ к нескольким AI моделям (Qwen, Gemini, Llama, Deepseek)
- 🚀 Без регистрации и ограничений
- 🖼️ Поддержка анализа изображений (Llama 4 Maverick)
- 🌙 Темная и светлая темы
- 📱 Адаптивный дизайн для всех устройств
- 🔒 Приватность - история хранится локально

## Настройка для разработки

1. Клонируйте репозиторий
2. Установите зависимости:
   ```bash
   npm install
   ```

3. Создайте файл `.env` на основе `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Получите API ключ от [OpenRouter](https://openrouter.ai/keys) и добавьте его в `.env`:
   ```
   VITE_OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
   ```

5. Запустите проект:
   ```bash
   npm run dev
   ```

## Развертывание

### Netlify

1. Подключите репозиторий к Netlify
2. Добавьте переменную окружения `VITE_OPENROUTER_API_KEY` в настройках сайта
3. Настройки сборки:
   - Build command: `npm run build`
   - Publish directory: `dist`

### Другие платформы

Проект совместим с любыми статическими хостингами (Vercel, GitHub Pages, etc.).

## Технологии

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router
- **AI API**: OpenRouter
- **Build**: Vite

## Структура проекта

```
src/
├── components/     # Переиспользуемые компоненты
├── contexts/       # React контексты
├── pages/          # Страницы приложения
├── services/       # API сервисы
└── utils/          # Утилиты

public/
├── ads.txt         # Google AdSense
├── robots.txt      # SEO
├── sitemap.xml     # SEO
└── tuya-*          # Tuya API инструменты
```

## Доступные AI модели

- **Qwen 3 30B** - Универсальная модель для большинства задач
- **Gemini 2.5 Flash** - Быстрая модель для оперативных ответов
- **Llama 4 Maverick** - Поддержка анализа изображений
- **Deepseek Chat** - Специализация на технических задачах
- **Gemini 2.0 Flash** - Улучшенное понимание контекста

## Лицензия

MIT License

## Поддержка

- Telegram: [@solvillage](https://t.me/solvillage)
- Email: support@aimarkethub.pro