import React, { useState } from 'react';
import { Share2, Copy, Check, MessageSquare } from 'lucide-react';

interface SocialShareButtonsProps {
  url: string;
  title: string;
  description?: string;
  className?: string;
}

/**
 * Компонент для кнопок социальных сетей
 */
const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  description = '',
  className = ''
}) => {
  const [copied, setCopied] = useState(false);
  
  // Используем текущий URL, если не передан
  const shareUrl = url || window.location.href;
  
  // Обработчик копирования ссылки
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Обработчики для социальных сетей
  const handleTelegramShare = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}`, '_blank', 'noopener,noreferrer');
  };
  
  const handleVKShare = () => {
    window.open(`https://vk.com/share.php?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`, '_blank', 'noopener,noreferrer');
  };
  
  const handleWhatsAppShare = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + shareUrl)}`, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-500 dark:text-gray-400">Поделиться:</span>
      
      {/* Telegram */}
      <button
        onClick={handleTelegramShare}
        className="p-2 bg-[#0088cc] text-white rounded-full hover:opacity-90 transition-opacity"
        title="Поделиться в Telegram"
        aria-label="Поделиться в Telegram"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.44 4.552 2.56 11.017c-1.151.435-1.143 1.102-.21 1.387l4.349 1.358 10.073-6.352c.476-.294.91-.134.553.188L8.818 15.51l-.206 3.08c.3.418.436.418.872.127l2.092-1.854 4.35 3.21c.803.442 1.38.211 1.58-.744l2.859-13.471c.294-1.176-.447-1.712-1.247-1.306Z"/>
        </svg>
      </button>
      
      {/* ВКонтакте */}
      <button
        onClick={handleVKShare}
        className="p-2 bg-[#4C75A3] text-white rounded-full hover:opacity-90 transition-opacity"
        title="Поделиться ВКонтакте"
        aria-label="Поделиться ВКонтакте"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.579 6.855c.14-.465 0-.806-.666-.806h-2.199c-.56 0-.817.296-.956.624 0 0-1.116 2.719-2.7 4.484-.51.51-.743.675-1.021.675-.14 0-.347-.165-.347-.63V6.855c0-.56-.161-.806-.626-.806H9.642c-.347 0-.557.26-.557.507 0 .532.794.654.874 2.15v3.251c0 .713-.129.842-.41.842-.743 0-2.549-2.731-3.62-5.857-.21-.606-.42-.854-.98-.854H2.752c-.626 0-.752.296-.752.624 0 .584.743 3.477 3.461 7.302 1.812 2.614 4.363 4.029 6.684 4.029 1.393 0 1.565-.314 1.565-.853v-1.966c0-.626.132-.752.574-.752.325 0 .882.166 2.183 1.417 1.486 1.486 1.732 2.153 2.567 2.153h2.199c.626 0 .939-.314.759-.932-.197-.614-.907-1.506-1.849-2.564-.51-.604-1.277-1.254-1.51-1.579-.325-.419-.232-.604 0-.976.001 0 2.672-3.765 2.949-5.044Z"/>
        </svg>
      </button>
      
      {/* WhatsApp */}
      <button
        onClick={handleWhatsAppShare}
        className="p-2 bg-[#25D366] text-white rounded-full hover:opacity-90 transition-opacity"
        title="Поделиться в WhatsApp"
        aria-label="Поделиться в WhatsApp"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
        </svg>
      </button>
      
      {/* Копировать ссылку */}
      <button
        onClick={handleCopyLink}
        className="p-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        title="Копировать ссылку"
        aria-label="Копировать ссылку"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default SocialShareButtons;