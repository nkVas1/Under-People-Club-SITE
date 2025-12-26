'use client';

export default function TelegramAuth() {
  // WebApp ссылка в бота - он перенаправит на callback после авторизации
  // ?start=login - параметр, который бот обработает
  // Бот должен отправить пользователя на: https://under-people-club.vercel.app/auth/callback?code=...
  const botLoginUrl = 'https://t.me/UPCworld_bot?start=login';

  return (
    <div className="flex flex-col items-center gap-6">
      <a
        href={botLoginUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#2AABEE] hover:bg-[#229ED9] text-white px-8 py-4 font-bold uppercase tracking-wider transition-colors flex items-center gap-3 rounded-sm border-2 border-[#2AABEE] hover:border-[#229ED9] group"
      >
        {/* Telegram Icon */}
        <svg
          className="w-6 h-6 group-hover:scale-110 transition-transform"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 11.944 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
        Войти через Telegram
      </a>

      <p className="text-[10px] text-zinc-600 font-mono text-center max-w-[280px] uppercase tracking-[0.15em] leading-relaxed">
        * Вас перенаправит в бота для подтверждения личности<br />
        Затем вы вернётесь на сайт авторизованными
      </p>

      {/* Дополнительная информация */}
      <div className="border-t border-zinc-800 pt-6 w-full max-w-sm">
        <p className="text-[9px] text-zinc-700 font-mono text-center space-y-2">
          <div>✓ Быстрая авторизация через Telegram</div>
          <div>✓ Ваши данные защищены</div>
          <div>✓ Без ввода пароля</div>
        </p>
      </div>
    </div>
  );
}
