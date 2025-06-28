import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Key, ExternalLink } from 'lucide-react';

const TuyaTokenPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Tuya API Token Generator | aimarkethub.pro</title>
        <meta name="description" content="Генератор токенов для API Tuya - получите токен для управления вашими устройствами умного дома." />
        <meta name="keywords" content="tuya api token, умный дом api, tuya токен, iot api" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-primary-100 dark:bg-primary-900/30 rounded-full mr-4">
              <Key className="h-8 w-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
              Tuya API Token Generator
            </h1>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Страница в разработке
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">Скоро здесь будет генератор токенов Tuya</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Мы работаем над созданием удобного инструмента для получения токенов API Tuya.
          </p>
          
          <div className="space-y-4">
            <a 
              href="/tuya-instructions.html"
              target="_blank"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
            >
              <ExternalLink className="h-5 w-5" />
              Инструкция по Postman
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default TuyaTokenPage;