# 🚀 Пошаговая настройка Tuya Token Generator

## 📋 Что уже готово

✅ **Netlify Functions созданы:**
- `netlify/functions/tuya-get-token.js` - получение токенов
- `netlify/functions/tuya-refresh-token.js` - обновление токенов

✅ **Конфигурация Netlify готова:**
- `netlify.toml` с настройками CORS и функций

✅ **Фронтенд обновлен:**
- Улучшенная обработка ошибок
- Поддержка Postman API
- Диагностика соединения

## 🛠️ Шаги для запуска

### Шаг 1: Установка зависимостей
```bash
npm install
```

### Шаг 2: Локальная разработка (опционально)

Для тестирования функций локально установите Netlify CLI:

```bash
# Установка Netlify CLI глобально
npm install -g netlify-cli

# Запуск локального сервера с поддержкой функций
npm run netlify:dev
```

**Примечание:** В обычном режиме разработки (`npm run dev`) функции недоступны.

### Шаг 3: Развертывание на Netlify

#### Вариант A: Через Git (рекомендуется)

1. **Закоммитьте изменения:**
```bash
git add .
git commit -m "Add Tuya Token Generator with Netlify Functions"
git push origin main
```

2. **Netlify автоматически развернет:**
- Функции будут доступны по адресам:
  - `https://ваш-сайт.netlify.app/.netlify/functions/tuya-get-token`
  - `https://ваш-сайт.netlify.app/.netlify/functions/tuya-refresh-token`

#### Вариант B: Ручное развертывание

```bash
# Сборка проекта
npm run build

# Развертывание (требует настройки Netlify CLI)
npm run netlify:build
```

### Шаг 4: Проверка работоспособности

1. **Откройте страницу генератора токенов:**
   - `https://ваш-сайт.netlify.app/tuya-token-generator`

2. **Нажмите "Тест соединения":**
   - Должно показать "✓ Сервер доступен"

3. **Введите данные Tuya и получите токен**

## 🔧 Использование с Postman

### Получение токена:
```
POST https://ваш-сайт.netlify.app/.netlify/functions/tuya-get-token
Content-Type: application/json

{
  "clientId": "ваш_client_id",
  "secret": "ваш_client_secret",
  "dataCenter": "https://openapi.tuyaeu.com"
}
```

### Обновление токена:
```
POST https://ваш-сайт.netlify.app/.netlify/functions/tuya-refresh-token
Content-Type: application/json

{
  "clientId": "ваш_client_id",
  "secret": "ваш_client_secret",
  "refreshToken": "ваш_refresh_token",
  "dataCenter": "https://openapi.tuyaeu.com"
}
```

## 🐛 Решение проблем

### "Проблемы с соединением"
- **Причина:** Функции еще не развернуты
- **Решение:** Дождитесь завершения развертывания на Netlify

### "404 Not Found"
- **Причина:** Netlify Functions не найдены
- **Решение:** Проверьте, что файлы в папке `netlify/functions/` закоммичены

### "CORS Error"
- **Причина:** Неправильная настройка CORS
- **Решение:** Убедитесь, что `netlify.toml` развернут корректно

### Локальная разработка
- **Используйте:** `npm run netlify:dev` вместо `npm run dev`
- **Или:** Тестируйте на развернутом сайте

## 📊 Мониторинг

После развертывания вы можете:

1. **Проверить логи функций** в панели Netlify
2. **Мониторить использование** в разделе Functions
3. **Просматривать ошибки** в Real-time logs

## 🔐 Безопасность

- ✅ Учетные данные не сохраняются на сервере
- ✅ HTTPS шифрование всех запросов
- ✅ CORS настроен для безопасного использования
- ✅ Валидация всех входных параметров

## 📞 Поддержка

Если возникают проблемы:
1. Проверьте логи в панели Netlify
2. Убедитесь, что все файлы закоммичены
3. Проверьте статус развертывания
4. Используйте тест соединения на сайте

---

**Готово!** После выполнения этих шагов ваш Tuya Token Generator будет полностью функционален! 🎉